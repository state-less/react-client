import { useContext, useEffect, useMemo, useState } from "react";
import { request } from "./util";
import { solveRegistrationChallenge, solveLoginChallenge } from '@webauthn/client'
import { web3Context } from "./Web3";


export const web3Strategy = () => {
  const { account, active, activateInjected, sign, deactivate } = useContext(web3Context);
  const [signature, setSignature] = useState(null);
  const [autoSign, setAutoSign] = useState(false);

  const connect = async () => {
    await activateInjected();
  }

  useEffect(() => {
    (async () => {
      await activateInjected();
    })()
  }, []);


  const authenticate = async (challenge) => {
    if (account && challenge.type === 'sign') {
      const response = await sign(challenge.challenge, account);
      return { challenge, response, success: true, strategy: 'web3' }
    } else {
      await activateInjected();
      return { success: false }

    }
  }

  return { authenticate, id: account, logout: deactivate, strategy: 'web3' }
}

export const webAuthnStrategy = () => {

  const authenticate = async (challenge) => {
    console.log("WebAauthn auth challenge", challenge);
    let response;
    if (challenge.type === 'register') {
      response = await solveRegistrationChallenge(challenge.challenge);
    } else if (challenge.type === 'login') {

      response = await solveLoginChallenge(challenge);
    }
    console.log("WebAauthn auth response", response);
    return { challenge, response, success: true, strategy: 'webauthn' }
  }

  return { authenticate, logout: () => { }, strategy: 'webauthn' }
}