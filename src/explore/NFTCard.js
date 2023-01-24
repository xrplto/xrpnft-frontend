import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";
import { useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    Box,
    CardMedia,
    Divider,
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

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
// import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { getMinterName } from "src/utils/constants";
import { fNumber } from 'src/utils/formatNumber';
import { getImgUrl } from 'src/utils/parse';

// Components
// import FlagsContainer from 'src/components/Flags';
import Label from './Label';

const CardWrapper = styled(Card)(
    ({ theme }) => `
        // box-shadow: 0px -0.5px 4px rgba(100, 100, 111, 0.9);
        // filter: drop-shadow(16px 16px 10px rgba(0,0,0,0.8));
        // filter: drop-shadow(0 0 0.2rem rgba(0,0,0,0.8));
        border-radius: 10px;
        backdrop-filter: blur(50px);
        // background: rgb(2, 0, 36);
        padding: 0px;
        // text-align: center;
        object-fit: cover;
        cursor: pointer;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        padding-bottom: 5px;
  `
);

export default function NFTCard({ nft }) {
    // const [imgUrl, setImgUrl] = useState('');
    // const [loading, setLoading] = useState(false);

    // const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);

    // const like = () => setIsLike(!isLike);

    // {
    //     "_id": "630b722e2aa4d0244dcfc62b",
    //     "name": "FAT CATS - 1",
    //     "externalLink": "",
    //     "description": "",
    //     "collection": "",
    //     "Flags": 13,
    //     "Issuer": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "minter": "xrpnft.com",
    //     "image": "QmeBkwfxtCygbxCeZFRf8A1Qoh7vf1VoU4AxQCXCDwscUx",
    //     "URI": "516D6653394D70417754756F684B674E795146636939726D6348654566727874705533473976324842674837735A",
    //     "uuid": "4a23c44e703944909b29b53f5e94a44b",
    //     "minted": true,
    //     "TokenID": "000D000011BBE0160B08A0743C13E22918573B2AAC759E9E16E5DA9C00000001"
    // },
    const {
        uuid,
        name,
        flag,
        account,
        minter,
        cost,
        costb,
        issuer,
        date,
        meta,
        NFTokenID,
        URI,
        status,
        destination,
        rarity,
        rarity_rank
    } = nft;

    const isSold = false;

    const imgUrl = getImgUrl(meta); // `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
    const isVideo = meta?.video ? true : false;

    const [loadingImg, setLoadingImg] = useState(true)

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    const onImageLoaded = () => {
        setLoadingImg(false)
    }


    return (
        <Link href={`/nft/${NFTokenID}`} underline='none'>
            <CardWrapper
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 280,
                    // height: 250,
                    aspectRatio: '9 / 16',
                    // minHeight: 250,
                    // background: `radial-gradient(
                    //         circle,
                    //         rgba(255, 255, 255, 0.05) 0%,
                    //         ${colors[0]} 0%,
                    //         rgba(255, 255, 255, 0.05) 70%
                    //     )`,
                }}
            >
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
                    component={
                        loadingImg ? () =>
                            <Skeleton
                                variant='rectangular'
                                // animation='wave'
                                sx={{
                                    width: '100%',
                                    height: '70%'
                                }}
                            /> :
                            isVideo ? 'video' : 'img'}
                    image={imgUrl}
                    loading={loadingImg.toString()}
                    alt={'NFT' + uuid}
                    // controls={isVideo}
                    // autoPlay={isVideo}
                    // loop={isVideo}
                    sx={{
                        width: '100%',
                        height: '70%',
                        maxWidth: 280,
                        // maxHeight: 250,
                        marginTop: 0,
                        // borderTopLeftRadius: 20,
                        // borderTopRightRadius: 20,
                        // borderBottomLeftRadius: 0,
                        // borderBottomRightRadius: 0,
                        objectFit: 'cover'
                    }}
                />
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
                {/* {isVideo ?
                    <CardMedia
                        component={isVideo ? 'video' : 'img'}
                        image={imgUrl}
                        alt={'NFT' + uuid}
                        controls={isVideo}
                        style={{
                            width: '100%',
                            maxWidth: 280,
                            maxHeight: 250,
                            marginTop: 0,
                            // borderTopLeftRadius: 20,
                            // borderTopRightRadius: 20,
                            // borderBottomLeftRadius: 0,
                            // borderBottomRightRadius: 0,
                            objectFit: 'cover'
                        }}
                    />
                    :
                    <ColorExtractor getColors={getColors}>
                        <img src={imgUrl}
                            onLoad={onImageLoaded}
                            style={{
                                width: '100%',
                                maxWidth: 280,
                                maxHeight: 250,
                                marginTop: 0,
                                // borderTopLeftRadius: 20,
                                // borderTopRightRadius: 20,
                                // borderBottomLeftRadius: 0,
                                // borderBottomRightRadius: 0,
                                objectFit: 'cover'
                            }}
                        />
                    </ColorExtractor>
                } */}
                {/* {
                  !loading
                    ?
                    <CardMedia
                        component='img'
                        image={imgUrl}
                        alt={imgUrl}
                        style={{
                            width: 260,
                            height: 220,
                            marginTop: 4,
                            borderRadius:20
                        }}
                    />
                    :
                    <Skeleton
                        animation='wave'
                        variant='rectangular'
                        style={{
                            width: 260,
                            height: 220,
                            marginTop: 4,
                            borderRadius:20
                        }}
                    />
                } */}
                {/* <Stack direction="row" justifyContent='space-between' sx={{mt:1}}>
                    <Typography variant='s2'>{type.toUpperCase()}</Typography>
                    <Typography variant='s2'>Price</Typography>
                </Stack> */}

                {/* <Stack direction="row" > */}
                {/* <Stack direction="row" sx={{ mt: 1, pl: 2, pr: 2 }}> */}
                <CardContent
                    sx={{ padding: 0 }}
                >
                    <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'} px={1}>
                        <Box display='flex'>
                            <Typography
                                textOverflow='ellipsis'
                                overflow='hidden'
                                whiteSpace='nowrap'
                            >
                                {name.slice(0, -5)}
                            </Typography>
                            <Typography
                                style={{ width: 45 }}>
                                {name.slice(-5)}
                            </Typography>
                        </Box>
                        {destination && getMinterName(account) ? (
                            // <Typography variant='s2'>TRANSFER</Typography>
                            <Tooltip title={`Sold & Transfer`}>
                                <SportsScoreIcon />
                            </Tooltip>
                        ) : (
                            <Grid container alignItems='center'>
                                <Grid item xs={12}>
                                    {cost ? (
                                        cost.currency === "XRP" ?
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Icon icon={rippleSolid} width="16" height="16" />
                                                <Typography >{fNumber(cost.amount)}</Typography>
                                            </Stack>
                                            :
                                            <Typography >{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>

                                    ) : (
                                        <Typography variant='s7'>Unlisted</Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        costb ?
                                            <>
                                                {costb.currency === "XRP" ?
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Typography variant='s7'>Offer</Typography>
                                                        <Icon icon={rippleSolid} color="#00AB55" width="12" height="12" />
                                                        <Typography variant='s2' color="#00AB55">{fNumber(costb.amount)}</Typography>
                                                    </Stack>
                                                    :
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Typography variant='s7'>Offer</Typography>
                                                        <Typography variant='s2' color="#00AB55">{fNumber(costb.amount)} {normalizeCurrencyCodeXummImpl(costb.currency)}</Typography>
                                                    </Stack>
                                                }
                                            </> : <Typography variant='s7'>No Offer</Typography>
                                    }
                                </Grid>
                            </Grid>
                            // <Stack alignItems="left">
                            //     {cost ? (
                            //         cost.currency === "XRP" ?
                            //             <Stack direction="row" spacing={0.5} alignItems="center">
                            //                 <Typography variant='s3' pt={0.8}><Icon icon={rippleSolid} width="16" height="16" /></Typography>
                            //                 <Typography variant='s3'>{fNumber(cost.amount)}</Typography>
                            //             </Stack>
                            //             :
                            //             <Typography variant='s3'>{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>

                            //     ) : (
                            //         <Typography variant='s8'>- - -</Typography>
                            //     )}

                            //     {costb &&
                            //         <>
                            //             {costb.currency === "XRP" ?
                            //                 <Stack direction="row" spacing={0.5} alignItems="center">
                            //                     <Typography variant='s7'>Offer</Typography>
                            //                     <Icon icon={rippleSolid} color="#00AB55" width="12" height="12" />
                            //                     <Typography variant='s2' color="#00AB55">{fNumber(costb.amount)}</Typography>
                            //                 </Stack>
                            //                 :
                            //                 <Stack direction="row" spacing={0.5} alignItems="center">
                            //                     <Typography variant='s7'>Offer</Typography>
                            //                     <Typography variant='s2' color="#00AB55">{fNumber(costb.amount)} {normalizeCurrencyCodeXummImpl(costb.currency)}</Typography>
                            //                 </Stack>
                            //             }
                            //         </>
                            //     }
                            // </Stack>
                        )}
                        {rarity_rank > 0 &&
                            <Stack direction="row" justifyContent='space-between' sx={{mt:0.2, mb:0.5}}>
                                <Typography variant="s7">Rarity</Typography>
                                <Typography variant="s11">#{rarity_rank}</Typography>
                            </Stack>
                        }
                    </Box>
                </CardContent>
                {/* <Divider sx={{mt:0.8, mb:0.3}}/>
                <Stack direction="row" justifyContent='space-between' sx={{mt:1, pl:1, pr:1}}>
                    <FlagsContainer Flags={flag} />
                    <FavoriteIcon />
                </Stack> */}

            </CardWrapper>
        </Link >
    );
};
