import {
  Box,
  Typography,
  Container,
  Button,
  styled
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
    background: linear-gradient(135deg, ${theme.colors.primary.lighter} 0%, ${theme.colors.primary.light} 100%);
`
);

const ContentWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    border-radius: ${theme.general.borderRadiusXl};
    padding: ${theme.spacing(6)};
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 480px;
    width: 100%;
`
);

const StyledButton = styled(Button)(
  ({ theme }) => `
    background: linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%);
    color: ${theme.colors.alpha.white[100]};
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`
);

function Status404() {
  return (
    <>
      <Head>
        <title>Page Not Found - 404 | YourStartup</title>
      </Head>
      <MainContent>
        <ContentWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
              404
            </Typography>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'medium' }}>
              Oops! Page Not Found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </Typography>
            <StyledButton 
              href="/" 
              variant="contained" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '0.9rem',
              }}
            >
              Back to Homepage
            </StyledButton>
          </motion.div>
        </ContentWrapper>
      </MainContent>
    </>
  );
}

export default Status404;
