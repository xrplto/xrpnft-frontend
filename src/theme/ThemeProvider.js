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

    // Create the main theme with wider maxWidth for containers
    let mainTheme = createTheme(baseTheme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        maxWidth: '2440px !important', // Updated to match the header
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
