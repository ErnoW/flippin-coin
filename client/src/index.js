import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { darkTheme, lightTheme } from "./theme";
import { ThemeProvider } from "emotion-theming";
import { useAppContext, AppContextProvider } from "./AppContext";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const POLLIN_INTERVAL = 4000;
const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLIN_INTERVAL;
  return library;
};

const InnerApp = () => {
  const { theme } = useAppContext();
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <App />
      </ThemeProvider>
    </Web3ReactProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <InnerApp />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
