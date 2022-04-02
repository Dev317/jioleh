import React, { useState, useEffect } from "react";
import { client } from "../client";

export const TokenContext = React.createContext();

export const TokenProvider = ({ children }) => {

  const connectWallet = async (id) => {
    try {
      if (!window.ethereum) {
        return alert("Please install Meta-Mask!");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await client.patch(id).set({ walletAddress: accounts[0] }).commit();

    } catch (err) {
      console.log(err);
    }

    return true;
  };

  return (
    <TokenContext.Provider
      value={{
        connectWallet,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
