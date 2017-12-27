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

store.dispatch(addPage("1"));
store.dispatch(addPage("2"));
store.dispatch(addPage("3"));
store.dispatch(addElement("1", {
    kind: "text",
    text: "Blubb 42",
    position: { x: 100, y: 100 },
    measurement: { width: 100, height: 20 },
    fontSize: 20
}));

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

// store.dispatch(addLine("1", line));
// store.dispatch(addText("1", text));
