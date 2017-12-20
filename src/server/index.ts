import * as express from "express";
import * as path from "path";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname, "..", "public", "index.html")));
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`listening on *:${port}`);
});
