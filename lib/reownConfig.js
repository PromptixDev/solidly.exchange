// Config Reown temporaire sans les imports problématiques
'use client'

// TODO: Réactiver quand Next.js sera migré vers v13+
// import { createAppKit } from '@reown/appkit/react' 
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { plasmaTestnet, plasmaMainnet } from '../config/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id-here'

// Configuration temporaire
export const appKit = {
  open: () => {
    console.log('Ouverture modale Reown...')
    // TODO: Implémenter la vraie modale Reown
  }
}

export const wagmiAdapter = {
  wagmiConfig: null // TODO: Configuration wagmi temporaire
}