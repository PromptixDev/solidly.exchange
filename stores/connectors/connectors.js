import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  369: "https://rpc.plasma.space",
  9746: "https://testnet-rpc.plasma.to"
};

let obj = {}
if(process.env.NEXT_PUBLIC_CHAINID == 369) {
  obj = { 369: RPC_URLS[369] }
} else {
  obj = { 9746: RPC_URLS[9746] }
}

export const network = new NetworkConnector({ urls: obj });

export const injected = new InjectedConnector({
  supportedChainIds: [parseInt(process.env.NEXT_PUBLIC_CHAINID)]
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    369: RPC_URLS[369],
    9746: RPC_URLS[9746]
  },
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAINID),
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[process.env.NEXT_PUBLIC_CHAINID],
  appName: "Fuseon - The Central Liquidity Hub",
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAINID),
});
