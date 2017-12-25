import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import { createStore } from "redux";
import { addElement, addPage } from "./actions";
import reducers from "./reducers";

const port = process.env.PORT || 8080;
const app = express();

const store = createStore(reducers);
console.dir(store.getState());
const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    console.dir(state);
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/addPage", (req, res) => {
    const { pageId } = req.body;
    store.dispatch(addPage(pageId));
    res.sendStatus(200);
});
app.post("/addElement", (req, res) => {
    const { pageId, element } = req.body;
    store.dispatch(addElement(pageId, element));
    res.sendStatus(200);
});

store.dispatch(addPage("1"));
store.dispatch(addPage("2"));
store.dispatch(addPage("3"));
store.dispatch(addElement("3", {
    kind: "text",
    text: "42",
    position: { x: 0, y: 0 },
    measurement: { width: 0, height: 0 },
    fontSize: 1
}));

app.post("/getPageList", (req, res) => { });
app.post("/getPageById", (req, res) => { });

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, "..", "public", "index.html")));
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`listening on *:${port}`);
});

// store.dispatch(addLine("1", line));
// store.dispatch(addText("1", text));
