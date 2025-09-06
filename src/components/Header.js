import { useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';

// Material
import {
    alpha,
    styled,
    useMediaQuery,
    useTheme,
    AppBar,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CollectionsIcon from '@mui/icons-material/Collections';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import NFTLogo from './Logo';
import Wallet from './Wallet';
import NavSearchBar from './NavSearchBar';

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
    width: '100%',
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    boxShadow: `0 4px 20px 0 ${alpha(theme.palette.primary.main, 0.08)}`,
    transition: 'all 0.3s ease-in-out',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`
    }
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    minHeight: '60px !important',
    height: '60px',
    padding: theme.spacing(0, 3),
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 4),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 5),
    },
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(0, 6),
    },
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(0, 7),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: '0.95rem',
    textTransform: 'none',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 2)
}));

export default function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { toggleTheme, darkMode } = useContext(AppContext);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const shareUrl = `https://xrpnft.com`;
    const shareTitle =
        'XRPNFT An NFT Marketplace for Purchasing, Selling, and Collecting Non-Fungible Tokens';
    const shareDesc =
        'XRPNFT is a fee-free platform for trading XRPL NFTs on the XRP Ledger, connecting creators and collectors in a seamless NFT marketplace.';

    const handleOpenNavMenu = (event) => {
        console.log("Menu opened");
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [fullSearch, setFullSearch] = useState(false);

    const handleFullSearch = (e) => {
        setFullSearch(true);
    };


    return (
        <>
            <HeaderWrapper position="sticky" enableColorOnDark={true} elevation={0}>
                <StyledToolbar disableGutters>
                    {/* Left side - Logo and Navigation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            id="logo-container-laptop"
                            sx={{
                                ml: 2,
                                mr: 2,
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            <NFTLogo />
                        </Box>

                        {!fullSearch && (
                            <Box
                                id="logo-container-mobile"
                                sx={{
                                    ml: 2,
                                    mr: 2,
                                    display: { xs: 'flex', sm: 'none' }
                                }}
                            >
                                <NFTLogo />
                            </Box>
                        )}

                        {/* Navigation Links next to logo */}
                        {!fullSearch && !isMobile && (
                            <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                                <Typography
                                    component="a"
                                    href="/explore"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.7
                                        }
                                    }}
                                >
                                    Explore
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/collections"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.7
                                        }
                                    }}
                                >
                                    Collections
                                </Typography>
                                <Typography
                                    component="a"
                                    href="/create"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.7
                                        }
                                    }}
                                >
                                    Create
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    {/* Center - Search Bar */}
                    {fullSearch && (
                        <Box sx={{ flex: 1, mx: 3 }}>
                            <NavSearchBar
                                id="id_search_items_collections_accounts"
                                placeholder="Search NFTs, collections, and accounts"
                                type="SEARCH_ITEM_COLLECTION_ACCOUNT"
                                fullSearch={fullSearch}
                                setFullSearch={setFullSearch}
                            />
                        </Box>
                    )}

                    {!fullSearch && !isMobile && (
                        <Box sx={{ flex: 1, mx: 4, mr: 2 }}>
                            <NavSearchBar
                                id="id_search_items_collections_accounts"
                                placeholder="Search NFTs, collections, and accounts"
                                type="SEARCH_ITEM_COLLECTION_ACCOUNT"
                                fullSearch={fullSearch}
                                setFullSearch={setFullSearch}
                            />
                        </Box>
                    )}

                    {/* Right side - Actions */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            ml: 'auto'
                        }}
                    >
                        {!fullSearch && isMobile && (
                            <IconButton
                                aria-label="search"
                                onClick={handleFullSearch}
                                sx={{
                                    color: 'primary.main',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    mr: 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        transform: 'scale(1.05)'
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)'
                                    }
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        )}
                        {!fullSearch && (
                            <Box sx={{ mx: 1, my: 0.5 }}>
                                <Wallet />
                            </Box>
                        )}
                        {!isMobile && (
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    ml: 1,
                                    mr: 2,
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    ),
                                    color: 'primary.main',
                                    borderRadius: theme.spacing(1.5),
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.2
                                        ),
                                        transform: 'rotate(180deg) scale(1.1)'
                                    },
                                    '&:active': {
                                        transform: 'rotate(180deg) scale(0.9)'
                                    }
                                }}
                            >
                                {darkMode ? (
                                    <Icon icon={baselineBrightness4} />
                                ) : (
                                    <Icon icon={baselineBrightnessHigh} />
                                )}
                            </IconButton>
                        )}
                    </Box>

                    {!fullSearch && (
                        <Box
                            id="nav-menu-mobile"
                            sx={{
                                flexGrow: 0,
                                display: { xs: 'flex', sm: 'flex', md: 'none' }
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                sx={{
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    ),
                                    color: 'primary.main',
                                    borderRadius: theme.spacing(1.5),
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.2
                                        ),
                                        transform: 'scale(1.05)'
                                    },
                                    '&:active': {
                                        transform: 'scale(0.95)'
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                    '& .MuiPaper-root': {
                                        background: alpha(theme.palette.background.paper, 0.95),
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
                                        borderRadius: theme.spacing(2),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        width: '220px',
                                        maxHeight: '80vh',
                                        overflowY: 'auto',
                                        mt: 1,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`
                                        }
                                    }
                                }}
                            >
                                {[
                                    { text: 'Explore', icon: <ExploreOutlinedIcon />, href: '/explore' },
                                    { text: 'Collections', icon: <CollectionsIcon />, href: '/collections' },
                                    { text: 'Create', icon: <AddPhotoAlternateIcon />, href: '/create' },
                                ].map((item) => (
                                    <MenuItem 
                                        key={item.text} 
                                        onClick={handleCloseNavMenu} 
                                        sx={{ 
                                            py: 1.5, 
                                            px: 2,
                                            borderRadius: theme.spacing(1),
                                            mx: 1,
                                            mb: 0.5
                                        }}
                                        disableRipple
                                    >
                                        <Link
                                            href={item.href}
                                            underline="none"
                                            color="inherit"
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                width: '100%',
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            {item.icon}
                                            <Typography sx={{ ml: 2, fontWeight: 500 }}>{item.text}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <MenuItem 
                                    onClick={toggleTheme} 
                                    sx={{ 
                                        py: 1.5, 
                                        px: 2,
                                        borderRadius: theme.spacing(1),
                                        mx: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        width: '100%',
                                        color: theme.palette.text.primary
                                    }}>
                                        {darkMode ? (
                                            <Icon icon={baselineBrightness4} width={24} height={24} />
                                        ) : (
                                            <Icon icon={baselineBrightnessHigh} width={24} height={24} />
                                        )}
                                        <Typography sx={{ ml: 2, fontWeight: 500 }}>
                                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </StyledToolbar>
            </HeaderWrapper>
        </>
    );
}