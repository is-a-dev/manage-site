import "@octokit/core";
import vars from "../vars";

async function getpr() {
  const token = Object.values(vars);
  const { Octokit } = require("@octokit/core");
  const ghtoken = token[0].toString();
  const user = token[1].toString();
  const repository = token[3].toString();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await delay(5000);
  const octokit = new Octokit({
    auth: ghtoken,
  });

  const res = octokit.request(
    "GET /repos/{owner}/{repo}/pulls?head=" + { user } + ":main",
    {
      owner: "is-a-dev",
      repo: repository,
      user: user,
    }
  );
  res.then((res) => {
    const url = res.data[0].html_url;
    //pr number is res.data[0].number
    window.open(url, "_blank", "noopener,noreferrer");
    fetch("https://notify-api.is-a.dev/pr/" + res.data[0].number)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return res;
}

export default getpr;
