import React, { useEffect, useState } from 'react';
import DownArrow from '../public/down-arrow.svg';
import Check from '../public/check.svg';
import { Networks } from '../utils/networks';
import { useMagic } from '../contexts/MagicContext';

const Network = () => {
  const networkOptions = [Networks.Sepolia, Networks.Goerli, Networks.Polygon, Networks.Mumbai, Networks.Optimism];
  const [isOpen, setIsOpen] = useState(false);
  const { network, setNetwork } = useMagic();

  const handleNetworkSelected = (networkOption: Networks) => {
    if (networkOption !== network) {
      setNetwork(networkOption);
    }
  };
  
  const ActiveNetwork = ({ network }: { network: string }) => {
    return (
      <div className="active-network">
        {network}
        <img src={Check.src} height="20px" alt="down-arrow" className={isOpen ? 'rotate' : ''} />
      </div>
    );
  };

  const NetworkDropdownOption = ({ network }: { network: Networks }) => {
    return (
      <div
        className="network-dropdown-option"
        onClick={() => {
          handleNetworkSelected(network);
        }}
      >
        <img src={DownArrow.src} height="15px" alt="check" style={{ marginRight: '10px' }} />
        {network}
      </div>
    );
  };

  return (
    <div className="network-dropdown" onClick={() => setIsOpen(!isOpen)}>
      <ActiveNetwork network={network} />
      {isOpen ? (
        <div className="network-options">
          {networkOptions.map(networkOption => (
            <NetworkDropdownOption key={networkOption} network={networkOption} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Network;
