
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import Login from './login';
import HomePage from './home';

const ConnectedOrNot = () => {
  
    const { user } = useUser();
    
  function connectedOrNot()
  {
    if(user)
    {
      console.log("##### Connected with", user)
      return <HomePage/>
    }
    console.log("##### NOT Connected")
    return <Login/>
  }
  useEffect(() => {
  }, [user]);

  return(<>{
    connectedOrNot()
  }
  </>)
};

export default ConnectedOrNot;