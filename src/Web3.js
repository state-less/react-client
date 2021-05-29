import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider as ETHWeb3Provider } from "@ethersproject/providers";
import { createContext, useEffect, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'

export const injected = new InjectedConnector({ supportedChainIds: [56, 1337] })

function getLibrary(provider, connector) {
  return new ETHWeb3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

export const web3Context = createContext();

export const Web3UtilProvider = ({children, autoActivate = true}) => {
  const web3React = useWeb3React();
  const { activate, account, active, error, ...rest } = web3React;
  const [web3, setWeb3] = useState(null);


  const activateInjected = async () => activate(injected)

  useEffect(() => {
    if (!autoActivate) return;
    (async () => {
      await activate(injected);
    })()
  }, []);

  useEffect(() => {
    if (account) {
      const _web3 = new Web3(web3React?.library?.provider)
      setWeb3(_web3);
    }
  }, [account])
  /**
   * 
   * @param {*} web3 - The web3 instance
   * @param {*} message - The message to sign
   * @param {*} account - The account to sign with
   * @returns - The signature
   */
  async function sign (message, account) {
    if (!web3 && !account) throw new Error('Web 3 not yet loaded, please connect an account')
    let res;
    if (account) {
      const web3 = new Web3(web3React?.library?.provider)
      res = await web3.eth.personal.sign(message, account);
    } else {
      res = await web3.eth.personal.sign(message, account);
    }
    return res;
  }

  /**
   * Recovers the account from a signed message
   * @param {*} web3 
   * @param {*} message 
   * @param {*} sig 
   */
  async function recover (message, sig) {
    if (!web3) throw new Error('Web 3 not yet loaded, please connect an account')
    const res = await web3.eth.personal.ecRecover(message, sig);
    return res;
  }

  /**
   * Verifies an account by signing a message.
   * @param *{} web3 
   * @param {*} account  The account to verify
   * @param {*} message  - Optional message to sign.
   * @returns 
   */
  async function verify (account, message = 'Please verify your Identity by signing this message.') {
    console.log ("VERIFY ", account, message)
    if (!web3) throw new Error('Web 3 not yet loaded, please connect an account')
    const sig = await sign(message, account);
    const acc = await recover(message, sig);
    console.log ("VERIFIED", account, acc, sig)
    return acc.toLowerCase() === account.toLowerCase();
  }

  return <web3Context.Provider value={{activateInjected, sign, recover, verify, active, account, error, ...rest}}>
    {children}
  </web3Context.Provider>
}
export const Web3Provider = ({children, ...rest}) => {
  return <Web3ReactProvider getLibrary={getLibrary}>
    <Web3UtilProvider {...rest}>
      {children}
    </Web3UtilProvider>
  </Web3ReactProvider>
}