import React, { useState } from 'react';
import Network from '../components/network';
import Loading from '../public/loading.svg';
import { useUser } from '../contexts/UserContext';
import { useMagic, getWeb3 } from '../contexts/MagicContext';
import { useWeb3 } from '../contexts/Web3Context';

const Login = () => {
  const { setUser } = useUser();
  const { setWeb3 } = useWeb3();
  const { magic } = useMagic();
  const [disabled, setDisabled] = useState(false);

  const connect = async () => {
    try {
      setDisabled(true);
      console.log("CONNECT", magic, setWeb3, setUser);

      const accounts = await magic.wallet.connectWithUI();
      setDisabled(false);
      console.log('Logged in user:', accounts[0]);
      localStorage.setItem('user', accounts[0]);

      // Once user is logged in, re-initialize web3 instance to use the new provider (if connected with third party wallet)
      const web3 = await getWeb3(magic);
      setWeb3(web3);
      setUser(accounts[0]);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  };

  return (
    <div className="login-page">
    <div style={{ textAlign: 'center' }}>
      <h3 className="demo-sub-header">MY TEST</h3>
    </div>
      <Network />
    <div style={{ textAlign: 'center' }}>
      <button className="connect-button" onClick={connect} disabled={disabled}>
        {disabled ? (
          <div className="loadingContainer" style={{ width: '100%' }}>
            <img className="loading" alt="loading" src={Loading.src} />
          </div>
        ) : (
          'Connect'
        )}
      </button>
    </div>
    </div>
  );
};

export default Login;
