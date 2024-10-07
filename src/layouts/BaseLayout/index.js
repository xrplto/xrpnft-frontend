import PropTypes from 'prop-types';
import { Box, Container } from '@mui/material';

const BaseLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%',
        justifyContent: 'center', // Center the content horizontally
      }}
    >
      <Container
        maxWidth="xl" // Use 'xl' for a wide layout
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxWidth: '1400px !important', // Override the default 'xl' max-width
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
