import "@octokit/core";
import vars from "../vars";

// Fork Function
async function fork(token) {
  const headers = { 'x-gh-auth': token };
  fetch('https://register.is-a.dev/api/fork', { headers })
    .then(async (res) => {
      if(res.status && res.status == "202") {
        console.log("Forked!");
      } else {
        alert("Error: " + res.status);
      }
    });
}

export default fork;
