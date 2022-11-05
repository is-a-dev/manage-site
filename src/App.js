import { GithubAuthProvider, OAuthCredential } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from 'react-hook-form';
import "./App.css";
import banner from "./assets/banner.png";
import config from "./config.json";
import commit from "./functions/commit";
import fork from "./functions/fork";
import getpr from "./functions/getpr";
import openPR from "./functions/pr";
import vars from "./vars";
import Popup from "./components/Popup";
import maintainers from './maintainers'
import helpers from './helpers'

firebase.initializeApp({
  apiKey: config.key,
  authDomain: "auth.is-a.dev",
  projectId: "is-a-dev",
  storageBucket: "is-a-dev.appspot.com",
  messagingSenderId: "611825040570",
  appId: "1:611825040570:web:98f70d5aaf5861552e1683",
  measurementId: "G-K9WXR60DWJ",
})

const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
// auth.signInWithPopup(provider);
const db = getFirestore();
let registerPopup = false;

function App() {
  window.addEventListener("load", (event) => auth.signOut());
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        {user ? <Nav /> : ""}
        <img alt="banner" className="banner" src={banner}></img>
      </header>
      <main>{user ? <Dashboard /> : <SignIn />}</main>

      <footer>
        <h3>&copy; is-a.dev</h3>
        <div className="donate">
          <p>Consider donating here:</p>
          <div className="donate-links">
            <img onClick={() => window.location.href="https://www.buymeacoffee.com/phenax"} src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="28" width="119"/>
            <img onClick={() => window.location.href="https://liberapay.com/phenax"} src="https://img.shields.io/badge/liberapay-donate-yellow.svg?style=for-the-badge" alt="Liberapay recurring donation button"/>
          </div>
        </div>
      </footer>
    </>
  );
}

function SignIn() {
  return (
    <button
    className="margin-top-15px"
      onClick={() => {
        githubLoginProvider.addScope("public_repo");
        auth.signInWithPopup(githubLoginProvider)
          .then((res) => {
            vars.token = res.credential.accessToken;
            vars.user = res.additionalUserInfo.username;
            vars.email = res.user.email;

            // For development set this varible to "test-project"
            vars.repo = "register";

            Object.freeze(vars);
            // Fork on login
            fork(vars.token);
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

  if(maintainers.includes(vars.user)) {
    return (
      <nav>
        <img alt="pfp.png" src={pfp}></img>
        <h3>Logged in as: {name} (@is-a-dev/maintainers)</h3>
      </nav>
    );
  } else if(helpers.includes(vars.user)){
    return (
      <nav>
        <img alt="pfp.png" src={pfp}></img>
        <h3>Logged in as: {name} (@is-a-dev/helpers)</h3>
      </nav>
    );
  } else return (
          <nav>
            <img alt="pfp.png" src={pfp}></img>
            <h3>Logged in as: {name}</h3>
          </nav>
        );
}

function Dashboard(props) {
  const name = auth.currentUser.displayName;
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => Commits(data);
    

if(name == null) {
    auth.signOut();
}

  return (
    <>
        <h1>Register A Subdomain</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btnBox">  
            <select id="dropbtn" {...register("type", { required: true })}>  
            <option value="" selected disabled>
                  Choose Record Type
                </option>
              <option value="A">A</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="TXT">TXT</option>
              <option value="URL">URL</option>
            </select>
          </div>
        <div className="subdomainfield">
          <input type="text" minLength={3} id="subdomain" placeholder="Subdomain" {...register("subdomain", {required: true, max: 12})} />
          <span>.is-a.dev</span>
        </div>
        <input type="text" id="value" placeholder="Record value" {...register("value", {required: true})} />
        <div className="btnBox">
          <button id="register" className="btn-submit" type="submit" >Register</button>
        </div>
        </form>

      <div className="btnBox">
        <button onClick={() => auth.signOut()}>Sign Out</button>
      </div>
    </>
  )
}


async function Commits(data) {
  const requestOptions = {
    method: 'post',
    headers: { "x-gh-auth": vars.token, "domain": data.subdomain, "email": vars.email, "username": vars.user, "type": data.type, "content": data.value },
  };
  fetch('https://register.is-a.dev/api/commit', { requestOptions})
    .then(async (res) => {
      if(res.status && res.status === "202") {
        console.log("PR!");
        getpr();
      } else {
        alert("Error: " + res.status);
      }
    });
}          
export default App;
