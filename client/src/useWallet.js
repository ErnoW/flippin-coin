import { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

export const supportedChainIds = [3];

export const injector = new InjectedConnector({
  // See https://chainid.network/
  supportedChainIds, // Ethereum Testnet Ropsten
});

export const isValidChainId = (chainId) =>
  chainId ? supportedChainIds.includes(chainId) : undefined;

export const useWallet = () => {
  const web3React = useWeb3React();
  const [pending, setPending] = useState(false);
  const [pendingError, setPendingError] = useState(false);
  const [chainId, setChainId] = useState(parseInt(window.ethereum.chainId));

  useEffect(() => {
    const timer = setInterval(() => {
      setChainId(parseInt(window.ethereum.chainId));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const activate = () => {
    setPending(true);
    setPendingError(false);

    web3React.activate(injector, (error) => {
      console.log(error);
      if (error instanceof UnsupportedChainIdError) {
        web3React.activate(web3React.connector); // a little janky...can't use setError because the connector isn't set
      } else {
        setPendingError(true);
      }
    });
  };

  console.log("window.ethereum", window.ethereum);
  console.log("web3React", web3React);

  return {
    activate,
    deactivate: web3React.deactivate,
    account: web3React.account,
    chainId,
    isMetaMask: window.ethereum.isMetaMask,
    isActive: web3React.active,
    library: web3React.library,
    balance: web3React.library
      ? () => web3React.library.getBalance(web3React.account)
      : undefined,
  };
};
