import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  369: "https://rpc.plasma.space",
  9746: "https://testnet-rpc.plasma.to"
};

// Configuration WalletConnect améliorée
let customWalletConnectProvider;

const initCustomWalletConnect = async () => {
  if (typeof window !== 'undefined' && !customWalletConnectProvider) {
    try {
      const { default: WalletConnectProvider } = await import('@walletconnect/web3-provider');
      
      customWalletConnectProvider = new WalletConnectProvider({
        rpc: {
          369: RPC_URLS[369],
          9746: RPC_URLS[9746]
        },
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAINID || '9746'),
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
        metadata: {
          name: 'Fuseon - The Central Liquidity Hub',
          description: 'Fuseon Exchange - Liquidity Hub on Plasma Network',
          url: 'https://fuseon.space',
          icons: ['https://fuseon.space/favicon.ico']
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du WalletConnect custom:', error);
    }
  }
  return customWalletConnectProvider;
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

// Fonctions helper pour WalletConnect custom
export const openCustomWalletConnectModal = async () => {
  const provider = await initCustomWalletConnect();
  if (provider) {
    try {
      await provider.enable();
      return provider;
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du modal WalletConnect:', error);
      throw error;
    }
  }
};

// Fonction helper pour se connecter avec le WalletConnect custom
export const connectCustomWalletConnect = async () => {
  try {
    const provider = await initCustomWalletConnect();
    if (provider) {
      await provider.enable();
      return provider;
    }
    throw new Error('Impossible d\'initialiser WalletConnect');
  } catch (error) {
    console.error('Erreur de connexion WalletConnect custom:', error);
    throw error;
  }
};

// Fonction helper pour se déconnecter
export const disconnectCustomWalletConnect = async () => {
  const provider = await initCustomWalletConnect();
  if (provider) {
    try {
      await provider.disconnect();
    } catch (error) {
      console.error('Erreur de déconnexion WalletConnect custom:', error);
      throw error;
    }
  }
};

// Export WalletConnect instance getter
export const getCustomWalletConnect = async () => {
  return await initCustomWalletConnect();
};

// Alias pour compatibilité
export const connectReown = connectCustomWalletConnect;
export const disconnectReown = disconnectCustomWalletConnect;
export const getReown = getCustomWalletConnect;

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[process.env.NEXT_PUBLIC_CHAINID],
  appName: "Fuseon - The Central Liquidity Hub",
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAINID),
});
