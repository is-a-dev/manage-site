import { Octokit } from "@octokit/rest";
import { env } from '$env/dynamic/private'

async function CheckDomain(subdomain) {
    console.log(subdomain)
    // check if domain is available
    let data = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${subdomain}.json`).then((res) => {
        if (res.status === 404) return true
        else return false
    });
    return data;
}
async function CountDomains() {
    try {
        const response = await fetch("https://raw-api.is-a.dev");
        const data = await response.json();
        const results = countDomainsAndOwners(data);
        return results;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

function countDomainsAndOwners(jsonData) {
    const parsedData = jsonData;
    const subdomains = parsedData.length;
    const owners = new Set();

    parsedData.forEach((entry) => {
        if (entry.owner) {
            owners.add(JSON.stringify(entry.owner));
        }
    });

    const individualOwners = owners.size;

    return {
        subdomains,
        individualOwners,
    };
}

async function DeleteDomain(apikey, username, email, domain) {
    let sha;
    let file;
    let octokit = new Octokit({
        auth: apikey,
    });
    try {
        file = await fetch(`https://api.github.com/repos/${username}/register/contents/domains/${domain}.json`)
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            });
        sha = file.sha;
        await octokit.repos.deleteFile({
            owner: username,
            repo: "register",
            path: "domains/" + domain + ".json",
            message: `Delete ${domain}.is-a.dev`,
            sha: sha,
            committer: {
                name: username,
                email: email,
            },
        });
    }
    catch (e) {
        console.log(e);
        return { "error": "Error deleting domain" };
    }
    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `BETA: Delete ${domain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Deleted \`${domain.toLowerCase().replace(/\.[^/.]+$/, "")}.is-a.dev\` using the site.`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }

}
async function DomainInfo(domain) {
    const domains = domain;
    const response = await fetch(`https://raw.githubusercontent.com/is-a-dev/register/main/domains/${domains}.json`, {
        headers: {
            "User-Agent": "is-a-dev-bot",
        },
    });
    console.log(response);
    if (response.status === 404) {
        return { "info": "Domain not registered" };
    } else {
        const data = await response.json();
        const record = data.record;
        const records = Object.entries(record).map(([type, value]) => ({ type, value }));
        const owner = data.owner;
        const json = {
            "domain": domain,
            "record": records,
            "owner": owner
        }
        return json;
    }
}

async function EditHosting(subdomain, username, email, apikey) {
    let file = await fetch(`https://api.github.com/repos/${username}/register/contents/domains/${subdomain}.json`)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });

    let sha = file.sha;
    let content;
    let octokit = new Octokit({ auth: apikey });


    content = `{
    "owner": {
        "username": "${username}",
        "email": "${email}"
    },
    "record": {
        "A": [
            "217.174.245.249",
            "51.161.54.161"
            ],
        "MX": ["mail.is-a.dev"],
        "TXT": "v=spf1 mx a:mail.is-a.dev ~all"
    }
}`;

    let record = Buffer.from(content).toString("base64");

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain + ".json",
            message: `feat(domain): ${subdomain}.is-a.dev`,
            content: record,
            sha: sha,
            committer: {
                name: username,
                email: email,
            },
            author: {
                name: username,
                email: email,
            },
        });

    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
    }

    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request for this domain already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `Update ${subdomain.toLowerCase()}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Updated \`${subdomain.toLowerCase()}.is-a.dev\` using the [dashboard](https://manage.is-a.dev).`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }
}

async function EditDomain(subdomain, username, email, apikey, records) {
    let file = await fetch(`https://api.github.com/repos/${username}/register/contents/domains/${subdomain}.json`)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });

    let sha = file.sha;
    let octokit = new Octokit({ auth: apikey });

    let data = records;
    const parsedArray = JSON.parse(data);
    let content;
    let value;
    let type;
    

    for (let i = 0; i < parsedArray.length; i++) {
        const obj = parsedArray[i];
        type = obj.type;
        value = obj.value;
        if (type === "A" || type === "MX") {
            value = JSON.stringify(value.split(",").map((s) => s.trim()));
        } else {
            value = `"${data.trim()}"`;
        }

        console.log("Type:", type);
        console.log("Value:", value);
    }

    content = `{
    "owner": {
        "username": "${username}",
        "email": "${email}"
    },
    "record": {
        "${type}": "${value}"
    }
}
`;

    let record = Buffer.from(content).toString("base64");

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain + ".json",
            message: `feat(domain): ${subdomain}.is-a.dev`,
            content: record,
            sha: sha,
            committer: {
                name: username,
                email: email,
            },
            author: {
                name: username,
                email: email,
            },
        });

    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
    }

    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request for this domain already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `BETA: Update ${subdomain.toLowerCase()}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Updated \`${subdomain.toLowerCase()}.is-a.dev\` using the [dashboard](https://manage.is-a.dev).`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }
}

async function forkRepo(token) {
    let forked;
    try {
        // Fork the repository
        const octokit = new Octokit({
            auth: token,
        });

        forked = await octokit.request("POST /repos/{owner}/{repo}/forks", {
            owner: "is-a-dev",
            repo: "register",
            name: "register",
            default_branch_only: true,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        const cloneResponse = forked.data.html_url;

        if (env.DEBUG) {
            console.log("FORKED REPO: " + cloneResponse);
        }

        return {
            forked: cloneResponse,
            error: null,
        }
    } catch (error) {
        console.log("ERROR: " + error);
        return {
            success: false,
            error: error,
        }
    }
};

async function ListDomains(username) {
    let results = [];

    // Assuming 'username' is defined and assigned a value

    // Assuming 'fetch' is a valid function that retrieves data from a given URL
    await fetch("https://raw-api.is-a.dev")
        .then((response) => response.json())
        .then(async (data) => {
            // Code inside the fetch promise handler
            // It receives the response and parses it as JSON data

            for (let i = 0; i < data.length; i++) {
                // Iterates over each element in the data array

                
                // Checks if the username (case-insensitive) matches the owner of the current data record
                if (data[i].owner && data[i].owner.username.toLowerCase() === username.toLowerCase()) {

                    const record = data[i].record;
                    const arr = Object.entries(record).map(([type, value]) => ({ type, value }));
                    // Extracts the record property from the current data record
                    // Converts the record object to an array of objects with 'type' and 'value' keys

                    results.push({ "domain": data[i].domain, "record": arr });
                    // Adds a new object to the results array
                    // The object contains the domain and the converted record array

                    // Sets a variable 'found' to true
                }
            }
        });

    return results;
}

async function RegisterDomain(subdomain, type, username, email, apikey, recordString) {
    let regexPattern;
    let content;
    switch (type) {
        case "A":
            regexPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            break;
        case "CNAME":
            regexPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
            break;
        case "MX":
            regexPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
            break;
        case "TXT":
            regexPattern = /^.*$/;
            break;
        case "URL":
            regexPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=%]*)?$/;
            break;
        default:
            return { "error": "Invalid record type." };
    }

    if (!regexPattern.test(recordString)) return { "error": "Invalid record string." };

    let octokit = new Octokit({ auth: apikey });

    let data = recordString;
    if (type === "A" || type === "MX") {
        data = JSON.stringify(data.split(",").map((s) => s.trim()));
    } else {
        data = `"${data.trim()}"`;
    }
    content = `{
    "owner": {
        "username": "${username}",
        "email": "${email}"
    },
    "record": {
        "${type}": ${data.toLowerCase()}
    }
}
`;

    let record = Buffer.from(content).toString("base64");

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain + ".json",
            message: `feat(domain): ${subdomain}.is-a.dev`,
            content: record,
            committer: {
                name: username,
                email: email,
            },
            author: {
                name: username,
                email: email,
            },
        });

    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
    }

    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request for this domain already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `BETA: Register ${subdomain.toLowerCase()}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Added \`${subdomain.toLowerCase()}.is-a.dev\` using the [dashboard](https://manage.is-a.dev).`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }



}

async function RegisterHosting(subdomain, username, email, apikey) {
    let octokit = new Octokit({ auth: apikey });
    let data = `{
    "owner": {
        "username": "${username}",
        "email": "${email}"
    },
    "record": {
        "A": [
            "217.174.245.249",
            "51.161.54.161"
            ],
        "MX": ["mail.is-a.dev"],
        "TXT": "v=spf1 mx a:mail.is-a.dev ~all"
    }
}`
    let record = Buffer.from(data).toString("base64");
    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: username,
            repo: "register",
            path: "domains/" + subdomain + ".json",
            message: `feat(domain): ${subdomain}.is-a.dev`,
            content: record,
            committer: {
                name: username,
                email: email,
            },
            author: {
                name: username,
                email: email,
            },
        });

    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating domain file." };
    }

    try {
        let existingPullRequests = await octokit.pulls.list({
            owner: "is-a-dev",
            repo: "register",
            state: "open",
            head: `${username}:main`,
            base: "main",
        });

        if (existingPullRequests.data.length > 0) {
            // Pull request already exists, return an error or handle it accordingly
            return { "error": "A pull request for this domain already exists." };
        }
        let pr = await octokit.pulls.create({
            owner: "is-a-dev",
            repo: "register",
            title: `BETA: Register ${subdomain.toLowerCase()}.is-a.dev`,
            head: `${username}:main`,
            base: "main",
            body: `Added \`${subdomain.toLowerCase()}.is-a.dev\` using the [dashboard](https://manage.is-a.dev).`,
        });
        let PrUrl = pr.data.html_url;
        return { "prurl": PrUrl, "prnumber": pr.data.number };
    }
    catch (e) {
        console.log(e);
        return { "error": "Error creating pull request." };
    }
}



async function getUser(token) {
    let octokit = new Octokit({
        auth: token,
    });
    let user = await octokit.users.getAuthenticated();
    return user.data;
}
async function getEmail(token) {
    let octokit = new Octokit({
        auth: token,
    });
    let emails = (await octokit.request("GET /user/emails", {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    })).data
    console.log(emails)
    let email = emails.find((email) => email.primary) || null;
    console.log(email.email)
    return email.email;

}

async function getHosting(jwt, domain) {
    try {
        let response = await fetch(`https://hosts.is-a.dev/api/domain?jwt=${jwt}&domain=${domain}`);
        if (!response.ok) {
            throw new Error('Failed to fetch hosting data');
        }
        let hostingData = await response.json(); // Assuming the response contains JSON data
        return hostingData; // Return the processed JSON data
    } catch (error) {
        console.error(error);
        return null; // Handle the error case appropriately
    }
}

async function Maintainer(username) {
    const validUsernames = [
        "andrewstech",
        "hackermondev",
        "mtgsquad",
        "phenax",
        "VaibhavSys",
        "wdhdev",
        "DEV-DIBSTER"
    ];

    return Boolean(username && validUsernames.includes(username));
}

export { CheckDomain, CountDomains, countDomainsAndOwners, DeleteDomain, DomainInfo, EditDomain, forkRepo, ListDomains, RegisterDomain, getUser, getEmail, getHosting, RegisterHosting, EditHosting, Maintainer };
