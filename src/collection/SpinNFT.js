import axios from 'axios';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { ColorExtractor } from 'react-color-extractor';
import useWindowSize from 'react-use/lib/useWindowSize';
import React, { useEffect, useState } from "react";

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Box,
    Button,
    CardMedia,
    Container,
    Divider,
    Grid,
    Link,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import BuyMintDialog from './BuyMintDialog';
import { useViewPort } from 'src/hooks/useViewPort';

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
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
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

const SlotBox = styled('div')(
    ({ theme }) => `
        // padding-top: 40px;
        width: 280px;
        height: 200px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 480px;
            height: 400px;
        }
        // margin-bottom: 20px;
        // margin-top: 20px;
        // border-style: solid;
        justify-content: center;
        overflow: hidden;
        // line-height: 4;
        border-radius: 20px;
    `
);

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    transition: theme.transitions.create('opacity'),
}));

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
`
);

export default function SpinNFT({ collection, setView }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { width, height } = useViewPort();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [nft, setNft] = useState(null);

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(false);

    const [openBuyMint, setOpenBuyMint] = useState(false);

    const [mints, setMints] = useState(0);

    const [xrpBalance, setXrpBalance] = useState(0);

    const [pendingNfts, setPendingNfts] = useState(0);
    const [seenMore, setSeenMore] = useState(false)

    // "collection": {
    //     "_id": "6332e893d799f7b10ec627a2",
    //     "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
    //     "name": "spinner1",
    //     "category": "",
    //     "slug": "spin1",
    //     "type": "random",
    //     "items": 6568,
    //     "owners": 0,
    //     "minter": "rLHcy375RJfLcQL3MayfkYaaK3H9HYdHiC",
    //     "costs": [
    //         {
    //             "md5": "xrp",
    //             "name": "XRP",
    //             "issuer": "XRPL",
    //             "currency": "XRP",
    //             "ext": "png",
    //             "exch": "1",
    //             "cost": "1"
    //         },
    //         {
    //             "md5": "0413ca7cfc258dfaf698c02fe304e607",
    //             "name": "SOLO",
    //             "issuer": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
    //             "currency": "534F4C4F00000000000000000000000000000000",
    //             "ext": "jpg",
    //             "exch": 0.29431199670355546,
    //             "cost": "100"
    //         }
    //     ]
    //     "description": "",
    //     "logoImage": "1664280722827_d05ae9f8628a41ed8dbfb1321cf9fb50.png",
    //     "featuredImage": "1664280722828_a14b3d6686d64cf38b2259b864c25f8f.jpg",
    //     "bannerImage": "1664280722829_2b95c99e4e964012bf2d410ec435ce0c.jpg",
    //     "created": 1664280723606,
    //     "modified": 1664280723606,
    //     "uuid": "4e9d651567834a58931960fbee6bc3a7",
    //     "taxon": 1,
    //     "creator": "xrpnft.com"
    // }

    const {
        uuid,
        name,
        slug,
        items,
        type,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        spinnerImage,
        timestamp,
        costs,
        minter,
        verified
    } = collection;

    // const description = "This is the test collection that spinns the nfts very fast and you can won and purchase nfts"

    const getColors = (colors, idx) => {
        // setColors(c => [...c, ...colors]);
        setColors(c => [...colors]);
    }

    const [spinning, setSpinning] = useState(false);

    let nftImgUrl = nft ? `https://gateway.xrpnft.com/ipfs/${nft.meta.image || nft.meta.video}` : '/static/unknown.png';
    const isVideo = nft?.meta.video;

    const spinImgUrl = spinnerImage ? `https://s1.xrpnft.com/collection/${spinnerImage}` : '/static/spin.gif';

    // useEffect(() => {
    //     window.addEventListener("resize", () => {
    //         // setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    //         console.log({ width: window.innerWidth, height: window.innerHeight });
    //         console.log(`Window innerHeight: ${window.innerHeight}`);
    //         console.log(`Window outerHeight: ${window.outerHeight}`);

    //         console.log(window.pageYOffset)
    //     });
    // }, []);

    useEffect(() => {
        function getMints() {
            if (!account || !accountToken) {
                openSnackbar('Please login', 'error');
                setMints(0);
                setXrpBalance(0);
                return;
            }

            // https://api.xrpnft.com/api/spin/count?account=rhhh
            axios.get(`${BASE_URL}/spin/count?account=${account}&cid=${collection.uuid}`, { headers: { 'x-access-token': accountToken } })
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        // console.log(`Mints: ${ret.mints}`);
                        setMints(ret.mints);
                        setXrpBalance(ret.xrpBalance);
                        setPendingNfts(ret.pendingNfts);
                    }
                }).catch(err => {
                    console.log("Error on getting mint count!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getMints();
    }, [account, accountToken, sync]);

    useEffect(() => {
        if (congrats) {
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    const getOneNFT = () => {
        if (spinning) return;

        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        if (mints < 1) {
            openSnackbar('You do not have enough Mints', 'error');
            return;
        }

        if (pendingNfts < 1) {
            openSnackbar('There are no NFTs left', 'error');
            return;
        }

        setSpinning(true);
        // setNft(null);

        const body = { account, cid: collection.uuid };

        axios.post(`${BASE_URL}/spin/chooseone`, body, { headers: { 'x-access-token': accountToken } })
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    const newNft = ret.nft;
                    if (newNft) {
                        setNft(newNft);
                        setSync(sync + 1);
                        setCongrats(true);
                        play();
                    } else {
                        openSnackbar(ret.error, 'error');
                    }
                }
            }).catch(err => {
                console.log("Error on choosing NFT!!!", err);
            }).then(function () {
                // always executed
                setSpinning(false);
            });
    }

    return (
        <>
            <BuyMintDialog
                open={openBuyMint}
                setOpen={setOpenBuyMint}
                type="random"
                cid={uuid}
                costs={costs}
                setMints={setMints}
                setXrpBalance={setXrpBalance}
            />

            <Confetti
                width={width}
                height={height}
                // confettiSource={{x:0, y: 300}}
                initialVelocityX={4}
                initialVelocityY={100}
                run={true}
                recycle={congrats}
                gravity={0.2}
                numberOfPieces={width / 3}
                tweenDuration={100}
            />
            <Stack alignItems="center" sx={{ mb: 5 }}>
                <IconCover>
                    <IconWrapper>
                        <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`} />
                        {account === collection.account &&
                            <Link href={`/collection/${slug}/edit`} underline='none'>
                                <CardOverlay>
                                    <EditIcon
                                        className="MuiIconEditButton-root"
                                        // color='primary'
                                        fontSize="large"
                                        sx={{ opacity: 0, zIndex: 1 }}
                                    />
                                </CardOverlay>
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                            </Link>
                        }
                    </IconWrapper>
                </IconCover>
                <Stack direction="row" alignItems='center' spacing={1}>
                    <Typography variant="h1a">{name}</Typography>
                    {verified === 'yes' &&
                        <Tooltip title='Verified'>
                            <VerifiedIcon color="success" />
                        </Tooltip>
                    }
                </Stack>
                {description &&
                    <Typography variant="d3" maxWidth='600px'>{seenMore ? description : description?.split(' ', width > 758 ? 15 : 9).join(' ')}{!seenMore && '...'}
                        <div onClick={() => setSeenMore(!seenMore)} className='viewMore'>See {seenMore ? 'less' : `more`}</div>
                    </Typography>
                }
                <Link
                    component="button"
                    underline="always"
                    variant="body2"
                    // color="#33C2FF"
                    onClick={() => {
                        setView('');
                    }}
                >
                    <Typography sx={{ ml: 0 }}>View Minted Items</Typography>
                </Link>
            </Stack>

            <Container maxWidth="lg">
                <Grid container rowSpacing={2} alignItems="center" sx={{ mb: 10 }}>
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
                            <SlotBox key={11} id={12}>
                                <ColorExtractor getColors={getColors}>
                                    <img src={spinImgUrl}
                                        style={{
                                            width: fullScreen ? '480px' : '280px',
                                            height: fullScreen ? '400px' : '200px',
                                            // marginTop: 5,
                                            // borderRadius: 20,
                                            objectFit: 'cover',
                                            display: spinning ? 'block' : 'none'
                                        }}
                                    />
                                </ColorExtractor>
                                {isVideo ?
                                    <CardMedia
                                        component="video"
                                        image={nftImgUrl}
                                        title='title'
                                        controls
                                        style={{
                                            width: fullScreen ? '480px' : '280px',
                                            height: fullScreen ? '400px' : '200px',
                                            // marginTop: 5,
                                            // borderRadius: 20,
                                            objectFit: 'cover',
                                            display: spinning ? 'none' : 'block'
                                        }}
                                    />
                                    :
                                    <img src={nftImgUrl}
                                        style={{
                                            width: fullScreen ? '480px' : '280px',
                                            height: fullScreen ? '400px' : '200px',
                                            // marginTop: 5,
                                            // borderRadius: 20,
                                            objectFit: 'cover',
                                            display: spinning ? 'none' : 'block'
                                        }}
                                    />
                                }
                            </SlotBox>


                            <Stack alignItems="center" sx={{ mt: 1 }}>
                                <Typography variant='h2a'>{spinning ? 'Please Wait!' : (nft ? nft.name : 'Spin to Mint')}</Typography>
                            </Stack>
                            <Divider sx={{ mt: 0.8, mb: 2 }} />
                            <Button
                                variant='contained'
                                disabled={spinning}
                                onClick={() => getOneNFT()}
                                sx={{ pl: 3, pr: 3 }}
                            >
                                Mint
                            </Button>
                        </CardWrapper>
                    </Grid>

                    <Grid container item xs={12} md={6} justifyContent="flex-start" alignItems="flex-start">
                        <Stack spacing={1} sx={{ mb: 6 }}>
                            <Typography variant="p5">To mint a {type} NFT from this collection, you need to purchase Mints.</Typography>
                            <Typography variant="p5">It can be used against the purchase of only <Typography variant="s5" color="#57CA22">{collection.name}</Typography> Collection.</Typography>
                            <Typography variant="p5">You currently have <Typography variant="s5" color="#33C2FF">{mints} Mints</Typography> available and <Typography variant="s5" color="#33C2FF">{xrpBalance} XRP</Typography> tokens in your wallet.</Typography>
                            <Typography variant="p5" sx={{ pb: 3 }}>There are currently <Typography variant="s5" color="error">{pendingNfts}</Typography> / <Typography variant="s4" color="#33C2FF">{collection.items}</Typography> NFTs left in this collection.</Typography>

                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant='contained'
                                    onClick={() => setOpenBuyMint(true)}
                                >
                                    Buy Mints
                                </Button>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    target="_blank"
                                    href={`/buy-crypto`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Stack>
                                        <Button
                                            variant='outlined'
                                            onClick={() => { }}
                                        >
                                            Buy XRP
                                        </Button>
                                    </Stack>
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* <Stack sx={{mt:5, minHeight: '20vh'}}>
            </Stack> */}
        </>
    );
};
