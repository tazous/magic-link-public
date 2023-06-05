import React, { useEffect, useState } from 'react';
import Loading from '../public/loading.svg';

import Network from './network';
import { Networks } from '../utils/networks';
import { useMagic } from '../contexts/MagicContext';
import { useUser } from '../contexts/UserContext';
import { useWeb3 } from '../contexts/Web3Context';
import { logout as logoutUtils } from '../utils/logout';
import { ethers } from 'ethers';

const UserInfo = () => {
  const { user, setUser } = useUser();
  const { web3, setWeb3 } = useWeb3();
  const { magic, network } = useMagic();
  const [balance, setBalance] = useState('...');
  const [copied, setCopied] = useState('Copy');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tokenSymbol, setTokenSymbol ] = useState('ETH');
  const [disabled, setDisabled] = useState(false);
  const [showUIError, setShowUIError] = useState(false);

  const copy = () => {
    if (user && copied === 'Copy') {
      setCopied('Copied!');
      navigator.clipboard.writeText(user);
      setTimeout(() => {
        setCopied('Copy');
      }, 1000);
    }
  };

  const getBalance = async () => {
    if (user && web3) {
      try {
        const balance = await web3./*eth.*/getBalance(user);
        console.log("BALANCE", balance);
        setBalance(/*web3.utils.fromWei(*/ethers.utils.formatEther(balance)/*)*/);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const showUI = async () => {
    try {
      setDisabled(true);
      setShowUIError(false);
      console.log("SHOW UI", magic, web3, magic?.wallet, magic?.user)
      const { walletType } = await magic.wallet.getInfo();
      console.log("SHOW UI", walletType)
      if (walletType !== 'magic') {
        setDisabled(false);
        setShowUIError(true);
        return;
      }
      (magic.wallet.showUI() as any)
        .on('disconnect', () => {
          logoutUtils(magic, setWeb3, setUser);
        })
        .then(() => setDisabled(false));
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  };
  const logout = async (disconnect: boolean) => {
    if(disconnect)
    {
      await magic?.wallet?.disconnect()
    }
    logoutUtils(magic, setWeb3, setUser);
  }

  useEffect(() => {
    console.log("######## wallet before")
    console.log("tokenSymbol", tokenSymbol, network === Networks.Polygon || network === Networks.Mumbai)
    setTokenSymbol(network === Networks.Polygon || network === Networks.Mumbai ? 'MATIC' : 'ETH');
    console.log("######## wallet after")
    console.log("tokenSymbol", tokenSymbol)
    if (!web3 || !user) return;
    getBalance();
  }, [web3, user, network]);

  return (
  <h1 >MY WALLET {user}
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected</div>
      </div>
      <button onClick={() => logout(false)}>logout</button>
      <button onClick={() => logout(true)}>disconnect</button>
      <Network />
      <div className="code">
        {balance.toString()/*.substring(0, 7)*/} {tokenSymbol}
      </div>
    
    <button className="wallet-method" onClick={showUI} disabled={disabled}>
        {disabled ? (
          <div className="loadingContainer" style={{ width: '76px' }}>
            <img className="loading" alt="loading" src={Loading} />
          </div>
        ) : (
          'showUI()'
        )}
      </button>
      {showUIError ? (
        <div style={{ marginBottom: '-10px' }}>
            Method not supported for third party wallets.
        </div>
      ) : null}
    </h1>
  );
};

export default UserInfo;
