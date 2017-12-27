import * as bodyParser from "body-parser";
import { configFile } from "config";
import * as express from "express";
import * as fs from "fs-extra";
import * as nconf from "nconf";
import * as path from "path";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { addElement, addPage } from "./actions";
import reducers from "./reducers";

nconf.file(configFile).env();
const config = {
    port: nconf.get("port"),
    repoUrl: nconf.get("repoUrl"),
    repoUser: nconf.get("repoUser"),
    repoPassword: nconf.get("repoPassword")
};

const port = process.env.PORT || config.port || 80;
const app = express();

// TODO: push every n minutes if getStatus (from nodegit) shows any changes

// load data also by async action
// fs.pathExists
const store = createStore(reducers, /*{ pageList, pageDetails },*/ applyMiddleware(thunkMiddleware));

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.post("/api/page", (req, res) => {
    const { pageId } = req.body;
    store.dispatch(addPage(pageId));
    res.sendStatus(200);
});
app.post("/api/element", (req, res) => {
    const { pageId, element } = req.body;
    store.dispatch(addElement(pageId, element));
    res.sendStatus(200);
});

// store.dispatch(addPage("1"));
// store.dispatch(addElement("1", {
//     kind: "text",
//     text: new Date().toISOString(),
//     position: { x: 100, y: 100 },
//     measurement: { width: 100, height: 20 },
//     fontSize: 20
// }));

app.get("/api/pages", (req, res) => {
    res.json(store.getState().pageList);
});
app.get("/api/page/:id", (req, res) => {
    res.json(store.getState().pageDetails[req.params.id]);
});

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, "..", "public", "index.html")));
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`listening on *:${port}`);
});
