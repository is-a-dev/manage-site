import React from 'react';
import './App.css';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import banner from './banner.png';

import {useAuthState} from 'react-firebase-hooks/auth';
import betatesters from '../betatesters';
firebase.initializeApp({
  apiKey: "AIzaSyDR0dz0tI9bpCOTuRr5IGyNEkC7fTfoT2M",
  authDomain: "is-a-dev.firebaseapp.com",
  projectId: "is-a-dev",
  storageBucket: "is-a-dev.appspot.com",
  messagingSenderId: "611825040570",
  appId: "1:611825040570:web:98f70d5aaf5861552e1683",
  measurementId: "G-K9WXR60DWJ"
});
const auth = firebase.auth();
const githubLoginProvider = new firebase.auth.GithubAuthProvider();
//auth.signInWithPopup(provider);


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

function SignIn() {

  return (
    <button className='button signIn' onClick={() => auth.signInWithPopup(githubLoginProvider)}>Sign In With GitHub</button>
  );
}



function SignOut() {
  return (
    <button className='signOut button' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Dashboard() {  
  const name = auth.currentUser.displayName;
  const pfp = auth.currentUser.photoURL;

  return (
    <>
    <center>
      <div className='userRow'>
        <img alt='pfp.png' className='pfp userRow-1' src={pfp}></img>
        <h2 className='userRow-2'>Logged In As {name}</h2>
      </div>
      <SignOut />
      <button className='delete button-red' onClick={() => auth.currentUser.delete()}>Delete Account</button>
    </center>
    </>
  ) 
}

export default App;
