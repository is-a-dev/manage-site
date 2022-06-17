import React from 'react';
import './App.css';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import banner from './assets/banner.png';
import {useAuthState} from 'react-firebase-hooks/auth';
import fork from './functions/fork';
import openPR from './functions/pr';
import commit from './functions/commit';
import { GithubAuthProvider, OAuthCredential } from 'firebase/auth';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import config from './config.json';
import vars from './vars'
import getpr from './functions/getpr';
const betatesters = require('./betatesters');
firebase.initializeApp({
  apiKey: config.key,
  authDomain: "is-a-dev.firebaseapp.com",
  projectId: "is-a-dev",
  storageBucket: "is-a-dev.appspot.com",
  messagingSenderId: "611825040570",
  appId: "1:611825040570:web:98f70d5aaf5861552e1683",
  measurementId: "G-K9WXR60DWJ"
});
const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
//auth.signInWithPopup(provider)
const db = getFirestore();

function SignIn() {

  return (
    <button className='button signIn' onClick={()=> {
      githubLoginProvider.addScope('repo');  
      auth.signInWithPopup(githubLoginProvider).then((res)=>{
       vars.token = res.credential.accessToken
       vars.user = res.additionalUserInfo.username;
       vars.email = res.user.email;
       
       // For development set this varible to test-project
       vars.repo = 'register';

       Object.freeze(vars)
       //fork on login
       fork()
      // remove after beta
      
      if(!betatesters.includes(vars.email)) {
        auth.currentUser.delete()
        alert('You are not a beta tester!')
      }
      })
    }}>Sign in with GitHub</button>
  );
}

function App() {
  window.addEventListener('load', (event) => {
    auth.signOut()
  });
  
  const [user] = useAuthState(auth);
  

  return (
    <div className="App">
      <header><img alt='banner.png' src={banner}></img></header>
      <>
      {user ? <Dashboard /> : <SignIn />}
      </>
    </div>
  );
}

function SignOut() {
  return (
    <button className='signOut button' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Dashboard(props) {
  const queryParams = new URLSearchParams(window.location.search)
  const record = queryParams.get("records")
  const name = auth.currentUser.displayName;
  const pfp = auth.currentUser.photoURL;

  return (
    <>
    <center>
    <img alt='pfp.png' className='pfp userItem-1' src={pfp}></img>
      <div className='userItemContainer'>
        <h2 className='white userItem-2'>Logged in as {name}</h2>
      </div>
      <div className='form-container'>
        <h1>Register A Subdomain</h1>
        <form>
        <div className="dropdown">
            <button id='dropbtn' type='button' className="dropbtn button">Choose Record Type</button>
            <div className="dropdown-content">
              <button type='button' onClick={(event) => {
                event.preventDefault();
                document.getElementById('dropbtn').innerText = 'CNAME';
                
              }} className='dropdown-buttons'>CNAME</button>

              <button type='button' onClick={(event) => {
                event.preventDefault();
                document.getElementById('dropbtn').innerText = 'A';
                
              }} className='dropdown-buttons'>A</button>

              <button type='button' onClick={(event) => {
                event.preventDefault();
                document.getElementById('dropbtn').innerText = 'URL';
              }} className='dropdown-buttons'>URL</button>

            </div>
          </div>
          <br />
          <input id="subdomain" type='text' placeholder='Subdomain (without .is-a.dev)'></input>
          <br />
          <input id="value" type='text' placeholder='Record Value'></input>
          <br />
          <label className='blue'><a href="https://docs.is-a.dev/domain_structure/">Read about record types and domain structure.</a></label>
          <br/>
          <button id='register' type='button' onClick={() => {
            const subdomain = document.getElementById('subdomain').value;
            const recordData = document.getElementById('value').value;

            commit(subdomain, `
              {
                "owner": {
                  "username": "${vars.user}",
                  "email": "${vars.email}"
                },
                "record": {
                  "${document.getElementById('dropbtn').innerText}": "${recordData}"
                }
              }
            `).then(() => document.getElementById('register').innerText = "Request Submitted");
            const docRef = addDoc(collection(db, "users"), {
              domains: subdomain,
              username: name
            });
          }} className='button-submit'>Register</button>
        </form>
      </div>
      <SignOut />
      <button className='delete button-red' onClick={() => auth.currentUser.delete()}>Delete Account</button>
      <h3 className='footer'>Please do not share the link for this beta, however you can share screenshots!</h3>
    </center>
    </>
  ) 
  }

export default App;
