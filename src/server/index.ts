import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import { createStore } from "redux";
import { addElement } from "./actions";
import reducers from "./reducers";

const port = process.env.PORT || 8080;
const app = express();

const store = createStore(reducers);
const unsubscribe = store.subscribe(() => {
    const state = store.getState();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/addElement", (req, res) => {
    const { pageId, element } = req.body;
    store.dispatch(addElement(pageId, element));
    res.sendStatus(200);
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
