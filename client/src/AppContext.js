import React, { useContext, useState, useCallback, useEffect } from "react";
import { useReadFunction } from "./utils/useReadFunction";
import { useWallet } from "./useWallet";
import { formatResult } from "./utils/formatResult";

const AppContext = React.createContext({});
const DEFAULT_THEME = "dark";

const useBalance = () => {
  const { library, account } = useWallet();
  const [balance, setBalance] = useState(
    library ? library.getBalance(account) : undefined,
  );

  const getBalance = useCallback(async () => {
    if (!library || !account) {
      setBalance(undefined);
      return;
    }

    const result = await library.getBalance(account);
    setBalance(formatResult(result, "eth"));
  }, [library, account]);

  useEffect(() => {
    getBalance();
  }, [library, account, getBalance]);

  return {
    balance,
    getBalance,
  };
};

export const useAppContext = () => useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotification] = useState([]);

  const { value: contractBalance, call: getContractBalance } = useReadFunction(
    "balance",
    "eth",
  );
  const { value: profit, call: getProfit } = useReadFunction(
    "myBalanceToBeCollected",
    "eth",
  );
  const { value: minimumBet, call: getMinimumBet } = useReadFunction(
    "minimumBet",
    "eth",
  );
  const { balance, getBalance } = useBalance();

  const syncAll = useCallback(() => {
    getContractBalance();
    getProfit();
    getBalance();
    getMinimumBet();
  }, [getContractBalance, getProfit, getBalance, getMinimumBet]);

  const addTransaction = useCallback(
    (transaction) => {
      const onCreatedTimeStamp = new Date();
      setTransactions([
        ...transactions,
        {
          ...transaction,
          onCreatedTimeStamp,
          type: "transaction",
          id: transaction.hash,
        },
      ]);
    },
    [transactions],
  );

  const addNotification = useCallback(
    (notification) => {
      const onCreatedTimeStamp = new Date();

      setNotification([
        ...notifications,
        {
          ...notification,
          onCreatedTimeStamp,
          type: "notification",
          id: onCreatedTimeStamp.toString(),
        },
      ]);
    },
    [notifications],
  );

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        transactions,
        addTransaction,
        notifications,
        addNotification,
        balance,
        getBalance,
        profit,
        getProfit,
        contractBalance,
        getContractBalance,
        minimumBet,
        getMinimumBet,
        syncAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
