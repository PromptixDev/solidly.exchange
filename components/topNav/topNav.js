import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, IconButton } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { WalletConnect } from '../WalletConnect';
import TransactionQueue from '../transactionQueue';
import { ACTIONS } from '../../stores/constants';
import stores from '../../stores';
import classes from './topNav.module.css';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

function TopNav() {
  const router = useRouter();
  const [active, setActive] = useState('swap');
  const [transactionQueueLength, setTransactionQueueLength] = useState(0);

  useEffect(() => {
    const activePath = router.asPath;
    if (activePath.includes('swap')) {
      setActive('swap');
    } else if (activePath.includes('liquidity')) {
      setActive('liquidity');
    } else if (activePath.includes('lock')) {
      setActive('lock');
    } else if (activePath.includes('vote')) {
      setActive('vote');
    }
  }, [router.asPath]);

  const menuItems = [
    {
      title: 'Swap',
      route: 'swap',
      disabled: false,
    },
    {
      title: 'Liquidity',
      route: 'liquidity',
      disabled: false,
    },
    {
      title: 'Lock',
      route: 'lock',
      disabled: true,
      comingSoon: true,
    },
    {
      title: 'Vote',
      route: 'vote',
      disabled: true,
      comingSoon: true,
    }
  ];

  const handleMenuClick = (item) => {
    if (item.disabled) return;
    setActive(item.route);
    router.push('/' + item.route);
  };

  const handleLogoClick = () => {
    router.push('/home');
  };

  const setQueueLength = (length) => {
    setTransactionQueueLength(length);
  };

  return (
    <nav className={classes.topNavContainer}>
      <div className={classes.topNavContent}>
        {/* Logo */}
        <div className={classes.logoSection} onClick={handleLogoClick}>
          <img src="/logo.png" alt="Fuseon" className={classes.logo} />
          <Typography className={classes.brandText}>Fuseon</Typography>
        </div>

        {/* Navigation Menu */}
        <div className={classes.menuSection}>
          {menuItems.map((item) => (
            <div
              key={item.route}
              className={`${classes.menuItem} ${active === item.route ? classes.menuItemActive : ''} ${item.disabled ? classes.menuItemDisabled : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <Typography className={classes.menuText}>{item.title}</Typography>
              {item.comingSoon && (
                <span className={classes.comingSoonBadge}>Soon</span>
              )}
            </div>
          ))}
        </div>

        {/* Real Connect Button */}
        <div className={classes.connectSection}>
          {transactionQueueLength > 0 && (
            <IconButton
              className={classes.transactionButton}
              variant="contained"
              onClick={() => {
                stores.emitter.emit(ACTIONS.TX_OPEN);
              }}
            >
              <StyledBadge badgeContent={transactionQueueLength} color="secondary" overlap="circular">
                <ListIcon className={classes.iconColor} />
              </StyledBadge>
            </IconButton>
          )}
          <WalletConnect />
        </div>
      </div>
      <TransactionQueue setQueueLength={setQueueLength} />
    </nav>
  );
}

export default TopNav;