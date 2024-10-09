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
                        maxWidth: '1800px !important', // Updated to match the header
                    },
                },
            },
        },
    });

    // Create a separate theme for the Header without the maxWidth override
    let headerTheme = createTheme(baseTheme);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    return (
        <StylesProvider injectFirst>
            <ThemeProvider theme={mainTheme}>
                {isMounted && (
                    <>
                        <ThemeProvider theme={headerTheme}>
                            {props.header}
                        </ThemeProvider>
                        {props.children}
                    </>
                )}
            </ThemeProvider>
        </StylesProvider>
    );
};

export default ThemeProviderWrapper;
