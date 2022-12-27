import { AppContext } from 'src/AppContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import NFTLogo from './NFTLogo';
import SearchIcon from '@mui/icons-material/Search';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';
import { alpha, Link, styled, useMediaQuery, useTheme } from '@mui/material';
import Wallet from './Wallet';
import NavSearchBar from './NavSearchBar';
import { useContext, useState } from 'react';


const HeaderWrapper = styled(AppBar)(({ theme }) => `
    width: 100%;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid ${alpha('#CBCCD2', 0.2)};
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    // z-index: 1300;
`
);

function XAppBar() {
    /*
    xs: 0,
    mobile: 450,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1840
    */
    const theme = useTheme();
    const { toggleTheme, darkMode } = useContext(AppContext);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const hideSearchBar = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const [fullSearch, setFullSearch] = useState(false);

    const handleFullSearch = (e) => {
        setFullSearch(true);
    }
    return (
        <HeaderWrapper position="sticky" enableColorOnDark={true} sx={{ py: 1 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
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
                                    href={`/explore-collections`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Explore</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Create</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    // href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Launch Pad</Button>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link
                                    underline="none"
                                    color="inherit"
                                    // href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="text">Ranking</Button>
                                </Link>
                            </MenuItem>
                        </Menu>
                    </Box>

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
                            placeholder='Search items, collections, and accounts'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }

                    {
                        !fullSearch &&
                        <Box id='logo-container-mobile'
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', sm: 'none' },
                            }}
                        >
                            <NFTLogo />
                        </Box>
                    }
                    {!fullSearch && !hideSearchBar &&
                        <NavSearchBar
                            id='id_search_items_collections_accounts'
                            placeholder='Search items, collections, and accounts'
                            type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                            fullSearch={fullSearch}
                            setFullSearch={setFullSearch}
                        />
                    }
                    <Box sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        <Link
                            underline="none"
                            color="inherit"
                            href={`/explore-collections`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="text">Explore</Button>
                        </Link>
                        <Link
                            underline="none"
                            color="inherit"
                            href={`/create`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="text">Create</Button>
                        </Link>
                        <Link
                            underline="none"
                            color="inherit"
                            // href={`/create`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="text">LaunchPad</Button>
                        </Link>
                        <Link
                            underline="none"
                            color="inherit"
                            // href={`/create`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="text">Ranking</Button>
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {!fullSearch && hideSearchBar &&
                            <IconButton
                                aria-label='search'
                                onClick={handleFullSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        }
                        <Wallet />
                        <IconButton onClick={() => { toggleTheme() }} >
                            {darkMode ? (
                                <Icon icon={baselineBrightnessHigh} />
                            ) : (
                                <Icon icon={baselineBrightness4} />
                            )}
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </HeaderWrapper >
    );
}
export default XAppBar;
