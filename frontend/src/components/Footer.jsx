import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  Container
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        color: 'grey.400',
        borderTop: '1px solid rgba(59,130,246,0.2)',
        mt: 8,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Logo + Description */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(to bottom right, rgba(59,130,246,0.2), rgba(37,99,235,0.2))',
                }}
              >
                <TrendingUpIcon sx={{ color: 'primary.light' }} />
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(to right, #93c5fd, #67e8f9)',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                TradeShift
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ mb: 3, maxWidth: 500, lineHeight: 1.7 }}>
              Enterprise-grade financial portfolio management and trading platform. 
              Track, analyze, and execute trades securely with real-time market data.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <IconButton
                sx={{
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  color: 'primary.light',
                  '&:hover': { backgroundColor: 'rgba(59,130,246,0.2)' }
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  color: 'primary.light',
                  '&:hover': { backgroundColor: 'rgba(59,130,246,0.2)' }
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  color: 'primary.light',
                  '&:hover': { backgroundColor: 'rgba(59,130,246,0.2)' }
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="white" fontWeight="600" gutterBottom>
              Product
            </Typography>
            <Stack spacing={1.5}>
              {['Features', 'Portfolio Management', 'Analytics', 'Pricing', 'Security'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.9rem',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="white" fontWeight="600" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="flex-start">
                <MailOutlineIcon sx={{ color: 'primary.light', mr: 1 }} />
                <Link
                  href="mailto:support@tradeshift.com"
                  underline="none"
                  sx={{ color: 'grey.400', '&:hover': { color: 'primary.light' } }}
                >
                  support@tradeshift.com
                </Link>
              </Stack>
              <Stack direction="row" alignItems="flex-start">
                <PhoneIcon sx={{ color: 'primary.light', mr: 1 }} />
                <Typography sx={{ cursor: 'pointer', '&:hover': { color: 'primary.light' } }}>
                  +1 (555) 123-4567
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="flex-start">
                <LocationOnIcon sx={{ color: 'primary.light', mr: 1 }} />
                <Typography>
                  123 Financial District<br />
                  New York, NY 10004
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Divider sx={{ my: 6, borderColor: 'rgba(59,130,246,0.2)' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} TradeShift. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={4}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <Link
                key={link}
                href="#"
                underline="none"
                sx={{
                  color: 'grey.400',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'primary.light' }
                }}
              >
                {link}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
