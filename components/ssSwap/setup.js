import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Dialog,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ToggleButton from '@material-ui/lab/ToggleButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { withTheme } from '@material-ui/core/styles';

import { formatCurrency, formatAddress, formatCurrencyWithSymbol, formatCurrencySmall } from '../../utils'

import classes from './ssSwap.module.css'

import stores from '../../stores'
import {
  ACTIONS,
  ETHERSCAN_URL
} from '../../stores/constants'
import BigNumber from 'bignumber.js'

function Setup() {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [ loading, setLoading ] = useState(false)
  const [ quoteLoading, setQuoteLoading ] = useState(false)
  const [ approvalLoading, setApprovalLoading ] = useState(false)

  const [ fromAmountValue, setFromAmountValue ] = useState('')
  const [ fromAmountError, setFromAmountError ] = useState(false)
  const [ fromAssetValue, setFromAssetValue ] = useState(null)
  const [ fromAssetError, setFromAssetError ] = useState(false)
  const [ fromAssetOptions, setFromAssetOptions ] = useState([])

  const [ toAmountValue, setToAmountValue ] = useState('')
  const [ toAmountError, setToAmountError ] = useState(false)
  const [ toAssetValue, setToAssetValue ] = useState(null)
  const [ toAssetError, setToAssetError ] = useState(false)
  const [ toAssetOptions, setToAssetOptions ] = useState([])

  const [ slippage, setSlippage ] = useState('2')
  const [ slippageError, setSlippageError ] = useState(false)
  const [ slippageModalOpen, setSlippageModalOpen ] = useState(false)

  const [ quoteError, setQuoteError ] = useState(null)
  const [ quote, setQuote ] = useState(null)

  useEffect(function() {
    const errorReturned = () => {
      setLoading(false)
      setApprovalLoading(false)
      setQuoteLoading(false)
    }

    const quoteReturned = (val) => {
      if(!val) {
        setQuoteLoading(false)
        setQuote(null)
        setToAmountValue('')
        setQuoteError('Insufficient liquidity or no route available to complete swap')
      }
      if(val && val.inputs && val.inputs.fromAmount === fromAmountValue && val.inputs.fromAsset.address === fromAssetValue.address && val.inputs.toAsset.address === toAssetValue.address) {
        setQuoteLoading(false)
        if(BigNumber(val.output.finalValue).eq(0)) {
          setQuote(null)
          setToAmountValue('')
          setQuoteError('Insufficient liquidity or no route available to complete swap')
          return
        }

        setToAmountValue(BigNumber(val.output.finalValue).toFixed(8))
        setQuote(val)
      }
    }

    const ssUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')

      setToAssetOptions(baseAsset)
      setFromAssetOptions(baseAsset)

      // Configuration des tokens par défaut : XPL (sell) et USDT0 (buy)
      if(baseAsset.length > 0 && toAssetValue == null) {
        // Chercher USDT0 en premier
        const usdtAsset = baseAsset.find(asset => asset.symbol === 'USDT0')
        setToAssetValue(usdtAsset || baseAsset[0])
      }

      if(baseAsset.length > 0 && fromAssetValue == null) {
        // Chercher XPL en premier  
        const xplAsset = baseAsset.find(asset => asset.symbol === 'XPL')
        setFromAssetValue(xplAsset || baseAsset[1])
      }

      forceUpdate()
    }

    const assetsUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')

      setToAssetOptions(baseAsset)
      setFromAssetOptions(baseAsset)
    }

    const swapReturned = (event) => {
      setLoading(false)
      setFromAmountValue('')
      setToAmountValue('')
      calculateReceiveAmount(0, fromAssetValue, toAssetValue)
      setQuote(null)
      setQuoteLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.SWAP_RETURNED, swapReturned)
    stores.emitter.on(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)

    ssUpdated()

    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.SWAP_RETURNED, swapReturned)
      stores.emitter.removeListener(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
    }
  },[fromAmountValue, fromAssetValue, toAssetValue]);

  const onAssetSelect = (type, value) => {
    if(type === 'From') {

      if(value.address === toAssetValue.address) {
        setToAssetValue(fromAssetValue)
        setFromAssetValue(toAssetValue)
        calculateReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setFromAssetValue(value)
        calculateReceiveAmount(fromAmountValue, value, toAssetValue)
      }


    } else {
      if(value.address === fromAssetValue.address) {
        setFromAssetError(toAssetValue)
        setToAssetValue(fromAssetValue)
        calculateReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setToAssetValue(value)
        calculateReceiveAmount(fromAmountValue, fromAssetValue, value)
      }
    }

    forceUpdate()
  }

  const fromAmountChanged = (event) => {
    setFromAmountError(false)
    setFromAmountValue(event.target.value)
    if(event.target.value == '') {
      setToAmountValue('')
      setQuote(null)
    } else {
      calculateReceiveAmount(event.target.value, fromAssetValue, toAssetValue)
    }
  }

  const toAmountChanged = (event) => {
  }

  const onSlippageChanged = (event) => {
    if(event.target.value == '' || !isNaN(event.target.value)) {
      setSlippage(event.target.value)
    }
  }

  const calculateReceiveAmount = (amount, from, to) => {
    if(amount !== '' && !isNaN(amount) && to != null) {

      setQuoteLoading(true)
      setQuoteError(false)

      stores.dispatcher.dispatch({ type: ACTIONS.QUOTE_SWAP, content: {
        fromAsset: from,
        toAsset: to,
        fromAmount: amount,
      } })
    }
  }

  const onSwap = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setToAssetError(false)

    let error = false

    if(!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError('From amount is required')
      error = true
    } else {
      if(!fromAssetValue.balance || isNaN(fromAssetValue.balance) || BigNumber(fromAssetValue.balance).lte(0))  {
        setFromAmountError('Invalid balance')
        error = true
      } else if(BigNumber(fromAmountValue).lt(0)) {
        setFromAmountError('Invalid amount')
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.balance)) {
        setFromAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if(!fromAssetValue || fromAssetValue === null) {
      setFromAssetError('From asset is required')
      error = true
    }

    if(!toAssetValue || toAssetValue === null) {
      setFromAssetError('To asset is required')
      error = true
    }

    if(!error) {
      setLoading(true)

      stores.dispatcher.dispatch({ type: ACTIONS.SWAP, content: {
        fromAsset: fromAssetValue,
        toAsset: toAssetValue,
        fromAmount: fromAmountValue,
        toAmount: toAmountValue,
        quote: quote,
        slippage: slippage
      } })
    }
  }

  const setBalance100 = () => {
    setFromAmountValue(fromAssetValue.balance)
    calculateReceiveAmount(fromAssetValue.balance, fromAssetValue, toAssetValue)
  }

  const swapAssets = () => {
    const fa = fromAssetValue
    const ta = toAssetValue
    setFromAssetValue(ta)
    setToAssetValue(fa)
    calculateReceiveAmount(fromAmountValue, ta, fa)
  }

  const renderSwapInformation = () => {

    if(quoteError) {
      return (
        <div className={ classes.quoteLoader }>
          <Typography className={ classes.quoteError }>{ quoteError }</Typography>
        </div>
      )
    }

    if(quoteLoading) {
      return (
        <div className={ classes.quoteLoader }>
          <CircularProgress size={20} className={ classes.loadingCircle } />
        </div>
      )
    }

    if(!quote) {
      return
        <div className={ classes.quoteLoader }> </div>
    }

    return (
      <div className={ classes.modernPriceInfo }>
        <div className={ classes.priceInfoRow }>
          <span className={ classes.priceLabel }>Fees</span>
          <span className={ classes.priceValue }>0.008%</span>
        </div>
        <div className={ classes.priceInfoRow }>
          <span className={ classes.priceLabel }>Exchange rate</span>
          <span className={ classes.priceValue }>
            1 {fromAssetValue?.symbol} = {formatCurrency(BigNumber(quote.output.finalValue).div(quote.inputs.fromAmount).toFixed(8))} {toAssetValue?.symbol}
          </span>
        </div>
        <div className={ classes.priceInfoRow }>
          <span className={ classes.priceLabel }>Price impact</span>
          <span className={ classes.priceValue }>{formatCurrency(quote.priceImpact)}%</span>
        </div>
        <div className={ classes.priceInfoRow }>
          <span className={ classes.priceLabel }>Minimum received</span>
          <div className={ classes.priceValueWithSlippage }>
            <span className={ classes.slippageLabel } onClick={() => setSlippageModalOpen(true)}>Slippage {slippage}%</span>
            <span className={ classes.priceValue }>
              {formatCurrency(BigNumber(quote.output.finalValue).times(1 - slippage/100).toFixed(8))} {toAssetValue?.symbol}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderSmallInput = (type, amountValue, amountError, amountChanged) => {
    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainerSlippage }>
          <div className={ classes.inputBalanceSlippage }>
            <Typography className={ classes.inputBalanceText } noWrap > Slippage </Typography>
          </div>
        </div>
        <div className={ classes.smallInputContainer }>
          <TextField
            placeholder='0.00'
            fullWidth
            error={ amountError }
            helperText={ amountError }
            value={ amountValue }
            onChange={ amountChanged }
            disabled={ loading }
            InputProps={{
              className: classes.smallInput,
              endAdornment: <InputAdornment position="end">
                %
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, assetValue, assetError, assetOptions, onAssetSelect) => {

    return (
      <div className={ classes.swapInputSection}>
        <div className={ classes.inputHeader }>
          <div className={ classes.inputLabel }>
            {type === 'From' ? 'Sell' : 'Buy'}
          </div>
          {type === 'From' && (
            <div className={ classes.balanceLabel } onClick={ setBalance100 }>
              Balance: { (assetValue && assetValue.balance) ?
                formatCurrency(assetValue.balance) + ' ' + assetValue.symbol :
                '0.0 ' + (assetValue?.symbol || '')
              }
            </div>
          )}
        </div>
        <div className={ `${classes.modernInputContainer} ${ (amountError || assetError) && classes.error }` }>
          <div className={ classes.tokenSelectorSection }>
            <AssetSelect type={type} value={ assetValue } assetOptions={ assetOptions } onSelect={ onAssetSelect } />
          </div>
          <div className={ classes.amountInputSection }>
            <TextField
              placeholder='0'
              fullWidth
              error={ amountError }
              helperText={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ loading || type === 'To' }
              InputProps={{
                className: classes.modernInput,
                disableUnderline: true
              }}
              variant="standard"
            />
            <div className={ classes.usdValue }>
              ${(assetValue && assetValue.balance && amountValue) ? 
                (parseFloat(amountValue) * 11.38).toFixed(2) : '0.0'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSlippageModal = () => {
    const presetValues = ['0.01', '0.1', '0.5', '1', '5']
    
    const onSlippagePresetClick = (value) => {
      setSlippage(value)
    }

    const onSlippageInputChange = (event) => {
      if(event.target.value === '' || !isNaN(event.target.value)) {
        setSlippage(event.target.value)
      }
    }

    const closeSlippageModal = () => {
      setSlippageModalOpen(false)
    }

    return (
      <Dialog 
        open={slippageModalOpen} 
        onClose={closeSlippageModal}
        className={classes.slippageModal}
        PaperProps={{
          className: classes.slippageModalPaper
        }}
      >
        <div className={classes.slippageModalContent}>
          <div className={classes.slippageModalHeader}>
            <h3 className={classes.slippageModalTitle}>Slippage tolerance</h3>
            <IconButton onClick={closeSlippageModal} className={classes.slippageModalClose}>
              ×
            </IconButton>
          </div>
          
          <p className={classes.slippageModalDescription}>
            Slippage is the difference between the current market price of a token and the price at which 
            the actual swap is executed. Volatile tokens usually require a larger value.
          </p>

          <div className={classes.slippageInputContainer}>
            <TextField
              fullWidth
              value={slippage}
              onChange={onSlippageInputChange}
              className={classes.slippageInput}
              InputProps={{
                className: classes.slippageInputField,
                endAdornment: <span className={classes.slippageInputPercent}>%</span>,
              }}
              variant="outlined"
            />
          </div>

          <div className={classes.slippagePresets}>
            {presetValues.map((value) => (
              <button
                key={value}
                className={`${classes.slippagePresetButton} ${slippage === value ? classes.slippagePresetButtonActive : ''}`}
                onClick={() => onSlippagePresetClick(value)}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    )
  }

  return (
    <div className={ classes.swapInputs }>
      { renderMassiveInput('From', fromAmountValue, fromAmountError, fromAmountChanged, fromAssetValue, fromAssetError, fromAssetOptions, onAssetSelect) }
      
      <div className={ classes.swapArrowContainer }>
        <button className={ classes.swapArrowButton } onClick={ swapAssets }>
          <svg className={ classes.swapArrowIcon } width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      { renderMassiveInput('To', toAmountValue, toAmountError, toAmountChanged, toAssetValue, toAssetError, toAssetOptions, onAssetSelect) }
      
      { renderSwapInformation() }

      <div className={ classes.modernActionsContainer }>
        <Button
          variant='contained'
          size='large'
          className={classes.modernSwapButton}
          disabled={ loading || quoteLoading }
          onClick={ onSwap }
          >
          { loading ? `Swapping...` : `Swap` }
        </Button>
      </div>

      {renderSlippageModal()}
    </div>
  )
}

function AssetSelect({ type, value, assetOptions, onSelect }) {

  const [ open, setOpen ] = useState(false);
  const [ search, setSearch ] = useState('')
  const [ filteredAssetOptions, setFilteredAssetOptions ] = useState([])

  const [ manageLocal, setManageLocal ] = useState(false)
  
  const [ copiedAddr, setCopiedAddr ] = useState(null)

  const openSearch = () => {
    setSearch('')
    setOpen(true)
  };

  useEffect(async function() {

    let ao = assetOptions.filter((asset) => {
      if(search && search !== '') {
        return asset.address.toLowerCase().includes(search.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    })

    setFilteredAssetOptions(ao)

    //no options in our default list and its an address we search for the address
    if(ao.length === 0 && search && search.length === 42) {
      stores.dispatcher.dispatch({
        type: ACTIONS.SEARCH_ASSET,
        content: { address: search }
      })
    }

    return () => {
    }
  }, [assetOptions, search]);

  useEffect(() => {
    const assetSearched = (newAsset) => {
      if(Array.isArray(newAsset)) {
        // Si c'est un tableau (depuis localStorage)
        setFilteredAssetOptions(prev => [...prev, ...newAsset])
      } else if(newAsset && newAsset.address) {
        // Si c'est un seul asset (nouveau token trouvé)
        setFilteredAssetOptions(prev => [...prev, newAsset])
      }
    }

    stores.emitter.on(ACTIONS.ASSET_SEARCHED, assetSearched)
    return () => {
      stores.emitter.removeListener(ACTIONS.ASSET_SEARCHED, assetSearched)
    }
  }, [])

  const onSearchChanged = async (event) => {
    setSearch(event.target.value)
  }

  const handleCopy = async (e, address) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddr(address);
      setTimeout(() => setCopiedAddr(null), 1200);
    } catch (err) {}
  }

  const onLocalSelect = (type, asset) => {
    setSearch('')
    setManageLocal(false)
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    setManageLocal(false)
    setSearch('')
    setOpen(false)
  }

  const toggleLocal = () => {
    setManageLocal(!manageLocal)
  }

  const deleteOption = (token) => {
    stores.stableSwapStore.removeBaseAsset(token)
  }

  const viewOption = (token) => {
    window.open(`${ETHERSCAN_URL}token/${token.address}`, '_blank')
  }

  const renderManageOption = (type, asset, idx) => {
    return (
      <MenuItem val={ asset.address } key={ asset.address+'_'+idx } className={ classes.assetSelectMenu } >
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainerSmall }>
            <img
              className={ classes.displayAssetIconSmall }
              alt=""
              src={ asset ? `${asset.logoURI}` : '' }
              height='60px'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
        <div className={ classes.assetSelectIconName }>
          <Typography variant='h5'>{ asset ? asset.symbol : '' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.name : '' }</Typography>
        </div>
        <div className={ classes.assetSelectActions}>
          <IconButton onClick={ () => { deleteOption(asset) } }>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={ () => { viewOption(asset) } }>
            ↗
          </IconButton>
        </div>
      </MenuItem>
    )
  }

  const renderAssetOption = (type, asset, idx) => {
    const formatAddress = (address) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
      <MenuItem val={ asset.address } key={ asset.address+'_'+idx } className={ classes.modernAssetOption } onClick={ () => { onLocalSelect(type, asset) } }>
        <div className={ classes.modernAssetContent }>
          <div className={ classes.modernAssetLeft }>
            <img
              className={ classes.modernAssetIcon }
              alt=""
              src={ asset ? `${asset.logoURI}` : '' }
              width='48'
              height='48'
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
            <div className={ classes.modernAssetInfo }>
              <div className={ classes.modernAssetSymbolRow }>
                <span className={ classes.modernAssetSymbol }>{ asset ? asset.symbol : '' }</span>
                {asset && asset.logoURI && <span className={ classes.modernAssetVerified }>✓</span>}
              </div>
              <div className={ classes.modernAssetAddressWrap }>
                <span className={ classes.modernAssetAddress }>
                  { asset ? formatAddress(asset.address) : '' }
                </span>
                <span
                  className={ classes.copyIcon }
                  onClick={(e) => handleCopy(e, asset.address) }
                  title="Copier l'adresse"
                >
                  <img src="/images/copy.png" alt="Copier l'adresse" width="14" height="14" />
                </span>
                {copiedAddr === asset.address && (
                  <span className={classes.copiedLabel}>Copied</span>
                )}
              </div>
            </div>
          </div>
          <div className={ classes.modernAssetRight }>
            <span className={ classes.modernAssetBalance }>
              { (asset && asset.balance) ? formatCurrency(asset.balance) : '0.0' }
            </span>
            <span className={ classes.modernAssetBalanceUsd }>$0.0</span>
          </div>
        </div>
      </MenuItem>
    )
  }

  const renderManageLocal = () => {
    return (
      <>
        <div className={ classes.searchContainer }>
          <div className={ classes.searchInline }>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              placeholder="XPL, USDT0, 0x..."
              value={ search }
              onChange={ onSearchChanged }
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>,
              }}
            />
          </div>
          <div className={ classes.assetSearchResults }>
            {
              filteredAssetOptions ? filteredAssetOptions.filter((option) => {
                return option.local === true
              }).map((asset, idx) => {
                return renderManageOption(type, asset, idx)
              }) : []
            }
          </div>
        </div>
        <div className={ classes.manageLocalContainer }>
          <Button
            onClick={ toggleLocal }
            >
            Back to Assets
          </Button>
        </div>
      </>
    )
  }

  const renderOptions = () => {
    return (
      <>
        <div className={ classes.searchContainer }>
          <div className={ classes.searchInline }>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              placeholder="XPL, USDT0, 0x..."
              value={ search }
              onChange={ onSearchChanged }
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>,
              }}
            />
          </div>
          <div className={ classes.assetSearchResults }>
            {
              (() => {
                const preferredOrder = ['FUSEON', 'USDT0', 'XPL', 'USDC', 'WXPL'];
                const list = filteredAssetOptions ? filteredAssetOptions.filter((asset) => {
                  // Ne montrer que les tokens whitelistés (avec logo et non local)
                  return !asset.local && asset.logoURI;
                }) : [];

                // Pinned tokens in specified order (case-insensitive), then the rest sorted by balance desc then symbol
                const pinned = preferredOrder
                  .map(sym => list.find(a => a.symbol && a.symbol.toUpperCase() === sym))
                  .filter(Boolean);

                const remaining = list.filter(a => !(a.symbol && preferredOrder.includes(a.symbol.toUpperCase())));

                const sortedRemaining = remaining.sort((a, b) => {
                  if(BigNumber(a.balance).lt(b.balance)) return 1;
                  if(BigNumber(a.balance).gt(b.balance)) return -1;
                  if(a.symbol.toLowerCase()<b.symbol.toLowerCase()) return -1;
                  if(a.symbol.toLowerCase()>b.symbol.toLowerCase()) return 1;
                  return 0;
                });

                const ordered = [...pinned, ...sortedRemaining];
                return ordered.map((asset, idx) => renderAssetOption(type, asset, idx));
              })()
            }
          </div>
        </div>
      </>
    )
  }

  return (
    <React.Fragment>
      <div className={ classes.modernTokenSelector } onClick={ () => { openSearch() } }>
        <img
          className={ classes.tokenIcon }
          alt=""
          src={ value ? `${value.logoURI}` : '' }
          width='32'
          height='32'
          onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
        />
        <span className={ classes.tokenSymbol }>{ value ? value.symbol : 'Select' }</span>
        <svg className={ classes.dropdownIcon } width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <Dialog 
        onClose={ onClose } 
        aria-labelledby="simple-dialog-title" 
        open={ open }
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
          { !manageLocal && renderOptions() }
          { manageLocal && renderManageLocal() }
        </div>
      </Dialog>
    </React.Fragment>
  )
}

export default withTheme(Setup)
