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
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`
}));

// Update the StyledToolbar component
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 3),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 4),
    },
    [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(0, 5),
    },
    [theme.breakpoints.up('xl')]: {
        padding: theme.spacing(0, 6),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1)
    }
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
                    <Box
                        id="logo-container-laptop"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        <NFTLogo />
                    </Box>

                    {fullSearch && (
                        <NavSearchBar
                            id="id_search_items_collections_accounts"
                            placeholder="Search NFTs, collections, and accounts"
                            type="SEARCH_ITEM_COLLECTION_ACCOUNT"
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    )}

                    {!fullSearch && (
                        <Box
                            id="logo-container-mobile"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', sm: 'none' }
                            }}
                        >
                            <NFTLogo />
                        </Box>
                    )}
                    {!fullSearch && !isMobile && (
                        <NavSearchBar
                            id="id_search_items_collections_accounts"
                            placeholder="Search NFTs, collections, and accounts"
                            type="SEARCH_ITEM_COLLECTION_ACCOUNT"
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    )}

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}
                    >
                        {!isMobile && (
                            <>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/explore`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <StyledButton>Explore</StyledButton>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collections`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <StyledButton>Collections</StyledButton>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <StyledButton>Create</StyledButton>
                                </Link>
                            </>
                        )}

                        {!fullSearch && isMobile && (
                            <IconButton
                                aria-label="search"
                                onClick={handleFullSearch}
                                sx={{
                                    color: 'primary.main'
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        )}
                        {!fullSearch && (
                            <Wallet>
                                {({ openWalletConnect }) => (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={openWalletConnect}
                                        startIcon={<AccountBalanceWalletOutlinedIcon />}
                                        sx={{
                                            mr: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: alpha(
                                                    theme.palette.primary.main,
                                                    0.8
                                                )
                                            }
                                        }}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </Wallet>
                        )}
                        {!isMobile && (
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    ),
                                    color: 'primary.main',
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.2
                                        )
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
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.2
                                        )
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
                                        background: alpha(theme.palette.background.paper, 0.9),
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
                                        width: '200px',
                                        maxHeight: '80vh', // Limit the height to 80% of the viewport height
                                        overflowY: 'auto', // Add scroll if content exceeds maxHeight
                                    }
                                }}
                            >
                                {[
                                    { text: 'Explore', icon: <ExploreOutlinedIcon />, href: '/explore' },
                                    { text: 'Collections', icon: <CollectionsIcon />, href: '/collections' },
                                    { text: 'Create', icon: <AddPhotoAlternateIcon />, href: '/create' },
                                ].map((item) => (
                                    <MenuItem key={item.text} onClick={handleCloseNavMenu} sx={{ py: 1 }}>
                                        <Link
                                            href={item.href}
                                            underline="none"
                                            color="inherit"
                                            sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                                        >
                                            {item.icon}
                                            <Typography sx={{ ml: 2 }}>{item.text}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <MenuItem onClick={toggleTheme} sx={{ py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        {darkMode ? (
                                            <Icon icon={baselineBrightness4} width={24} height={24} />
                                        ) : (
                                            <Icon icon={baselineBrightnessHigh} width={24} height={24} />
                                        )}
                                        <Typography sx={{ ml: 2 }}>
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
