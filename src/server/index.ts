import * as nconf from "nconf";
import { Server } from "Server";

nconf.argv().env();
const config = {
    port: nconf.get("port"),
    repoUrl: nconf.get("repoUrl"),
    repoUser: nconf.get("repoUser"),
    repoPassword: nconf.get("repoPassword")
};
new Server(config).start();
