import React, { useState, useEffect, useCallback } from 'react';
import { Paper } from '@material-ui/core';
import ModernLiquidityCreate from '../../../components/ssLiquidityManage/modernLiquidityCreate'

import classes from './liquidity.module.css';

function Pair({ changeTheme }) {

  return (
    <div className={classes.newLiquidityCreateContainer}>
      <Paper elevation={0} className={classes.liquidityCreateContainer}>
        <ModernLiquidityCreate />
      </Paper>
    </div>
  );
}

export default Pair;
