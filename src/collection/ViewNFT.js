import React, { useRef, useState, useContext } from 'react';
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import { useTheme, alpha } from '@mui/material/styles';
import {
    styled, useMediaQuery,
    Box, IconButton, Link, Popover, Stack, Tooltip, Typography, Divider
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

const IconCover = styled('div')(({ theme }) => ({
    width: 192,
    height: 192,
    marginTop: -96,
    marginBottom: 24,
    border: `6px solid ${theme.palette.background.paper}`,
    borderRadius: theme.shape.borderRadius * 2, // Rounded corners
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        width: 132,
        height: 132,
        marginTop: -66,
    },
}));

const IconImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'inherit', // Inherit border radius from parent
});

const StatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

const StatItem = styled(Box)(({ theme }) => ({
    textAlign: 'center',
}));

export default function ViewNFT({ collection }) {
    const anchorRef = useRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { accountProfile } = useContext(AppContext);
    const accountLogin = accountProfile?.account;

    const [openShare, setOpenShare] = useState(false);

    const {
        account, accountName, name, slug, items, description, logoImage,
        extra, verified, created, volume, totalVolume, floor
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
            <Box sx={{ position: 'relative', mb: 4 }}>
                <Box
                    component="img"
                    src={`https://s1.xrpnft.com/collection/${collection.bannerImage}`}
                    alt="Collection Banner"
                    sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                        borderRadius: theme => theme.shape.borderRadius * 2,
                        boxShadow: theme => theme.shadows[3],
                    }}
                />
                <IconCover>
                    <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`} alt={name} />
                </IconCover>
            </Box>

            <Stack direction={fullScreen ? "column" : "row"} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3" fontWeight="bold">{name}</Typography>
                    {verified === 'yes' && (
                        <Tooltip title='Verified'>
                            <VerifiedIcon color="primary" />
                        </Tooltip>
                    )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {accountLogin === collection.account && (
                        <Tooltip title="Edit your collection">
                            <IconButton component={Link} href={`/collection/${slug}/edit`} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Watch collection={collection} />
                    <Tooltip title="Share">
                        <IconButton ref={anchorRef} onClick={handleOpenShare} color="primary">
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton color="primary">
                        <MoreHorizIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Typography variant="body1" sx={{ mb: 2 }}>
                By <Link href={`/account/${account}`} color="primary">{accountName || account.slice(0, 4) + '...' + account.slice(-4)}</Link>
                &nbsp;·&nbsp;Created {formatMonthYear(created)}
            </Typography>

            <SeeMoreTypography
                variant="body1"
                text={description}
                maxLines={3}
                sx={{ mb: 4 }}
            />

            <Divider sx={{ mb: 4 }} />

            <StatsContainer>
                <StatItem>
                    <Typography variant='h4' fontWeight="bold">{items}</Typography>
                    <Typography variant='body2' color="text.secondary">items</Typography>
                </StatItem>
                <StatItem>
                    <Typography variant='h4' fontWeight="bold">{extra.owners}</Typography>
                    <Typography variant='body2' color="text.secondary">owners</Typography>
                </StatItem>
                <StatItem>
                    <Stack direction="row" spacing={0.5} alignItems='center' justifyContent="center">
                        <Icon icon={rippleSolid} width="24" height="24" />
                        <Typography variant="h4" fontWeight="bold" noWrap>{volume2}</Typography>
                        <Tooltip
                            title={
                                <Typography variant="body2">Volume on XRPNFT: {volume1}</Typography>
                            }
                        >
                            <Icon icon={infoFilled} style={{ cursor: 'pointer' }} />
                        </Tooltip>
                    </Stack>
                    <Typography variant='body2' color="text.secondary" noWrap>total volume</Typography>
                </StatItem>
                <StatItem>
                    <Stack direction="row" spacing={0.5} alignItems='center' justifyContent="center">
                        <Icon icon={rippleSolid} width="24" height="24" />
                        <Typography variant="h4" fontWeight="bold" noWrap>{fNumber(floorPrice)}</Typography>
                    </Stack>
                    <Typography variant='body2' color="text.secondary" noWrap>floor price</Typography>
                </StatItem>
            </StatsContainer>

            <ExploreNFT collection={collection} />

            <Popover
                open={openShare}
                onClose={handleCloseShare}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                    <FacebookShareButton url={shareUrl} quote={shareTitle} hashtag="#" description={shareDesc} onClick={handleCloseShare}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton title={shareTitle} url={shareUrl} hashtag="#" onClick={handleCloseShare}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </Stack>
            </Popover>
        </>
    );
}