import { useCallback } from "react";
import { parseEther } from "@ethersproject/units";

import { useCoinFlipContract } from "../useContract";
import { calculateGasMargin } from "./calculateGasMargin";
import { useAppContext } from "../AppContext";

export const useFunction = (caller, rawValue) => {
  const contract = useCoinFlipContract();
  const { addTransaction } = useAppContext();

  const doCall = useCallback(async () => {
    if (!contract) {
      return;
    }

    const parsedValue = rawValue
      ? parseEther(`${rawValue}`).toString()
      : undefined;

    const estimatedGas = await contract.estimateGas[caller]({
      value: parsedValue,
    });

    const { hash, from, value, wait } = await contract[caller]({
      value: parsedValue,
      gasLimit: calculateGasMargin(estimatedGas),
    });

    addTransaction({ hash, from, value, wait });
  }, [caller, rawValue, contract, addTransaction]);

  return doCall;
};
