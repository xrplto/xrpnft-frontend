import React, { useEffect, useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    Button,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Skeleton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Components
import MySlot from './MySlot';

const CardWrapper = styled('div')(
    ({ theme }) => `
        width: 300px;
        height: 340px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 540px;
        }
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 30px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 10px;
        text-align: center;
        object-fit: cover;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
  `
);

const IconCover = styled('div')(
    ({ theme }) => `
        width: 102px;
        height: 102px;
        margin-top: -56px;
        margin-bottom: 16px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 132px;
            height: 132px;
            margin-top: -86px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 192px;
            height: 192px;
            margin-top: -156px;
        }
        border: 6px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 90px;
        height: 90px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 120px;
            height: 120px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 180px;
            height: 180px;
        }
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 0px;
  `
);

export default function SpinNFT({ collection, spins, setView }) {

    const nft = spins[0];

    const [colors, setColors] = useState([]);

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
        name,
        slug,
        items,
        type,
        // description,
        infoSPIN,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp
    } = collection;

    const description = "This is the test collection that spinns the nfts very fast and you can won and purchase nfts"

    const imgUrl = `https://gateway.xrpnft.com/ipfs/${nft.meta.image}s`;

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    return (
        <>
            <Stack alignItems="center" sx={{mb: 5}}>
                <IconCover>
                    <IconWrapper>
                        <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`}/>
                    </IconWrapper>
                </IconCover>
                <Typography variant="h1a">{name}</Typography>
                {description &&
                    <Typography variant="d3" maxWidth='600px'>{description}</Typography>
                }
                <Link
                    component="button"
                    underline="always"
                    variant="body2"
                    color="#33C2FF"
                    onClick={() => {
                        setView('');
                    }}
                >
                    <Typography sx={{ml:0}}>View Collection Items</Typography>
                </Link>
            </Stack>

            <Container maxWidth="lg">
                <Grid container rowSpacing={2} alignItems="center" sx={{mt: 0}}>
                    <Grid container item xs={12} md={6} justifyContent="center" alignItems="center">
                        <CardWrapper
                            style={{
                                background: `radial-gradient(
                                        circle,
                                        rgba(255, 255, 255, 0.05) 0%,
                                        ${colors[0]} 0%,
                                        rgba(255, 255, 255, 0.05) 70%
                                    )`,
                            }}
                        >
                            <ColorExtractor getColors={getColors}>
                                <img src={imgUrl}
                                    style={{
                                        width: '98%',
                                        height: 'calc(90% - 80px)',
                                        marginTop: 5,
                                        borderRadius: 20,
                                        objectFit: 'cover'
                                    }}
                                />
                            </ColorExtractor>
                            <Stack alignItems="center" sx={{mt:1}}>
                                <Typography variant='h2a'>{nft.name}</Typography>
                            </Stack>
                            <Divider sx={{mt:0.8, mb:2}}/>
                            <Button
                                variant='contained'
                                onClick={() => {}}
                                sx={{pl:3, pr:3}}
                            >
                                Spin
                            </Button>
                        </CardWrapper>
                    </Grid>

                    <Grid container item xs={12} md={6} justifyContent="flex-start" alignItems="flex-start">
                        <Stack spacing={1} sx={{mb:6}}>
                            <Typography variant="p5">To win a random NFT from this collection, you need to purchase spins.</Typography>
                            <Typography variant="p5">Each spin costs {infoSPIN.cost} {infoSPIN.name}.</Typography>
                            <Typography variant="p5">If a collection sells out and an allocation could not be completed, your spin will not be used and will remain in your account.</Typography>
                            <Typography variant="p5">It can be used against the purchase of any other spinner collection.</Typography>
                            <Typography variant="p5" sx={{pb: 3}}>You currently have 94 spins available and 8327.9998 XRP tokens in your wallet.</Typography>
                            <Stack>
                                <Button
                                    variant='contained'
                                    onClick={() => {}}
                                    sx={{ml:5, mr:5}}
                                >
                                    Buy Spins With XRP
                                </Button>

                                <Button
                                    variant='outlined'
                                    onClick={() => {}}
                                    sx={{mt:2, ml:5, mr:5}}
                                >
                                    Buy XRP
                                </Button>
                            </Stack>

                            <MySlot />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
