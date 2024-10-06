import React, { useRef, useState, useContext } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';

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
import CollectionActivity from 'src/explore/CollectionActivity';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import Watch from 'src/components/Watch';

const IconCover = styled('div')(({ theme }) => ({
    width: 192,
    height: 192,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha('#0095D9', 0.2)}`,
    [theme.breakpoints.down('sm')]: {
        width: 132,
        height: 132
    }
}));

const IconImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit' // Inherit border radius from parent
});

const StatItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(2)
}));

const GlassBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px 0 ${alpha('#0095D9', 0.2)}`,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    '&:hover': {
        background: alpha(theme.palette.background.paper, 0.2),
        boxShadow: `0 8px 32px 0 ${alpha('#0095D9', 0.3)}`
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

export default function ViewNFT({ collection }) {
    const anchorRef = useRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { accountProfile } = useContext(AppContext);
    const accountLogin = accountProfile?.account;

    const [openShare, setOpenShare] = useState(false);

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
        floor
    } = collection;

    const floorPrice = floor?.amount || 0;
    let volume1 = fVolume(volume || 0);
    let volume2 = fVolume(totalVolume || 0);

    const shareUrl = `https://xrpnft.com/collection/${slug}`;
    const shareTitle = name;
    const shareDesc = description || '';

    const handleOpenShare = () => setOpenShare(true);
    const handleCloseShare = () => setOpenShare(false);

    return (
        <>
            <GlassBox
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    mb: 6,
                    mx: { xs: 2, md: 4 },
                    mt: { xs: 10, md: 12 }
                }}
            >
                <IconCover
                    sx={{
                        mr: { md: 4 },
                        mb: { xs: 4, md: 0 },
                        width: { xs: 150, md: 220 },
                        height: { xs: 150, md: 220 },
                        border: 'none',
                        boxShadow: (theme) =>
                            `0 10px 30px ${alpha(theme.palette.info.light, 0.3)}`
                    }}
                >
                    <IconImage
                        src={`https://s1.xrpnft.com/collection/${logoImage}`}
                        alt={name}
                    />
                </IconCover>

                <Box sx={{ flex: 1 }}>
                    <Stack
                        direction={fullScreen ? 'column' : 'row'}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={fullScreen ? 'center' : 'flex-start'}
                        sx={{ mb: 3 }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h3" fontWeight="bold">
                                {name}
                            </Typography>
                            {verified === 'yes' && (
                                <Tooltip title="Verified">
                                    <VerifiedIcon color="primary" />
                                </Tooltip>
                            )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
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

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        By{' '}
                        <Link href={`/account/${account}`} color="primary">
                            {accountName ||
                                account.slice(0, 4) + '...' + account.slice(-4)}
                        </Link>
                        &nbsp;·&nbsp;Created {formatMonthYear(created)}
                    </Typography>

                    <SeeMoreTypography
                        variant="body1"
                        text={description}
                        maxLines={3}
                        sx={{ mb: 4 }}
                    />

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                        <StatItem>
                            <Typography variant="h6" fontWeight="bold">
                                {items}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                items
                            </Typography>
                        </StatItem>
                        <StatItem>
                            <Typography variant="h6" fontWeight="bold">
                                {extra.owners}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                owners
                            </Typography>
                        </StatItem>
                        <StatItem>
                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                            >
                                <Icon
                                    icon={rippleSolid}
                                    width="20"
                                    height="20"
                                />
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    noWrap
                                >
                                    {volume2}
                                </Typography>
                                <Tooltip
                                    title={
                                        <Typography variant="body2">
                                            Volume on XRPNFT: {volume1}
                                        </Typography>
                                    }
                                >
                                    <Icon
                                        icon={infoFilled}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '16px'
                                        }}
                                    />
                                </Tooltip>
                            </Stack>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                            >
                                total volume
                            </Typography>
                        </StatItem>
                        <StatItem>
                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                            >
                                <Icon
                                    icon={rippleSolid}
                                    width="20"
                                    height="20"
                                />
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    noWrap
                                >
                                    {fNumber(floorPrice)}
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                            >
                                floor price
                            </Typography>
                        </StatItem>
                    </Box>
                </Box>
            </GlassBox>

            <Box sx={{ mx: { xs: 2, md: 4 } }}>
                <ExploreNFT collection={collection} />
                <CollectionActivity collection={collection} />
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