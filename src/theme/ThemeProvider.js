import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeCreator } from './base';

const ThemeProviderWrapper = (props) => {
    const [isMounted, setIsMounted] = useState(false)

    const { darkMode } = useContext(AppContext);
    
    let baseTheme = themeCreator(darkMode);

    // Create the main theme with much wider containers for better table display
    let mainTheme = createTheme(baseTheme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        maxWidth: 'none !important', // Remove all width constraints
                        margin: '0 auto',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        [baseTheme.breakpoints.up('sm')]: {
                            paddingLeft: '24px',
                            paddingRight: '24px',
                        },
                        [baseTheme.breakpoints.up('md')]: {
                            paddingLeft: '32px',
                            paddingRight: '32px',
                        },
                        [baseTheme.breakpoints.up('lg')]: {
                            paddingLeft: '48px',
                            paddingRight: '48px',
                            maxWidth: '2000px !important', // Much wider for large screens
                        },
                        [baseTheme.breakpoints.up('xl')]: {
                            paddingLeft: '64px',
                            paddingRight: '64px', 
                            maxWidth: '2400px !important', // Ultra-wide support
                        },
                    },
                },
            },
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    return (
        <ThemeProvider theme={mainTheme}>
            {isMounted && props.children}
        </ThemeProvider>
    );
};

export default ThemeProviderWrapper;
