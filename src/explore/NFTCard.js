import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";
import { useContext, useState } from "react";

// Material
import {
    styled, useTheme,
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
// import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import CloseIcon from '@mui/icons-material/Close';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
// import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { getMinterName } from "src/utils/constants";
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import { getNftCoverUrl } from 'src/utils/parse';

// Components
// import FlagsContainer from 'src/components/Flags';
import Label from './Label';
import { AppContext } from "src/AppContext";

const CardWrapper = styled(Card)(
    ({ theme }) => `
        border-radius: 12px;
        backdrop-filter: blur(50px);
        padding: 0;
        cursor: pointer;
        transition: transform 0.3s ease-in-out;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        &:hover {
            transform: translateY(-4px);
        }
  `
);

export default function NFTCard({ nft, handleRemove }) {
    const theme = useTheme();

    const { accountProfile } = useContext(AppContext);
    const isAdmin = accountProfile?.admin;

    // const [imgUrl, setImgUrl] = useState('');
    // const [loading, setLoading] = useState(false);

    // const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);
    

    // const like = () => setIsLike(!isLike);

    const {
        uuid,
        // name,
        // flag,
        account,
        // minter,
        cost,
        costb,
        // issuer,
        // date,
        meta,
        dfile,
        NFTokenID,
        // URI,
        // status,
        destination,
        rarity,
        rarity_rank,
        updateEvent,
    } = nft;

    const isSold = false;

    // const imgUrl = '/static/nft.png';
    const imgUrl = getNftCoverUrl(nft, 'small');// , 300);

    const isVideo = /*meta?.video ? true : */false; // disabling for  now video as showing animated thumbnails

    const [loadingImg, setLoadingImg] = useState(true)

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
        <Link href={`/nft/${NFTokenID}`} underline='none' sx={{ position: 'relative' }}>
            <CardWrapper
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 280,
                    aspectRatio: '9 / 14',
                }}
            >
                {isAdmin &&
                    <CloseIcon
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 1500
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
                        height: '70%',
                        maxHeight: 220,
                        objectFit: 'cover'
                    }}
                />
                {loadingImg && (
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            height: '70%',
                            maxHeight: 220,
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
                <CardContent sx={{ padding: '12px 16px' }}>
                    <Box display={'flex'} flexDirection='column' justifyContent={'space-between'} height="100%">
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {name}
                        </Typography>
                        
                        {destination && getMinterName(account) ? (
                            <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt: 1}}>
                                <Tooltip title={`Sold & Transfer`}>
                                    <SportsScoreIcon color="primary" />
                                </Tooltip>
                                {renderRarityRank()}
                            </Stack>
                        ) : (
                            <Box>
                                <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mb: 1}}>
                                    {renderPrice()}
                                    {renderRarityRank()}
                                </Stack>
                                {renderOffer()}
                            </Box>
                        )}
                        
                        <Typography variant='caption' color="text.secondary" sx={{mt: 1}}>
                            Event: {updateEvent}
                        </Typography>
                    </Box>
                </CardContent>
            </CardWrapper>
        </Link>
    );
    
    function renderPrice() {
        if (!cost) return <Typography variant='body2' color="text.secondary">Unlisted</Typography>;
        
        return cost.currency === "XRP" ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Icon icon={rippleSolid} width="16" height="16" />
                <Typography variant="h6">{fNumber(cost.amount)}</Typography>
            </Stack>
        ) : (
            <Typography variant="h6">{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>
        );
    }
    
    function renderOffer() {
        if (!costb) return <Typography variant='body2' color="text.secondary">No Offer</Typography>;
        
        return costb.currency === "XRP" ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant='body2' color="text.secondary">Offer:</Typography>
                <Icon icon={rippleSolid} color="#00AB55" width="14" height="14" />
                <Typography variant='subtitle2' color="#00AB55">{fNumber(costb.amount)}</Typography>
            </Stack>
        ) : (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant='body2' color="text.secondary">Offer:</Typography>
                <Typography variant='subtitle2' color="#00AB55">
                    {fNumber(costb.amount)} {normalizeCurrencyCodeXummImpl(costb.currency)}
                </Typography>
            </Stack>
        );
    }
    
    function renderRarityRank() {
        if (rarity_rank <= 0) return null;
        
        return (
            <Chip
                variant="outlined"
                size="small"
                icon={<LeaderboardOutlinedIcon sx={{width: '14px'}} />}
                label={fIntNumber(rarity_rank)}
                sx={{
                    height: '24px',
                    '& .MuiChip-label': {
                        px: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                    }
                }}
            />
        );
    }
};