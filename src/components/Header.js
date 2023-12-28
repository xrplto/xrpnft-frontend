import { useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import {
    alpha, styled, useMediaQuery, useTheme,
    AppBar,
    Box,
    Button,
    Container,
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

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import NFTLogo from './NFTLogo';
import Wallet from './Wallet';
import NavSearchBar from './NavSearchBar';

const HeaderWrapper = styled(AppBar)(({ theme }) => `
    width: 100%;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    border: none;
    border-radius: 0px;
    border-bottom: 0px solid ${alpha('#CBCCD2', 0.2)};
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    // z-index: 1300;
`
);

export default function Header() {
    /*
    xs: 0,
    mobile: 450,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1840
    */
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { toggleTheme, darkMode } = useContext(AppContext);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const shareUrl = `https://xrpnft.com`;
    const shareTitle = 'XRPNFT An NFT Marketplace for Purchasing, Selling, and Collecting Non-Fungible Tokens';
    const shareDesc = 'XRPNFT is a fee-free platform for trading XRPL NFTs on the XRP Ledger, connecting creators and collectors in a seamless NFT marketplace.';

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const [fullSearch, setFullSearch] = useState(false);

    const handleFullSearch = (e) => {
        setFullSearch(true);
    }
    return (
        <HeaderWrapper position="sticky" enableColorOnDark={true} sx={{ py: 1 }}>
            <Container maxWidth="xxl">
                <Toolbar disableGutters>
                    <Box id='logo-container-laptop'
                        sx={{
                            mr: 2,
                            display: { xs: 'none', sm: 'flex' },
                        }}
                    >
                        <NFTLogo />
                    </Box>


                    {fullSearch &&
                        <NavSearchBar
                            id='id_search_items_collections_accounts'
                            placeholder='Search NFTs, Collections, and Accounts'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }

                    {!fullSearch &&
                        <Box id='logo-container-mobile'
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', sm: 'none' },
                            }}
                        >
                            <NFTLogo />
                        </Box>
                    }
                    {!fullSearch && !isMobile &&
                        <NavSearchBar
                            id='id_search_items_collections_accounts'
                            placeholder='Search NFTs, Collections, and Accounts'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {!isMobile &&
                            <>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/explore`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Explore</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collections`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Collections</Button>
                                </Link>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Create</Button>
                                </Link>
                            </>
                        }

                        {!fullSearch && isMobile &&
                            <IconButton
                                aria-label='search'
                                onClick={handleFullSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        }
                        {!fullSearch &&
                            <Wallet />
                        }
                        {!isMobile &&
                            <IconButton onClick={() => { toggleTheme() }} >
                                {darkMode ? (
                                    <Icon icon={baselineBrightness4} />
                                ) : (
                                    <Icon icon={baselineBrightnessHigh} />
                                )}
                            </IconButton>
                        }
                    </Box>

                    {!fullSearch &&
                        <Box id='nav-menu-mobile'
                            sx={{ flexGrow: 0, display: { sm: 'flex', md: 'none' } }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >

                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/explore`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <ExploreOutlinedIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Explore</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/collections`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <CollectionsIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Collections</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/create`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <AddPhotoAlternateIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Create</Typography>
                                        </Stack>
                                    </Link>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={()=> {toggleTheme();}}>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        {darkMode ? (
                                            <Icon icon={baselineBrightness4} width={24} height={24} />
                                        ) : (
                                            <Icon icon={baselineBrightnessHigh} width={24} height={24} />
                                        )}
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>{darkMode ? 'Dark Theme':'Light Theme'}</Typography>
                                    </Stack>
                                </MenuItem>

                                <Stack alignItems="center" sx={{mt: 2}} >
                                    <Stack direction="row" spacing={3}>
                                        <FacebookShareButton
                                            url={shareUrl}
                                            quote={shareTitle}
                                            hashtag={"#"}
                                            description={shareDesc}
                                        >
                                            <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton
                                            title={shareTitle}
                                            url={shareUrl}
                                            hashtag={"#"}
                                        >
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                    </Stack>
                                </Stack>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </HeaderWrapper >
    );
}
