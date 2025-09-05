import React, { useState, useEffect } from 'react'
import { Typography, Button, Dialog, IconButton, Radio, RadioGroup, FormControlLabel, TextField, InputAdornment } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { formatCurrency } from '../../utils'
import classes from './ssLiquidityManage.module.css'

import SearchIcon from '@material-ui/icons/Search'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

// Import AssetSelect from swap
function AssetSelect({ type, value, assetOptions, onSelect }) {
  const [ open, setOpen ] = useState(false);
  const [ search, setSearch ] = useState('')
  const [ filteredAssetOptions, setFilteredAssetOptions ] = useState([])

  const openSearch = () => {
    setSearch('')
    setOpen(true)
  };

  useEffect(() => {
    let ao = assetOptions.filter((asset) => {
      if(search && search !== '') {
        return asset.address.toLowerCase().includes(search.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    }).filter((asset) => {
      // Only show whitelisted tokens (with logo and not local)
      return !asset.local && asset.logoURI;
    }).sort((a, b) => {
      // Sort by balance first, then alphabetically
      if(BigNumber(a.balance).lt(b.balance)) return 1;
      if(BigNumber(a.balance).gt(b.balance)) return -1;
      if(a.symbol.toLowerCase()<b.symbol.toLowerCase()) return -1;
      if(a.symbol.toLowerCase()>b.symbol.toLowerCase()) return 1;
      return 0;
    })

    setFilteredAssetOptions(ao)
  }, [assetOptions, search]);

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (asset) => {
    setSearch('')
    setOpen(false)
    onSelect(asset)
  }

  const onClose = () => {
    setOpen(false)
  }

  const renderAssetOption = (asset, idx) => {
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
    }

    const formatAddress = (address) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
      <div key={asset.address+'_'+idx} className={classes.modernAssetOption} onClick={() => onLocalSelect(asset)}>
        <div className={classes.modernAssetContent}>
          <div className={classes.modernAssetLeft}>
            <img
              className={classes.modernAssetIcon}
              alt=""
              src={asset ? `${asset.logoURI}` : ''}
              width='48'
              height='48'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <div className={classes.modernAssetInfo}>
              <div className={classes.modernAssetSymbolRow}>
                <span className={classes.modernAssetSymbol}>{asset ? asset.symbol : ''}</span>
                {asset && asset.logoURI && <span className={classes.modernAssetVerified}>✓</span>}
              </div>
              <span 
                className={classes.modernAssetAddress} 
                onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.address) }}
              >
                {asset ? formatAddress(asset.address) : ''}
              </span>
            </div>
          </div>
          <div className={classes.modernAssetRight}>
            <span className={classes.modernAssetBalance}>
              {(asset && asset.balance) ? formatCurrency(asset.balance) : '0.0'}
            </span>
            <span className={classes.modernAssetBalanceUsd}>$0.0</span>
          </div>
        </div>
      </div>
    )
  }

  const renderOptions = () => {
    return (
      <div className={classes.searchContainer}>
        <div className={classes.searchInline}>
          <TextField
            autoFocus
            variant="outlined"
            fullWidth
            placeholder="ETH, CRV, aave, 0xa0b8..."
            value={search}
            onChange={onSearchChanged}
            InputProps={{
              className: classes.searchInputField,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={classes.searchIcon} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.assetSearchResults}>
          {
            filteredAssetOptions ? filteredAssetOptions.map((asset, idx) => {
              return renderAssetOption(asset, idx)
            }) : []
          }
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className={classes.modernTokenSelectorButton} onClick={openSearch}>
        {value ? (
          <div className={classes.modernTokenSelectorContent}>
            <img
              src={value.logoURI}
              alt=""
              className={classes.modernTokenSelectorIcon}
              onError={(e) => {e.target.src = "/tokens/unknown-logo.png"}}
            />
            <span className={classes.modernTokenSelectorSymbol}>{value.symbol}</span>
          </div>
        ) : (
          <div className={classes.modernTokenSelectorPlaceholder}>
            <div className={classes.modernTokenSelectorPlaceholderIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className={classes.modernTokenSelectorPlaceholderText}>Select token</span>
          </div>
        )}
        <svg className={classes.modernTokenSelectorArrow} width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <Dialog 
        open={open} 
        onClose={onClose}
        className={classes.tokenSelectModal}
        PaperProps={{
          className: classes.tokenSelectModalPaper
        }}
      >
        <div className={classes.tokenSelectModalContent}>
          <div className={classes.tokenSelectModalHeader}>
            <h3 className={classes.tokenSelectModalTitle}>Select token</h3>
            <IconButton onClick={onClose} className={classes.tokenSelectModalClose}>
              ×
            </IconButton>
          </div>
          {renderOptions()}
        </div>
      </Dialog>
    </React.Fragment>
  )
}

export default function ModernLiquidityCreate() {
  const [step, setStep] = useState(1) // 1: token selection, 2: pool type, 3: amounts
  const [asset0, setAsset0] = useState(null)
  const [asset1, setAsset1] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])
  const [filteredAssetOptions, setFilteredAssetOptions] = useState([])
  const [poolType, setPoolType] = useState('basic')
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [slippage, setSlippage] = useState('2')
  const [createLoading, setCreateLoading] = useState(false)
  const [showAssetSelect0, setShowAssetSelect0] = useState(false)
  const [showAssetSelect1, setShowAssetSelect1] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.PAIR_CREATED, pairCreated)
    
    const stableSwapAssets = stores.stableSwapStore.getStore('baseAssets')
    setAssetOptions(stableSwapAssets)

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.PAIR_CREATED, pairCreated)
    }
  }, [])

  const ssUpdated = () => {
    const stableSwapAssets = stores.stableSwapStore.getStore('baseAssets')
    setAssetOptions(stableSwapAssets)
  }

  const pairCreated = () => {
    setCreateLoading(false)
    // Navigate back or show success
  }

  useEffect(() => {
    let ao = assetOptions.filter((asset) => {
      if(search && search !== '') {
        return asset.address.toLowerCase().includes(search.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    }).filter((asset) => {
      // Only show whitelisted tokens (with logo and not local)
      return !asset.local && asset.logoURI;
    }).sort((a, b) => {
      // Sort by balance first, then alphabetically
      if(BigNumber(a.balance).lt(b.balance)) return 1;
      if(BigNumber(a.balance).gt(b.balance)) return -1;
      if(a.symbol.toLowerCase()<b.symbol.toLowerCase()) return -1;
      if(a.symbol.toLowerCase()>b.symbol.toLowerCase()) return 1;
      return 0;
    })

    setFilteredAssetOptions(ao)
  }, [assetOptions, search]);

  const onSearchChanged = (event) => {
    setSearch(event.target.value)
  }

  const onAssetSelect0 = (asset) => {
    setAsset0(asset)
    setShowAssetSelect0(false)
    setSearch('')
  }

  const onAssetSelect1 = (asset) => {
    setAsset1(asset)
    setShowAssetSelect1(false)
    setSearch('')
  }

  const renderAssetOption = (asset, idx, onLocalSelect) => {
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
    }

    const formatAddress = (address) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
      <div key={asset.address+'_'+idx} className={classes.modernAssetOption} onClick={() => onLocalSelect(asset)}>
        <div className={classes.modernAssetContent}>
          <div className={classes.modernAssetLeft}>
            <img
              className={classes.modernAssetIcon}
              alt=""
              src={asset ? `${asset.logoURI}` : ''}
              width='48'
              height='48'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <div className={classes.modernAssetInfo}>
              <div className={classes.modernAssetSymbolRow}>
                <span className={classes.modernAssetSymbol}>{asset ? asset.symbol : ''}</span>
                {asset && asset.logoURI && <span className={classes.modernAssetVerified}>✓</span>}
              </div>
              <span 
                className={classes.modernAssetAddress} 
                onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.address) }}
              >
                {asset ? formatAddress(asset.address) : ''}
              </span>
            </div>
          </div>
          <div className={classes.modernAssetRight}>
            <span className={classes.modernAssetBalance}>
              {(asset && asset.balance) ? formatCurrency(asset.balance) : '0.0'}
            </span>
            <span className={classes.modernAssetBalanceUsd}>$0.0</span>
          </div>
        </div>
      </div>
    )
  }

  const onCreatePool = () => {
    setCreateLoading(true)
    stores.dispatcher.dispatch({
      type: ACTIONS.CREATE_PAIR_AND_DEPOSIT,
      content: {
        token0: asset0,
        token1: asset1,
        amount0: amount0,
        amount1: amount1,
        isStable: poolType === 'basic',
        slippage: slippage
      }
    })
  }

  const renderTokenSelector = (position, label) => {
    const selectedAsset = position === 0 ? asset0 : asset1
    const showModal = position === 0 ? showAssetSelect0 : showAssetSelect1
    const setShowModal = position === 0 ? setShowAssetSelect0 : setShowAssetSelect1
    const onSelect = position === 0 ? onAssetSelect0 : onAssetSelect1
    
    return (
      <div className={classes.modernTokenSelector}>
        <Typography className={classes.modernTokenSelectorLabel}>
          {label}
        </Typography>
        <div className={classes.modernTokenSelectorButton} onClick={() => setShowModal(true)}>
          {selectedAsset ? (
            <div className={classes.modernTokenSelectorContent}>
              <img
                src={selectedAsset.logoURI}
                alt=""
                className={classes.modernTokenSelectorIcon}
                onError={(e) => {e.target.src = "/tokens/unknown-logo.png"}}
              />
              <span className={classes.modernTokenSelectorSymbol}>{selectedAsset.symbol}</span>
            </div>
          ) : (
            <div className={classes.modernTokenSelectorPlaceholder}>
              <div className={classes.modernTokenSelectorPlaceholderIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className={classes.modernTokenSelectorPlaceholderText}>Select token</span>
            </div>
          )}
          <svg className={classes.modernTokenSelectorArrow} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        {showModal && (
          <Dialog 
            open={showModal} 
            onClose={() => setShowModal(false)}
            className={classes.tokenSelectModal}
            PaperProps={{
              className: classes.tokenSelectModalPaper
            }}
          >
            <div className={classes.tokenSelectModalContent}>
              <div className={classes.tokenSelectModalHeader}>
                <h3 className={classes.tokenSelectModalTitle}>Select token</h3>
                <IconButton onClick={() => setShowModal(false)} className={classes.tokenSelectModalClose}>
                  ×
                </IconButton>
              </div>
              <div className={classes.searchContainer}>
                <div className={classes.searchInline}>
                  <TextField
                    autoFocus
                    variant="outlined"
                    fullWidth
                    placeholder="ETH, CRV, aave, 0xa0b8..."
                    value={search}
                    onChange={onSearchChanged}
                    InputProps={{
                      className: classes.searchInputField,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon className={classes.searchIcon} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className={classes.assetSearchResults}>
                  {
                    filteredAssetOptions ? filteredAssetOptions.map((asset, idx) => {
                      return renderAssetOption(asset, idx, onSelect)
                    }) : []
                  }
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    )
  }

  const renderPoolTypeSelector = () => {
    return (
      <div className={classes.modernPoolTypeContainer}>
        <div 
          className={`${classes.modernPoolTypeCard} ${poolType === 'concentrated' ? classes.modernPoolTypeCardActive : ''}`}
          onClick={() => setPoolType('concentrated')}
        >
          <div className={classes.modernPoolTypeHeader}>
            <Radio
              checked={poolType === 'concentrated'}
              className={classes.modernPoolTypeRadio}
            />
            <Typography className={classes.modernPoolTypeTitle}>
              Concentrated Pools
            </Typography>
          </div>
          <Typography className={classes.modernPoolTypeDescription}>
            These pools require you to specify a price range in which your liquidity will be 
            active. The range is defined using evenly spaced price intervals called ticks.
          </Typography>
        </div>

        <div 
          className={`${classes.modernPoolTypeCard} ${poolType === 'basic' ? classes.modernPoolTypeCardActive : ''}`}
          onClick={() => setPoolType('basic')}
        >
          <div className={classes.modernPoolTypeHeader}>
            <Radio
              checked={poolType === 'basic'}
              className={classes.modernPoolTypeRadio}
            />
            <Typography className={classes.modernPoolTypeTitle}>
              Basic Pools
            </Typography>
          </div>
          <Typography className={classes.modernPoolTypeDescription}>
            Also known as constant product AMMs, these pools spread liquidity across the 
            full price range (0 to ∞) and require little to no active management.
          </Typography>
        </div>
      </div>
    )
  }


  return (
    <div className={classes.modernLiquidityContainer}>
      <div className={classes.modernLiquidityHeader}>
        <Typography className={classes.modernLiquidityTitle}>
          New deposit
        </Typography>
        <IconButton className={classes.modernLiquidityInfo}>
          ?
        </IconButton>
      </div>

      {step === 1 && (
        <div className={classes.modernLiquidityContent}>
          <div className={classes.modernTokenSelectorContainer}>
            {renderTokenSelector(0, "Token you want to deposit")}
            {renderTokenSelector(1, "Token you want to pair with")}
          </div>
          
          {asset0 && asset1 && (
            <Button
              className={classes.modernNextButton}
              onClick={() => setStep(2)}
              disabled={!asset0 || !asset1}
            >
              Next
            </Button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className={classes.modernLiquidityContent}>
          {renderTokenSelector(0, "Token you want to deposit")}
          {renderTokenSelector(1, "Token you want to pair with")}
          
          {renderPoolTypeSelector()}
          
          <Button
            className={classes.modernNextButton}
            onClick={() => setStep(3)}
          >
            Next
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className={classes.modernLiquidityContent}>
          {/* Amount inputs and final creation */}
          <Button
            className={classes.modernCreateButton}
            onClick={onCreatePool}
            disabled={createLoading}
          >
            {createLoading ? 'Creating...' : 'Create Pool'}
          </Button>
        </div>
      )}

    </div>
  )
}