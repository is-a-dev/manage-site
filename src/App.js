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
const betatesters = require("./betatesters");
firebase.initializeApp({
  apiKey: config.key,
  authDomain: "auth.is-a.dev",
  projectId: "is-a-dev",
  storageBucket: "is-a-dev.appspot.com",
  messagingSenderId: "611825040570",
  appId: "1:611825040570:web:98f70d5aaf5861552e1683",
  measurementId: "G-K9WXR60DWJ",
});

const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
//auth.signInWithPopup(provider)
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
        <h3>
          Please do not share the link for this beta, however you can share
          screenshots!
        </h3>
      </footer>
    </>
  );
}

function SignIn() {
  return (
    <button
      onClick={() => {
        githubLoginProvider.addScope("repo");
        auth.signInWithPopup(githubLoginProvider).then((res) => {
          vars.token = res.credential.accessToken;
          vars.user = res.additionalUserInfo.username;
          vars.email = res.user.email;

          // For development set this varible to test-project
          vars.repo = "register";

          Object.freeze(vars);
          //fork on login
          fork();
          // remove after beta

          if (!betatesters.includes(vars.email)) {
            auth.currentUser.delete();
            alert("You are not a beta tester!");
          }
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
      <h3>Logged in as {name}</h3>
    </nav>
  );
}

function Dashboard(props) {
  const queryParams = new URLSearchParams(window.location.search);
  const record = queryParams.get("records");
  const name = auth.currentUser.displayName;
  if (name == null) {
    auth.signOut();
  }

  return (
    <>
      <h1>Register A Subdomain</h1>

      <div className="btnBox">
        <select id="dropbtn">
          <option value="" selected disabled>
            Choose Record Type
          </option>
          <option value="CNAME">CNAME</option>
          <option value="A">A</option>
          <option value="URL">URL</option>
        </select>

        <input
          id="subdomain"
          type="text"
          placeholder="Subdomain (without .is-a.dev)"
        />

        <input id="value" type="text" placeholder="Record Value" />
      </div>

      <div
        className="g-recaptcha"
        data-sitekey="6Le5KHsgAAAAAFy50r1Jiw1_Uh-Ru3Jl2FWGLUIH"
        data-callback="verifyRecaptchaCallback"
        data-expired-callback="expiredRecaptchaCallback"
      ></div>

      <a href="https://docs.is-a.dev/domain_structure/">
        Read about record types and domain structure.
      </a>

      <div className="btnBox">
        <button
          id="register"
          className="btn-green"
          onClick={() => {
            const subdomain = document.getElementById("subdomain").value;
            const recordData = document.getElementById("value").value;

            commit(
              subdomain,
              `
              {
                "owner": {
                  "username": "${vars.user}",
                  "email": "${vars.email}"
                },
                "record": {
                  "${document.getElementById("dropbtn").value}": "${recordData}"
                }
              }
            `
            ).then(
              () =>
                (document.getElementById("register").innerText =
                  "Request Submitted")
            );
            const docRef = addDoc(collection(db, "users"), {
              domains: subdomain,
              username: name,
            });
          }}
        >
          Register
        </button>

        <button onClick={() => auth.signOut()}>Sign Out</button>
        <button className="btn-red" onClick={() => auth.currentUser.delete()}>
          Delete Account
        </button>
      </div>
    </>
  );
}

export default App;
