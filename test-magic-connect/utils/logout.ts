import { getProvider } from '../contexts/MagicContext';

// When a user logs out, disconnect with Magic & re-set web3 provider
export const logout = async (magic: any, setWeb3: any, setUser: any) => {
  await magic?.wallet.disconnect();
  setWeb3(null);
  console.log('Successfully disconnected');
};
