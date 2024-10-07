import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { Typography, Link, useTheme, Box } from '@mui/material';

function Logo() {
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);

    return (
        <Link
            href="/"
            sx={{ 
                pl: 0, 
                pr: 0, 
                py: 0.5, 
                display: 'inline-flex',
                textDecoration: 'none',
                alignItems: 'center'
            }}
            rel="noreferrer noopener nofollow"
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                    variant="h3" 
                    component="span"
                    sx={{ 
                        fontWeight: 1000,
                        color: darkMode ? 'white' : 'black',
                        letterSpacing: '0.05em',
                    }}
                >
                    XRP
                </Typography>
                <Typography 
                    variant="h3" 
                    component="span"
                    sx={{ 
                        fontWeight: 1000,
                        color: theme.palette.primary.main,
                        letterSpacing: '0.05em',
                    }}
                >
                    NFT
                </Typography>
            </Box>
        </Link>
    );
}

export default Logo;
