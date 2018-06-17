import * as nconf from "nconf";
import * as path from "path";
import { Config, Server } from "Server";

nconf.file({ file: path.resolve(__dirname + "/config.json") }).argv().env();
const config: Config = {
    isProd: !!nconf.get("isProd"),
    port: nconf.get("port"),
    repoUrl: nconf.get("repoUrl"),
    repoUser: nconf.get("repoUser"),
    repoPassword: nconf.get("repoPassword"),
    sessionSecret: nconf.get("sessionSecret"),
    clientId: nconf.get("clientId"),
    clientSecret: nconf.get("clientSecret"),
    userMail: nconf.get("userMail"),
    userId: nconf.get("userId")
};
new Server(config).start();
