import "@octokit/core";
import vars from "../vars";

// Fork Function
async function fork(token) {
  const headers = { 'x-gh-auth': token };
  fetch('https://register-api.is-a.dev/api/fork', { headers })
    .then(async (res) => {
      if(res.responce && res.responce == "authorized") {
        console.log("Forked!");
      } else {
        alert("Error: " + res.responce);
      }
    });
}

export default fork;
