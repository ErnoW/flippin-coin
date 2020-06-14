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

export function useEagerConnect(activate) {
  const [tried, setTried] = useState(false);
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

export const useNetworkSync = (activate) => {
  const { setChainId, chainId } = useWallet();

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.ethereum?.chainId) {
        setChainId(parseInt(window.ethereum.chainId));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [setChainId]);

  useEffect(() => {
    activate();
  }, [chainId]);
};

export const useWallet = () => {
  const web3React = useWeb3React();
  const [pending, setPending] = useState(false);
  const [pendingError, setPendingError] = useState(false);
  const [chainId, setChainId] = useState(
    window.ethereum?.chainId ? parseInt(window.ethereum.chainId) : undefined,
  );

  const activate = useCallback(() => {
    setPending(true);
    setPendingError(false);

    web3React.activate(injected, (error) => {
      if (error instanceof UnsupportedChainIdError) {
        web3React.activate(web3React.connector); // a little janky...can't use setError because the connector isn't set
      } else {
        setPendingError(true);
      }
    });
  }, [web3React]);

  return {
    activate,
    deactivate: web3React.deactivate,
    account: web3React.account,
    chainId,
    setChainId,
    isMetaMask: window.ethereum?.isMetaMask,
    isActive: web3React.active,
    library: web3React.library,
  };
};
