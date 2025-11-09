import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { Link } from 'react-router-dom';

export default function Header({ onSignInClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
  }, []);

  const menuItems = ["About"];

  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    }
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleAboutClick = () => {
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Scroll to footer
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(to right, rgba(10,25,41,0.95), rgba(13,71,161,0.95))",
        borderBottom: "1px solid rgba(33,150,243,0.2)",
        backdropFilter: "blur(10px)",
        width: "100vw",
        left: 0,
        right: 0,
        overflowX: "hidden",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background:
                "linear-gradient(to bottom right, rgba(33,150,243,0.2), rgba(30,136,229,0.2))",
              mr: 1.5,
            }}
          >
            <TrendingUpIcon sx={{ color: "#64b5f6" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg,#64b5f6,#4dd0e1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TradeShift
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item}
              onClick={handleAboutClick}
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { color: "#64b5f6" },
              }}
            >
              {item}
            </Button>
          ))}

          {/* Sign In button (desktop) */}
          <Button
            component={Link}
            to="/login"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { color: "#64b5f6" },
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleMenu}
          sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            width: 250,
            bgcolor: "rgba(10,25,41,0.95)",
            color: "white",
            backdropFilter: "blur(12px)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              background: "linear-gradient(90deg,#64b5f6,#4dd0e1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            TradeShift
          </Typography>

          <List>
            {menuItems.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={handleAboutClick}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Sign In button (mobile) */}
          <Box mt={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSignInClick}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}