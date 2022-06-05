import "@octokit/core";
import vars from '../vars'

async function getpr() { 
    const token = Object.values(vars)
    const { Octokit } = require("@octokit/core");
    const ghtoken = token[0].toString();
    const octokit = new Octokit({
        auth: ghtoken
      })
      
    await octokit.request('GET /repos/{owner}/{repo}/pulls?head=mtgsquad:OhaDerErste', {
        owner: 'is-a-dev',
        repo: 'register'
    })
    
    console.log(octokit);

    return octokit;
}  

export default getpr;