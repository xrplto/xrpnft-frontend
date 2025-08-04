import React, { useRef, useState, useContext, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import { useRouter } from 'next/router';

// Material
import { useTheme, alpha } from '@mui/material/styles';
import {
    styled,
    useMediaQuery,
    Box,
    IconButton,
    Link,
    Popover,
    Stack,
    Tooltip,
    Typography,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { formatMonthYear } from 'src/utils/formatTime';
import { fNumber, fVolume } from 'src/utils/formatNumber';

// Context
import { AppContext } from 'src/AppContext';

// Components
import ExploreNFT from 'src/explore';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import Watch from 'src/components/Watch';

// Add these imports at the top of the file
import { Grid, Paper } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Add this new styled component for the stat cards
const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1), // Reduced from 1.5
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'all 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6]
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5), // Further reduced padding on mobile
    }
}));

const IconCover = styled('div')(({ theme }) => ({
    width: 220,
    height: 220,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    [theme.breakpoints.down('sm')]: {
        width: 100, // Reduced from 120
        height: 100 // Reduced from 120
    }
}));

const IconImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit'
});

const StatItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2)
}));

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
    }
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(4, 0),
    background: `linear-gradient(90deg, ${alpha(
        theme.palette.primary.main,
        0
    )} 0%, ${alpha(theme.palette.primary.main, 0.5)} 50%, ${alpha(
        theme.palette.primary.main,
        0
    )} 100%)`
}));

const BackgroundImage = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(20px)',
    opacity: 0.3,
    zIndex: -1
}));

const BackgroundBlur = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    opacity: 0.3,
    zIndex: -1
}));

// Add this import
import CheckIcon from '@mui/icons-material/Check';

// Add this new styled component for the verification badge
const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '& svg': {
        fontSize: 14
    }
}));

export default function ViewNFT({ collection }) {
    const router = useRouter();
    const anchorRef = useRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { accountProfile } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [openShare, setOpenShare] = useState(false);
    const [urlParams, setUrlParams] = useState({});

    useEffect(() => {
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);
        const issuer = params.get('issuer');
        const taxon = params.get('taxon');
        const filterAttrs = params.get('filterAttrs');

        console.log('ViewNFT URL Parameters:', {
            issuer,
            taxon,
            filterAttrs,
            parsedFilterAttrs: filterAttrs ? JSON.parse(filterAttrs) : null
        });

        setUrlParams({
            issuer,
            taxon,
            filterAttrs: filterAttrs ? JSON.parse(filterAttrs) : null
        });
    }, [router.asPath]);

    const {
        account,
        accountName,
        name,
        slug,
        items,
        description,
        logoImage,
        extra,
        verified,
        created,
        volume,
        totalVolume,
        floor,
        totalVol24h
    } = collection;

    // Add this line to log the API URL
    console.log('API URL for Collection data:', `https://api.xrpnft.com/collection/${slug}`);

    console.log('Collection data:', collection);
    console.log('Account login:', accountLogin);
    console.log('Is mobile:', isMobile);

    const floorPrice = floor?.amount || 0;
    let volume1 = fVolume(volume || 0);
    let volume2 = fVolume(totalVolume || 0);
    let volume24h = fVolume(totalVol24h || 0);

    // Calculate percentage listed
    const totalNFTs = extra.onSaleCount + extra.notOnSaleCount;
    const percentListed = ((extra.onSaleCount / totalNFTs) * 100).toFixed(2);

    console.log('Floor price:', floorPrice);
    console.log('Volume 1:', volume1);
    console.log('Volume 2:', volume2);
    console.log('24h Volume:', volume24h);
    console.log('Percent Listed:', percentListed);

    const shareUrl = `https://xrpnft.com/collection/${slug}`;
    const shareTitle = name;
    const shareDesc = description || '';

    const handleOpenShare = () => {
        console.log('Opening share dialog');
        setOpenShare(true);
    };
    const handleCloseShare = () => {
        console.log('Closing share dialog');
        setOpenShare(false);
    };

    console.log('Rendering ViewNFT component');

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    mb: { xs: 2, md: 6 }, // Reduced vertical margin on mobile
                    mx: { xs: 1, md: 4 }, // Reduced horizontal margin on mobile
                    mt: { xs: 4, md: 12 } // Reduced top margin on mobile
                }}
            >
                <BackgroundImage
                    sx={{
                        backgroundImage: `url(https://s1.xrpnft.com/collection/${logoImage})`
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
                        py: { xs: 1.5, md: 3 }, // Reduced vertical padding on mobile
                        px: { xs: 1.5, md: 3 } // Added horizontal padding reduction on mobile
                    }}
                >
                    <IconCover
                        sx={{
                            mr: { md: 4 },
                            mb: { xs: 1.5, md: 0 }, // Reduced bottom margin on mobile
                            width: { xs: 100, md: 220 }, // Adjusted width
                            height: { xs: 100, md: 220 }, // Adjusted height
                            border: 'none',
                            boxShadow: (theme) =>
                                `0 10px 30px ${alpha(
                                    theme.palette.primary.main,
                                    0.3
                                )}`
                        }}
                    >
                        <BackgroundBlur
                            sx={{
                                backgroundImage: `url(https://s1.xrpnft.com/collection/${logoImage})`
                            }}
                        />
                        <IconImage
                            src={`https://s1.xrpnft.com/collection/${logoImage}`}
                            alt={name}
                        />
                    </IconCover>

                    <Box sx={{ flex: 1 }}>
                        <Stack
                            direction={fullScreen ? 'column' : 'row'}
                            spacing={{ xs: 0.5, md: 2 }} // Reduced spacing on mobile
                            justifyContent="space-between"
                            alignItems={fullScreen ? 'center' : 'flex-start'}
                            sx={{ mb: { xs: 0.5, md: 3 } }} // Reduced margin on mobile
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color="primary.main"
                                >
                                    {name}
                                </Typography>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerificationBadge>
                                            <CheckIcon />
                                        </VerificationBadge>
                                    </Tooltip>
                                )}
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                {accountLogin === collection.account && (
                                    <Tooltip title="Edit your collection">
                                        <IconButton
                                            component={Link}
                                            href={`/collection/${slug}/edit`}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Watch collection={collection} />
                                <Tooltip title="Share">
                                    <IconButton
                                        ref={anchorRef}
                                        onClick={handleOpenShare}
                                        color="primary"
                                    >
                                        <ShareIcon />
                                    </IconButton>
                                </Tooltip>
                                <IconButton color="primary">
                                    <MoreHorizIcon />
                                </IconButton>
                            </Stack>
                        </Stack>

                        <Typography
                            variant="body2" // Changed from body1 to body2 for mobile
                            sx={{ 
                                mb: { xs: 0.5, md: 2 },
                                fontSize: { xs: '0.8rem', md: '1rem' } // Reduced font size on mobile
                            }}
                        >
                            By{' '}
                            <Link href={`/account/${account}`} color="primary">
                                {accountName ||
                                    account.slice(0, 4) +
                                        '...' +
                                        account.slice(-4)}
                            </Link>
                            &nbsp;·&nbsp;Created {formatMonthYear(created)}
                        </Typography>

                        <Typography
                            variant="body2" // Changed from body1 to body2 for mobile
                            sx={{ 
                                mb: { xs: 1, md: 4 },
                                fontSize: { xs: '0.8rem', md: '1rem' }, // Reduced font size on mobile
                                display: { xs: 'none', md: 'block' } // Hide description on mobile
                            }}
                        >
                            {description}
                        </Typography>

                        <Grid
                            container
                            spacing={{ xs: 0.5, md: 2 }} // Reduced spacing on mobile
                            sx={{ mb: { xs: 1, md: 3 } }} // Reduced margin on mobile
                        >
                            {[
                                {
                                    label: 'Floor Price',
                                    value: `${fNumber(floorPrice)} XRP`,
                                    icon: <LocalOfferIcon />
                                },
                                {
                                    label: '24h Volume',
                                    value: `${volume24h} XRP`,
                                    icon: <ShowChartIcon />
                                },
                                {
                                    label: 'Total Volume',
                                    value: `${volume2} XRP`,
                                    icon: <ShowChartIcon />
                                },
                                {
                                    label: 'Items',
                                    value: items,
                                    icon: <CollectionsIcon />
                                },
                                {
                                    label: 'Owners',
                                    value: extra.owners,
                                    icon: <PeopleIcon />
                                },
                                {
                                    label: '% Listed',
                                    value: `${percentListed}%`,
                                    icon: <LocalOfferIcon />
                                }
                            ].map((stat, index) => {
                                console.log(`Rendering stat: ${stat.label}`, stat.value);
                                return (
                                    <Grid item xs={6} sm={4} md={2} key={index}>
                                        <StatCard elevation={3}>
                                            <Tooltip title={stat.label}>
                                                {React.cloneElement(stat.icon, {
                                                    fontSize: 'small',
                                                    color: 'primary'
                                                })}
                                            </Tooltip>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="primary.main"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {stat.value}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {stat.label}
                                            </Typography>
                                        </StatCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </GlassBox>
            </Box>

            <Box sx={{ mx: { xs: 1, md: 4 } }}> {/* Reduced horizontal margin on mobile */}
                <ExploreNFT collection={collection} showBanner={false} urlParams={urlParams} />
            </Box>

            <Popover
                open={openShare}
                onClose={handleCloseShare}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                    <FacebookShareButton
                        url={shareUrl}
                        quote={shareTitle}
                        hashtag="#"
                        description={shareDesc}
                        onClick={handleCloseShare}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        title={shareTitle}
                        url={shareUrl}
                        hashtag="#"
                        onClick={handleCloseShare}
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </Stack>
            </Popover>
        </>
    );
}
