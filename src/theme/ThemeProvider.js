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
                        maxWidth: '100% !important', // Updated to full width
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        [baseTheme.breakpoints.up('sm')]: {
                            paddingLeft: '32px',
                            paddingRight: '32px',
                        },
                        [baseTheme.breakpoints.up('md')]: {
                            paddingLeft: '48px',
                            paddingRight: '48px',
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
