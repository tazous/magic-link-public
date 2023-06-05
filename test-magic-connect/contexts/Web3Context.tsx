import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMagic, getWeb3 as getMagicWeb3 } from './MagicContext';

const Web3Context = createContext<any>([]);

export const Web3ContextProvider = ({ children }: any) => {
  const [web3, setWeb3] = useState<any>();
  const { magic } = useMagic();

  // Init & Update
  useEffect(() => {
    console.log('####### Web3Context before #######', web3, magic)
    getMagicWeb3(magic).then(setWeb3);
    console.log('####### Web3Context after #######', web3, magic)
  }, [magic]);

  return <Web3Context.Provider value={{ web3, setWeb3 }}>{children}</Web3Context.Provider>;
};

export function useWeb3() {
  return useContext(Web3Context);
}
