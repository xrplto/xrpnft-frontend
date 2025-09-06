import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Link, Stack, Typography, IconButton, Tooltip, Button } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Icons
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Custom components
import Logo from './Logo';

const FooterWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: theme.spacing(1.5, 0),
    paddingBottom: theme.spacing(8),
    marginTop: 'auto'
}));

const GradientXRP = styled('span')(({ theme }) => ({
  background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginRight: '4px',
  fontSize: '1rem',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
}));

const FloatingFooterWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  boxShadow: `0 -2px 10px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  padding: theme.spacing(0.75, 0),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        color: theme.palette.primary.main,
    },
}));

const ChatButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.25, 0.75),
  fontSize: '0.75rem',
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const FloatingFooter = () => {
  const [xrpPrice, setXrpPrice] = useState(null);
  const [tps, setTps] = useState(null);

  useEffect(() => {
    const fetchXrpPrice = async () => {
      try {
        const response = await fetch('https://api.xrpl.to/api/tokens?start=0&limit=0&sortBy=vol24hxrp&sortType=desc&filter=');
        const data = await response.json();
        if (data.result === 'success' && data.exch && data.exch.USD) {
          setXrpPrice(1 / data.exch.USD);
        }
      } catch (error) {
        console.error('Error fetching XRP price:', error);
      }
    };

    const fetchTPS = async () => {
      try {
        const response = await fetch('https://api.xrpscan.com/api/v1/ledgers');
        const data = await response.json();
        if (data.ledgers && data.ledgers.length > 0) {
          const latestLedger = data.ledgers[0];
          const txCount = latestLedger.tx_count;
          
          const calculatedTPS = txCount / 4;
          setTps(calculatedTPS.toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching TPS:', error);
      }
    };

    fetchXrpPrice();
    fetchTPS();
    const interval = setInterval(() => {
      fetchXrpPrice();
      fetchTPS();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleChatClick = () => {
    console.log('Chat button clicked');
  };

  return (
    <FloatingFooterWrapper>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          justifyContent="flex-end"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {xrpPrice && (
              <Tooltip title="XRP Price">
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <GradientXRP>✕</GradientXRP>
                  {xrpPrice.toFixed(2)} USD
                </Typography>
              </Tooltip>
            )}
            {tps && (
              <Tooltip title="Transactions Per Second">
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  TPS: {tps}
                </Typography>
              </Tooltip>
            )}
            <ChatButton
              variant="contained"
              onClick={handleChatClick}
            >
              Chat
            </ChatButton>
          </Stack>
        </Stack>
      </Box>
    </FloatingFooterWrapper>
  );
};

export default function Footer() {
    const { darkMode } = useContext(AppContext);
    const theme = useTheme();

    return (
        <>
            <FooterWrapper>
                <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={{ xs: 3, sm: 4 }}
                        alignItems={{ xs: 'center', sm: 'flex-start' }}
                        justifyContent="space-between"
                    >
                        {/* Brand Section */}
                        <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                            <Logo />
                            <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', sm: 'left' }} sx={{ maxWidth: 300, lineHeight: 1.5 }}>
                                A non-broker NFT marketplace where users trade directly with each other across all marketplaces on the XRP Ledger.
                            </Typography>
                        </Stack>
                        
                        {/* Navigation Links */}
                        <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                    Navigate
                                </Typography>
                                <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                    <StyledLink href="/explore" underline="hover">
                                        <Typography variant="body2">Explore NFTs</Typography>
                                    </StyledLink>
                                    <StyledLink href="/collections" underline="hover">
                                        <Typography variant="body2">Collections</Typography>
                                    </StyledLink>
                                    <StyledLink href="/create" underline="hover">
                                        <Typography variant="body2">Create NFT</Typography>
                                    </StyledLink>
                                </Stack>
                            </Box>

                        {/* Social Links */}
                        <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                    Connect
                                </Typography>
                                <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                    <StyledLink href="https://twitter.com/XRPNFTdotcom/" target="_blank" underline="hover">
                                        <Typography variant="body2">Twitter</Typography>
                                    </StyledLink>
                                    <StyledLink href="https://www.instagram.com/xrpnftdotcom" target="_blank" underline="hover">
                                        <Typography variant="body2">Instagram</Typography>
                                    </StyledLink>
                                    <StyledLink href="https://xrpnft.com/discord" target="_blank" underline="hover">
                                        <Typography variant="body2">Discord</Typography>
                                    </StyledLink>
                                </Stack>
                            </Box>

                        {/* Legal Links */}
                        <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                    Legal
                                </Typography>
                                <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                                    <StyledLink href="/terms" underline="hover">
                                        <Typography variant="body2">Terms of Service</Typography>
                                    </StyledLink>
                                    <StyledLink href="/privacy" underline="hover">
                                        <Typography variant="body2">Privacy Policy</Typography>
                                    </StyledLink>
                                </Stack>
                        </Box>
                    </Stack>
                </Box>
            </FooterWrapper>
            <FloatingFooter />
        </>
    );
}
