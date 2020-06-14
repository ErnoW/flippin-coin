import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { SUPPORTED_CHAINS } from "../constants";
import { useWallet, isValidChainId, chains } from "../useWallet";

const StyledWarning = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.darker};
  padding: ${({ theme }) => theme.space.m}px;
  text-align: center;
`;

const useRenderTimeout = (ms = 1000) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, [ms]);

    return () => clearTimeout(timer);
  }, [ms]);

  return isReady;
};

export const Warning = () => {
  const { chainId, isMetaMask } = useWallet();
  const isReady = useRenderTimeout();
  let warning = null;

  if (!isMetaMask) {
    warning = "No MetaMask found, MetaMask is required to interact.";
  } else if (!isValidChainId(chainId)) {
    warning = `Invalid chain, supported chains: ${SUPPORTED_CHAINS.map(
      (id) => chains[id].name,
    ).join(", ")}`;
  }

  if (!warning || !isReady) {
    return null;
  }

  return <StyledWarning>{warning}</StyledWarning>;
};
