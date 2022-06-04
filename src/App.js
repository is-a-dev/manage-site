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
import config from './config.json';
import vars from './vars'
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
function SignIn() {

  return (
    <button className='button signIn' onClick={()=> {
      githubLoginProvider.addScope('repo');  
      auth.signInWithPopup(githubLoginProvider).then((res)=>{
       console.log(res.credential.accessToken);
       vars.token = res.credential.accessToken
       vars.user = res.additionalUserInfo.username;
       console.log(res.additionalUserInfo.username);
       vars.email = res.user.email;
       Object.freeze(vars)
       //fork on login
       fork() 
      })
    }}>Sign In With GitHub</button>
  );
}

function App() {
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
  const record = queryParams.get("record")
  const name = auth.currentUser.displayName;
  const pfp = auth.currentUser.photoURL;

  return (
    <>
    <center>
    <img alt='pfp.png' className='pfp userItem-1' src={pfp}></img>
      <div className='userItemContainer'>
        <h2 className='white userItem-2'>Logged In As {name}</h2>
      </div>
      <div className='form-container'>
        <h1>Register A Subdomain</h1>
        <form>
          <input type='text' placeholder='Subdomain'></input>
          <br />
          <div class="dropdown">
            <button class="dropbtn button">Choose Record Type</button>
            <div class="dropdown-content">
              <button className='dropdown-buttons'>CNAME</button>
              <button className='dropdown-buttons'>A</button>
              <button className='dropdown-buttons'>URL</button>
            </div>
          </div>
          <br />
          <button className='button-submit'>Submit</button>
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
