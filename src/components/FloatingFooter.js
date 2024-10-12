import React, { useState, useEffect } from 'react';
import { Box, Link, Stack, IconButton, Tooltip, Container, Typography, Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// Icons
import ExploreIcon from '@mui/icons-material/Explore';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import ChatIcon from '@mui/icons-material/Chat';

const GradientXRP = styled('span')(({ theme }) => ({
  background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginRight: '4px',
  fontSize: '1rem', // Increased from 0.875rem to 1rem
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
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: `0 -4px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  padding: theme.spacing(1, 0),
}));

const ChatButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5, 1),
  marginLeft: theme.spacing(1),
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
          
          // Calculate TPS based on 4-second ledger close time
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
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleChatClick = () => {
    // Implement chat functionality here
    console.log('Chat button clicked');
  };

  return (
    <FloatingFooterWrapper>
      <Container maxWidth="lg">
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title="Explore">
              <Link href="/explore" component={IconButton} color="inherit">
                <ExploreIcon fontSize="small" />
              </Link>
            </Tooltip>
            <Tooltip title="Collections">
              <Link href="/collections" component={IconButton} color="inherit">
                <CollectionsIcon fontSize="small" />
              </Link>
            </Tooltip>
            <Tooltip title="Create">
              <Link href="/create" component={IconButton} color="inherit">
                <AddCircleOutlineIcon fontSize="small" />
              </Link>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
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
                  <SpeedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {tps} TPS
                </Typography>
              </Tooltip>
            )}
            <ChatButton
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={handleChatClick}
            >
              Chat
            </ChatButton>
          </Stack>
        </Stack>
      </Container>
    </FloatingFooterWrapper>
  );
};

export default FloatingFooter;
