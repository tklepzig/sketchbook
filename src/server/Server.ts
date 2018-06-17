import { addElement, addPage, deleteLastElement, deletePage, loadState, setPageName } from "actions";
import * as bodyParser from "body-parser";
import { dataPath } from "config";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { Application, NextFunction, Request, Response } from "express-serve-static-core";
import * as session from "express-session";
import * as fs from "fs-extra";
import * as passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as path from "path";
import { applyMiddleware, createStore, Store } from "redux";
import thunkMiddleware from "redux-thunk";
import { RepoService } from "RepoService";
import { RootState } from "RootState";
import reducers from "./reducers";

export interface Config {
    isProd: boolean;
    port: number;
    repoUrl: string;
    repoUser: string;
    repoPassword: string;
    sessionSecret: string;
    clientId: string;
    clientSecret: string;
    userMail: string;
    userId: string;
}
export class Server {
    private store: Store<RootState>;
    private repoService: RepoService;
    private readonly authRedirectUri = "/auth/google/callback";

    constructor(private config: Config) {
        this.store = createStore(reducers, applyMiddleware(thunkMiddleware));
        this.repoService = new RepoService();
    }

    public async start() {
        await this.init();
        await this.loadDataFromFiles();
        await this.startServer();

        if (this.config.repoUrl) {
            setInterval(async () => {
                const statuses = await this.repoService.status(dataPath);

                if (statuses.length > 0) {
                    const { repoUser, repoPassword } = this.config;

                    await this.repoService.addAllAndCommit(
                        dataPath,
                        "data changed",
                        "sketchbook bot",
                        "bot@sketchbook");

                    await this.repoService.push(
                        dataPath,
                        repoUser,
                        repoPassword);
                }
            }, 5 * 60 * 1000);
        }
    }

    private async init() {
        const existsDataPath = await fs.pathExists(dataPath);
        if (!existsDataPath) {
            const { repoUrl, repoUser, repoPassword } = this.config;
            if (repoUrl) {
                await this.repoService.clone(
                    repoUrl,
                    dataPath,
                    repoUser,
                    repoPassword
                );
            } else {
                await fs.mkdirp(dataPath);
            }
        }
    }
    private async loadDataFromFiles() {
        await this.store.dispatch(loadState());
    }

    private auth(app: Application) {
        app.use(session({
            secret: this.config.sessionSecret,
            name: "sketchbook-auth",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: this.config.isProd,
                httpOnly: true
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));

        passport.use(new GoogleStrategy(
            {
                clientID: this.config.clientId,
                clientSecret: this.config.clientSecret,
                callbackURL: this.authRedirectUri,
                proxy: true // necessary for https redirect on Azure
            },
            (accessToken: any, refreshToken: any, profile: any, done: any) => done(null, profile)
        ));

        // force https in production
        app.use((req, res, next) => {
            if (this.config.isProd && req.protocol === "http") {
                return res.redirect("https://" + req.headers.host + req.url);
            }
            next();
        });

        // Azure and secure cookies
        // see http://scottksmith.com/blog/2014/08/22/using-secure-cookies-in-node-on-azure/

        // tell express that we're running behind a reverse proxy that supplies https for you
        app.set("trust proxy", 1);

        // add middleware that will trick express into thinking the request is secure
        app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.headers["x-arr-ssl"] && !req.headers["x-forwarded-proto"]) {
                req.headers["x-forwarded-proto"] = "https";
            }
            return next();
        });

        app.get("/login", passport.authenticate("google",
            {
                scope: [
                    "https://www.googleapis.com/auth/plus.profile.emails.read",
                    "https://www.googleapis.com/auth/plus.login"
                ]
            }));

        // see https://stackoverflow.com/a/13734798
        // for reference: http://passportjs.org/guide/authenticate/
        const authenticate = (req: Request, success: () => void, failure: (error: Error) => void) => {
            return passport.authenticate("google", (error, user, info) => {
                if (error) {
                    failure(error);
                } else if (!user) {
                    failure(new Error("Invalid login data"));
                } else {
                    const allowedUserEmails = user.emails.filter((email: any) =>
                        email.type === "account" && email.value === this.config.userMail);

                    const allowedUserId = user.id === this.config.userId;

                    if (allowedUserEmails.length === 0 || !allowedUserId) {
                        failure(new Error(`User ${JSON.stringify(user)} not allowed`));
                    } else {
                        req.login(user, (err: Error) => {
                            if (err) {
                                failure(err);
                            }
                            success();
                        });
                    }
                }
            }
            );
        };

        const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

            const success = () => {
                res.redirect("/");
            };

            const failure = (error: Error) => {
                // tslint:disable-next-line:no-console
                console.log(error);
                res.status(401).send("Access Denied");
            };

            const middleware = authenticate(req, success, failure);
            middleware(req, res, next);
        };

        app.get(this.authRedirectUri, authMiddleware);

        const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect("/login");
        }

        return ensureAuthenticated;
    }

    private startServer() {
        const app = express();
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        const ensureAuthenticated = this.auth(app);
        app.use(ensureAuthenticated, express.static(path.resolve(__dirname, "..", "public")));
        this.defineRoutes(app);
        app.get("/*", ensureAuthenticated, (req: Request, res: Response) => {
            res.sendFile(path.resolve(path.join(__dirname, "..", "public", "index.html")));
        });

        const port = process.env.PORT || this.config.port || 80;
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`listening on *:${port}`);
        });
    }

    private defineRoutes(app: Application) {
        app.post("/api/page", (req: Request, res: Response) => {
            const { pageNumber, name } = req.body;
            this.store.dispatch(addPage(pageNumber, name));
            res.sendStatus(200);
        });
        app.put("/api/page", (req: Request, res: Response) => {
            const { pageNumber, name } = req.body;
            this.store.dispatch(setPageName(pageNumber, name));
            res.sendStatus(200);
        });
        app.delete("/api/page", (req: Request, res: Response) => {
            const { pageNumber } = req.body;
            this.store.dispatch(deletePage(pageNumber));
            res.sendStatus(200);
        });
        app.post("/api/element", (req, res) => {
            const { pageNumber, element } = req.body;
            this.store.dispatch(addElement(pageNumber, element));
            res.sendStatus(200);
        });
        app.delete("/api/lastElement", (req, res) => {
            const { pageNumber } = req.body;
            this.store.dispatch(deleteLastElement(pageNumber));
            res.sendStatus(200);
        });
        app.get("/api/pages", (req, res) => {
            res.json(this.store.getState().pageList);
        });
        app.get("/api/page/:pageNumber", (req, res) => {
            res.json(this.store.getState().pageDetails[req.params.pageNumber]);
        });
    }
}
