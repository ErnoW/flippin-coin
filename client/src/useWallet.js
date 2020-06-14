import { useState, useEffect, useCallback } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { SUPPORTED_CHAINS } from "./constants";

export const chains = {
  1: {
    name: "MainNet",
    etherScanPrefix: "",
  },
  3: {
    name: "Ropsten",
    etherScanPrefix: "ropsten.",
  },
  42: {
    name: "Kovan",
    etherScanPrefix: "kovan.",
  },
};

export const injected = new InjectedConnector({
  // See https://chainid.network/
  supportedChainIds: SUPPORTED_CHAINS,
});

export const isValidChainId = (chainId) =>
  chainId ? SUPPORTED_CHAINS.includes(chainId) : undefined;

export function useEagerConnect() {
  const [tried, setTried] = useState(false);
  const { activate } = useWallet();

  useEffect(() => {
    const setTriedFalse = () => setTried(false);
    window.ethereum.on("networkChanged", setTriedFalse);
    window.ethereum.on("chainChanged", setTriedFalse);
    window.ethereum.on("accountChanged", setTriedFalse);

    return () => {
      window.ethereum.off("networkChanged", setTriedFalse);
      window.ethereum.off("chainChanged", setTriedFalse);
      window.ethereum.off("accountChanged", setTriedFalse);
    };
  }, [setTried]);

  useEffect(() => {
    if (!activate || tried) {
      return;
    }

    setTried(true);

    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate();
      }
    });
  }, [activate, tried]);
}

export const useWallet = () => {
  const web3React = useWeb3React();

  const activate = useCallback(() => {
    web3React.activate(injected, (error) => {
      if (error instanceof UnsupportedChainIdError) {
        web3React.activate(web3React.connector); // a little janky...can't use setError because the connector isn't set
      }
    });
  }, [web3React]);

  return {
    activate,
    isActive: web3React.active,
    deactivate: web3React.deactivate,
    chainId: web3React.chainId,
    account: web3React.account,
    isMetaMask: window.ethereum?.isMetaMask,
    isActive: web3React.active,
    library: web3React.library,
  };
};
