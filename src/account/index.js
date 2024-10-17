import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Client } from 'xrpl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
    Button,
    Grid,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Icon } from '@iconify/react';
import infoFilled from '@iconify/icons-ep/info-filled';
import CollectionsIcon from '@mui/icons-material/Collections';
import ImageIcon from '@mui/icons-material/Image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BrushIcon from '@mui/icons-material/Brush';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings'; // Add this import

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
import EditProfileModal from './setting'; // Import the modal component

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
    border-radius: ${
        theme.shape.borderRadius
    }px;  // Add this line for rounded corners
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

const GlassBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    '&:hover': {
        background: alpha(theme.palette.background.paper, 0.15),
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.3)}`
    },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'center', md: 'flex-start' },
    position: 'relative',
    zIndex: 1,
    mx: { xs: -2, md: -4 }, // Add negative margins to extend to the sides
    px: { xs: 4, md: 6 },   // Increase padding to compensate for negative margins
    py: 4                   // Add some vertical padding
}));

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

    const [nftStats, setNftStats] = useState({ 
        totalCount: 0, 
        totalForSale: 0, 
        collectionCount: 0,
        createdCount: 0 // Add this line
    });

    const [createdNFTsCount, setCreatedNFTsCount] = useState(0);

    const [xrpBalance, setXrpBalance] = useState(null);
    const [availableBalance, setAvailableBalance] = useState(null);

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const handleOpenSettingsModal = () => {
        setIsSettingsModalOpen(true);
    };

    const handleCloseSettingsModal = () => {
        setIsSettingsModalOpen(false);
    };

    const updateNotificationCount = useCallback((key, value) => {
        setNotificationCounts(prev => {
            const newCounts = { ...prev, [key]: value };
            console.log('Updated notification counts:', newCounts);
            return newCounts;
        });
    }, []);

    const getOffersCount = useCallback(async () => {
        if (!account) return;

        try {
            const response = await axios.post(
                `${BASE_URL}/account/notification`,
                { account }
            );
            if (response.status === 200) {
                const data = response.data;
                console.log('Notification data received:', data);
                setNotificationCounts(prevCounts => ({
                    acceptNfts: data.acceptNfts || prevCounts.acceptNfts,
                    orphanedOffers: data.orphanedOffers || prevCounts.orphanedOffers,
                    buyOffers: data.buyOffers || prevCounts.buyOffers,
                    sellOffers: data.sellOffers || prevCounts.sellOffers,
                    receivedOffers: data.receivedOffers || prevCounts.receivedOffers
                }));
            }
        } catch (error) {
            console.error('Error fetching notification counts:', error);
        }
    }, [account, BASE_URL]);

    // Add this function inside the Account component, before the useEffect hooks

    const fetchNFTStats = useCallback(async () => {
        if (!account) return;

        try {
            const collectedResponse = await axios.post(
                `${BASE_URL}/account/collectedCreated`,
                { account, type: 'collected' }
            );
            const createdResponse = await axios.post(
                `${BASE_URL}/account/collectedCreated`,
                { account, type: 'created' }
            );

            if (collectedResponse.status === 200 && createdResponse.status === 200) {
                const collectedData = collectedResponse.data;
                const createdData = createdResponse.data;
                console.log('API response for collected:', collectedData);
                console.log('API response for created:', createdData);
                
                const totalCount = collectedData.nfts.reduce((sum, collection) => sum + collection.nftCount, 0);
                const totalForSale = collectedData.nfts.reduce((sum, collection) => sum + collection.nftsForSale, 0);
                const collectionCount = collectedData.nfts.length;
                const createdCount = createdData.nfts.length;
                
                setNftStats({ 
                    totalCount, 
                    totalForSale, 
                    collectionCount,
                    createdCount
                });
                setCreatedNFTsCount(createdCount);
            }
        } catch (error) {
            console.error('Error fetching NFT stats:', error);
        }
    }, [account, BASE_URL]);

    // Also, add fetchXRPBalance function if it's not already defined
    const fetchXRPBalance = useCallback(async () => {
        if (!account) return;

        const client = new Client('wss://s1.ripple.com');
        try {
            await client.connect();
            const accountInfoResponse = await client.request({
                command: 'account_info',
                account: account,
                ledger_index: 'validated'
            });

            if (accountInfoResponse.result && accountInfoResponse.result.account_data) {
                const totalBalance = parseFloat(accountInfoResponse.result.account_data.Balance) / 1000000;
                const ownerCount = parseInt(accountInfoResponse.result.account_data.OwnerCount);

                // Fetch current reserve settings
                const serverInfoResponse = await client.request({
                    command: 'server_info'
                });

                if (serverInfoResponse.result && serverInfoResponse.result.info) {
                    const baseReserve = parseFloat(serverInfoResponse.result.info.validated_ledger.reserve_base_xrp);
                    const ownerReserve = parseFloat(serverInfoResponse.result.info.validated_ledger.reserve_inc_xrp);

                    const totalReserve = baseReserve + (ownerCount * ownerReserve);
                    const available = Math.max(totalBalance - totalReserve, 0);

                    setXrpBalance(totalBalance.toFixed(2));
                    setAvailableBalance(available.toFixed(2));
                }
            }
        } catch (error) {
            console.error('Error fetching XRP balance:', error);
        } finally {
            client.disconnect();
        }
    }, [account]);

    // Update the useEffect dependencies
    useEffect(() => {
        if (account) {
            getOffersCount();
            fetchNFTStats();
            fetchXRPBalance();
        }
    }, [account, sync, getOffersCount, fetchNFTStats, fetchXRPBalance]);

    useEffect(() => {
        setNftStats(prevStats => ({
            ...prevStats,
            createdCount: createdNFTsCount
        }));
    }, [createdNFTsCount]);

    useEffect(() => {
        console.log('Notification counts changed:', notificationCounts);
    }, [notificationCounts]);

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

    const totalNotifications = useMemo(() => 
        Object.values(notificationCounts).reduce((sum, count) => sum + count, 0),
        [notificationCounts]
    );

    console.log('Current notification counts:', notificationCounts);
    console.log('Total notifications:', totalNotifications);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Box sx={{ position: 'relative', mt: 7, mx: { xs: 2, md: 4 } }}>
                <BackgroundImage
                    sx={{
                        backgroundImage: `url(${bannerImage})`
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: (theme) =>
                            alpha(theme.palette.background.default, 0.8),
                        backdropFilter: 'blur(15px)',
                        zIndex: 0
                    }}
                />
                <GlassBox
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'center', md: 'flex-start' },
                        position: 'relative',
                        zIndex: 1,
                        mx: { xs: -2, md: -4 }, // Add negative margins to extend to the sides
                        px: { xs: 4, md: 6 },   // Increase padding to compensate for negative margins
                        py: 4                   // Add some vertical padding
                    }}
                >
                    <Avatar
                        variant="square"
                        sx={{
                            width: { xs: 150, md: 220 },
                            height: { xs: 150, md: 220 },
                            mr: { md: 4 },
                            mb: { xs: 4, md: 0 },
                            borderRadius: (theme) => `${theme.shape.borderRadius * 2}px`,
                            boxShadow: (theme) => `0 10px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <BackgroundBlur
                            sx={{
                                backgroundImage: `url(${logoImage})`,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <IconImage
                                src={logoImage}
                                alt={name || account}
                                sx={{
                                    width: '90%',
                                    height: '90%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
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

                    <Box sx={{ flex: 1 }}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'center', md: 'flex-start' }}
                            sx={{ mb: 3 }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h3" fontWeight="bold" color="primary.main">
                                    {name || account?.toString().slice(0, 5)}
                                </Typography>
                            </Stack>

                            {accountLogin === account && (
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        onClick={handleOpenSettingsModal}
                                        startIcon={<SettingsIcon />}
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.primary.main,
                                            color: (theme) => theme.palette.primary.contrastText,
                                            '&:hover': {
                                                backgroundColor: (theme) => theme.palette.primary.dark
                                            }
                                        }}
                                    >
                                        Settings
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={onLogoutXumm}
                                        startIcon={<Icon icon="mdi:logout" />}
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.error.main,
                                            color: (theme) => theme.palette.error.contrastText,
                                            '&:hover': {
                                                backgroundColor: (theme) => theme.palette.error.dark
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </Stack>
                            )}
                        </Stack>

                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: isMobile ? 'center' : 'left',
                                    width: '100%',
                                }}
                            >
                                {account}
                            </Typography>
                            <CopyToClipboard
                                text={account}
                                onCopy={() => {
                                    openSnackbar('Copied!', 'success');
                                }}
                            >
                                <Tooltip title="Click to copy">
                                    <IconButton>
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
                                <IconButton>
                                    <OpenInNewIcon />
                                </IconButton>
                            </Link>
                        </Box>

                        <SeeMoreTypography
                            variant="body1"
                            text={description}
                            maxLines={3}
                            sx={{ mb: 4 }}
                        />

                        {/* Add NFT statistics here */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {[
                                { label: 'Collections', value: nftStats.collectionCount, icon: <CollectionsIcon /> },
                                { label: 'Total NFTs', value: nftStats.totalCount, icon: <ImageIcon /> },
                                { label: 'NFTs for Sale', value: nftStats.totalForSale, icon: <ShoppingCartIcon /> },
                                { label: 'Created NFTs', value: nftStats.createdCount, icon: <BrushIcon /> },
                                { label: 'XRP Available', value: availableBalance, icon: <AccountBalanceWalletIcon /> },
                            ].map((stat, index) => (
                                <Grid item xs={6} sm={4} md={2.4} key={index}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: (theme) => theme.shadows[6],
                                            },
                                        }}
                                    >
                                        <Tooltip title={stat.label}>
                                            {stat.icon}
                                        </Tooltip>
                                        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            {stat.value || '0'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </GlassBox>
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
                            setCreatedNFTsCount={setCreatedNFTsCount}
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={1}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <Offers
                            account={account}
                            {...notificationCounts}
                            setAcceptNfts={(value) => updateNotificationCount('acceptNfts', value)}
                            setOrphanedOffers={(value) => updateNotificationCount('orphanedOffers', value)}
                            setBuyOffers={(value) => updateNotificationCount('buyOffers', value)}
                            setSellOffers={(value) => updateNotificationCount('sellOffers', value)}
                            setReceivedOffers={(value) => updateNotificationCount('receivedOffers', value)}
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={2}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <History account={account} />
                    </Stack>
                </TabPanel>
            </Box>

            <EditProfileModal 
                open={isSettingsModalOpen} 
                onClose={handleCloseSettingsModal} 
            />
        </>
    );
}