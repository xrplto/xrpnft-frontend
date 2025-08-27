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
import ExploreNFT from './ExploreNFT';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import Watch from 'src/components/Watch';

// Add these imports at the top of the file
import { Grid, Paper } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Add this new styled component for the stat cards
const StatCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.75),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius * 0.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    transition: 'all 0.2s ease-in-out',
    minHeight: 36,
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        borderColor: alpha(theme.palette.primary.main, 0.15)
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
        minHeight: 32,
    }
}));

const IconCover = styled('div')(({ theme }) => ({
    width: 120,
    height: 120,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80
    }
}));

const IconImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit'
});


const HeaderContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    background: alpha(theme.palette.background.default, 0.9),
    backdropFilter: 'blur(20px)',
    borderRadius: 0,
    padding: theme.spacing(2, 0),
    overflow: 'hidden',
    width: '100%',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5, 0),
        marginBottom: theme.spacing(1),
    }
}));




import CheckIcon from '@mui/icons-material/Check';

// Add this new styled component for the verification badge
const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(1),
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '& svg': {
        fontSize: 12,
        fontWeight: 'bold'
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
    const [urlParams, setUrlParams] = useState(null); // Start with null to indicate not loaded
    const [urlParamsReady, setUrlParamsReady] = useState(false);

    useEffect(() => {
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);
        const issuer = params.get('issuer');
        const taxon = params.get('taxon');
        const filterAttrs = params.get('filterAttrs');

        // Only set URL params if there are actual filter parameters
        if (issuer || taxon || filterAttrs) {
            setUrlParams({
                issuer,
                taxon,
                filterAttrs: filterAttrs ? JSON.parse(filterAttrs) : null
            });
        } else {
            setUrlParams({});
        }
        setUrlParamsReady(true);
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


    const floorPrice = floor?.amount || 0;
    let volume1 = fVolume(volume || 0);
    let volume2 = fVolume(totalVolume || 0);
    let volume24h = fVolume(totalVol24h || 0);

    // Calculate percentage listed
    const totalNFTs = extra.onSaleCount + extra.notOnSaleCount;
    const percentListed = ((extra.onSaleCount / totalNFTs) * 100).toFixed(2);


    const shareUrl = `https://xrpnft.com/collection/${slug}`;
    const shareTitle = name;
    const shareDesc = description || '';

    const handleOpenShare = () => {
        setOpenShare(true);
    };
    const handleCloseShare = () => {
        setOpenShare(false);
    };


    return (
        <>
            <HeaderContainer>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(https://s1.xrpnft.com/collection/${logoImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(50px)',
                        opacity: 0.2,
                        zIndex: 0
                    }}
                />
                <Box
                    sx={{
                        px: { xs: 2, sm: 3, md: 4 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'center', md: 'flex-start' },
                            gap: { xs: 2, md: 3 }
                        }}
                    >
                        <IconCover>
                            <IconImage
                                src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                alt={name}
                            />
                        </IconCover>

                        <Box sx={{ flex: 1, width: '100%' }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                sx={{ mb: 1 }}
                            >
                                <Box>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        sx={{ mb: 1 }}
                                    >
                                        <Typography
                                            variant={isMobile ? 'h5' : 'h4'}
                                            fontWeight="600"
                                            sx={{ lineHeight: 1.1 }}
                                        >
                                            {name}
                                        </Typography>
                                        {verified === 'yes' && (
                                            <Tooltip title="Verified Collection" placement="top" arrow>
                                                <VerificationBadge>
                                                    <CheckIcon />
                                                </VerificationBadge>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <Link 
                                            href={`/account/${account}`} 
                                            sx={{ 
                                                color: 'text.primary',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            {accountName || (isMobile ? `${account.slice(0, 4)}...${account.slice(-4)}` : account)}
                                        </Link>
                                    </Typography>
                                </Box>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ 
                                        display: { xs: 'none', sm: 'flex' }
                                    }}
                                >
                                    {accountLogin === collection.account && (
                                        <IconButton
                                            component={Link}
                                            href={`/collection/${slug}/edit`}
                                            size="small"
                                            sx={{
                                                border: 1,
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                                }
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <Watch collection={collection} />
                                    <IconButton
                                        ref={anchorRef}
                                        onClick={handleOpenShare}
                                        size="small"
                                        sx={{
                                            border: 1,
                                            borderColor: 'divider',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                            }
                                        }}
                                    >
                                        <ShareIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>

                            {description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ 
                                        mb: 1.5,
                                        maxWidth: 600,
                                        display: { xs: 'none', sm: 'block' },
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: 1.3,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {description}
                                </Typography>
                            )}

                            <Stack 
                                direction="row" 
                                spacing={1} 
                                flexWrap="wrap"
                                sx={{ 
                                    gap: 1,
                                    '& > *': {
                                        flex: { xs: '0 0 calc(50% - 4px)', sm: '0 0 calc(33.333% - 5px)', md: '1 1 auto' },
                                        minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' }
                                    }
                                }}
                            >
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            Floor
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {fNumber(floorPrice)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            XRP
                                        </Typography>
                                    </Stack>
                                </StatCard>
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            24h Vol
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {volume24h}
                                        </Typography>
                                    </Stack>
                                </StatCard>
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            Total Vol
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {volume2}
                                        </Typography>
                                    </Stack>
                                </StatCard>
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            Items
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {fNumber(items)}
                                        </Typography>
                                    </Stack>
                                </StatCard>
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            Owners
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {fNumber(extra.owners)}
                                        </Typography>
                                    </Stack>
                                </StatCard>
                                <StatCard>
                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                            Listed
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {percentListed}%
                                        </Typography>
                                    </Stack>
                                </StatCard>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </HeaderContainer>

            <Box sx={{ width: '100%' }}>
                {urlParamsReady && (
                    <ExploreNFT collection={collection} showBanner={false} urlParams={urlParams || {}} />
                )}
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
