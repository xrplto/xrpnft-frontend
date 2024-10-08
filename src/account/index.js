import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    alpha,
    styled,
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Icon } from '@iconify/react';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { getHashIcon } from 'src/utils/parse';

// Components
import NFTs from './NFTs';
import Offers from './Offers';
import History from './History';
// import FavoritedList from './FavoritedList';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import StyledBadge from './StyledBadge';

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: ${theme.shape.borderRadius}px; // Add this line for rounded corners
  `
);

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    transition: theme.transitions.create('opacity')
}));

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
`
);

const BannerWrapper = styled('div')(
    ({ theme }) => `
    position: relative;
    overflow: hidden;
    height: 280px;  // Decreased from 320px to 280px
    margin-bottom: ${theme.spacing(6)};
    background-color: ${theme.palette.background.default};
    border-radius: ${theme.shape.borderRadius}px;  // Add this line for rounded corners
`
);

const BackgroundImage = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.5,
    zIndex: 0
}));

const BackgroundBlur = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(20px)',
    backgroundColor: alpha(theme.palette.common.black, 0.5), // Changed to black with 50% opacity
    zIndex: 1
}));

const BannerImage = styled('img')(
    ({ theme }) => `
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
  `
);

function TabPanel(props) {
    const { children, value, id, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== id}
            id={`simple-tabpanel-${id}`}
            aria-labelledby={`simple-tab-${id}`}
            {...other}
        >
            {value === id && (
                <Box
                    sx={
                        {
                            // p: { xs: 0, md: 3 },
                            // pt: { xs: 3 },
                        }
                    }
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// const tabValues = ['', 'created', 'favorited', 'activity', 'transfers', 'more'];
// const tabLabels = ['Collected', 'Created', 'Favorited', 'Activity', 'Transfers', 'More'];

const tabValues = ['nfts', 'offers', 'history'];
const tabLabels = ['NFTs', 'Offers', 'History'];

const MORE_INDEX = tabValues.indexOf('more');

function getTabID(tab) {
    if (!tab) return 0;

    const idx = tabValues.indexOf(tab);
    if (idx < 0) return 0;
    return idx;
}

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light'
                ? 'rgb(55, 65, 81)'
                : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                )
            }
        }
    }
}));

export default function Account({ profile, limit, tab, collection, type }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar, sync, setAccountProfile } =
        useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const accountUuid = accountProfile?.xuuid;

    const [tabID, setTabID] = useState(getTabID(tab));

    const [notificationCounts, setNotificationCounts] = useState({
        acceptNfts: 0,
        orphanedOffers: 0,
        buyOffers: 0,
        sellOffers: 0,
        receivedOffers: 0
    });

    useEffect(() => {
        async function getOffersCount() {
            try {
                const response = await axios.post(`${BASE_URL}/account/notification`, { account });
                if (response.status === 200) {
                    const data = response.data;
                    console.log('Notification data received:', data);
                    setNotificationCounts({
                        acceptNfts: data.acceptNfts || 0,
                        orphanedOffers: data.orphanedOffers || 0,
                        buyOffers: data.buyOffers || 0,
                        sellOffers: data.sellOffers || 0,
                        receivedOffers: data.receivedOffers || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching notification counts:', error);
            }
        }

        if (account) {
            getOffersCount();
        }
    }, [account, sync]);

    const { account, name, logo, banner, description, minterWallet } = profile;

    const logoImage = logo
        ? `https://s1.xrpnft.com/profile/${logo}`
        : getHashIcon(account);

    const bannerImage = banner
        ? `https://s1.xrpnft.com/profile/${banner}`
        : logoImage; // Use logoImage as fallback for banner

    const gotoTabView = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-tab-anchor'
        );

        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleChangeTab = (event, newID) => {
        if (newID === MORE_INDEX) {
            return;
        }
        const url =
            newID > 0
                ? `/account/${account}/${tabValues[newID]}`
                : `/account/${account}`;
        window.history.pushState({}, null, url);
        setTabID(newID);
        gotoTabView(event);
    };

    const onLogoutXumm = async () => {
        try {
            const res = await axios.delete(
                `${BASE_URL}/account/logout/${accountLogin}/${accountUuid}`,
                { headers: { 'x-access-token': accountToken } }
            );
            if (res.status === 200) {
                setAccountProfile(null);
                openSnackbar('Logged out successfully', 'success');
                // Redirect to home page or refresh the current page
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Logout failed', err);
            openSnackbar('Logout failed', 'error');
        }
    };

    const totalNotifications = Object.values(notificationCounts).reduce((sum, count) => sum + count, 0);

    console.log('Current notification counts:', notificationCounts);
    console.log('Total notifications:', totalNotifications);

    return (
        <>
            <Box sx={{ position: 'relative', mt: 7 }}>  {/* Increased margin top from 6 to 7 */}
                <BannerWrapper>
                    {bannerImage ? (
                        <>
                            <BackgroundImage
                                sx={{
                                    backgroundImage: `url(${bannerImage})`
                                }}
                            />
                            <BackgroundBlur />
                            <BannerImage alt="" src={bannerImage} decoding="async" />
                        </>
                    ) : (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'background.default',
                            }}
                        >
                            <Avatar
                                variant="square"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <IconImage src={getHashIcon(account)} />
                            </Avatar>
                        </Box>
                    )}
                </BannerWrapper>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        zIndex: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar
                                variant="square" // Change this to 'square'
                                sx={{
                                    width: { md: 90, xs: 50 },
                                    height: { md: 90, xs: 50 },
                                    backgroundColor: '#00000000',
                                    borderRadius: (theme) => `${theme.shape.borderRadius}px`, // Add this line for rounded corners
                                }}
                            >
                                <IconImage src={logoImage} />
                                {accountLogin === account && (
                                    <Link href={`/setting`} underline="none">
                                        <CardOverlay>
                                            <EditIcon
                                                className="MuiIconEditButton-root"
                                                fontSize="large"
                                                sx={{ opacity: 0, zIndex: 1 }}
                                            />
                                        </CardOverlay>
                                        <ImageBackdrop className="MuiImageBackdrop-root" />
                                    </Link>
                                )}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" sx={{ color: 'common.white' }}>
                                    {name || account?.toString().slice(0, 5)}
                                </Typography>
                                <Box display="flex" alignItems={'center'}>
                                    <Typography
                                        style={{ wordWrap: 'break-word' }}
                                        variant="d3"
                                        sx={{ color: 'common.white' }}
                                    >
                                        {account.slice(0, 4) + '...' + account.slice(-4)}
                                    </Typography>
                                    <CopyToClipboard
                                        text={account}
                                        onCopy={() => {
                                            openSnackbar('Copied!', 'success');
                                        }}
                                    >
                                        <Tooltip title="Click to copy">
                                            <IconButton sx={{ color: 'common.white' }}>
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </CopyToClipboard>
                                    <Link
                                        color="inherit"
                                        target="_blank"
                                        href={`https://bithomp.com/explorer/${account}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <IconButton sx={{ color: 'common.white' }}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                        {accountLogin === account && (
                            <Button
                                variant="contained"
                                onClick={onLogoutXumm}
                                startIcon={<Icon icon="mdi:logout" />}
                                sx={{
                                    backgroundColor: (theme) =>
                                        theme.palette.error.main,
                                    color: (theme) => theme.palette.error.contrastText,
                                    '&:hover': {
                                        backgroundColor: (theme) =>
                                            theme.palette.error.dark
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 2, px: 2 }}>
                <SeeMoreTypography variant="d3" text={description} />
            </Box>

            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    width: '100%',
                    '& > *': {
                        scrollSnapAlign: 'center'
                    },
                    '::-webkit-scrollbar': { display: 'none' }
                }}
            >
                <Tabs
                    value={tabID}
                    onChange={handleChangeTab}
                    aria-label="token-tabs"
                    sx={{
                        '& .MuiTabs-scroller, .MuiTab-root': {
                            overflow: 'visible !important'
                        },
                        '& .MuiBadge-overlapRectangular': {
                            borderRadius: '50%'
                        }
                    }}
                >
                    <Tab value={0} label={tabLabels[0]} {...a11yProps(0)} />
                    <Tab
                        value={1}
                        label={
                            <StyledBadge
                                color="primary"
                                badgeContent={totalNotifications}
                            >
                                {tabLabels[1]}
                            </StyledBadge>
                        }
                        {...a11yProps(1)}
                    />
                    <Tab value={2} label={tabLabels[2]} {...a11yProps(2)} />
                </Tabs>
            </Box>
            <Box sx={{ my: 1 }}>
                <TabPanel value={tabID} id={0}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <NFTs
                            account={account}
                            limit={limit}
                            collection={collection}
                            type={type}
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={1}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <Offers
                            account={account}
                            {...notificationCounts}
                            setAcceptNfts={(value) => setNotificationCounts(prev => ({ ...prev, acceptNfts: value }))}
                            setOrphanedOffers={(value) => setNotificationCounts(prev => ({ ...prev, orphanedOffers: value }))}
                            setBuyOffers={(value) => setNotificationCounts(prev => ({ ...prev, buyOffers: value }))}
                            setSellOffers={(value) => setNotificationCounts(prev => ({ ...prev, sellOffers: value }))}
                            setReceivedOffers={(value) => setNotificationCounts(prev => ({ ...prev, receivedOffers: value }))}
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={2}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <History account={account} />
                    </Stack>
                </TabPanel>
            </Box>
        </>
    );
}