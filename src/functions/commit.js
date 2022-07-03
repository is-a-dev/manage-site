import "@octokit/core";
import "@octokit/rest";
import vars from "../vars";
import openPR from "./pr";
import getpr from "./getpr";

async function commit(domain, FileContents) {
  const { Octokit } = require("@octokit/rest");
  const { Base64 } = require("js-base64");
  const token = Object.values(vars);
  const ghtoken = token[0].toString();
  const user = token[1].toString();
  const email = token[2].toString();
  const repository = token[3].toString();
  const contentEncoded = Base64.encode(FileContents);

  const octokit = new Octokit({
    auth: ghtoken,
  });
  let ChosenDomain = domain;
  let type = ".json";
  let fileName = ChosenDomain.concat(type);
  let apiurl =
    "https://api.github.com/repos/is-a-dev/register/contents/domains/" +
    fileName;
  try {
    const response = await fetch(apiurl);

    console.log("response.status: ", response.status); // 👉️ 200
    console.log(response);
  } catch (err) {
    console.log(err);
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: user,
      repo: repository,
      path: "domains/" + fileName,
      message: "feat: Added domain programatically",
      content: contentEncoded,
      committer: {
        name: user,
        email: email,
      },
      author: {
        name: user,
        email: email,
      },
    });
    openPR(domain);
    getpr();
  }
}

export default commit;
