import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Paper, Button, Tooltip, SvgIcon } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';

import SSWarning from '../ssWarning';
import stores from '../../stores';
import classes from './sidebar.module.css';

// Icônes personnalisées
function SwapIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
    </SvgIcon>
  );
}

function LiquidityIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
    </SvgIcon>
  );
}

function LockIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
    </SvgIcon>
  );
}

function VoteIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18,13H13V18H11V13H6V11H11V6H13V11H18V13Z"/>
    </SvgIcon>
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
    },
    {
      title: 'Vote',
      route: 'vote',
      icon: <VoteIcon />,
    },
    {
      title: 'Rewards',
      route: 'rewards',
      icon: <RewardsIcon />,
    },
    {
      title: 'Whitelist',
      route: 'whitelist',
      icon: <WhitelistIcon />,
    },
  ];

  const handleMenuClick = (route) => {
    setActive(route);
    handleNavigate('/' + route);
  };

  return (
    <div className={classes.sidebarContainer}>
      {/* Header avec logo */}
      <div className={classes.sidebarHeader}>
        <div className={classes.logoContainer} onClick={() => router.push('/home')}>
          <SiteLogo className={classes.logo} />
          <Typography className={classes.brandText}>Fuseon</Typography>
        </div>
      </div>

      {/* Menu principal */}
      <div className={classes.menuSection}>
        <Typography className={classes.sectionTitle}>Navigation</Typography>
        <div className={classes.menuItems}>
          {menuItems.map((item) => (
            <div
              key={item.route}
              className={`${classes.menuItem} ${active === item.route ? classes.menuItemActive : ''}`}
              onClick={() => handleMenuClick(item.route)}
            >
              <div className={classes.menuIcon}>
                {item.icon}
              </div>
              <Typography className={classes.menuText}>{item.title}</Typography>
            </div>
          ))}
        </div>
      </div>

      

      {/* Footer avec icônes */}
      <div className={classes.sidebarFooter}>
        <div className={classes.footerIcons}>
          <div className={classes.footerIcon}>⚙️</div>
          <div className={classes.footerIcon}>🔗</div>
          <div className={classes.footerIcon}>📊</div>
          <div className={classes.footerIcon}>⚙️</div>
        </div>
      </div>

      {warningOpen && <SSWarning close={closeWarning} />}
    </div>
  );
}

export default withTheme(Sidebar);
