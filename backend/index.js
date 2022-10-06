const express = require('express'); //Line 1
const app = express(); //Line 2
const { Octokit } = require("@octokit/core");
const { createTokenAuth } = require("@octokit/auth-token");
const path = require("path");
const isDomainValid = require('is-domain-valid');
const { response } = require('express');
const port = process.env.PORT || 5000; 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static("public"));

app.use(bodyParser.json());

app.get('/api/fork', function(req,res,next){
    var auth = req.header("x-gh-auth");
    var octokit = new Octokit({
        auth: auth
    });
    octokit.request('POST /repos/{owner}/{repo}/forks', {
        owner: 'is-a-dev',
        repo: 'register'
    }).then((response) => {
        res.send(response.status);
    }).catch((error) => {
        res.send(error.status);
    }
    );


});

app.post('/api/commit', function(req, res){
    var auth = req.header("x-gh-auth");
    var domain = req.header("domain");
    console.log(req.body);
    var octokit = new Octokit({
        auth: auth
    })
    fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${domain}.json`, {
            method: "GET",
            headers: {
                "User-Agent": "mtgsquad"
            }
        }).then(async (res) => {
            if(res.status && res.status == 404) {
                octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'is-a-dev',
                    repo: 'register',
                    path: 'domains/' + domain + '.json',
                    message: 'Add ' + domain,
                    content: Buffer.from(JSON.stringify(req.body)).toString('base64')
                }).then((response) => {
                    res.send(response.status);
                }).catch((error) => {
                    res.send(error.status);
                }
                );
            } else {
                res.send(response.status);
            }

        }).catch((error) => {
            res.send(error.status);
        }
        );
});