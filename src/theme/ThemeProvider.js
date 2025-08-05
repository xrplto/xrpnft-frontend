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

    // Create the main theme with wider constrained width for containers
    let mainTheme = createTheme(baseTheme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        maxWidth: '1600px !important',
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
                            paddingLeft: '40px',
                            paddingRight: '40px',
                            maxWidth: '1400px !important',
                        },
                        [baseTheme.breakpoints.up('xl')]: {
                            paddingLeft: '48px',
                            paddingRight: '48px',
                            maxWidth: '1536px !important',
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
