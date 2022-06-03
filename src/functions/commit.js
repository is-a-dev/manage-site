import "@octokit/core";
import "@octokit/rest";
import vars from './vars'


async function commit(domain, FileContents) {
    const { Octokit } = require("@octokit/rest");
    const { Base64 } = require("js-base64");
    const token = Object.values(vars)
    console.log(token);
    const ghtoken = token[0].toString();
    const user = token[1].toString();
    const email = token[2].toString();
    console.log(ghtoken);
    const contentEncoded = Base64.encode(FileContents);

    const octokit = new Octokit({
        auth: ghtoken
    })
    let ChosenDomain = domain;
    let type = '.json';
    let fileName = ChosenDomain.concat(type);
    const { data } = await octokit.repos.createOrUpdateFileContents({
              owner: user,
              repo: "register",
              path: 'domains/' + fileName,
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
    
    
}    

export default commit;