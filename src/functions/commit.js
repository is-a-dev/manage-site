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

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-gh-auth": ghtoken,
            domain: domain,
        },
        body: FileContents,
    };
    fetch("https://register.is-a.dev/api/commit", requestOptions).then(
        async (res) => {
            if (res.status && res.status == "202") {
                console.log("Committed!");
                openPR(domain);
            } else {
                alert("Error: " + res.status);
            }
        }
    );
}

export default commit;
