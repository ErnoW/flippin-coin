import React from "react";
import styled from "@emotion/styled";

import { SUPPORTED_CHAINS } from "../constants";
import { useWallet, isValidChainId, chains } from "../useWallet";

const StyledWarning = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.darker};
  padding: ${({ theme }) => theme.space.m}px;
  text-align: center;
`;

export const Warning = () => {
  const { chainId, isMetaMask } = useWallet();
  let warning = null;

  if (!isMetaMask) {
    warning = "No MetaMask found, MetaMask is required to interact.";
  } else if (chainId && !isValidChainId(chainId)) {
    warning = `Invalid chain, supported chains: ${SUPPORTED_CHAINS.map(
      (id) => chains[id].name,
    ).join(", ")}`;
  }

  if (!warning) {
    return null;
  }

  return <StyledWarning>{warning}</StyledWarning>;
};
