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

        try {
            return git.Clone.clone(url, localPath, { fetchOpts });
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(`Error during git clone: ${error}`);
            throw error;
        }
    }

    public async addAllAndCommit(
        repoPath: string,
        commitMessage: string,
        author: string,
        authorEmail: string
    ) {
        try {
            const repo = await git.Repository.open(repoPath);
            const index = await repo.refreshIndex();
            await index.addAll(undefined!, undefined!);
            index.write();
            const oid = await index.writeTree();
            const head = await git.Reference.nameToId(repo, "HEAD");
            const parentCommit = await repo.getCommit(head);

            const signature = git.Signature.now(author, authorEmail);
            return repo.createCommit("HEAD", signature, signature, commitMessage, oid, [parentCommit]);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(`Error during git add and commit: ${error}`);
            throw error;
        }
    }

    public async push(repoPath: string, username: string, password: string) {
        try {
            const repo = await git.Repository.open(repoPath);
            const remote = await repo.getRemote("origin");
            return remote.push(["refs/heads/master:refs/heads/master"], {
                callbacks: {
                    credentials: () => {
                        return git.Cred.userpassPlaintextNew(username, password);
                    }
                }
            });
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(`Error during git push: ${error}`);
            throw error;
        }
    }

    public async status(repoPath: string) {
        try {
            const repo = await git.Repository.open(repoPath);
            return repo.getStatus();
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log(`Error during retrieving git status: ${error}`);
            throw error;
        }
    }
}
