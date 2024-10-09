import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

const ThemeProviderWrapper = (props) => {
    const [isMounted, setIsMounted] = useState(false)

    const { darkMode } = useContext(AppContext);
    
    let theme = themeCreator(darkMode);

    // Modify the theme to have a wider default maxWidth for containers
    theme = createTheme(theme, {
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        maxWidth: '1600px !important', // Adjust this value as needed
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
            <ThemeProvider theme={theme}>
                {isMounted && props.children}
            </ThemeProvider>
        </StylesProvider>
    );
};

export default ThemeProviderWrapper;
