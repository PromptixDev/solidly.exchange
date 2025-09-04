import { Typography, Button, Paper, SvgIcon, Grid, Avatar } from "@material-ui/core";

import { useScrollTo } from 'react-use-window-scroll';

import classes from './home.module.css';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


function Home({ changeTheme }) {

  function handleNavigate(route) {
    router.push(route);
  }

  const router = useRouter();

  const scrollTo = useScrollTo();

  return (
    <div className={classes.ffContainer}>

      <div className={classes.contentContainerFull}>


        <Grid container spacing={2} className={classes.homeContentMain}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h1" className={classes.preTitle}>Central Liquidity Hub</Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h1" className={classes.mainTitle}>Advanced Liquidity Management on Plasma</Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button className={classes.buttonInfo} onClick={() => scrollTo({ top: 1000, left: 0, behavior: 'smooth' })}>Learn More</Button>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button className={classes.buttonEnter} onClick={() => router.push('/swap')}>Enter App</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div id="info" className={classes.contentContainerFullTwo}>

        <div className={classes.floatingSphere}></div>

        <Grid container spacing={3} className={classes.homeContentMain}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h1" className={classes.secTitle}>Welcome to Fuseon</Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="body1" className={classes.mainDescription}>
              Fuseon is the central liquidity hub on Plasma Network, designed to optimize capital efficiency and provide seamless trading experiences. Built for the next generation of DeFi, Fuseon aggregates and manages liquidity across multiple protocols while offering low fees, minimal slippage, and advanced yield optimization strategies.
            </Typography>
            <Typography variant="body2" className={classes.secDescription}>
              Our innovative approach to liquidity management allows users to maximize their returns through intelligent routing, automated market making, and sophisticated liquidity provision strategies. Whether you're trading stablecoins, volatile assets, or providing liquidity, Fuseon serves as your gateway to efficient capital utilization on Plasma.
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Button className={classes.buttonEnterSingle} onClick={() => router.push('/swap')}>Enter App</Button>
          </Grid>
        </Grid>
      </div>

      <div className={classes.contentContainerFull}>
        <Grid container spacing={3} className={classes.homeContentMain}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="h2" className={classes.secTitle}>Why Choose Fuseon Hub?</Typography>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Paper className={classes.featureCard}>
              <Typography variant="h3" className={classes.featureTitle}>Liquidity Aggregation</Typography>
              <Typography variant="body1" className={classes.featureDescription}>
                Access deep liquidity pools across multiple protocols through a single interface, ensuring optimal pricing and minimal slippage.
              </Typography>
            </Paper>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Paper className={classes.featureCard}>
              <Typography variant="h3" className={classes.featureTitle}>Smart Routing</Typography>
              <Typography variant="body1" className={classes.featureDescription}>
                Our intelligent routing system automatically finds the best execution paths to maximize your returns and minimize costs.
              </Typography>
            </Paper>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Paper className={classes.featureCard}>
              <Typography variant="h3" className={classes.featureTitle}>Yield Optimization</Typography>
              <Typography variant="body1" className={classes.featureDescription}>
                Automated strategies that optimize your capital allocation to generate maximum returns while managing risk effectively.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>

    </div>
  );
}

export default Home;
