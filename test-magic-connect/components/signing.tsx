import React, {useState, useEffect} from 'react';
import { useUser } from '../contexts/UserContext';
import { useWeb3 } from '../contexts/Web3Context';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import {toast} from 'react-toastify';
import { ethers } from 'ethers';
import axios from 'axios';

import * as directSaleContractDefMumbai from './JarvixERC721TokenManualMinter-mumbai.json'

export const SigningMethods = () => {
    const { user } = useUser();
    const { web3 } = useWeb3();
    const [message, setMessage] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [disabled1, setDisabled1] = useState(!message);
    const [disabled2, setDisabled2] = useState(!toAddress);
    useEffect(() => {
      setDisabled1(!message);
    }, [message]);
    useEffect(() => {
      setDisabled2(!toAddress);
    }, [toAddress]);

    
  const personalSign = async () => {
    try {
      if (user) {
        setDisabled1(true);
        const signer = web3.getSigner();

        const signedMessage = await signer.signMessage(message);
        console.log('signedMessage:', signedMessage);
        const recoveredAddress = recoverPersonalSignature({
          data: message,
          signature: signedMessage,
        });
        console.log(
          recoveredAddress.toLocaleLowerCase() === user?.toLocaleLowerCase() ? 'Signing success!' : 'Signing failed!',
        );
        setMessage('');
        setDisabled1(false);
      }
    } catch (error) {
      setDisabled1(false);
      console.error(error);
    }
  };

  const mintNFTs4Art = async () => {
    const minterContract = new ethers.Contract(directSaleContractDefMumbai.contractAddress, directSaleContractDefMumbai.contractArtifact.abi, web3)
    
    setDisabled2(true);
    sendTx(
      'JarvixERC721TokenManualMinter.mintNextAndDefine',
      minterContract?.connect(web3.getSigner()).mintNextAndDefine,
      [
        [toAddress],
        ["uri"],
      ],
      {
        pending: 'Minting artwork NFT.',
        success: 'Artwork NFT minted'
      }
    ).then(() => setDisabled2(false))
  }
  
interface FeeData {
    maxFee: number
    maxPriorityFee: number
  }
  
  enum FeeSpeed {
    safeLow = 'safeLow',
    standard = 'standard',
    fast = 'fast'
  }
interface GasData {
    safeLow: FeeData
    standard: FeeData
    fast: FeeData
  }
  const GET_GAS_DATA = async (): Promise<GasData> => {
      const resp = await axios.get('https://gasstation-mumbai.matic.today/v2');
      return resp.data;
  }
   const DEFAULT_GAS_LIMIT = 500000
const GET_GAS_OPTIONS = async (feeSpeed: FeeSpeed = FeeSpeed.standard, gasLimit: number = DEFAULT_GAS_LIMIT) => {
    const gasData = await GET_GAS_DATA();
    return {
        gasLimit: gasLimit,
        maxFeePerGas: ethers.utils.parseUnits(Math.floor((gasData as any)[feeSpeed.toString()].maxFee * 10 ** 9).toString(), 'wei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits(Math.floor((gasData as any)[feeSpeed.toString()].maxPriorityFee * 10 ** 9).toString(), 'wei')
    };
  }
  const sendTx = (methodName: string, method: any, params: any[] | any, messages: { pending: string, success: string }) =>
  GET_GAS_OPTIONS(FeeSpeed.fast).then((gasOptions: any) =>
 {
    if (Array.isArray(params)) {
      if(params[params.length - 1]?.value != null){
        let callOptions = params[params.length - 1]
        callOptions = Object.assign({}, callOptions, gasOptions)
        params[params.length - 1] = callOptions;
      }
      else
        params.push(gasOptions)
    }
    else
      params = Object.assign({}, params, gasOptions)
    let toastId = toast.loading(messages.pending + ' Sending transaction...')
    console.log('> Sending tx... "' + messages.pending + '": (' + methodName + ')', params, ' -GAS OPTIONS:', gasOptions)
    return (Array.isArray(params) ? method(...params) : method(params))
      .then((tx: any) => {
        toast.update(toastId, {
          render: 'Transaction sent 👌',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        console.log('> Tx SENT ! "' + messages.pending + '": (' + methodName + ')  WAITING for blockchain confirmation...', '(TX #' + tx.hash + ')')
        toastId = toast.loading(messages.pending + ' Waiting for blockchain confirmation...')
        return tx.wait(1).then(() => {
          toast.update(toastId, {
            render: messages.success + ' 👌',
            type: 'success',
            isLoading: false,
            autoClose: 2000
          })
          console.log('> Tx CONFIRMED ! "' + messages.success + '" (' + methodName + ')', '(TX #' + tx.hash + ')')
        })
      }).catch((err: any) => {
        toast.update(toastId, {
          render: 'Error sending transaction 🤯',
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        console.warn('> Error sending Tx ! (' + methodName + ')', err)
      })
  })
  


  return (
    <h1 >SIGNING
    <h2 >MESSAGE
      <input className="form-input" value={message} onChange={(e: any) => setMessage(e.target.value)} placeholder="My message" />
      <button className="form-button" disabled={!message || disabled1} onClick={personalSign}>
      Sign
        </button>
    </h2>
    <h2 >TX
      <input className="form-input" value={toAddress} onChange={(e: any) => setToAddress(e.target.value)} placeholder="Receiving Address" />
      <button className="form-button" disabled={!toAddress || disabled2} onClick={mintNFTs4Art}>
      Execute
        </button>
    </h2>
    </h1>
  );
};

export default SigningMethods;
