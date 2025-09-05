import React, { useState, useEffect } from 'react'
import { Typography, Button, Dialog, IconButton, TextField, InputAdornment } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { formatCurrency } from '../../utils'
import classes from './ssLiquidityManage.module.css'

import SearchIcon from '@material-ui/icons/Search'
import stores from '../../stores'
import { ACTIONS } from '../../stores/constants'

// Token Selector Component
function TokenSelector({ label, value, assetOptions, onSelect, disabled = false }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredAssetOptions, setFilteredAssetOptions] = useState([])

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
      return !asset.local && asset.logoURI;
    }).sort((a, b) => {
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

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const renderAssetOption = (asset, idx) => {
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
              <span className={classes.modernAssetAddress}>
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

  return (
    <>
      <div className={classes.liquidityInputSection}>
        <div className={classes.inputHeader}>
          <div className={classes.inputLabel}>{label}</div>
        </div>
        <div className={classes.modernTokenSelector} onClick={() => !disabled && setOpen(true)}>
          {value ? (
            <>
              <img
                className={classes.tokenIcon}
                alt=""
                src={value.logoURI}
                width='32'
                height='32'
                onError={(e) => {e.target.src = "/tokens/unknown-logo.png"}}
              />
              <span className={classes.tokenSymbol}>{value.symbol}</span>
            </>
          ) : (
            <span className={classes.tokenSymbol}>Select token</span>
          )}
          <svg className={classes.dropdownIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        className={classes.tokenSelectModal}
        PaperProps={{
          className: classes.tokenSelectModalPaper
        }}
      >
        <div className={classes.tokenSelectModalContent}>
          <div className={classes.tokenSelectModalHeader}>
            <h3 className={classes.tokenSelectModalTitle}>Select token</h3>
            <IconButton onClick={() => setOpen(false)} className={classes.tokenSelectModalClose}>
              ×
            </IconButton>
          </div>
          <div className={classes.searchContainer}>
            <div className={classes.searchInline}>
              <TextField
                autoFocus
                variant="outlined"
                fullWidth
                placeholder="XPL, USDT0, 0x..."
                value={search}
                onChange={onSearchChanged}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className={classes.assetSearchResults}>
              {filteredAssetOptions.map((asset, idx) => renderAssetOption(asset, idx))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

// Amount Input Component
function AmountInput({ label, value, onChange, asset, onMaxClick, disabled = false }) {
  return (
    <div className={classes.liquidityInputSection}>
      <div className={classes.inputHeader}>
        <div className={classes.inputLabel}>{label}</div>
        {asset && (
          <div className={classes.balanceLabel} onClick={onMaxClick}>
            Balance: {asset.balance ? formatCurrency(asset.balance) : '0.0'} {asset.symbol}
          </div>
        )}
      </div>
      <div className={classes.modernInputContainer}>
        <div className={classes.tokenSelectorSection}>
          {asset && (
            <div className={classes.modernTokenSelector}>
              <img
                className={classes.tokenIcon}
                alt=""
                src={asset.logoURI}
                width='32'
                height='32'
                onError={(e) => {e.target.src = "/tokens/unknown-logo.png"}}
              />
              <span className={classes.tokenSymbol}>{asset.symbol}</span>
            </div>
          )}
        </div>
        <div className={classes.amountInputSection}>
          <TextField
            placeholder='0'
            fullWidth
            value={value}
            onChange={onChange}
            disabled={disabled}
            InputProps={{
              className: classes.modernInput,
              disableUnderline: true
            }}
            variant="standard"
          />
          <div className={classes.usdValue}>
            ${value && asset ? (parseFloat(value) * 1.0).toFixed(2) : '0.0'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ModernLiquidityCreate() {
  const [asset0, setAsset0] = useState(null)
  const [asset1, setAsset1] = useState(null)
  const [assetOptions, setAssetOptions] = useState([])
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const [poolType, setPoolType] = useState('stable')
  const [createLoading, setCreateLoading] = useState(false)

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
  }

  const onAssetSelect0 = (asset) => {
    if(asset1 && asset.address === asset1.address) {
      setAsset1(asset0)
    }
    setAsset0(asset)
  }

  const onAssetSelect1 = (asset) => {
    if(asset0 && asset.address === asset0.address) {
      setAsset0(asset1)
    }
    setAsset1(asset)
  }

  const onAmount0Changed = (event) => {
    setAmount0(event.target.value)
  }

  const onAmount1Changed = (event) => {
    setAmount1(event.target.value)
  }

  const setMax0 = () => {
    if(asset0 && asset0.balance) {
      setAmount0(asset0.balance)
    }
  }

  const setMax1 = () => {
    if(asset1 && asset1.balance) {
      setAmount1(asset1.balance)
    }
  }

  const onCreatePool = () => {
    if(!asset0 || !asset1 || !amount0 || !amount1) return
    
    setCreateLoading(true)
    stores.dispatcher.dispatch({
      type: ACTIONS.CREATE_PAIR_AND_DEPOSIT,
      content: {
        token0: asset0,
        token1: asset1,
        amount0: amount0,
        amount1: amount1,
        isStable: poolType === 'stable',
        slippage: '2'
      }
    })
  }

  const renderPoolTypeSelector = () => {
    return (
      <div className={classes.poolTypeSection}>
        <div className={classes.inputHeader}>
          <div className={classes.inputLabel}>Pool Type</div>
        </div>
        <div className={classes.poolTypeButtons}>
          <button
            className={`${classes.poolTypeButton} ${poolType === 'stable' ? classes.poolTypeButtonActive : ''}`}
            onClick={() => setPoolType('stable')}
          >
            <div className={classes.poolTypeContent}>
              <span className={classes.poolTypeTitle}>Stable Pool</span>
              <span className={classes.poolTypeDescription}>For correlated assets (USDC/USDT)</span>
            </div>
          </button>
          <button
            className={`${classes.poolTypeButton} ${poolType === 'volatile' ? classes.poolTypeButtonActive : ''}`}
            onClick={() => setPoolType('volatile')}
          >
            <div className={classes.poolTypeContent}>
              <span className={classes.poolTypeTitle}>Volatile Pool</span>
              <span className={classes.poolTypeDescription}>For uncorrelated assets (XPL/USDT)</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  const renderPriceInfo = () => {
    if(!asset0 || !asset1 || !amount0 || !amount1) return null

    return (
      <div className={classes.modernPriceInfo}>
        <div className={classes.priceInfoRow}>
          <span className={classes.priceLabel}>Pool Type</span>
          <span className={classes.priceValue}>{poolType === 'stable' ? 'Stable' : 'Volatile'}</span>
        </div>
        <div className={classes.priceInfoRow}>
          <span className={classes.priceLabel}>Share of Pool</span>
          <span className={classes.priceValue}>100%</span>
        </div>
        <div className={classes.priceInfoRow}>
          <span className={classes.priceLabel}>Exchange Rate</span>
          <span className={classes.priceValue}>
            1 {asset0.symbol} = {formatCurrency(parseFloat(amount1) / parseFloat(amount0))} {asset1.symbol}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.swapInputs}>
      <TokenSelector
        label="First Token"
        value={asset0}
        assetOptions={assetOptions}
        onSelect={onAssetSelect0}
      />

      <TokenSelector
        label="Second Token"
        value={asset1}
        assetOptions={assetOptions}
        onSelect={onAssetSelect1}
      />

      {asset0 && asset1 && (
        <>
          {renderPoolTypeSelector()}

          <AmountInput
            label={`${asset0.symbol} Amount`}
            value={amount0}
            onChange={onAmount0Changed}
            asset={asset0}
            onMaxClick={setMax0}
          />

          <div className={classes.swapArrowContainer}>
            <div className={classes.swapArrowButton}>
              <svg className={classes.swapArrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <AmountInput
            label={`${asset1.symbol} Amount`}
            value={amount1}
            onChange={onAmount1Changed}
            asset={asset1}
            onMaxClick={setMax1}
          />

          {renderPriceInfo()}

          <div className={classes.modernActionsContainer}>
            <Button
              variant='contained'
              size='large'
              className={classes.modernSwapButton}
              disabled={createLoading || !amount0 || !amount1}
              onClick={onCreatePool}
            >
              {createLoading ? 'Creating Pool...' : 'Create Pool & Add Liquidity'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
