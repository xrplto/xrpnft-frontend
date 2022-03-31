import * as React from 'react';
import { useContext } from 'react'
import Context from '../../Context'
import { Icon } from '@iconify/react';
import AddIcon from '@mui/icons-material/Add';
import { styled/*, alpha, useTheme*/ } from '@mui/material/styles';
import { Button, Stack, Toolbar, IconButton, Box } from '@mui/material';
import AccountPopover from './AccountPopover';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';
import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import BaseDialog from 'components/dialog/BaseDialog';
import ChooseAccountDgContent from 'components/dialog/ChooseAccountDgContent';
import { useSelector, useDispatch } from 'react-redux'
import { reset } from 'app/slices/accountSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
// ----------------------------------------------------------------------
//const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 72;
// boxShadow: theme.customShadows.z1,

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_DESKTOP
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none'
}));

// ----------------------------------------------------------------------
export default function Navbar({ onOpenSidebar }) {
    const { toggleThisTheme, isDarkMode } = useContext(Context);
    const account = useSelector(state => state.account.account)
    const dispatch = useDispatch()

    // state to open & close account select dialog
    const [open, setOpen] = React.useState(false);

    // open dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // close dialog
    const handleClose = () => {
        setOpen(false);
    };

    // disconnect current account
    const handleDisconnect = () => {
        dispatch(reset())
    };

    return (
        <ToolbarStyle>
            <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Icon icon={menu2Fill} />
            </IconButton>

            <Box component={RouterLink} to="/" sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ flexGrow: 1 }} />
            {account.key && <StyledNavLink to='/create' sx={{textDecoration: 'none'}}>
                <Button startIcon={<AddIcon />}>Create</Button>
            </StyledNavLink>}
            {account.key && <StyledNavLink to='/'>
                <Button
                    onClick={handleDisconnect}
                    startIcon={<LogoutIcon />}
                >Disconnect
                </Button>
            </StyledNavLink>}
            {!account.key && <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<LoginIcon />}
            >
                Connect
            </Button>}
            <BaseDialog
                isOpen={open}
                close={handleClose}
                title='Select Account'
                render={
                    <ChooseAccountDgContent
                        close={handleClose}
                    />
                }
            />

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
