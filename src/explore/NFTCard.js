import { normalizeCurrencyCodeXummImpl } from 'src/utils/normalizers';
import { useContext, useState } from 'react';

// Material
import {
    styled,
    useTheme,
    alpha,
    Box,
    CardMedia,
    Chip,
    Link,
    Stack,
    Tooltip,
    Typography,
    Skeleton,
    Card,
    Grid,
    CardContent
} from '@mui/material';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import CloseIcon from '@mui/icons-material/Close';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils
import { getMinterName } from 'src/utils/constants';
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import { getNftCoverUrl } from 'src/utils/parse';

// Components
import Label from './Label';
import { AppContext } from 'src/AppContext';

const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden', // Changed from 'visible' to 'hidden'
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,

    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px'
    }
}));

const GlassContent = styled(CardContent)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '130px', // Further decreased from 140px to 130px
    padding: theme.spacing(0.75) // Even more reduced padding
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    paddingTop: '100%', // This creates a 1:1 aspect ratio
    overflow: 'hidden'
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderTopLeftRadius: theme.shape.borderRadius * 2, // Add this line
    borderTopRightRadius: theme.shape.borderRadius * 2 // Add this line
}));

const SequenceOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    padding: '3px 8px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 700,
    zIndex: 2,
    boxShadow: `0 2px 8px 0 ${alpha(theme.palette.common.black, 0.25)}`,
}));

export default function NFTCard({ nft, handleRemove }) {
    const theme = useTheme();

    const { accountProfile } = useContext(AppContext);
    const isAdmin = accountProfile?.admin;

    const [colors, setColors] = useState([]);
    const [loadingImg, setLoadingImg] = useState(true);

    const {
        uuid,
        account,
        cost,
        costb,
        meta,
        dfile,
        NFTokenID,
        destination,
        rarity,
        rarity_rank,
        updateEvent,
        MasterSequence
    } = nft;

    const isSold = false;
    const imgUrl = getNftCoverUrl(nft, 'small');
    const isVideo = false;
    const name = nft.meta?.name || meta?.Name || 'No Name';

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const onImageLoaded = () => {
        setLoadingImg(false);
    };

    const handleRemoveNft = (e) => {
        e.preventDefault();

        if (!isAdmin) return;

        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }

        handleRemove(NFTokenID);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                padding: { xs: '2px', sm: '5px', md: '10px' }, // Further reduced padding on mobile
                '&:hover': {
                    zIndex: 1
                }
            }}
        >
            <Link href={`/nft/${NFTokenID}`} underline="none">
                <CardWrapper
                    sx={{
                        width: '100%',
                        maxWidth: { xs: '100%', sm: 290, md: 310, lg: 330 },
                        height: '100%',
                        // Further reduced margin bottom for mobile
                        marginBottom: { xs: '5px', sm: '8px', md: 0 }
                    }}
                >
                    {isAdmin && (
                        <CloseIcon
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16, // Changed from 'right: 16' to 'left: 16'
                                zIndex: 1500,
                                color: theme.palette.primary.main
                            }}
                            onClick={(e) => handleRemoveNft(e)}
                        />
                    )}
                    {isSold && (
                        <Label
                            variant="filled"
                            color={(isSold && 'error') || 'info'}
                            sx={{
                                zIndex: 9,
                                top: 24,
                                right: 24,
                                position: 'absolute',
                                textTransform: 'uppercase'
                            }}
                        >
                            SOLD
                        </Label>
                    )}
                    <ImageContainer>
                        <StyledCardMedia
                            component={
                                loadingImg ? 'div' : isVideo ? 'video' : 'img'
                            }
                            image={imgUrl}
                            loading={loadingImg.toString()}
                            alt={'NFT' + uuid}
                        />
                        {loadingImg && (
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    )
                                }}
                            />
                        )}
                        {!loadingImg && MasterSequence && (
                            <SequenceOverlay>
                                #{MasterSequence}
                            </SequenceOverlay>
                        )}
                    </ImageContainer>
                    <img
                        src={imgUrl}
                        style={{ display: 'none' }}
                        onLoad={onImageLoaded}
                    />
                    {isVideo && (
                        <video
                            src={imgUrl}
                            style={{ display: 'none' }}
                            onCanPlay={onImageLoaded}
                        />
                    )}
                    <GlassContent>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.2,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' }, // Smaller font size on mobile
                                color: theme.palette.text.primary,
                                height: '2.2em' // Slightly reduced height
                            }}
                        >
                            {name}
                        </Typography>

                        <Stack spacing={0.1}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                {renderPrice()}
                                {renderRarityRank()}
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                            >
                                {renderOffer()}
                                {renderEvent()}
                            </Stack>
                        </Stack>
                    </GlassContent>
                </CardWrapper>
            </Link>
        </Box>
    );

    function renderPrice() {
        if (!cost)
            return (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize="0.85rem"
                >
                    Unlisted
                </Typography>
            );

        return cost.currency === 'XRP' ? (
            <Stack direction="row" spacing={0.3} alignItems="center">
                <Icon
                    icon={rippleSolid}
                    width="16"
                    height="16"
                    color={theme.palette.primary.main}
                />
                <Typography
                    variant="body2"
                    fontWeight="600"
                    fontSize={{ xs: '0.8rem', sm: '0.85rem' }} // Smaller on mobile
                    color="primary.main"
                >
                    {fNumber(cost.amount)}
                </Typography>
            </Stack>
        ) : (
            <Typography
                variant="body2"
                fontWeight="600"
                fontSize="0.85rem"
                color="primary.main"
            >
                {fNumber(cost.amount)}{' '}
                {normalizeCurrencyCodeXummImpl(cost.currency)}
            </Typography>
        );
    }

    function renderOffer() {
        if (!costb) return <Box flexGrow={1} />; // Add this line to maintain layout when there's no offer

        return (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize="0.75rem"
                    noWrap
                >
                    Offer:
                </Typography>
                {costb.currency === 'XRP' ? (
                    <>
                        <Icon
                            icon={rippleSolid}
                            color={theme.palette.success.main}
                            width="14"
                            height="14"
                        />
                        <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight="600"
                            fontSize="0.75rem"
                            noWrap
                        >
                            {fNumber(costb.amount)}
                        </Typography>
                    </>
                ) : (
                    <Typography
                        variant="caption"
                        color="success.main"
                        fontWeight="600"
                        fontSize="0.75rem"
                        noWrap
                    >
                        {fNumber(costb.amount)}{' '}
                        {normalizeCurrencyCodeXummImpl(costb.currency)}
                    </Typography>
                )}
            </Stack>
        );
    }

    function renderRarityRank() {
        if (rarity_rank <= 0) return null;

        return (
            <Chip
                variant="outlined"
                size="small"
                icon={
                    <LeaderboardOutlinedIcon
                        sx={{
                            width: '14px',
                            color: theme.palette.primary.main
                        }}
                    />
                } // Changed color to primary.main
                label={fIntNumber(rarity_rank)}
                sx={{
                    height: '20px', // Reduced from 22px
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '& .MuiChip-label': {
                        px: 0.4, // Reduced horizontal padding
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Smaller on mobile
                        fontWeight: 600
                    }
                }}
            />
        );
    }

    function renderEvent() {
        if (!updateEvent) return null;

        return (
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    fontSize: { xs: '0.65rem', sm: '0.7rem' }, // Smaller on mobile
                    textAlign: 'right',
                    maxWidth: '50%'
                }}
                noWrap
            >
                Updated: {updateEvent}
            </Typography>
        );
    }
}
