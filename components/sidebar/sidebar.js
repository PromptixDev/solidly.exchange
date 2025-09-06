import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Paper, Button, Tooltip, SvgIcon } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import SSWarning from '../ssWarning';
import stores from '../../stores';
import classes from './sidebar.module.css';

// Icônes personnalisées avec images
function SwapIcon(props) {
  return (
    <img src="/images/swap.png" alt="Swap" style={{ width: '24px', height: '24px' }} />
  );
}

function LiquidityIcon(props) {
  return (
    <img src="/images/liquidity.png" alt="Liquidity" style={{ width: '24px', height: '24px' }} />
  );
}

function LockIcon(props) {
  return (
    <img src="/images/lock.png" alt="Lock" style={{ width: '24px', height: '24px' }} />
  );
}

function VoteIcon(props) {
  return (
    <img src="/images/vote.png" alt="Vote" style={{ width: '24px', height: '24px' }} />
  );
}

function RewardsIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M5,16L3,5H1V3H4L6,14H18.5L19.5,12H21.47L19.72,16H5ZM7,18A2,2 0 0,0 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20A2,2 0 0,0 7,18ZM17,18A2,2 0 0,0 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20A2,2 0 0,0 17,18Z"/>
    </SvgIcon>
  );
}

function WhitelistIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </SvgIcon>
  );
}

function SiteLogo(props) {
  const { className } = props;
  return (
    <img src="/logo.svg" alt="Fuseon" className={className} style={{ height: '32px', width: 'auto' }} />
  );
}

function Sidebar(props) {
  const router = useRouter();
  const [active, setActive] = useState('swap');
  const [warningOpen, setWarningOpen] = useState(false);

  function handleNavigate(route) {
    router.push(route);
  }

  useEffect(function () {
    const localStorageWarningAccepted = window.localStorage.getItem('fixed.forex-warning-accepted');
    setWarningOpen(localStorageWarningAccepted ? localStorageWarningAccepted !== 'accepted' : true);
  }, []);

  const closeWarning = () => {
    window.localStorage.setItem('fixed.forex-warning-accepted', 'accepted');
    setWarningOpen(false);
  };

  useEffect(() => {
    const activePath = router.asPath;
    if (activePath.includes('swap')) {
      setActive('swap');
    }
    if (activePath.includes('liquidity')) {
      setActive('liquidity');
    }
    if (activePath.includes('lock')) {
      setActive('lock');
    }
    if (activePath.includes('vote')) {
      setActive('vote');
    }
    if (activePath.includes('bribe')) {
      setActive('bribe');
    }
    if (activePath.includes('rewards')) {
      setActive('rewards');
    }
    if (activePath.includes('dashboard')) {
      setActive('dashboard');
    }
    if (activePath.includes('whitelist')) {
      setActive('whitelist');
    }
  }, [router.asPath]);

  const menuItems = [
    {
      title: 'Swap',
      route: 'swap',
      icon: <SwapIcon />,
    },
    {
      title: 'Liquidity',
      route: 'liquidity',
      icon: <LiquidityIcon />,
    },
    {
      title: 'Lock',
      route: 'lock',
      icon: <LockIcon />,
      disabled: true,
      comingSoon: true,
    },
    {
      title: 'Vote',
      route: 'vote',
      icon: <VoteIcon />,
      disabled: true,
      comingSoon: true,
    },
  ];

  const handleMenuClick = (item) => {
    if (item.disabled) return;
    setActive(item.route);
    handleNavigate('/' + item.route);
  };

  return (
    <div className={classes.sidebarContainer}>
      {/* Header avec logo */}
      <div className={classes.sidebarHeader}>
        <div className={classes.logoContainer} onClick={() => router.push('/home')}>
          <SiteLogo className={classes.logo} />
          
        </div>
      </div>

      {/* Menu principal */}
      <div className={classes.menuSection}>
        <Typography className={classes.sectionTitle}>Navigation</Typography>
        <div className={classes.menuItems}>
          {menuItems.map((item) => (
            <div
              key={item.route}
              className={`${classes.menuItem} ${active === item.route ? classes.menuItemActive : ''} ${item.disabled ? classes.menuItemDisabled : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <div className={classes.menuIcon}>
                {item.icon}
              </div>
              <div className={classes.menuTextContainer}>
                <Typography className={classes.menuText}>{item.title}</Typography>
                {item.comingSoon && (
                  <Typography className={classes.comingSoonText}>Coming Soon</Typography>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Footer avec liens sociaux */}
      <div className={classes.sidebarFooter}>
        <div className={classes.footerIcons}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={classes.footerIcon}>
            <img src="/images/twitter.png" alt="Twitter" style={{ width: '20px', height: '20px' }} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={classes.footerIcon}>
            <img src="/images/discord.png" alt="Discord" style={{ width: '20px', height: '20px' }} />
          </a>
          <a href="/docs" target="_blank" rel="noopener noreferrer" className={classes.footerIcon}>
            <img src="/images/docs.png" alt="Docs" style={{ width: '20px', height: '20px' }} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={classes.footerIcon}>
            <img src="/images/github.png" alt="GitHub" style={{ width: '20px', height: '20px' }} />
          </a>
        </div>
      </div>

      {warningOpen && <SSWarning close={closeWarning} />}
    </div>
  );
}

export default withTheme(Sidebar);
