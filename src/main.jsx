import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import {bscTestnet} from 'wagmi/chains'

const root = ReactDOM.createRoot(document.getElementById("root"));
if (!import.meta.env.VITE_PROJECT_ID) {
  throw new Error(".env not configured");
}

const pid = import.meta.env.VITE_PROJECT_ID;

const chains = [bscTestnet];
const { provider } = configureChains(chains, [
  w3mProvider({ projectId: pid }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId: pid }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
    <HashRouter>
        <App />
    </HashRouter>
    </WagmiConfig>
    <Web3Modal ethereumClient={ethereumClient} projectId={pid} />
  </React.StrictMode>
);

