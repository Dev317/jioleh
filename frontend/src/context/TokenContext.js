import React, { useState, useEffect } from "react";
import { client } from "../client";

export const TokenContext = React.createContext();

export const TokenProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();

  const connectWallet = async (vendorId) => {
    try {
      if (!window.ethereum) {
        return alert("Please install Meta-Mask!");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);

      await client.patch(vendorId).set({ walletAddress: accounts[0] }).commit();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TokenContext.Provider
      value={{
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
