import * as express from "express";
import * as path from "path";

const port = 8080;
const app = express();

app.use("/", express.static(path.resolve(`${__dirname}/../public`)));

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`listening on *:${port}`);
});
