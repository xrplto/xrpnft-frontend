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
                    display: 'flex',
                    flexDirection: 'column',
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
                        flexGrow: 1,
                        objectFit: 'cover'
                    }}
                />
                {loadingImg && (
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            flexGrow: 1,
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
                <CardContent sx={{ padding: '12px', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100px' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            fontSize: '0.8rem',
                        }}
                    >
                        {name}
                    </Typography>
                    
                    <Stack spacing={0.5} mt="auto">
                        <Stack direction="row" alignItems='center' justifyContent='space-between'>
                            {renderPrice()}
                            {renderRarityRank()}
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            {renderOffer()}
                            {renderEvent()}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardWrapper>
        </Link>
    );
    
    function renderPrice() {
        if (!cost) return <Typography variant='body2' color="text.secondary" fontSize="0.75rem">Unlisted</Typography>;
        
        return cost.currency === "XRP" ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Icon icon={rippleSolid} width="14" height="14" />
                <Typography variant="body2" fontWeight="600" fontSize="0.75rem">{fNumber(cost.amount)}</Typography>
            </Stack>
        ) : (
            <Typography variant="body2" fontWeight="600" fontSize="0.75rem">{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>
        );
    }
    
    function renderOffer() {
        if (!costb) return <Box sx={{ visibility: 'hidden', fontSize: '0.65rem' }}>No offer</Box>;
        
        return (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant='caption' color="text.secondary" fontSize="0.65rem">Offer:</Typography>
                {costb.currency === "XRP" ? (
                    <>
                        <Icon icon={rippleSolid} color="#00AB55" width="10" height="10" />
                        <Typography variant='caption' color="#00AB55" fontWeight="600" fontSize="0.65rem">{fNumber(costb.amount)}</Typography>
                    </>
                ) : (
                    <Typography variant='caption' color="#00AB55" fontWeight="600" fontSize="0.65rem">
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
                icon={<LeaderboardOutlinedIcon sx={{width: '10px'}} />}
                label={fIntNumber(rarity_rank)}
                sx={{
                    height: '18px',
                    '& .MuiChip-label': {
                        px: 0.5,
                        fontSize: '0.6rem',
                        fontWeight: 600,
                    }
                }}
            />
        );
    }

    function renderEvent() {
        return (
            <Typography variant='caption' color="text.secondary" sx={{fontSize: '0.6rem', textAlign: 'right'}}>
                Updated: {updateEvent}
            </Typography>
        );
    }
};