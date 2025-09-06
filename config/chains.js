// Copie exacte de old/src/config/chains.ts adaptée en JS
import { defineChain } from 'viem'

export const plasmaTestnet = defineChain({
  id: 9746,
  name: 'Plasma Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XPL',
    symbol: 'XPL',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.plasma.to'] },
    default: { http: ['https://testnet-rpc.plasma.to'] },
  },
  blockExplorers: {
    default: { name: 'PlasmaTestnetScan', url: 'https://testnet.plasmascan.to' },
  },
  testnet: true,
})

export const plasmaMainnet = defineChain({
  id: 369,
  name: 'Plasma',
  nativeCurrency: {
    decimals: 18,
    name: 'PLS',
    symbol: 'PLS',
  },
  rpcUrls: {
    public: { http: ['https://rpc.plasma.space'] },
    default: { http: ['https://rpc.plasma.space'] },
  },
  blockExplorers: {
    default: { name: 'PlasmaScan', url: 'https://plasmascan.com' },
  },
  testnet: false,
})