import "@octokit/core";
import vars from "../vars";

async function openPR(domain) {
    const { Octokit } = require("@octokit/core");
    const { createTokenAuth } = require("@octokit/auth-token");
    const token = Object.values(vars);
    const ghtoken = token[0].toString();
    const user = token[1].toString();
    const repository = token[3].toString();

    const octokit = new Octokit({ auth: ghtoken });

    const stripExt = function (data) {
        return data.replace(/\.[^/.]+$/, "");
    };

    const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
        owner: "is-a-dev",
        repo: repository,
        title: `Register ${domain.toLowerCase().stripExt()}.is-a.dev`,
        body: `Added \`${domain.toLowerCase().stripExt()}\` via the registration website.`,
        head: user + ":main",
        base: "main",
    });

    return pr;
}

export default openPR;
