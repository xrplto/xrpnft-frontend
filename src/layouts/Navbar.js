import * as React from 'react';
import { useContext } from 'react'
import Context from '../Context'
import { Icon } from '@iconify/react';
import AddIcon from '@mui/icons-material/Add';
// material
import { styled/*, alpha, useTheme*/ } from '@mui/material/styles';
import { Button, Stack, Toolbar, IconButton, Box } from '@mui/material';
// components
//
import AccountPopover from './AccountPopover';
import { NavLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Logo from '../components/Logo';

import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';

//import LightModeIcon from '@mui/icons-material/LightMode';
//import DarkModeIcon from '@mui/icons-material/DarkMode';

import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
//const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 72;
// boxShadow: theme.customShadows.z1,

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_DESKTOP
}));

// ----------------------------------------------------------------------
export default function Navbar({ onOpenSidebar }) {
    const { toggleThisTheme, isDarkMode } = useContext(Context);

    return (
        <ToolbarStyle>

            <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Icon icon={menu2Fill} />
            </IconButton>

            <Box component={RouterLink} to="/" sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <NavLink to='/create'>
                <Button startIcon={<AddIcon />}>Create</Button>
            </NavLink>
            <NavLink to='/account'>
                <Button startIcon={<AccountBalanceWalletIcon />}>Account</Button>
            </NavLink>

            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                <AccountPopover />
                <IconButton onClick={() => { toggleThisTheme('isDarkMode') }} >
                    {isDarkMode ? (
                        <Icon icon={baselineBrightnessHigh} />
                    ) : (
                        <Icon icon={baselineBrightness4} />
                    )}
                </IconButton>
            </Stack>
        </ToolbarStyle>
    );
}
