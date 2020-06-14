import React, { useState } from "react";
import styled from "@emotion/styled";
import Color from "color";
import { formatEther } from "@ethersproject/units";
import { faTrophy, faSadTear } from "@fortawesome/free-solid-svg-icons";

import { Button } from "./Button";
import { Eth } from "./Eth";
import { NumberInput } from "./NumberInput";
import { useWallet } from "../useWallet";
import { useAppContext } from "../AppContext";
import { ReactComponent as EthereumLogo } from "../assets/EthereumLogo.svg";
import { useCoinFlipContract } from "../useContract";
import { useFunction } from "../utils/useFunction";
import { useEventCallback } from "../utils/useEventCallback";
import { ConnectButton } from "./ConnectButton";

const StyledCoin = styled.button`
  height: 7.1rem;
  width: 7.1rem;
  border-radius: 50%;
  border: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 3.3rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: ${({ marginRight, theme }) =>
    marginRight ? `${theme.space.l}px` : undefined};
  cursor: pointer;
  outline: 0;
  translate: transform 150ms ease-in-out, background-color 150ms ease-in-out;
  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) =>
      Color(theme.colors.primary).darken(0.2).toString()};
  }
`;

const StyledCoinWrapper = styled.div`
  display: flex;
  margin-top: ${({ theme }) => `${theme.space.m}px`};
  margin-bottom: ${({ theme }) => `${theme.space.m}px`};
`;

const TailsCoin = ({ onClick }) => {
  return <StyledCoin onClick={onClick}>Ξ</StyledCoin>;
};

const HeadsCoin = ({ onClick }) => {
  return (
    <StyledCoin onClick={onClick} marginRight>
      <EthereumLogo />
    </StyledCoin>
  );
};

export const Game = () => {
  const { isActive, account } = useWallet();
  const {
    balance,
    profit,
    houseTakes,
    minimumBet,
    getContractBalance,
    syncAll,
    addNotification,
  } = useAppContext();
  const [bet, setBet] = useState(0.01);
  const contract = useCoinFlipContract();

  useEventCallback(
    "CoinFlipResult",
    (address, queryId, value, hasWon) => {
      if (address === account) {
        syncAll();
        addNotification({
          title: hasWon
            ? `You won Ξ ${formatEther(value)}`
            : `You lost Ξ ${formatEther(value)}`,
          icon: hasWon ? faTrophy : faSadTear,
          isSuccess: hasWon,
          isError: !hasWon,
        });
      } else {
        getContractBalance();
      }
    },
    [account, addNotification, syncAll],
  );

  const doFlip = useFunction("flipCoin", bet);
  const doCollect = useFunction("collectBalance");

  if (!isActive || !account) {
    return <ConnectButton block>Connect your wallet to start</ConnectButton>;
  }

  if (!contract) {
    return <p>Could not connect to the contract</p>;
  }

  return (
    <div>
      <h2>
        Hi,{" "}
        {account.substring(0, 5) +
          "..." +
          account.substring(account.length - 5)}
      </h2>
      <p>
        Are you ready for some coin flippin' action? Select your bet amount and
        one of the two sides of the coin to start.
      </p>
      <p>Good luck!</p>
      <p
        style={{
          fontStyle: "italic",
          fontSize: "0.7em",
          opacity: 0.91,
        }}
      >
        Note: it might take a while (up to a few minutes) before you get a
        result of the coinflip. Be patient, you will get a notification. In the
        meantime, you can flip as much coins as you want!
      </p>
      <p>
        Account balance: <Eth>{balance}</Eth> <br />
        Your profit: <Eth>{profit}</Eth>{" "}
        {profit && profit !== "0.0" && (
          <Button onClick={doCollect}>Collect</Button>
        )}
      </p>
      <NumberInput value={bet} onChange={setBet} />
      <p
        style={{
          marginTop: 2,
          fontStyle: "italic",
          fontSize: "0.7em",
          opacity: 0.91,
        }}
      >
        Minimum required bet: <Eth>{minimumBet}</Eth>, fee: {houseTakes}%
      </p>
      <StyledCoinWrapper>
        <HeadsCoin onClick={doFlip} />
        <TailsCoin onClick={doFlip} />
      </StyledCoinWrapper>
    </div>
  );
};
