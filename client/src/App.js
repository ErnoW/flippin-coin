import React, { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import "sanitize.css";
import { Button } from "./components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatEther, formatUnits, parseEther } from "@ethersproject/units";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "./AppContext";
import { Card } from "./components/Card";
import { useWallet, isValidChainId } from "./useWallet";
import { ReactComponent as EthereumLogo } from "./assets/EthereumLogo.svg";
import Jazzicon from "jazzicon";
import Color from "color";
import { NumberInput } from "./components/NumberInput";
import { useCoinFlipContract } from "./useContract";
import { BigNumber } from "@ethersproject/bignumber";

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.m}px;
`;

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 ${({ theme }) => theme.space.m}px;
  padding-top: 65px;
`;

const Logo = styled.h1`
  font-size: 1.56em;
  font-family: ${({ theme }) => theme.fonts.logo};
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.m}px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

const Warning = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.darker};
  padding: ${({ theme }) => theme.space.m}px;
  text-align: center;
`;

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  margin-right: 8px;
`;

const StyledCoin = styled.button`
  height: 5.1rem;
  width: 5.1rem;
  border-radius: 50%;
  border: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: ${({ marginRight, theme }) =>
    marginRight ? `${theme.space.m}px` : undefined};
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
`;

const ConnectButton = () => {
  const { activate, isActive, deactivate, account, isMetaMask } = useWallet();

  if (account && isActive) {
    return (
      <Button title={account} onClick={deactivate}>
        <Identicon />
        {account.substring(0, 5) +
          "..." +
          account.substring(account.length - 5)}
      </Button>
    );
  }

  if (!isMetaMask) {
    return <Button onClick={() => {}}>MetaMask is required</Button>;
  }

  return <Button onClick={activate}>Connect Wallet</Button>;
};

const Identicon = () => {
  const { account } = useWallet();
  const ref = useRef();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledIdenticon ref={ref} />;
};

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

const Game = () => {
  const { isActive, account, activate, balance } = useWallet();
  const { addTransaction } = useAppContext();
  const [bet, setBet] = useState(0.0001);
  const contract = useCoinFlipContract();

  useEffect(() => {
    const onCoinFlipResult = (...data) => {
      console.log("[event] onCoinFlipResult", data);
    };
    const onLogNewProvableQuery = (...data) => {
      console.log("[event] onLogNewProvableQuery", data);
    };
    const onGeneratedRandomNumber = (...data) => {
      console.log("[event] onGeneratedRandomNumber", data);
    };

    if (contract) {
      contract.on("CoinFlipResult", onCoinFlipResult);
      contract.on("LogNewProvableQuery", onLogNewProvableQuery);
      contract.on("GeneratedRandomNumber", onGeneratedRandomNumber);
    }

    return () => {
      if (contract) {
        contract.off("CoinFlipResult", onCoinFlipResult);
        contract.off("LogNewProvableQuery", onLogNewProvableQuery);
        contract.off("GeneratedRandomNumber", onGeneratedRandomNumber);
      }
    };
  }, [contract]);

  // Add 10%
  const calculateGasMargin = (value) =>
    value
      .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
      .div(BigNumber.from(10000));

  const doFlip = async (isHead) => {
    if (!contract) {
      return;
    }

    const value = parseEther(`${bet}`).toString();

    const estimatedGas = await contract.estimateGas.flipCoin({ value });

    contract
      .flipCoin({ value, gasLimit: calculateGasMargin(estimatedGas) })
      .then(({ hash, from, value, wait, ...rest }) => {
        console.log("rest after flip", rest);
        addTransaction({ hash, from, value, wait, isHead });
      });
  };

  if (!isActive || !account) {
    return (
      <Button block onClick={activate}>
        Connect your wallet to start
      </Button>
    );
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
        <br />
        Good luck!
      </p>
      <p>
        Your balance: <ResolvedValue call={balance} isEth /> <br />
        Your profit:{" "}
        <ResolvedValue call={contract.myBalanceToBeCollected} isEth />
      </p>
      <NumberInput value={bet} onChange={setBet} />
      <StyledCoinWrapper>
        <HeadsCoin onClick={() => doFlip(true)} />
        <TailsCoin onClick={() => doFlip(false)} />
      </StyledCoinWrapper>
    </div>
  );
};

const ResolvedValue = ({ call, isEth, isNumber }) => {
  const [resolved, setResolved] = useState();

  useEffect(() => {
    if (!call) {
      return;
    }
    call().then(setResolved);
  }, [call]);

  console.log("resolved", resolved);

  if (!resolved) {
    return null;
  }

  if (isEth) {
    return `Ξ ${formatEther(resolved)}`;
  }

  if (isNumber) {
    return formatUnits(resolved);
  }

  return null;
};

const Admin = () => {
  const contract = useCoinFlipContract();
  const { account } = useWallet();
  const [ownerAddress, setOwnerAddress] = useState(null);

  useEffect(() => {
    if (!contract) {
      return;
    }
    contract.functions.owner().then(setOwnerAddress);
  }, [contract]);

  if (!contract) {
    return null;
  }

  if (!ownerAddress || ownerAddress[0] !== account) {
    return null;
  }

  return (
    <div>
      <hr />
      <h2>Hi Boss!</h2>
      <p>
        Current balance: <ResolvedValue call={contract.balance} isEth />
        <br />
        Minimum bet: <ResolvedValue call={contract.minimumBet} isEth />
        <br />
      </p>
    </div>
  );
};

const Transactions = () => {
  const { transactions } = useAppContext();
  return (
    <div>
      <div>Transactions</div>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
};

const App = () => {
  const { theme, toggleTheme } = useAppContext();
  const { chainId } = useWallet();

  return (
    <Wrapper>
      {isValidChainId(chainId) === false && (
        <Warning>Invalid chain, only Ropsten is supported</Warning>
      )}
      <Header>
        <div>
          <Logo>Flippin' Coin</Logo>
        </div>
        <div>
          <ConnectButton />
        </div>
      </Header>
      <Main>
        <Card>
          <Game />
          <Admin />
          <Transactions />
        </Card>
      </Main>
      <Footer>
        <div></div>
        <div style={{ pointerEvents: "auto" }}>
          <Button onClick={toggleTheme}>
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          </Button>{" "}
        </div>
      </Footer>
    </Wrapper>
  );
};

export default App;
