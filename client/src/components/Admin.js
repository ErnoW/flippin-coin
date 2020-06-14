import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";

import { Button } from "./Button";
import { Eth } from "./Eth";
import { useAppContext } from "../AppContext";
import { useWallet } from "../useWallet";
import { NumberInput } from "./NumberInput";
import { useCoinFlipContract } from "../useContract";
import { useFunction } from "../utils/useFunction";

const useOwnerAddress = () => {
  const contract = useCoinFlipContract();
  const [ownerAddress, setOwnerAddress] = useState(null);

  useEffect(() => {
    if (!contract) {
      return;
    }
    contract.functions.owner().then(setOwnerAddress);
  }, [contract]);

  return ownerAddress;
};

export const Admin = () => {
  const contract = useCoinFlipContract();
  const { account } = useWallet();
  const [deposit, setDeposit] = useState(1);
  const [withdraw, setWithdraw] = useState(1);
  const { contractBalance } = useAppContext();
  const ownerAddress = useOwnerAddress();
  const doDeposit = useFunction("deposit", deposit);
  const doWithdraw = useFunction("withdraw", undefined, [
    parseEther(`${withdraw}`).toString(),
  ]);
  const doWithdrawAll = useFunction("withdrawAll");
  const isOwner = ownerAddress && ownerAddress[0] === account;

  if (!contract || !isOwner) {
    return null;
  }

  return (
    <div>
      <hr style={{ marginTop: 20, marginBottom: 20, opacity: 0.34 }} />
      <h2>Hi Boss!</h2>
      <p>
        Game balance: <Eth>{contractBalance}</Eth>
        <br />
        Deposit: <NumberInput onChange={setDeposit} value={deposit} />{" "}
        <Button onClick={doDeposit}>Confirm</Button>
        <br />
        Withdraw: <NumberInput onChange={setWithdraw} value={withdraw} />{" "}
        <Button onClick={doWithdraw}>Confirm</Button>{" "}
        <Button onClick={doWithdrawAll}>Withdraw all</Button>
      </p>
    </div>
  );
};
