const express = require("express"); //Line 1
const app = express(); //Line 2
const { Octokit } = require("@octokit/core");
const { Base64 } = require("js-base64");
const bodyParser = require('body-parser')
const { createTokenAuth } = require("@octokit/auth-token");
const path = require("path");
const isDomainValid = require("is-domain-valid");
const { response } = require("express");
const sgMail = require("@sendgrid/mail");
const simpleParser = require("mailparser").simpleParser;
require("dotenv").config();
const {HttpClient} = require('@actions/http-client')
const {ErrorHandler, BadRequestError} = require('express-json-api-error-handler')
const JSONdb = require("simple-json-db");
const db = new JSONdb("/is-a-dev/privacy.json");

const multer = require("multer");

var maintainers = ["andrew@win11react.com"];

const upload = multer();
const port = process.env.PORT || 5000;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createComment = async (http, params) => {
    const {repoToken, owner, repo, issueNumber, body} = params
  
    return http.postJson(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {body},
      {
        accept: 'application/vnd.github.v3+json',
        authorization: `token ${repoToken}`,
      }
    )
}

const checkToken = async (http, token) => {
    if (!token) {
      return false
    }
  
    if (token === process.env.GITHUB_TOKEN) {
      // Assume the use of this token is intentional
      return true
    }
  
    try {
      await http.getJson(`https://api.github.com/user/repos`, {
        accept: 'application/vnd.github.v3+json',
        authorization: `token ${token}`,
      })
      return false
    } catch (err) {
      // Far from perfect, temporary tokens are difficult to identify
      // A bad token returns 401, and a personal token returns 200
      return (
        err.statusCode === 403 &&
        err.result.message &&
        err.result.message.startsWith('Resource not accessible by integration')
      )
    }
}


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use((req, res, next) => {
    req.httpClient = new HttpClient('http-client-add-pr-comment-bot')
    next()
})
app.use(bodyParser.json())

app.use(express.static("public"));



function isValidURL(string) {
    var res = string.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function ValidateIPaddress(ipaddress) {
    if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            ipaddress
        )
    ) {
        return true;
    }
    return false;
}

app.get("/api/fork", function (req, res, next) {
    var auth = req.header("x-gh-auth");
    var octokit = new Octokit({
        auth: auth,
    });
    octokit
        .request("POST /repos/{owner}/{repo}/forks", {
            owner: "is-a-dev",
            repo: "register",
        })
        .then((response) => {
            res.send(response.status);
        })
        .catch((error) => {
            res.send(error.status);
        });
});

app.post("/api/commit", async function (req, res) {
    var auth = req.header("x-gh-auth");
    var domain = req.header("domain");
    var type = req.header("type");
    var content = req.header("content");
    var username = req.header("username");
    var email = req.header("email");
    var octokit = new Octokit({
        auth: auth,
    });

    var lowcaseDomain = domain.toLowerCase();
    var LowcaseContent = content.toLowerCase();

    if (type === "CNAME") {
        if (isValidURL(LowcaseContent) === false) {
            res.status(335);
            throw new Error("Invalid Url!");
        }
    }
    if (type === "A") {
        if (ValidateIPaddress(LowcaseContent) === false) {
            res.status(335);
            throw new Error("Invalid IP!");
        }
    }

    var validSubdomain = lowcaseDomain.replace(/\.is-a\.dev$/, "");

    if (type === "A" || type === "MX") {
        LowcaseContent = JSON.stringify(
            LowcaseContent.split(",").map((s) => s.trim())
        );
    } else {
        LowcaseContent = `"${LowcaseContent.trim()}"`;
    }

    var fullContent = ` 
    {
      "owner": {
        "username": "${username}",
        "email": "${email}"
      },
      "record": {
        "${type}": ${LowcaseContent}
      }
    }
      `;
    var contentEncoded = Base64.encode(fullContent);

    octokit
        .request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: username,
            repo: "register",
            path: "domains/" + validSubdomain + ".json",
            message: "Added " + validSubdomain,
            content: contentEncoded,
        })
        .catch((error) => {
            res.sendStatus(3281);
            throw new Error("Can't commit!");
        });
    await delay(1000);
    octokit
        .request("POST /repos/{owner}/{repo}/pulls", {
            owner: "is-a-dev",
            repo: "register",
            title: "Register Subdomain: " + validSubdomain,
            body: "Added the domain: " + validSubdomain,
            head: username + ":main",
            base: "main",
        })
        .catch((error) => {
            res.sendStatus(3282);
            throw new Error("Can't open PR!");
        });
    res.sendStatus(202);
});



app.post('/repos/:owner/:repo/issues/:issueNumber/comments', async (req, res, next) => {
    try {
      const isTokenValid = await checkToken(req.httpClient, req.header('temporary-github-token'))
      if (!isTokenValid) {
        throw new BadRequestError('must provide a valid temporary github token')
      }
  
      const response = await createComment(req.httpClient, {
        ...req.params,
        ...req.body,
        repoToken: process.env.GITHUB_TOKEN,
      })
  
      res.status(200).send(response).end()
    } catch (err) {
      next(err)
    }
})

app.post("/api/privacy", upload.any(), (req, res) => {
    var emailMapper = db.json();
  
    simpleParser(req.body.email).then((parsedEmail) => {
      const toEmail = [];
  
      parsedEmail.to.value.forEach((value) => {
        if (emailMapper[value.address] !== undefined) {
          toEmail.push(emailMapper[value.address]);
        }
      });
  
      if (toEmail.length > 0) {
        let attachments = [];
  
        if (parsedEmail.attachments.length > 0) {
          parsedEmail.attachments.forEach((file) => {
            attachment = {
              content: file.content.toString("base64"),
              filename: file.filename,
              type: file.type,
              disposition: file.contentDisposition,
              content_id: file.contentId,
            };
  
            attachments.push(attachment);
          });
        }
  
        const msg = {
          to: toEmail,
          from: "service@privacy.is-a.dev",
          replyto: parsedEmail.from.value[0].address,
          subject: parsedEmail.subject,
          text: parsedEmail.text,
          html: parsedEmail.html,
          attachments: attachments,
        };
  
        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);
  
            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
      }
    });
    res.sendStatus(200);
});


app.get("/privacy/add", (req, res) => {
    var email = req.query.email;
    //generate a random string of nubers between 3212 and 9999
    var random = Math.floor(Math.random() * 6788) + 3212;
    // if random exsit in the database, generate another random number
    while (db.has(random)) {
        random = Math.floor(Math.random() * 6788) + 3212;
    }
    // add the random number and email to the database
    db.set(random, email);
    // send the random number to the user
    res.send(random.toString() + "@privacy.is-a.dev is your privacy email");
});

const errorHandler = new ErrorHandler()
errorHandler.setErrorEventHandler(err => console.log(JSON.stringify(err)))
app.use(errorHandler.handle)
