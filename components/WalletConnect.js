// Composant WalletConnect avec le style de la dapp Fuseon
'use client'

import { useState } from 'react'
import { Button, Typography, Dialog, DialogContent, Menu, MenuItem, ListItemText } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import MenuIcon from '@material-ui/icons/Menu'
import classes from './header/header.module.css'

const StyledDialog = withStyles((theme) => ({
  paper: {
    background: '#0f172a !important',
    borderRadius: '16px',
    padding: '32px',
    minWidth: '420px',
    maxWidth: '450px',
    border: 'none',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)'
  },
  root: {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.95) !important'
    }
  }
}))(Dialog)

const StyledMenu = withStyles({
  paper: {
    background: '#1a1a2e',
    border: 'none',
    borderRadius: '12px',
    marginTop: '8px',
    minWidth: '200px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  }
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: '14px 20px',
    color: '#ffffff',
    fontSize: '15px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    }
  }
}))(MenuItem)

const walletOptions = [
  { 
    name: 'MetaMask', 
    icon: '/connectors/metamask.png',
    type: 'metamask' 
  },
  { 
    name: 'Rabby Wallet', 
    icon: '/images/rabbywallet.png',
    type: 'rabby' 
  }
]

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectHover, setConnectHover] = useState(false)
  const [connectedHover, setConnectedHover] = useState(false)

  const truncateAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async (walletType) => {
    setIsConnecting(true)
    console.log('Connecting to:', walletType)
    
    try {
      if (walletType === 'metamask' || walletType === 'rabby') {
        // Vérifier si window.ethereum existe
        if (typeof window !== 'undefined' && window.ethereum) {
          console.log('Ethereum detected:', window.ethereum)
          
          // Demander la connexion
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          
          console.log('Accounts received:', accounts)
          
          if (accounts.length > 0) {
            const account = accounts[0]
            setIsConnected(true)
            setAddress(account)
            setIsModalOpen(false)
            
            // Vérifier/changer le réseau vers Plasma testnet
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x2612' }], // 9746 en hexadécimal
              })
            } catch (switchError) {
              console.log('Switch error:', switchError)
              // Si le réseau n'existe pas, l'ajouter
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: '0x2612',
                      chainName: 'Plasma Testnet',
                      nativeCurrency: {
                        name: 'XPL',
                        symbol: 'XPL',
                        decimals: 18,
                      },
                      rpcUrls: ['https://testnet-rpc.plasma.to'],
                      blockExplorerUrls: ['https://testnet.plasmascan.to'],
                    }],
                  })
                } catch (addError) {
                  console.error('Failed to add network:', addError)
                }
              }
            }
          }
        } else {
          console.log('No ethereum provider found')
          alert('Please install MetaMask or Rabby Wallet!')
        }
      }
    } catch (error) {
      console.error('Connection failed:', error)
      if (error.code === 4001) {
        console.log('User rejected the connection request.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
    setAnchorEl(null)
  }

  const handleBlockExplorer = () => {
    window.open(`https://testnet.plasmascan.to/address/${address}`, '_blank')
    setAnchorEl(null)
  }

  const handleFaucet = () => {
    window.open('https://faucet.plasma.to', '_blank')
    setAnchorEl(null)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  if (isConnected) {
    return (
      <>
        <Button 
          onClick={handleMenuClick}
          onMouseEnter={() => setConnectedHover(true)}
          onMouseLeave={() => setConnectedHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            borderRadius: '25px',
            border: 'none',
            background: connectedHover ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            color: '#ffffff',
            minWidth: 'auto',
            textTransform: 'none',
            transition: 'all 0.2s ease',
            minHeight: '50px'
          }}
          disableRipple
        >
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            marginRight: '12px'
          }} />
          <Typography style={{ fontSize: '16px', marginRight: '12px', fontWeight: '500' }}>
            {truncateAddress(address)}
          </Typography>
          <MenuIcon style={{ fontSize: '20px' }} />
        </Button>
        
        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <StyledMenuItem onClick={handleBlockExplorer}>
            <ListItemText primary="Block Explorer" />
            <OpenInNewIcon style={{ fontSize: '16px', marginLeft: '8px' }} />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleDisconnect}>
            <ListItemText primary="Disconnect" />
            <OpenInNewIcon style={{ fontSize: '16px', marginLeft: '8px' }} />
          </StyledMenuItem>
        </StyledMenu>
      </>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setConnectHover(true)}
        onMouseLeave={() => setConnectHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          background: connectHover ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          color: '#ffffff',
          minWidth: 'auto',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          minHeight: '50px'
        }}
        disableRipple
      >
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#f97316',
          marginRight: '12px'
        }} />
        <Typography style={{ fontSize: '16px', marginRight: '12px', fontWeight: '500' }}>
          Connect
        </Typography>
        <MenuIcon style={{ fontSize: '20px' }} />
      </Button>

      <StyledDialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <DialogContent style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Typography style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#ffffff',
              marginBottom: '8px' 
            }}>
              Connect Wallet
            </Typography>
            <Typography style={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px'
            }}>
              Choose your preferred wallet to continue
            </Typography>
          </div>
          
          <div>
            {walletOptions.map((wallet) => (
              <div 
                key={wallet.name}
                onClick={() => handleConnect(wallet.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  transition: 'all 0.2s ease',
                  opacity: isConnecting ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <img 
                  src={wallet.icon}
                  alt={wallet.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    marginRight: '16px',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    // Fallback si l'image n'existe pas
                    e.target.style.display = 'none'
                  }}
                />
                <Typography style={{ 
                  fontSize: '16px', 
                  fontWeight: '500',
                  color: '#ffffff' 
                }}>
                  {wallet.name}
                </Typography>
              </div>
            ))}
          </div>
          
          {isConnecting && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTop: '3px solid #10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '12px'
              }} />
              <Typography style={{ 
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Connecting wallet...
              </Typography>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </DialogContent>
      </StyledDialog>
    </>
  )
}