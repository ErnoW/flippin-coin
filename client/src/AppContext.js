import React, { useContext, useState, useCallback } from "react";

const AppContext = React.createContext({});
const DEFAULT_THEME = "dark";

export const useAppContext = () => useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [transactions, setTransactions] = useState([]);

  const addTransaction = useCallback(
    (transaction) => {
      setTransactions([...transactions, transaction]);
    },
    [transactions],
  );

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        transactions,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
