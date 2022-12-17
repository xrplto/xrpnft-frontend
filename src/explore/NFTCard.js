import {normalizeCurrencyCodeXummImpl} from "src/utils/normalizers";
import { useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    CardMedia,
    Divider,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { NFToken, getMinterName } from "src/utils/constants";
import { fNumber } from 'src/utils/formatNumber';

// Components
import FlagsContainer from 'src/components/Flags';
import Label from './Label';

const CardWrapper = styled('div')(
    ({ theme }) => `
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 30px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 0px;
        text-align: center;
        object-fit: cover;
        cursor: pointer;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
  `
);

export default function NFTCard({ nft }) {
    // const [imgUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);

    const like = () => setIsLike(!isLike);

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
        URI,
        status,
        destination
    } = nft;

    const isSold = false;

    const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
    const isVideo = meta.video;

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    // useEffect(() => {
    //     let mounted = true
    //     const getImgUrl = async () => {
    //         setLoading(true);

    //         const res = await getNFTokenInfo(URI);
    //         setType(res.type);

    //         console.log(res);
            
    //         if (mounted) {
    //             setImgUrl('/static/nft.png');
    //             // setImgUrl(res.image)

    //             // console.log("image url", res.image);
    //         }
    //         setLoading(false);
    //         // if(res.description.name){
    //         // setName(res.description.name)}
    //     }

    //     getImgUrl()

    //     return () => {
    //         mounted = false
    //     }
    // }, [URI])

    return (
        <Link href={`/assets/${uuid}`} underline='none'>
            <CardWrapper
                style={{
                    width: 280,
                    height: 360,
                    background: `radial-gradient(
                            circle,
                            rgba(255, 255, 255, 0.05) 0%,
                            ${colors[0]} 0%,
                            rgba(255, 255, 255, 0.05) 70%
                        )`,
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
                {isVideo ?
                    <CardMedia
                        component={isVideo?'video':'img'}
                        image={imgUrl}
                        alt={'NFT'}
                        controls={isVideo}
                        style={{
                            width: 280,
                            height: 250,
                            marginTop: 0,
                            borderRadius: 20,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            objectFit: 'cover'
                        }}
                    />
                    :
                    <ColorExtractor getColors={getColors}>
                        <img src={imgUrl}
                            style={{
                                width: 280,
                                height: 250,
                                marginTop: 0,
                                borderRadius: 20,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                objectFit: 'cover'
                            }}
                        />
                    </ColorExtractor>
                }
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
                <Typography variant='s10'>{name}</Typography>

                <Stack direction="row" justifyContent='space-between' sx={{mt:1, pl:2, pr:2}}>
                    {/* <Typography variant='s8'>Price</Typography> */}
                    {destination && getMinterName(account) ? (
                        // <Typography variant='s2'>TRANSFER</Typography>
                        <Tooltip title={`Sold & Transfer`}>
                            <SportsScoreIcon />
                        </Tooltip>
                    ):(
                        <Stack alignItems="left">
                            {cost ? (
                                cost.currency === "XRP" ?
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant='s3' pt={0.8}><Icon icon={rippleSolid} width="16" height="16" /></Typography>
                                        <Typography variant='s3'>{fNumber(cost.amount)}</Typography>
                                    </Stack>
                                    :
                                    <Typography variant='s3'>{fNumber(cost.amount)} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>
                                
                            ):(
                                <Typography variant='s8'>- - -</Typography>
                            )}

                            {costb && costb.currency === "XRP" &&
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Icon icon={rippleSolid} color="#00AB55" width="12" height="12" />
                                    <Typography variant='s2' color="#00AB55">{fNumber(costb.amount)}</Typography>
                                </Stack>
                            }

                            {costb && costb.currency !== "XRP" &&
                                <Typography variant='s2' color="#00AB55">Offer {fNumber(costb.amount)} {normalizeCurrencyCodeXummImpl(costb.currency)}</Typography>
                            }
                        </Stack>
                    )}
                </Stack>
                {/* <Divider sx={{mt:0.8, mb:0.3}}/>
                <Stack direction="row" justifyContent='space-between' sx={{mt:1, pl:1, pr:1}}>
                    <FlagsContainer Flags={flag} />
                    <FavoriteIcon />
                </Stack> */}

            </CardWrapper>
        </Link>
    );
};
