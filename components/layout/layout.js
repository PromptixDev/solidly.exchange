import Head from "next/head";
import { useRouter } from "next/router";
import classes from "./layout.module.css";
import TopNav from "../topNav/topNav";
import SnackbarController from "../snackbar";

// Footer Component
function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerContent}>
        <div className={classes.footerTop}>
          <div className={classes.footerBrand}>
            <div className={classes.footerLogo}>
              <img src="/logo.png" alt="Fuseon" className={classes.footerLogoImg} />
              <span className={classes.footerLogoText}>Fuseon Protocol</span>
            </div>
            <p className={classes.footerDescription}>
              The central liquidity hub on Plasma Network
            </p>
          </div>
          
          <div className={classes.footerSection}>
            <h6 className={classes.footerSectionTitle}>Resources</h6>
            <div className={classes.footerLinks}>
              <a href="#" className={classes.footerLink}>Documentation</a>
              <a href="#" className={classes.footerLink}>Brand Assets</a>
            </div>
          </div>
          
          <div className={classes.footerSection}>
            <h6 className={classes.footerSectionTitle}>Community</h6>
            <div className={classes.footerSocial}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <img src="/images/twitter.png" alt="Twitter" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <img src="/images/discord.png" alt="Discord" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <img src="/images/github.png" alt="GitHub" />
              </a>
            </div>
          </div>
        </div>
        
        <div className={classes.footerBottom}>
          <div className={classes.footerBottomLeft}>
            <p className={classes.footerText}>
              © 2024 Fuseon Protocol. All rights reserved.
            </p>
          </div>
          <div className={classes.footerBottomRight}>
            <p className={classes.footerText}>
              Legal • Disclaimer • Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({
  children,
  configure,
  backClicked,
  changeTheme,
  title
}) {
  const router = useRouter();
  const isHomePage = router.pathname === '/home';
  
  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Bold.ttf"
          as="font"
          crossOrigin=""
        />
        <meta name="description" content="Fuseon - The Central Liquidity Hub on Plasma. Low cost, near 0 slippage trades with advanced liquidity management." />
        <meta name="og:title" content="Fuseon - The Central Liquidity Hub" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      {/* Top Navigation - cachée sur la page d'accueil */}
      {!configure && !isHomePage && <TopNav />}
      
      <div className={classes.content}>
        {!isHomePage && <SnackbarController />}
        <main className={isHomePage ? classes.homeContent : classes.mainContent}>
          {children}
        </main>
        {/* Footer - visible sur toutes les pages */}
        {!configure && <Footer />}
      </div>
    </div>
  );
}
