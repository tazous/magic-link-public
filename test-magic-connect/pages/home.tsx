import React, { useEffect, useState } from 'react';
import Wallet from '../components/wallet';
import SigningMethods from '../components/signing';
import HomePageBackground from '../public/main.svg';
import { Networks } from '../utils/networks';
import { useMagic } from '../contexts/MagicContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useUser } from '../contexts/UserContext';
import { logout } from '../utils/logout';

export default function Home() {
  const { user, setUser } = useUser();
  const { web3, setWeb3 } = useWeb3();
  const { magic, network } = useMagic();

  // Update state for newly connected wallet
  const handleDisconnect = () => {
    logout(magic, setWeb3, setUser);
  };

  // Update state for newly connected wallet
  const handleAccountsChanged = (acc: any) => {
    console.log('New account:', acc);
    // If user disconnected wallet, logout & reset web3
    if (!acc[0]) {
      handleDisconnect();
    } else {
      localStorage.setItem('user', acc[0]);
      setUser(acc[0]);
    }
  };

  // Refresh the page when a user changes networks,
  const handleChainChanged = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!web3 || !user) return;
    console.log("HOME", web3, web3./*currentP*/provider, web3._network, user);
    // Once a user is connected, check if the wallet is on the correct network
    (async function () {
      const userWalletChainId = (await web3./*eth*/getNetwork())./*getC*/chainId/*()*/;
      const dappChainId = getChainIdForSetNetwork();
      if (Number(userWalletChainId) !== dappChainId) {
        alert(`Connected wallet is on the wrong network. Please switch to ${network} (chainId ${dappChainId})`);
      }
    })();

    // Listen for events emitted by third party wallets
    // web3./*currentP*/provider.on('accountsChanged', handleAccountsChanged);
    // web3./*currentP*/provider.on('chainChanged', handleChainChanged);
    // return () => {
    //   web3./*currentP*/provider.removeListener('accountsChanged', handleAccountsChanged);
    //   web3./*currentP*/provider.removeListener('chainChanged', handleChainChanged);
    // };
  }, [web3, user]);

  const getChainIdForSetNetwork = () => {
    switch (network) {
      case Networks.Polygon:
        return 80001;
    case Networks.Mumbai:
        return 80001;
      case Networks.Optimism:
        return 420;
      case Networks.Goerli:
        return 5;
      default:
        return 11155111;
    }
  };

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${HomePageBackground})`,
      }}
    >
      <div className="cards-container">
        <Wallet />
        <SigningMethods/>
      </div>
    </div>
  );
}
