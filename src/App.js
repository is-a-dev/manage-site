import { GithubAuthProvider, OAuthCredential } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import banner from "./assets/banner.png";
import config from "./config.json";
import commit from "./functions/commit";
import fork from "./functions/fork";
import getpr from "./functions/getpr";
import openPR from "./functions/pr";
import vars from "./vars";

firebase.initializeApp({
  apiKey: config.key,
  authDomain: "open-beta.isa.win11react.com",
  projectId: "open-beta-is-dev",
  storageBucket: "open-beta-is-dev.appspot.com",
  messagingSenderId: "376394020338",
  appId: "1:376394020338:web:ecae3033a961741902276b",
  measurementId: "G-P2MGDWCFP9",
});

const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
// auth.signInWithPopup(provider);
const db = getFirestore();

function App() {
  window.addEventListener("load", (event) => auth.signOut());
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        {user ? <Nav /> : null}
        <img alt="banner" className="banner" src={banner}></img>
      </header>
      <main>{user ? <Dashboard /> : <SignIn />}</main>

      <footer>
        <h3>&copy; is-a.dev</h3>
      </footer>
    </>
  );
}

function SignIn() {
  return (
    <button
      onClick={() => {
        githubLoginProvider.addScope("repo");
        auth.signInWithPopup(githubLoginProvider)
          .then((res) => {
            vars.token = res.credential.accessToken;
            vars.user = res.additionalUserInfo.username;
            vars.email = res.user.email;

            // For development set this varible to "test-project"
            vars.repo = "register";

            Object.freeze(vars);
            // Fork on login
            fork();
        });
      }}
    >
      Sign in with GitHub
    </button>
  );
}

function Nav() {
  const pfp = auth.currentUser.photoURL;
  const name = auth.currentUser.displayName;

  return (
    <nav>
      <img alt="pfp.png" src={pfp}></img>
      <h3>Logged in as: {name}</h3>
    </nav>
  );
}

function Dashboard(props) {
  const queryParams = new URLSearchParams(window.location.search);
  const record = queryParams.get("records");
  const name = auth.currentUser.displayName;
  if(name == null) {
    auth.signOut();
  }

  return (
    <>
      <h1>Register a Subdomain</h1>

      <div className="btnBox">
        <select id="dropbtn">
          <option value="" selected disabled>
            Choose Record Type
          </option>
          <option value="A">A</option>
          <option value="CNAME">CNAME</option>
          <option value="MX">MX</option>
          <option value="TXT">TXT</option>
          <option value="URL">URL</option>
        </select>

        <input
          id="subdomain"
          type="text"
          placeholder="Subdomain (without .is-a.dev)"
          required="required"
        />

        <input id="value" type="text" placeholder="Record Value" required="required" />
      </div>

      <div
        className="g-recaptcha"
        data-sitekey="6Le5KHsgAAAAAFy50r1Jiw1_Uh-Ru3Jl2FWGLUIH"
        data-callback="verifyRecaptchaCallback"
        data-expired-callback="expiredRecaptchaCallback"
      ></div>

      <a
        href="https://docs.is-a.dev/domain_structure"
        target="_blank"
        rel="noreferrer"
      >
        Read more about record types and domain structure.
      </a>

      <div className="btnBox">
        <button
          id="register"
          className="btn-green"
          onClick={() => {
            const subdomain = document.getElementById("subdomain").value;
            const recordType = document.getElementById("dropbtn").value;
            let recordData = document.getElementById("value").value;

            if(recordType === "A" || recordType === "MX") {
              recordData = JSON.stringify(
                recordData.split(",").map((s) => s.trim())
              );
            } else {
              recordData = `"${recordData.trim()}"`;
            }
            if(recordData === "null") {
              alert('No Record value');
              auth.signOut();
            }
            if(subdomain === "null") {
              alert('No subdomain selected');
              auth.signOut();
            }
            if(recordType === "null") {
              alert('No record Type selected');
              auth.signOut();
            }
              

            commit(
              subdomain,
              `
              {
                "owner": {
                  "username": "${vars.user}",
                  "email": "${vars.email}"
                },
                "record": {
                  "${recordType}": ${recordData}
                }
              }
            `
            ).then(
              () =>
                (document.getElementById("register").innerText = "Request Submitted")
            );

          }}
        >
          Register
        </button>

        <button onClick={() => auth.signOut()}>Sign Out</button>
      </div>
    </>
  );
}

export default App;
