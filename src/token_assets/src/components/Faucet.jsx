import React, { useState } from "react";
import {token, canisterId, createActor}  from "../../../declarations/token";
import { AuthClient } from '@dfinity/auth-client';


function Faucet(props) {
  const [isDisabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("Gimme Gimme")

  async function handleClick(event) {
    setDisabled(true);
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
  
    const authenticatedCanister = createActor(canisterId, {
      agentOptions : {
        identity,
      }
    })
    setMessage(await authenticatedCanister.payOut());
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Flex tokens here! Claim 10,000 FLEX token to {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" 
        onClick={handleClick}
        disabled = {isDisabled}
        > {message}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
