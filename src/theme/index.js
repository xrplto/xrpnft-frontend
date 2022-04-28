import { useContext } from 'react'
import Context from '../Context'
import PropTypes from 'prop-types';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import * as React from 'react';
import { blueGrey, grey } from '@mui/material/colors';
// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
    children: PropTypes.node
};

export default function ThemeConfig({ children }) {
    const { isDarkMode } = useContext(Context);

    const xrpltheme = createTheme({
        components: {
            MuiAccordion: {
                defaultProps: {
                    elevation: 0,
                    defaultExpanded: true,
                    disableGutters: true,
                },
                styleOverrides: {
                    root: ({ theme }) => ({
                        border: `1px solid ${theme.palette.divider}`,
                    })
                }
            },
            MuiAccordionSummary: {
                styleOverrides: {
                    root: ({ theme }) => (
                        {
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, .05)'
                                    : 'rgba(0, 0, 0, .03)',
                            '& .MuiAccordionSummary-content': {
                                marginLeft: theme.spacing(1),
                            },
                        }
                    )
                }
            },
            MuiDialog: {
                styleOverrides: {
                    root: {
                        '& .MuiDialog-paper': {
                            minWidth: 400
                        }
                    }
                }
            },
            MuiLink: {
                variants: [
                    {
                        props: { variant: 'menu-item' },
                        style: {
                            textTransform: 'uppercase',
                        }
                    },
                ],

            },
            MuiListItemText: {
                styleOverrides: {
                    root: {
                        overflowWrap: 'anywhere',
                    }
                }
            },
            MuiListSubheader: {
                styleOverrides: {
                    root: {
                        minWidth: 120,
                        overflowWrap: 'anywhere'
                    }
                }
            },
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
                            color: 'rgb(190, 190, 190)',
                            fontSize: 14,
                            fontWeight: 500,
                        }
                    },
                    {
                        props: { variant: 'caption' },
                        style: {
                            fontSize: 16,
                            fontWeight: 600,
                        }
                    },
                ]
            },
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
            <ThemeProvider theme={xrpltheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
