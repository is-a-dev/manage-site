import * as config from './config.json';
import octokit, { Octokit } from '@octokit/core';
import fetch from 'node-fetch';

const octokit = new Octokit({
    auth: config.gh
});

module.exports.fork = (repository) => {
    octokit.request('POST /repos/{owner}/{repo}/forks', {
      owner: 'is-a-dev',
      repo: repository
    })
}

module.exports.createFileOnFork = (subdomain, base64content, msg) => {
    fetch(`https://api.github.com/repos/is-a-dev-github/test/contents/so-test.txt`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${config.gh}`
        },
        body: {"message": "Initial Commit","content": "bXkgbmV3IGZpbGUgY29udGVudHM="}
    })
}
