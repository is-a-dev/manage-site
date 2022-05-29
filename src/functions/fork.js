const {Octokit} = require('@octokit/core')

function fork(repository, token) {
    const octo = new Octokit({
        auth: token
    });

    octo.request('POST /repos/{owner}/{repo}/forks', {
      owner: 'is-a-dev',
      repo: repository
    });
}

export default fork;