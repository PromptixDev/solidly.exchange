import Head from "next/head";
import { useRouter } from "next/router";
import classes from "./layout.module.css";
import Header from "../header";
import Navigation from "../navigation";
import Sidebar from "../sidebar";
import SnackbarController from "../snackbar";

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
      
      {/* Nouvelle sidebar - cachée sur la page d'accueil */}
      {!configure && !isHomePage && <Sidebar changeTheme={changeTheme} />}
      
      <div className={`${classes.content} ${!configure && !isHomePage ? classes.contentWithSidebar : ''}`}>
        {!configure && !isHomePage && (
          <Header backClicked={backClicked} changeTheme={changeTheme} title={ title } />
        )}
        {!isHomePage && <SnackbarController />}
        <main className={isHomePage ? classes.homeContent : classes.mainContent}>{children}</main>
      </div>
    </div>
  );
}
