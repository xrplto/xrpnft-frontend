import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

const ThemeProviderWrapper = (props) => {
    const [isMounted, setIsMounted] = useState(false)

    const { darkMode } = useContext(AppContext);
    
    let baseTheme = themeCreator(darkMode);

    // Create the main theme with full width for containers
    let mainTheme = createTheme(baseTheme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        maxWidth: '100% !important',
                        paddingLeft: '0px', // No padding for mobile
                        paddingRight: '0px', // No padding for mobile
                        [baseTheme.breakpoints.up('sm')]: {
                            paddingLeft: '4px',
                            paddingRight: '4px',
                        },
                        [baseTheme.breakpoints.up('md')]: {
                            paddingLeft: '8px',
                            paddingRight: '8px',
                        },
                        [baseTheme.breakpoints.up('lg')]: {
                            paddingLeft: '16px',
                            paddingRight: '16px',
                        },
                        [baseTheme.breakpoints.up('xl')]: {
                            paddingLeft: '24px',
                            paddingRight: '24px',
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
        <StylesProvider injectFirst>
            <ThemeProvider theme={mainTheme}>
                {isMounted && props.children}
            </ThemeProvider>
        </StylesProvider>
    );
};

export default ThemeProviderWrapper;
