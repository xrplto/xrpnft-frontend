import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";
import { useContext, useState } from "react";

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
import { getMinterName } from "src/utils/constants";
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import { getNftCoverUrl } from 'src/utils/parse';

// Components
import Label from './Label';
import { AppContext } from "src/AppContext";

const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px',
    }
}));

const GlassContent = styled(CardContent)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
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
    } = nft;

    const isSold = false;
    const imgUrl = getNftCoverUrl(nft, 'small');
    const isVideo = false;
    const name = nft.meta?.name || meta?.Name || 'No Name';

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }


    const onImageLoaded = () => {
        setLoadingImg(false)
    }

    const handleRemoveNft = (e) => {
        e.preventDefault();

        if (!isAdmin) return;

        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }

        handleRemove(NFTokenID);
    }

    return (
        <Box sx={{ 
            position: 'relative', 
            padding: '16px', // Increased padding
            '&:hover': {
                zIndex: 1,
            }
        }}>
            <Link href={`/nft/${NFTokenID}`} underline='none'>
                <CardWrapper
                    sx={{
                        width: '100%',
                        maxWidth: { xs: '100%', sm: 320, md: 340, lg: 360 }, // Increased max-width
                        aspectRatio: '3 / 4',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {isAdmin &&
                        <CloseIcon
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                zIndex: 1500,
                                color: theme.palette.primary.main,
                            }}
                            onClick={(e) => handleRemoveNft(e)}
                        />
                    }
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
                    <CardMedia
                        component={loadingImg ? 'div' : (isVideo ? 'video' : 'img')}
                        image={imgUrl}
                        loading={loadingImg.toString()}
                        alt={'NFT' + uuid}
                        sx={{
                            width: '100%',
                            flexGrow: 1,
                            objectFit: 'cover',
                            borderTopLeftRadius: theme.shape.borderRadius * 2,
                            borderTopRightRadius: theme.shape.borderRadius * 2,
                        }}
                    />
                    {loadingImg && (
                        <Skeleton
                            variant='rectangular'
                            sx={{
                                width: '100%',
                                flexGrow: 1,
                                borderTopLeftRadius: theme.shape.borderRadius * 2,
                                borderTopRightRadius: theme.shape.borderRadius * 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                            }}
                        />
                    )}
                    <img src={imgUrl}
                        style={{ display: 'none' }}
                        onLoad={onImageLoaded} />
                    {
                        isVideo &&
                        <video src={imgUrl}
                            style={{ display: 'none' }}
                            onCanPlay={onImageLoaded}
                        />
                    }
                    <GlassContent sx={{ 
                        padding: '16px', // Increased padding
                        display: 'flex', 
                        flexDirection: 'column', 
                        flexShrink: 0, 
                        height: '110px' // Slightly increased height
                    }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 0.75, // Slightly increased margin
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.2,
                                fontSize: '0.9rem', // Increased font size
                                color: theme.palette.text.primary,
                            }}
                        >
                            {name}
                        </Typography>
                        
                        <Stack spacing={0.75} mt="auto"> {/* Increased spacing */}
                            <Stack direction="row" alignItems='center' justifyContent='space-between'>
                                {renderPrice()}
                                {renderRarityRank()}
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
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
        if (!cost) return <Typography variant='body2' color="text.secondary" fontSize="0.85rem">Unlisted</Typography>;
        
        return cost.currency === "XRP" ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Icon icon={rippleSolid} width="18" height="18" color={theme.palette.primary.main} />
                <Typography variant="body2" fontWeight="600" fontSize="0.85rem" color="primary.main">{fNumber(cost.amount)}</Typography>
            </Stack>
        ) : (
            <Typography variant="body2" fontWeight="600" fontSize="0.85rem" color="primary.main">{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>
        );
    }
    
    function renderOffer() {
        if (!costb) return <Box sx={{ visibility: 'hidden', fontSize: '0.75rem' }}>No offer</Box>;
        
        return (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant='caption' color="text.secondary" fontSize="0.75rem">Offer:</Typography>
                {costb.currency === "XRP" ? (
                    <>
                        <Icon icon={rippleSolid} color={theme.palette.success.main} width="14" height="14" />
                        <Typography variant='caption' color="success.main" fontWeight="600" fontSize="0.75rem">{fNumber(costb.amount)}</Typography>
                    </>
                ) : (
                    <Typography variant='caption' color="success.main" fontWeight="600" fontSize="0.75rem">
                        {fNumber(costb.amount)} {normalizeCurrencyCodeXummImpl(costb.currency)}
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
                icon={<LeaderboardOutlinedIcon sx={{width: '14px', color: theme.palette.primary.main}} />}
                label={fIntNumber(rarity_rank)}
                sx={{
                    height: '22px',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '& .MuiChip-label': {
                        px: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                    }
                }}
            />
        );
    }

    function renderEvent() {
        return (
            <Typography variant='caption' color="text.secondary" sx={{fontSize: '0.7rem', textAlign: 'right'}}>
                Updated: {updateEvent}
            </Typography>
        );
    }
};