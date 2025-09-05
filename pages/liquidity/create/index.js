import React, { useState, useEffect, useCallback } from 'react';
import ModernLiquidityCreate from '../../../components/ssLiquidityManage/modernLiquidityCreate'

import classes from './liquidity.module.css';

function Pair({ changeTheme }) {

  return (
    <div className={classes.container}>
      <ModernLiquidityCreate />
    </div>
  );
}

export default Pair;
