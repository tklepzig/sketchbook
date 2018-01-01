import { addElement, addPage, deletePage, loadState } from "actions";
import * as bodyParser from "body-parser";
import { dataPath } from "config";
import * as express from "express";
import { Request, Response } from "express-serve-static-core";
import * as fs from "fs-extra";
import * as path from "path";
import { applyMiddleware, createStore, Store } from "redux";
import thunkMiddleware from "redux-thunk";
import { RepoService } from "RepoService";
import { RootState } from "RootState";
import reducers from "./reducers";

export interface Config {
    port: number;
    repoUrl: string;
    repoUser: string;
    repoPassword: string;
}
export class Server {
    private store: Store<RootState>;
    private repoService: RepoService;
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

    private startServer() {
        const app = express();

        app.use(bodyParser.json());
        app.use(express.static(path.resolve(__dirname, "..", "public")));

        app.post("/api/page", (req: Request, res: Response) => {
            const { pageNumber, name } = req.body;
            this.store.dispatch(addPage(pageNumber, name));
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

        // this.store.dispatch(addPage("1"));
        // store.dispatch(addElement("1", {
        //     kind: "text",
        //     text: new Date().toISOString(),
        //     position: { x: 100, y: 100 },
        //     measurement: { width: 100, height: 20 },
        //     fontSize: 20
        // }));

        app.get("/api/pages", (req, res) => {
            res.json(this.store.getState().pageList);
        });
        app.get("/api/page/:pageNumber", (req, res) => {
            res.json(this.store.getState().pageDetails[req.params.pageNumber]);
        });

        app.get("/*", (req, res) => {
            res.sendFile(path.resolve(path.join(__dirname, "..", "public", "index.html")));
        });

        const port = process.env.PORT || this.config.port || 80;
        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`listening on *:${port}`);
        });
    }
}
