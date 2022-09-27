import axios from 'axios';
import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { ColorExtractor } from 'react-color-extractor';
import useWindowSize from 'react-use/lib/useWindowSize';
import React, { useEffect, useState, createRef } from "react";

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Button,
    Container,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import BuyMintDialog from './BuyMintDialog';

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

const SlotBox = styled('div') (
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
  
const numberOfSymbolsPerSlot = 5;

function arrayRotate(arr, reverse) {
    if (reverse)
        arr.unshift(arr.pop());
    else
        arr.push(arr.shift());
    return arr;
}

export default function SpinNFT({ collection, nfts, setView }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [nft, setNft] = useState(null);

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(false);

    const [openBuyMint, setOpenBuyMint] = useState(false);

    const nftImgUrl = nft?`https://gateway.xrpnft.com/ipfs/${nft.meta.image}`:'/static/unknown.png';

    const [mints, setMints] = useState(0);

    // "collection": {
    //     "_id": "6332e893d799f7b10ec627a2",
    //     "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
    //     "name": "spinner1",
    //     "family": "",
    //     "slug": "spin1",
    //     "type": "spinner",
    //     "items": 6568,
    //     "owners": 0,
    //     "minter": "rLHcy375RJfLcQL3MayfkYaaK3H9HYdHiC",
    //     "infoSPIN": {
    //         "costs": [
    //             {
    //                 "md5": "xrp",
    //                 "name": "XRP",
    //                 "issuer": "XRPL",
    //                 "currency": "XRP",
    //                 "ext": "png",
    //                 "exch": "1",
    //                 "cost": "1"
    //             },
    //             {
    //                 "md5": "0413ca7cfc258dfaf698c02fe304e607",
    //                 "name": "SOLO",
    //                 "issuer": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
    //                 "currency": "534F4C4F00000000000000000000000000000000",
    //                 "ext": "jpg",
    //                 "exch": 0.29431199670355546,
    //                 "cost": "100"
    //             }
    //         ]
    //     },
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
        name,
        slug,
        items,
        type,
        description,
        infoSPIN,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp,
        minter
    } = collection;

    // const description = "This is the test collection that spinns the nfts very fast and you can won and purchase nfts"

    const getColors = (colors, idx) => {
        setColors(c => [...c, ...colors]);
    }

    // Reel Slot
    let symbolArray = [];

    const slotRef = createRef();

    const [state, setState] = useState({
        spin: 0
    });

    const [spinning, setSpinning] = useState(false);

    const [reelSymbols, setReelSymbols] = useState([]);

    useEffect(() => {
        function getMints() {
            if (!account || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }

            // https://api.xrpnft.com/api/spin/count?account=rhhh
            axios.get(`${BASE_URL}/spin/count?account=${account}&cid=${collection.uuid}`, {headers: {'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        console.log(`Mints: ${ret.mints}`);
                        setMints(ret.mints);
                    }
                }).catch(err => {
                    console.log("Error on getting exchanges!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getMints();
    }, [account, accountToken]);

    useEffect(() => {
        setReelArraySymbols().then((syms) => {
            setReelSymbols(syms);
        });
    }, [fullScreen]);

    useEffect(() => {
        if (congrats) {
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    const onAnimationStart = () => {
        setState({ spin: 1 });
    };

    const onAnimationEnd = () => {
        slotRef.current.style.animation = ``;
        setState({ spin: 0 });
        setCongrats(true);
    };

    const setReelArraySymbols = (callback) => {
        return new Promise((resolve, reject) => {
            resolve(
                (symbolArray = [
                    generateImageColumn()
                ])
            );
        });
    };

    const setImage = (index, key) => {
        const imgUrl = `https://gateway.xrpnft.com/ipfs/${nfts[index].meta.image}`;
        return (
            <img
                key={key}
                alt="Oops..."
                src={imgUrl}
                style={{
                    width: fullScreen?'480px':'280px',
                    height: fullScreen?'400px':'200px',
                    // marginTop: 5,
                    // borderRadius: 20,
                    objectFit: 'cover',
                }}
            />
        )
    }

    const generateImageColumn = () => {
        var nums = [];
        // nums.push(setMainImage());

        // for (var i = 0; i < numberOfSymbolsPerSlot; i++) {
        //     var randomIndex = Math.floor(Math.random() * nfts.length);
        //     nums.push(setImage(randomIndex, i));
        // }

        const len = nfts.length;
        for (var i = 0; i < numberOfSymbolsPerSlot; i++) {
            nums.push(setImage(i % len, i));
        }

        return nums;
    }

    const getSpinnerNFT = (slotRef) => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        if (mints < 1) {
            openSnackbar('You do not have enough Mints', 'error');
            return;
        }

        setSpinning(true);
        // setNft(null);

        const body = { account, collection: collection.name };

        let newNft = null;
        // https://api.xrpnft.com/api/account/spinnernft
        axios.post(`${BASE_URL}/account/spinnernft`, body, {headers: {'x-access-token': accountToken}})
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret && ret.nft) {
                    newNft = ret.nft;
                    // setCongrats(true);
                }
            }).catch(err => {
                console.log("Error on getting exchanges!!!", err);
            }).then(function () {
                // always executed
                // slotRef.current.style.animation = ``;
                setTimeout(() => {
                    setNft(newNft);
                    setCongrats(true);
                    setSpinning(false);
                    play();
                }, 3000);
            });
    }

    const mint = () => {
        // if (spinning)
        //     setSpinning(false);
        // else
        //     setSpinning(true);

        getSpinnerNFT();
        
        // resetAllSlots();

        // setReelArraySymbols().then((syms) => {
        //     setReelSymbols(syms);
        // });

        // slotRef.current.style.animation = `spinner 0.5s forwards ease-in-out`;
    }

    return (
        <>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />

            <BuyMintDialog
                open={openBuyMint}
                setOpen={setOpenBuyMint}
                infoSPIN={infoSPIN}
                openSnackbar={openSnackbar}
                minter={minter}
                collection={collection}
                setMints={setMints}
            />

            <Confetti
                width={width}
                height={height}
                initialVelocityX={4}
                initialVelocityY={100}
                run={true}
                recycle={congrats}
                gravity={0.2}
                numberOfPieces={width / 3}
                tweenDuration={100}
            />
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
                <Grid container rowSpacing={2} alignItems="center" sx={{mb: 10}}>
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
                                    <img src={nftImgUrl}
                                        style={{
                                            width: fullScreen?'480px':'280px',
                                            height: fullScreen?'400px':'200px',
                                            // marginTop: 5,
                                            // borderRadius: 20,
                                            objectFit: 'cover',
                                            display: spinning?'none':'block'
                                        }}
                                    />
                                </ColorExtractor>
                                <Stack
                                    ref={slotRef}
                                    onAnimationStart={onAnimationStart}
                                    onAnimationEnd={onAnimationEnd}
                                    style={{
                                        animation: spinning?`spinner .5s infinite forwards ease-in-out`:``,
                                        filter: !mints?'blur(30px)':'',
                                        WebkitMask: !mints?'linear-gradient(rgb(255, 255, 255), transparent)':''
                                    }}
                                >
                                    {reelSymbols[0]}
                                </Stack>
                            </SlotBox>
                            
                            
                            <Stack alignItems="center" sx={{mt:1}}>
                                <Typography variant='h2a'>{spinning?'SPINNING':(nft?nft.name:'Spin to Mint')}</Typography>
                            </Stack>
                            <Divider sx={{mt:0.8, mb:2}}/>
                            <Button
                                variant='contained'
                                onClick={() => mint()}
                                sx={{pl:3, pr:3}}
                            >
                                Mint
                            </Button>
                        </CardWrapper>
                    </Grid>

                    <Grid container item xs={12} md={6} justifyContent="flex-start" alignItems="flex-start">
                        <Stack spacing={1} sx={{mb:6}}>
                            <Typography variant="p5">To mint a random NFT from this collection, you need to purchase Mints.</Typography>
                            {/* <Typography variant="s5">Each mint costs <Typography variant="s5" color="#33C2FF">{infoSPIN.cost} {infoSPIN.name}</Typography>.</Typography> */}
                            <Typography variant="p5">It can be used against the purchase of only <Typography variant="s5" color="#57CA22">{collection.name}</Typography> Collection.</Typography>
                            <Typography variant="p5" sx={{pb: 3}}>You currently have <Typography variant="s5" color="#33C2FF">{mints} mints</Typography> available and <Typography variant="s5" color="#33C2FF">8327.9998 XRP</Typography> tokens in your wallet.</Typography>
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
                                            onClick={() => {}}
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
