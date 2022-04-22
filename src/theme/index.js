import { useContext } from 'react'
import Context from '../Context'
import PropTypes from 'prop-types';
// material
import { CssBaseline } from '@mui/material';
import { /*useTheme, */ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import shape from './shape';
import { palette_light, palette_dark } from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import * as React from 'react';
import { blueGrey, grey } from '@mui/material/colors';
// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
    children: PropTypes.node
};

export default function ThemeConfig({ children }) {
    const { isDarkMode } = useContext(Context);

    const theme = createTheme({
        components: {
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        minHeight: 'auto',
                    }
                }
            },
            MuiTypography: {
                variants: [
                    {
                        props: { variant: 'body1' },
                        style: {
                            color: 'rgb(138, 147, 155)',
                            fontSize: 12
                        }
                    }
                ]
            },
            MuiLink: {
                variants: [
                    {
                        props: { variant: 'menu-item' },
                        style: {
                            textTransform: 'uppercase'

                        }
                    }
                ],
                styleOverrides: {

                    root: {
                        // textTransform: 'uppercase'
                    }
                }
            }
        },
        palette: isDarkMode ? {
            mode: 'dark',
            primary: {
                main: grey[100],
                light: grey[50],
                dark: grey[200],
                contrastText: 'black'
            },
            secondary: {
                main: blueGrey[700],
                light: blueGrey[500],
                dark: blueGrey[900],
                contrastText: 'white'
            },
            background: {
                paper: grey[900],
                light: '#212121'
            }
        } : {
            mode: 'light',
            primary: {
                main: grey[700],
                light: grey[500],
                dark: grey[900],
                contrastText: 'white'
            },
            secondary: {
                main: blueGrey[500],
                light: blueGrey[300],
                dark: blueGrey[500],
                contrastText: 'white'
            }
        },
    });

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
