import "@octokit/core";
import vars from "../vars";

async function openPR(domain) {
  const { Octokit } = require("@octokit/core");
  const { createTokenAuth } = require("@octokit/auth-token");
  const token = Object.values(vars);
  const ghtoken = token[0].toString();
  const user = token[1].toString();
  const repository = token[3].toString();
  const beta-message = " Via Open Beta Program: https://open-beta.is-a.dev/"

  const octokit = new Octokit({
    auth: ghtoken,
  });
  const pr = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: "is-a-dev",
    repo: repository,
    title: "BETA" + "Add Subdomain:" + domain,
    body: "Added the domain  " + domain + beta-message,
    head: user + ":main",
    base: "main",
  });
  return pr;
}

export default openPR;
