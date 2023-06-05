import { EthNetworkConfiguration, Magic, } from 'magic-sdk';
import { Networks } from '../utils/networks';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

const MagicContext = createContext<any>([]);

export const MagicContextProvider = ({ children }: any) => {
  const [magic, setMagic] = useState<any>();
  const [network, setNetwork] = useState<any>();
  const formattedNetwork = (): EthNetworkConfiguration => {
    switch (network) {
      case Networks.Polygon:
        return {
          rpcUrl: 'https://polygon-rpc.com/',// as string,
          chainId: 137,
        };
      default:
        // case Networks.Mumbai:
        setNetwork(Networks.Mumbai);
        return {
          rpcUrl: 'https://matic-mumbai.chainstacklabs.com',// as string,
          chainId: 80001,
        };
    }
  };
  // Init & Update
  useEffect(() => {
    console.log('####### MagicContext before #######', magic, network)
    if(!network)
    {
      const _network = localStorage.getItem('network') as Networks;
      console.log('####### New network #######', _network)
      setNetwork(_network);
  }
    const _magic = new Magic('pk_live_F6E37827919B42CC', {network: formattedNetwork()});
    console.log('####### New magic #######', _magic)
    setMagic(_magic);
    console.log('####### MagicContext after #######', magic, network)
  }, [network])

  return <MagicContext.Provider value={{ magic, setMagic, network, setNetwork }}>{children}</MagicContext.Provider>
};

export function useMagic () {
  return useContext(MagicContext);
};
export async function getProvider (magic: any) {
  return magic?.wallet.getProvider();
};
export async function getWeb3 (magic: any) {
  const provider = await getProvider(magic);
  return !provider ? null : new ethers.providers.Web3Provider(provider);
};
