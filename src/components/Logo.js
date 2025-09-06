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
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)',
                    borderRadius: '1px',
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
            <span style={{ position: 'relative' }}>
                X<span style={{ 
                    position: 'absolute',
                    top: '-8px',
                    right: '-5px',
                    fontSize: '0.8rem',
                    filter: 'hue-rotate(200deg) saturate(1.2)',
                    color: theme.palette.primary.main
                }}>🐦</span>
            </span>RP<span style={{ 
                color: theme.palette.primary.main,
                fontWeight: 700 
            }}>NFT</span>
        </Link>
    );
}

export default Logo;
