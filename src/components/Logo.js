import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { Link, useTheme } from '@mui/material';

function Logo() {
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);

    return (
        <Link
            href="/"
            sx={{ 
                textDecoration: 'none !important',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: darkMode ? '#fff' : '#000',
                position: 'relative',
                transition: 'all 0.2s ease',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: 0,
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease'
                },
                '&:hover': {
                    textDecoration: 'none !important'
                },
                '&:hover::after': {
                    width: '100%'
                }
            }}
        >
            XRP<span style={{ color: theme.palette.primary.main }}>NFT</span>
        </Link>
    );
}

export default Logo;
