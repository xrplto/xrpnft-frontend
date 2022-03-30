import * as React from 'react';
import { useContext } from 'react'
import Context from '../../Context'
import { Icon } from '@iconify/react';
import AddIcon from '@mui/icons-material/Add';
import { styled/*, alpha, useTheme*/ } from '@mui/material/styles';
import { Button, Stack, Toolbar, IconButton, Box } from '@mui/material';
import AccountPopover from './AccountPopover';
import { NavLink } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Logo from '../Logo';
import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import BaseDialog from 'components/dialog/BaseDialog';
import ChooseAccountDgContent from 'components/dialog/ChooseAccountDgContent';

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

    // state to open & close account select dialog
    const [open, setOpen] = React.useState(false);
    // const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    // open dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // close dialog
    const handleClose = (value) => {
        setOpen(false);
        // setSelectedValue(value);
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
            <NavLink to='/create'>
                <Button startIcon={<AddIcon />}>Create</Button>
            </NavLink>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AccountBalanceWalletIcon />}
            >
                Accounts
            </Button>
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
