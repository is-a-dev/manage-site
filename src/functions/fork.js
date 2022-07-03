import "@octokit/core";
import vars from "../vars";

//make fork function
async function fork() {
  const { Octokit } = require("@octokit/core");
  const { createTokenAuth } = require("@octokit/auth-token");
  const token = Object.values(vars);
  const ghtoken = token[0].toString();
  const repository = token[3].toString();

  const octokit = new Octokit({
    auth: ghtoken,
  });
  const forked = await octokit.request("POST /repos/{owner}/{repo}/forks", {
    owner: "is-a-dev",
    repo: repository,
  });
  return forked;
}

export default fork;
