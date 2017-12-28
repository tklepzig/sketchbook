import * as git from "nodegit";

export class RepoService {
    public clone(url: string, localPath: string, username: string, password: string) {
        const fetchOpts = {
            callbacks: {
                credentials: () => {
                    return git.Cred.userpassPlaintextNew(username, password);
                }
            }
        };

        return git.Clone.clone(url, localPath, { fetchOpts });
    }
}
