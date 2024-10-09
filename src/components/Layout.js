import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1600px', // Increase this value to make the content wider
        margin: '0 auto',
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;