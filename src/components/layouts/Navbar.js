import * as React from 'react';
import { useContext } from 'react'
import Context from '../../Context'
import { Icon } from '@iconify/react';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, Toolbar, IconButton, Box, Link, Container } from '@mui/material';
import AccountPopover from './AccountPopover';
import Logo from '../Logo';
// import { Link as RouterLink/*, useLocation*/ } from 'react-router-dom';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from 'app/slices/accountSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { resetIpfsState } from 'app/slices/ipfSlice'
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import DropdownExpore from './DropdownExplore';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    // color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
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
        <Toolbar sx={{gap: 5}}>
            {/* <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <MenuIcon />
            </IconButton> */}
            <Box to="/" sx={{ px: 2.5, display: 'inline-flex' }}>
                <Logo />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
            <DropdownExpore />
            {/* <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}> */}
                {/* <Container sx={{ gap: 5, display: 'flex' }}> */}
                    {
                        login ?
                            <>
                                {/* <Link href='/create' underline='none'>
                            <Button startIcon={<AddIcon />}>Create</Button>
                        </Link> */}
                                <Link href='/create' underline='none' sx={{ color: 'text.primary' }}>
                                    {/* <AddIcon /> */}
                                    Create
                                </Link>
                                <Link href='/account' underline='none' sx={{ color: 'text.primary' }}>
                                    {/* <Button startIcon={<Icon icon='mdi:postage-stamp' />}>My NFTs</Button> */}
                                    My NFTs
                                </Link>
                                <Link href='/' underline='none'
                                    component='button'
                                    onClick={handleDisconnect}
                                    // endIcon={<LogoutIcon />}
                                    sx={{ color: 'text.primary' }}
                                >
                                    Connected: {key.slice(0, 4) + '...' + key.slice(-4)}
                                </Link>
                            </>
                            :
                            <Link href='/login' underline='none' sx={{ color: 'text.primary' }}>
                                Log In
                            </Link>
                    }
                {/* </Container> */}
                <AccountPopover />
                <IconButton onClick={() => { toggleThisTheme('isDarkMode') }} >
                    {isDarkMode ? (
                        <Icon icon={baselineBrightnessHigh} />
                    ) : (
                        <Icon icon={baselineBrightness4} />
                    )}
                </IconButton>
            {/* </Stack> */}
        </Toolbar>
    );
}
