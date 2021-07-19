import { useContext, useEffect, useMemo, useState } from "react";
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
    if (account) {
      const response = await sign(challenge, account);
      return { challenge, response, success: true }
    } else {
      await activateInjected();
      return { success: false }

    }
  }

  return { authenticate, id: account, logout: deactivate}
}