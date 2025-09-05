import { Typography, Button, Paper } from "@material-ui/core"
import LiquidityPairs from '../../components/ssLiquidityPairs'

import React, { useState, useEffect } from 'react';
import { ACTIONS } from '../../stores/constants';

import stores from '../../stores';
import { useRouter } from "next/router";
import Unlock from '../../components/unlock';

import classes from './liquidity.module.css';

function Liquidity({ changeTheme }) {

  const accountStore = stores.accountStore.getStore('account');
  const router = useRouter();
  const [account, setAccount] = useState(accountStore);
  const [unlockOpen, setUnlockOpen] = useState(false);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account');
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(ACTIONS.CONNECT_WALLET, connectWallet);

    return () => {
      stores.emitter.removeListener(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure);
      stores.emitter.removeListener(ACTIONS.CONNECT_WALLET, connectWallet);
    };
  }, []);

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  const onCreateLiquidity = () => {
    router.push('/liquidity/create');
  };

  return (
    <div className={classes.newLiquidityContainer}>
      {account && account.address ? (
        <div className={classes.liquidityContainer}>
          <div className={classes.liquidityHeader}>
            <Typography className={classes.liquidityTitle} variant='h1'>
              Liquidity Pools
            </Typography>
            <Button
              className={classes.createLiquidityButton}
              variant="contained"
              onClick={onCreateLiquidity}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Liquidity
            </Button>
          </div>
          
          <LiquidityPairs />
        </div>
      ) : (
        <Paper className={classes.notConnectedContent}>
          <div className={classes.sphere}></div>
          <div className={classes.contentFloat}>
            <div className={classes.welcomeIcon}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <Typography className={classes.mainHeadingNC} variant='h1'>
              Liquidity Pools
            </Typography>
            <Typography className={classes.mainDescNC} variant='body2'>
              Earn fees and rewards by providing liquidity to trading pairs. Choose between stable pools for correlated assets or volatile pools for uncorrelated pairs.
            </Typography>
            <div className={classes.featuresList}>
              <div className={classes.feature}>
                <div className={classes.featureIcon}>💰</div>
                <span>Earn trading fees</span>
              </div>
              <div className={classes.feature}>
                <div className={classes.featureIcon}>🎯</div>
                <span>Gauge rewards</span>
              </div>
              <div className={classes.feature}>
                <div className={classes.featureIcon}>⚡</div>
                <span>Low slippage</span>
              </div>
            </div>
            <Button
              disableElevation
              className={classes.buttonConnect}
              variant="contained"
              onClick={onAddressClicked}
            >
              <div className={classes.walletIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                </svg>
              </div>
              <Typography>Connect Wallet to Continue</Typography>
            </Button>
          </div>
        </Paper>
      )}
      {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
    </div>
  );
}

export default Liquidity;
