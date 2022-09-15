import React, { useState } from "react";
import {canisterId, createActor}  from "../../../declarations/token";
import { AuthClient } from '@dfinity/auth-client';
import {Principal} from "@dfinity/principal";

function Transfer() {
  const [recipientId, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [isHidden, setHidden] = useState(true);
  
  async function handleClick() {
    setHidden(true)
    setDisabled(true)
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
  
    const authenticatedCanister = createActor(canisterId, {
      agentOptions : {
        identity,
      }
    })
    const recipient = Principal.fromText(recipientId);
    const amountToTransfer = Number(amount);
    const result = await authenticatedCanister.transfer(recipient, amountToTransfer);
    setMessage(result);
    setHidden(false);
    setDisabled(false);
    
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" 
          onClick={handleClick}
          disabled={isDisabled}
          
          >
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{message}</p>
      </div>
    </div>
  );
}

export default Transfer;
