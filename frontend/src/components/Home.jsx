import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Lock,
  BarChart,
  TrendingUp,
  Bolt,
  Public,
  Group,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import Header from "./Header";
import Footer from "./Footer";

// ✅ Features data
const features = [
  {
    icon: <Lock color="primary" />,
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with role-based access control and JWT/OAuth2 integration.",
  },
  {
    icon: <BarChart color="primary" />,
    title: "Portfolio Management",
    description:
      "Track assets, calculate real-time values, and analyze performance metrics in one dashboard.",
  },
  {
    icon: <Public color="primary" />,
    title: "Third-Party Integration",
    description:
      "Securely connect to multiple brokerage accounts and aggregate holdings seamlessly.",
  },
  {
    icon: <Bolt color="primary" />,
    title: "Real-Time Trading",
    description:
      "Execute buy/sell orders with real-time market data and complete transaction history.",
  },
  {
    icon: <TrendingUp color="primary" />,
    title: "Market Analytics",
    description:
      "Advanced charting tools and historical data analysis for informed decisions.",
  },
  {
    icon: <Group color="primary" />,
    title: "Collaborative Tools",
    description:
      "Share insights and annotate portfolio documents with team members.",
  },
];

// ✅ Stats data
const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "2.5B+", label: "Assets Managed" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];

export default function Home() {
  const handleSignInClick = () => {
    // This will be handled by the parent component or navigation
    console.log("Sign in clicked");
  };

  const handleWatchDemo = () => {
    // Open YouTube video in a new tab
    window.open("https://youtu.be/DRAcPbYPNVk?si=Pr3DLsZ5vwWesFqN", "_blank", "noopener,noreferrer");
  };

  const handleStartTrial = () => {
    // You can add navigation to signup or trial page here
    console.log("Start free trial clicked");
    // Example: navigate('/signup');
  };

  const handleGetStarted = () => {
    // You can add navigation to signup page here
    console.log("Get started today clicked");
    // Example: navigate('/signup');
  };

  return (
    <Box sx={{ bgcolor: "#0a1929", color: "white", overflow: "hidden" }}>
      {/* Header Component */}
      <Header onSignInClick={handleSignInClick} />

      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          background: "linear-gradient(to bottom right, #0a1929, #001e3c)",
          py: { xs: 10, md: 14 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="body2"
            sx={{
              bgcolor: "rgba(25,118,210,0.1)",
              border: "1px solid rgba(25,118,210,0.3)",
              color: "primary.light",
              borderRadius: 5,
              px: 3,
              py: 1,
              display: "inline-block",
              mb: 3,
            }}
          >
            Next Generation Financial Platform
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(90deg,#42a5f5,#81d4fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Master Your Financial Portfolio with Confidence
          </Typography>

          <Typography
            variant="h6"
            color="grey.400"
            sx={{ maxWidth: 720, mx: "auto", mb: 5 }}
          >
            TradeShift is the enterprise-grade platform trusted by professional
            investors. Connect your brokerage accounts, get real-time portfolio
            insights, and execute trades securely.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleStartTrial}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg,#1976d2,#2196f3)",
                "&:hover": {
                  background: "linear-gradient(90deg,#1565c0,#1976d2)",
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              onClick={handleWatchDemo}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { 
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Watch Demo
            </Button>
          </Box>

          {/* Stats Row */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 8, textAlign: "center" }}
          >
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography variant="h4" color="primary.light" fontWeight={700}>
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="grey.400">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= DASHBOARD IMAGE ================= */}
      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(33,150,243,0.3)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop"
            alt="Dashboard Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
      </Container>

      {/* ================= FEATURES SECTION ================= */}
      <Box
        sx={{
          bgcolor: "#0d1117",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            mb={2}
            sx={{
              background: "linear-gradient(90deg,#42a5f5,#81d4fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Powerful Features Built for Success
          </Typography>

          <Typography
            variant="h6"
            align="center"
            color="grey.400"
            mb={8}
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Everything you need to manage your investments professionally
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textAlign: "center",
                    p: 4,
                    bgcolor: "rgba(255,255,255,0.03)",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "primary.main",
                      boxShadow: "0 8px 30px rgba(33,150,243,0.25)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 56,
                      height: 56,
                      mb: 2.5,
                    }}
                  >
                    {feature.icon}
                  </Avatar>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ color: "white" }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="grey.400"
                    sx={{
                      lineHeight: 1.6,
                      maxWidth: 280,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= WHY CHOOSE US ================= */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Grid
          container
          spacing={8}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} mb={3}>
              Why Choose TradeShift?
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
              {[
                "Bank-level encryption and security protocols",
                "Real-time portfolio tracking across all accounts",
                "Institutional-grade analytics and reporting",
                "Seamless integration with major brokerages",
                "Dedicated 24/7 customer support",
                "Fully compliant with financial regulations",
              ].map((item, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    display: "flex",
                    mb: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <CheckCircle sx={{ color: "primary.main", mr: 2, mt: "4px" }} />
                  <Typography variant="body1" color="grey.300">
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 0 40px rgba(33,150,243,0.4)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop"
                alt="Security Feature"
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ================= CTA SECTION ================= */}
      <Box
        sx={{
          background: "linear-gradient(90deg,#1976d2,#0d47a1)",
          py: { xs: 8, md: 10 },
          textAlign: "center",
          borderRadius: "40px 40px 0 0",
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={700} mb={2}>
            Ready to Transform Your Trading?
          </Typography>
          <Typography
            variant="h6"
            color="rgba(255,255,255,0.8)"
            mb={4}
            maxWidth="600px"
            mx="auto"
          >
            Join thousands of investors already using TradeShift to manage their
            portfolios professionally.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              "&:hover": { 
                bgcolor: "#f5f5f5",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}