import React, { useContext, useEffect, useState } from 'react';
import { useMagic, getProvider } from './MagicContext';
import { useWeb3 } from './Web3Context';
import { logout } from '../utils/logout';

export const UserContext = React.createContext<any>([]);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>();
  const { web3, setWeb3 } = useWeb3();
  const { magic } = useMagic();

  const handleUserOnPageLoad = async () => {
    const provider = await getProvider(magic);
    if(provider)
    {
      const accounts = await provider.request({ method: 'eth_accounts' });
      // If user wallet is no longer connected, logout
      if (!accounts[0] && user) {
        logout(magic, setWeb3, setUser);
      }
      // Set user in localStorage, or clear localStorage if no wallet connected
      accounts[0] ? localStorage.setItem('user', accounts[0]) : localStorage.removeItem('user');
      setUser(accounts[0]);
    }
    else
    {
      localStorage.removeItem('user')
      console.log("No provider")
    }
  };


  useEffect(() => {
    console.log('####### UserContext before #######', user, web3, magic)
    handleUserOnPageLoad();
    console.log('####### UserContext after #######', user, web3, magic)
  }, [web3]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
