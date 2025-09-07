import {
  Box,
  Typography,
  Container,
  Button,
  styled,
  alpha,
  useTheme
} from '@mui/material';
import Head from 'next/head';
import { motion } from 'framer-motion';

const MainContent = styled(Box) (
  ({ theme }) => `
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(32, 34, 37);
`
);

const ContentWrapper = styled(Box)(
  ({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(6),
    textAlign: 'center',
    maxWidth: 480,
    width: '100%',
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`
  })
);

const StyledButton = styled(Button)(
  ({ theme }) => ({
    padding: '10px 20px',
    fontWeight: 500,
    fontSize: '0.9375rem',
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)'
    }
  })
);

function Status404() {
  const theme = useTheme();
  
  return (
    <>
      <Head>
        <title>Page Not Found - 404 | XRPNFT</title>
        <meta name="description" content="Page not found on XRPNFT - Your Premier XRP NFT Platform" />
      </Head>
      <MainContent>
        <ContentWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '3rem', md: '4rem' }, 
                fontWeight: 700, 
                mb: 2, 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              404
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Oops! Page Not Found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                mb: 4,
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}
            >
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <StyledButton 
                href="/" 
                variant="contained" 
                size="large"
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                Back to Homepage
              </StyledButton>
              <StyledButton 
                href="/collections" 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Browse Collections
              </StyledButton>
            </Box>
          </motion.div>
        </ContentWrapper>
      </MainContent>
    </>
  );
}

export default Status404;
