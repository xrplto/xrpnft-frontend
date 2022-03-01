import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { useContext } from 'react'
import Context from '../Context'
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import {
    Brightness4 as Brightness4Icon,
    BrightnessHigh as BrightnessHighIcon,
} from '@mui/icons-material'
// components
//
import Logo from '../components/Logo';
import AccountPopover from './AccountPopover';

//import { createTheme } from '@mui/material/styles';

//import { purple } from '@mui/material/colors';

import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';

// ----------------------------------------------------------------------

//const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
//const APPBAR_DESKTOP = 72;

const RootStyle = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    //backgroundColor: alpha(theme.palette.background.default, 0.72),
    //backgroundColor: alpha("#00AB88", 0.4),
    backgroundColor: alpha("#FFFFFF", 0.02),
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_MOBILE
}));

// ----------------------------------------------------------------------

Navbar.propTypes = {
    onOpenSidebar: PropTypes.func
};

export default function Navbar({ onOpenSidebar }) {
    const { toggleThisTheme, isDarkMode } = useContext(Context);

    return (
        <RootStyle>
            <ToolbarStyle>
                <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                    <Icon icon={menu2Fill} />
                </IconButton>

                <Box component={RouterLink} to="/" sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                    <Logo />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                    <AccountPopover />
                    <IconButton onClick={() => { toggleThisTheme('isDarkMode') }} >
                        {isDarkMode ? (
                            <BrightnessHighIcon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Stack>
            </ToolbarStyle>
        </RootStyle>
    );
}
