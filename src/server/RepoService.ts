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

    public async addAllAndCommit(
        repoPath: string,
        commitMessage: string,
        author: string,
        authorEmail: string
    ) {

        const repo = await git.Repository.open(repoPath);
        const index = await repo.refreshIndex();
        await index.addAll(undefined!, undefined!);
        index.write();
        const oid = await index.writeTree();
        const head = await git.Reference.nameToId(repo, "HEAD");
        const parentCommit = await repo.getCommit(head);

        const signature = git.Signature.now(author, authorEmail);
        return repo.createCommit("HEAD", signature, signature, commitMessage, oid, [parentCommit]);
    }

    public async push(repoPath: string, username: string, password: string) {
        const repo = await git.Repository.open(repoPath);
        const remote = await repo.getRemote("origin");
        return remote.push(["refs/heads/master:refs/heads/master"], {
            callbacks: {
                credentials: () => {
                    return git.Cred.userpassPlaintextNew(username, password);
                }
            }
        });
    }

    public async status(repoPath: string) {
        const repo = await git.Repository.open(repoPath);
        return repo.getStatus();
    }
}
