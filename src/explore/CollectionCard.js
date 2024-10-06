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
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
  `
);

export default function CollectionCard({ collectionData, type, account, handleRemove }) {
    const collection = collectionData.collection;
    //console.log(`CollectionCard: ${JSON.stringify(collection)}`);
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
        //account,
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
        rarity_rank
    } = collection;

    const isSold = false;

    // const imgUrl = '/static/nft.png';
    const imgUrl = `https://s1.xrpnft.com/collection/${collection.logoImage}`//getNftCoverUrl(nft, 'small');//get..ImgUrl(nft, 300);

    const isVideo = /*meta?.video ? true : */false; // disabling for  now video as showing animated thumbnails

    const [loadingImg, setLoadingImg] = useState(true)

    const name = collection.name || 'No Name';

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

    const collectionType = type.charAt(0).toUpperCase() + type.slice(1)

    return (
        <Link href={`/account/${account}/collection${collectionType}/${collectionData.collection.id/*slug*/}`} underline='none' sx={{ position: 'relative' }}>
            <CardWrapper
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 280,
                    aspectRatio: '9 / 15',
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
                        height: '75%',
                        maxWidth: 280,
                        objectFit: 'cover'
                    }}
                />
                {loadingImg && (
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            height: '75%'
                        }}
                    />
                )}
                <img src={imgUrl} style={{ display: 'none' }} onLoad={onImageLoaded} />
                {isVideo && <video src={imgUrl} style={{ display: 'none' }} onCanPlay={onImageLoaded} />}

                <CardContent sx={{ padding: '12px 16px' }}>
                    <Box display={'flex'} flexDirection='column' justifyContent={'space-between'} height="100%">
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {name}
                        </Typography>

                        <Grid container alignItems='center' spacing={1}>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems='center' justifyContent='space-between'>
                                    <Typography variant='body2' color="text.secondary">
                                        {collectionData.nftCount} item{collectionData.nftCount !== 1 && 's'}
                                    </Typography>

                                    {rarity_rank > 0 && (
                                        <Chip
                                            variant="outlined"
                                            icon={<LeaderboardOutlinedIcon sx={{ width: '14px' }} />}
                                            label={<Typography variant="caption" fontWeight={600}>{fIntNumber(rarity_rank)}</Typography>}
                                            sx={{
                                                height: '24px',
                                                borderColor: theme.palette.primary.main,
                                                '& .MuiChip-icon': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body2' color="text.secondary">
                                    {collectionData.nftsForSale} listed
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </CardWrapper>
        </Link>
    );
};