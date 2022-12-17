import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import { useState, useEffect } from 'react';

// Material
import {
    alpha, styled, useMediaQuery, useTheme,
    Box,
    Container,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Iconify Icons
import { Icon } from '@iconify/react';
import baselineBrightnessHigh from '@iconify/icons-ic/baseline-brightness-high';
import baselineBrightness4 from '@iconify/icons-ic/baseline-brightness-4';

// Utils
import { MAINNET } from 'src/utils/constants';

// Components
import Logo from './Logo';
import Wallet from './Wallet';
import NavSearchBar from './NavSearchBar';

const NotifyWrapper = styled(Box)(({ theme }) => `
    width: 100%;
    height: ${theme.spacing(3)};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${alpha(theme.colors.primary.main, 0.8)};
    margin-bottom: ${theme.spacing(0)};
    border-radius: 0px;
    border-bottom: 1px solid ${alpha('#CBCCD2', 0.2)};
`
);

const HeaderWrapper = styled(Box)(({ theme }) => `
    width: 100%;
    height: ${theme.spacing(9)};
    display: flex;
    align-items: center;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    border-radius: 0px;
    border-bottom: 0px solid ${alpha('#CBCCD2', 0.2)};
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1300;
`
);

export default function Header(props) {
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
    // const isMobile = useMediaQuery(theme.breakpoints.down('mobile'));
    const hideSearchBar = useMediaQuery(theme.breakpoints.down('sm'));

    const [fullSearch, setFullSearch] = useState(false);

    const handleFullSearch = (e) => {
        setFullSearch(true);
    }

    return (
        <>
            {MAINNET==="NOT_ALIVE" &&
                <NotifyWrapper>
                    <Stack alignItems="center">
                        <Typography variant="s6">You are on the XLS20 NFT-Devnet now. Your data may reset anytime without any notice.</Typography>
                        {/* <Typography variant="s6">XRPNFT.com will reset all data and will be combined with mainnet in 12 hours.</Typography> */}
                    </Stack>
                </NotifyWrapper>
            }
            <HeaderWrapper>
                <Container maxWidth="xl">
                    {fullSearch ?
                        <>
                            <NavSearchBar
                                id='id_search_items_collections_accounts'
                                placeholder='Search items, collections, and accounts'
                                type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                                fullSearch={fullSearch}
                                setFullSearch={setFullSearch}
                            />
                        </>
                        :
                        <Box display="flex" alignItems="center" justifyContent="space-between" flex={2} sx={{pl:0, pr:0}}>
                            <Stack direction="row" alignItems="center" spacing={5}>
                                <Box>
                                    <Logo />
                                </Box>

                                {!hideSearchBar &&
                                    <NavSearchBar
                                        id='id_search_items_collections_accounts'
                                        placeholder='Search items, collections, and accounts'
                                        type='SEARCH_ITEM_COLLECTION_ACCOUNT'
                                        fullSearch={fullSearch}
                                        setFullSearch={setFullSearch}
                                    />
                                }

                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                                {hideSearchBar &&
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
                            </Stack>
                        </Box>
                    }
                </Container>
            </HeaderWrapper>
        </>
    );
}
