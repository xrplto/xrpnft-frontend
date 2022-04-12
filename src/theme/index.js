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
// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
    children: PropTypes.node
};

export default function ThemeConfig({ children }) {
    const { isDarkMode } = useContext(Context);

    const palette = isDarkMode ? palette_dark : palette_light;

    const themeOptions = {
        palette: isDarkMode ? {
            mode: 'dark',
            ...palette
        } : {
            mode: 'light',
            ...palette
        },
        // palette: palette,
        shape,
        typography,
        // shadows,
        customShadows
    };

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
