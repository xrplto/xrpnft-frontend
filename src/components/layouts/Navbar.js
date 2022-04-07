import * as React from 'react';
import { useContext } from 'react'
import Context from '../../Context'
import { Icon } from '@iconify/react';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import { Button, Stack, Toolbar, IconButton, Box } from '@mui/material';
import AccountPopover from './AccountPopover';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';
import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from 'app/slices/accountSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { TOP_BAR_HEIGHT_DESKTOP } from 'utils/constants';
import { resetIpfsState } from 'app/slices/ipfSlice'


const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: TOP_BAR_HEIGHT_DESKTOP
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none'
}));

export default function Navbar({ onOpenSidebar }) {
    const { toggleThisTheme, isDarkMode } = useContext(Context);
    const login = useSelector(state => state.account.login)
    const key = useSelector(state => state.account.account.key)
    const dispatch = useDispatch()

    // disconnect current account
    const handleDisconnect = () => {
        dispatch(resetAccount())
        dispatch(resetIpfsState())
    };

    return (
        <ToolbarStyle>
            <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Icon icon={menu2Fill} />
            </IconButton>
            <Box component={RouterLink} to="/" sx={{ px: 2.5, display: 'inline-flex' }}>
                <Logo />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            {
                login ?
                    <>
                        <StyledNavLink to='/create' sx={{ textDecoration: 'none' }}>
                            <Button startIcon={<AddIcon />}>Create</Button>
                        </StyledNavLink>
                        <StyledNavLink to='/account' sx={{ textDecoration: 'none' }}>
                            <Button startIcon={<Icon icon='mdi:postage-stamp' />}>My NFTs</Button>
                        </StyledNavLink>
                        <StyledNavLink to='/'>
                            <Button
                                onClick={handleDisconnect}
                                endIcon={<LogoutIcon />}
                            >Connected: {key.slice(0,4) + '...' + key.slice(-4)}
                            </Button>
                        </StyledNavLink>
                    </>
                    :
                    <StyledNavLink to='/login'>
                        <Button
                            startIcon={<LoginIcon />}
                        >Log In
                        </Button>
                    </StyledNavLink>
            }

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
