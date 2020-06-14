import { useCallback } from "react";
import { parseEther } from "@ethersproject/units";

import { useCoinFlipContract } from "../useContract";
import { calculateGasMargin } from "./calculateGasMargin";
import { useAppContext } from "../AppContext";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export const useFunction = (caller, rawValue, args = []) => {
  const contract = useCoinFlipContract();
  const { addTransaction, addNotification } = useAppContext();

  const doCall = useCallback(async () => {
    if (!contract) {
      return;
    }

    const parsedValue = rawValue
      ? parseEther(`${rawValue}`).toString()
      : undefined;

    try {
      const estimatedGas = await contract.estimateGas[caller](...args, {
        value: parsedValue,
      });

      const { hash, from, value, wait } = await contract[caller](...args, {
        value: parsedValue,
        gasLimit: calculateGasMargin(estimatedGas),
      });

      addTransaction({ hash, from, value, wait });
    } catch (error) {
      addNotification({
        title: error.message || "Oops something went wrong",
        isError: true,
        wrapText: true,
        icon: faExclamationTriangle,
        hideIn: 2500,
      });
    }
  }, [caller, rawValue, contract, addTransaction, addNotification]);

  return doCall;
};
