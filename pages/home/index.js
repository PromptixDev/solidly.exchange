import { Typography, Grid, Paper, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import classes from './home.module.css';

function Home({ changeTheme }) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  // Suppression de la section stats

  const features = [
    {
      title: "Low-Cost Trading",
      subtitle: "Trade with minimal fees",
      description: "Experience the lowest trading fees on Plasma Network with optimized routing and deep liquidity pools.",
      icon: "⚡"
    },
    {
      title: "Provide Liquidity",
      subtitle: "Earn rewards as a liquidity provider",
      description: "Supply liquidity to earn trading fees and FUSEON rewards. Multiple pools and farming opportunities available.",
      icon: "🌊"
    },
    {
      title: "Advanced Features",
      subtitle: "Professional trading tools",
      description: "Access advanced trading features including limit orders, portfolio management, and yield optimization strategies.",
      icon: "🛠️"
    }
  ];

  return (
    <div className={classes.landingContainer}>
      {/* Hero Section */}
      <section className={classes.heroSection}>
        <div className={classes.heroContent}>
          <div className={classes.logoContainer}>
            <img 
              src="/logo.png" 
              alt="Fuseon Logo" 
              className={classes.heroLogo}
            />
          </div>
          
          <Typography variant="h1" className={classes.heroTitle}>
            Fuseon
          </Typography>
          
          <div className={classes.subtitleContainer}>
            <Typography variant="h2" className={classes.heroSubtitle}>
              The Central Liquidity Hub on 
            </Typography>
            <img 
              src="/images/icon_plasma.png" 
              alt="Plasma" 
              className={classes.plasmaIcon}
            />
            <Typography variant="h2" className={classes.plasmaText}>
              Plasma
            </Typography>
          </div>
          
          <Typography variant="body1" className={classes.heroDescription}>
            Experience next-generation DeFi with optimal capital efficiency,
            <br />minimal slippage, and maximum returns.
          </Typography>
          
          <div className={classes.heroButtons}>
            <Button 
              className={classes.primaryButton}
              onClick={() => router.push('/swap')}
            >
              Launch App
            </Button>
            <Button 
              className={classes.secondaryButton}
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className={classes.featuresSection}>
        <div className={classes.sectionContainer}>
          <Typography variant="h2" className={classes.sectionTitle}>
            Built for the future of DeFi
          </Typography>
          
          <Grid container spacing={6} className={classes.featuresGrid}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>{feature.icon}</div>
                  <Typography variant="h3" className={classes.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="h4" className={classes.featureSubtitle}>
                    {feature.subtitle}
                  </Typography>
                  <Typography variant="body1" className={classes.featureDescription}>
                    {feature.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* CTA Section */}
      <section className={classes.ctaSection}>
        <div className={classes.ctaContainer}>
          <Typography variant="h2" className={classes.ctaTitle}>
            Ready to get started?
          </Typography>
          <Typography variant="body1" className={classes.ctaDescription}>
            Join thousands of users trading and earning on Fuseon
          </Typography>
          <Button 
            className={classes.ctaButton}
            onClick={() => router.push('/swap')}
          >
            Launch App
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <Typography variant="body2" className={classes.footerText}>
            Built on Plasma Network • Secured by smart contracts
          </Typography>
        </div>
      </footer>
    </div>
  );
}

export default Home;