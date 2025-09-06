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

  const stats = [
    { label: "Total Value Locked", value: "$2.4B+", description: "Across all pools" },
    { label: "24h Trading Volume", value: "$45M+", description: "Daily volume" },
    { label: "Active Users", value: "12K+", description: "Monthly active" }
  ];

  const features = [
    {
      title: "Ultra-Low Fees",
      subtitle: "Optimized for efficiency",
      description: "Experience near-zero slippage with our advanced AMM algorithms and concentrated liquidity pools on Plasma Network.",
      icon: "⚡"
    },
    {
      title: "Yield Farming",
      subtitle: "Maximize your returns",
      description: "Earn competitive yields through our sophisticated liquidity mining programs and staking mechanisms.",
      icon: "🚀"
    },
    {
      title: "Cross-Chain Bridge",
      subtitle: "Seamless interoperability",
      description: "Bridge assets effortlessly between Plasma and other major networks with institutional-grade security.",
      icon: "🌐"
    },
    {
      title: "Governance & DAO",
      subtitle: "Community-driven protocol",
      description: "Participate in protocol governance and shape the future of DeFi through our decentralized voting system.",
      icon: "🏛️"
    }
  ];

  const partnerships = [
    { name: "Plasma Network", logo: "/images/icon_plasma.png" },
    { name: "Partner 2", logo: "/logo.png" },
    { name: "Partner 3", logo: "/logo.png" }
  ];

  return (
    <div className={classes.landingContainer}>
      {/* Hero Section */}
      <section className={classes.heroSection}>
        <div className={classes.heroBackground}>
          <div className={classes.gradientOrb}></div>
          <div className={classes.gradientOrb2}></div>
        </div>
        <div className={classes.heroContent}>
          <div className={classes.logoContainer}>
            <img 
              src="/logo.png" 
              alt="Fuseon Logo" 
              className={classes.heroLogo}
            />
          </div>
          
          <Typography variant="h1" className={classes.heroTitle}>
            Fuseon Protocol
          </Typography>
          
          <div className={classes.subtitleContainer}>
            <Typography variant="h2" className={classes.heroSubtitle}>
              The central liquidity hub on
            </Typography>
            <div className={classes.plasmaContainer}>
              <img 
                src="/images/icon_plasma.png" 
                alt="Plasma" 
                className={classes.plasmaIcon}
              />
              <Typography variant="h2" className={classes.plasmaText}>
                Plasma Network
              </Typography>
            </div>
          </div>

          {/* Stats */}
          <div className={classes.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className={classes.statItem}>
                <div className={classes.statValue}>{stat.value}</div>
                <div className={classes.statLabel}>{stat.label}</div>
                <div className={classes.statDescription}>{stat.description}</div>
              </div>
            ))}
          </div>
          
          <div className={classes.heroButtons}>
            <Button 
              className={classes.primaryButton}
              onClick={() => router.push('/swap')}
            >
              Enter App
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
          <div className={classes.sectionHeader}>
            <Typography variant="h6" className={classes.sectionSubtitle}>
              PROTOCOL FEATURES
            </Typography>
            <Typography variant="h2" className={classes.sectionTitle}>
              Built for Institutional DeFi
            </Typography>
            <Typography variant="body1" className={classes.sectionDescription}>
              Advanced features designed for sophisticated trading strategies and optimal capital efficiency
            </Typography>
          </div>
          
          <Grid container spacing={4} className={classes.featuresGrid}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <div className={classes.featureCard}>
                  <div className={classes.featureHeader}>
                    <div className={classes.featureIcon}>{feature.icon}</div>
                    <div className={classes.featureNumber}>0{index + 1}</div>
                  </div>
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

      {/* Partners Section */}
      <section className={classes.partnersSection}>
        <div className={classes.sectionContainer}>
          <Typography variant="h6" className={classes.partnersTitle}>
            TRUSTED BY LEADING PROTOCOLS
          </Typography>
          <div className={classes.partnersGrid}>
            {partnerships.map((partner, index) => (
              <div key={index} className={classes.partnerItem}>
                <img src={partner.logo} alt={partner.name} className={classes.partnerLogo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={classes.ctaSection}>
        <div className={classes.ctaContainer}>
          <div className={classes.ctaContent}>
            <Typography variant="h6" className={classes.ctaSubtitle}>
              START TRADING
            </Typography>
            <Typography variant="h2" className={classes.ctaTitle}>
              Ready to Experience Next-Gen DeFi?
            </Typography>
            <Typography variant="body1" className={classes.ctaDescription}>
              Join institutional traders and DeFi natives leveraging Fuseon's advanced infrastructure
            </Typography>
            <div className={classes.ctaButtons}>
              <Button 
                className={classes.ctaButton}
                onClick={() => router.push('/swap')}
              >
                Launch dApp
              </Button>
              <Button 
                className={classes.ctaSecondaryButton}
                onClick={() => window.open('https://docs.fuseon.io', '_blank')}
              >
                Read Docs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerTop}>
            <div className={classes.footerBrand}>
              <div className={classes.footerLogo}>
                <img src="/logo.png" alt="Fuseon" className={classes.footerLogoImg} />
                <span className={classes.footerLogoText}>Fuseon Protocol</span>
              </div>
              <Typography variant="body2" className={classes.footerDescription}>
                The central liquidity hub on Plasma Network
              </Typography>
            </div>
            
            <div className={classes.footerSection}>
              <Typography variant="h6" className={classes.footerSectionTitle}>Protocol</Typography>
              <div className={classes.footerLinks}>
                <a href="/swap" className={classes.footerLink}>Swap</a>
                <a href="/liquidity" className={classes.footerLink}>Liquidity</a>
                <a href="#" className={classes.footerLink}>Analytics</a>
                <a href="#" className={classes.footerLink}>Governance</a>
              </div>
            </div>
            
            <div className={classes.footerSection}>
              <Typography variant="h6" className={classes.footerSectionTitle}>Resources</Typography>
              <div className={classes.footerLinks}>
                <a href="#" className={classes.footerLink}>Documentation</a>
                <a href="#" className={classes.footerLink}>Security</a>
                <a href="#" className={classes.footerLink}>Bug Bounty</a>
                <a href="#" className={classes.footerLink}>Brand Assets</a>
              </div>
            </div>
            
            <div className={classes.footerSection}>
              <Typography variant="h6" className={classes.footerSectionTitle}>Community</Typography>
              <div className={classes.footerSocial}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                  <img src="/images/twitter.png" alt="Twitter" />
                  <span>Twitter</span>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                  <img src="/images/discord.png" alt="Discord" />
                  <span>Discord</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                  <img src="/images/github.png" alt="GitHub" />
                  <span>GitHub</span>
                </a>
                <a href="/docs" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                  <img src="/images/docs.png" alt="Docs" />
                  <span>Docs</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className={classes.footerBottom}>
            <div className={classes.footerBottomLeft}>
              <Typography variant="body2" className={classes.footerText}>
                © 2024 Fuseon Protocol. All rights reserved.
              </Typography>
            </div>
            <div className={classes.footerBottomRight}>
              <Typography variant="body2" className={classes.footerText}>
                Built on Plasma Network • Secured by smart contracts
              </Typography>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;