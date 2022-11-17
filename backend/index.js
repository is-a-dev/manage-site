const express = require('express'); //Line 1
const app = express(); //Line 2
const { Octokit } = require("@octokit/core");
const { Base64 } = require("js-base64");
const { createTokenAuth } = require("@octokit/auth-token");
const path = require("path");
const isDomainValid = require('is-domain-valid');
const { response } = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const multer  = require('multer');

var maintainers = [ "andrew@win11react.com", "bob@bo.com"]

const upload = multer();
const port = process.env.PORT || 5000; 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static("public"));


function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  };

function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    } 
    return (false)  
  }  


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

app.post('/api/commit', async function(req, res){
    var auth = req.header("x-gh-auth");
    var domain = req.header("domain");
    var type = req.header("type");
    var content = req.header("content");
    var username = req.header("username");
    var email = req.header("email");
    var octokit = new Octokit({
        auth: auth
    })

    var lowcaseDomain = domain.toLowerCase();
    var LowcaseContent = content.toLowerCase();

    if(type === "CNAME") {
        if (isValidURL(LowcaseContent) === false) {
            res.status(335);
            throw new Error("Invalid Url!");
        }
    }
    if(type === "A") {
        if (ValidateIPaddress(LowcaseContent) === false) {
            res.status(335);
            throw new Error("Invalid IP!");
        }
    }

    var validSubdomain = lowcaseDomain.replace(/\.is-a\.dev$/, '');

    if(type === "A" || type === "MX") {
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

    octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: username,
        repo: 'register',
        path: 'domains/' + validSubdomain + '.json',
        message: 'Added ' + validSubdomain,
        content: contentEncoded
    }
    ).catch((error) => {
        res.sendStatus(3281);
        throw new Error("Can't commit!");
    }
    );
    await delay(1000);
    octokit.request("POST /repos/{owner}/{repo}/pulls", {
        owner: "is-a-dev",
        repo: "register",
        title: "Register Subdomain: " + validSubdomain,
        body: "Added the domain: " + validSubdomain,
        head: username + ":main",
        base: "main",
    }
    ).catch((error) => {
        res.sendStatus(3282);
        throw new Error("Can't open PR!");
    }
    );
    res.sendStatus(202);


});

app.post('/api/privacy', upload.none(), (req, res) => {
    const body = req.body;
  
    console.log(`From: ${body.from}`);
    var text = body.from
    var re = /[^< ]+(?=>)/g;

    text.match(re).forEach(function(email) {
    console.log(`Email From: ${email}`);
    });
    console.log(`To: ${body.to}`);
    console.log(`Subject: ${body.subject}`);
    console.log(`Text: ${body.text}`);

    // if email is in the maintainers list, send the email
    if (!maintainers.includes(email)) {
        sgMail.send({
            to: email,
            from: 'service@privacy.is-a.dev',
            subject: 'Not Authorized',
            text: 'Sorry your not authorized to use this service.',
            html: '<strong>Sorry your not authorized to use this service</strong>',
        });
        `Email not sent to ${email}`;
    } else {
        sgMail.send({
            to: email,
            from: 'service@privacy.is-a.dev',
            subject: 'Email Sent',
            text: 'Your email has been sent.',
            html: '<strong>Your email has been sent</strong>',
        });

  
    return res.status(200).send();
  });
  

// post body
