import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from '@dfinity/auth-client';

// authenticating with internet identity

const init = async () => { 
 

  const authClient = await AuthClient.create(); // an async method

  if (await authClient.isAuthenticated()){
    handleAuthenticated(authClient);
  }
  else{
    await authClient.login({
      identityProvider : "https://identity.ic0.app/#authorize",
      onSuccess : () => {
        handleAuthenticated(authClient);
      }
  
    });
  } 

};

async function handleAuthenticated(authClient){
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal.toString();
  ReactDOM.render(<App loggedInPrincipal={userPrincipal} />, document.getElementById("root"));
}

init();


