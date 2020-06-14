import { useCallback, useState, useEffect } from "react";

import { useCoinFlipContract } from "../useContract";
import { calculateGasMargin } from "./calculateGasMargin";
import { formatResult } from "./formatResult";

export const useReadFunction = (caller, type) => {
  const contract = useCoinFlipContract();
  const [value, setValue] = useState();

  const doCall = useCallback(async () => {
    if (!contract) {
      return;
    }

    const estimatedGas = await contract.estimateGas[caller]();

    const result = await contract[caller]({
      gasLimit: calculateGasMargin(estimatedGas),
    });

    setValue(formatResult(result, type));
  }, [contract, caller]);

  useEffect(() => {
    if (contract) {
      doCall();
    }
  }, [contract]);

  return { call: doCall, value };
};
