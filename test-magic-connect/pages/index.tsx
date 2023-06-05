import React from 'react';
import Head from 'next/head';
// import '../styles/globals.css';
import type {NextPage} from 'next'
import { MagicContextProvider } from '../contexts/MagicContext';
import { Web3ContextProvider } from '../contexts/Web3Context';
import { UserProvider } from '../contexts/UserContext';
import ConnectedOrNot from './connectedOrNot';

const Home: NextPage = () => {
  
  // Page rendering
  //////////////////////////////////////////////////////////////
  return (<>
    <MagicContextProvider>
        <Web3ContextProvider>
            <UserProvider>
                <div>
                  <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                  </Head>
                  <main>
                    <ConnectedOrNot/>
                  </main>
                </div>
            </UserProvider>
        </Web3ContextProvider>
    </MagicContextProvider>
  </>
    )
  }
  
  export default Home
  