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
import BuySpinDialog from './BuySpinDialog';

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
  
const numberOfSymbolsPerSlot = 18; // 18;

function arrayRotate(arr, reverse) {
    if (reverse)
        arr.unshift(arr.pop());
    else
        arr.push(arr.shift());
    return arr;
}

export default function SpinNFT({ collection, spins, setView }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const token = accountProfile?.token;

    const [nft, setNft] = useState(spins[0]);

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(false);

    const [openBuySpin, setOpenBuySpin] = useState(false);

    const nftImgUrl = `https://gateway.xrpnft.com/ipfs/${nft.meta.image}`;

    // "collection": {
    //     "_id": "632980fe283594d8a321fdaa",
    //     "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
    //     "name": "test1",
    //     "family": "",
    //     "slug": "test1",
    //     "type": "spinner",
    //     "items": 10000,
    //     "owners": 0,
    //     "infoSPIN": {
    //         "name": "XRP",
    //         "issuer": "XRPL",
    //         "currency": "XRP",
    //         "ext": "png",
    //         "cost": "1"
    //     },
    //     "description": "",
    //     "logoImage": "1663664381890_53c4804a3c6a4cf09fb0e9ca249c7d02.png",
    //     "featuredImage": "1663664381891_5b63c3b5343b45b4bf0ceebce490ddc5.jpg",
    //     "bannerImage": "1663664381891_783dcce2a9614ee3a802d9cf11028b7f.jpg",
    //     "created": 1663664382644,
    //     "modified": 1663664382644,
    //     "uuid": "f19c871e0750474795942f998bbfad0d",
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
        const imgUrl = `https://gateway.xrpnft.com/ipfs/${spins[index].meta.image}`;
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

    const setMainImage = () => {
        // const nftImgUrl = 'https://xrpl.to/static/tokens/c9ac9a6c44763c1bd9ccc6e47572fd26.jpg';
        console.log(nftImgUrl);
        return (
            <ColorExtractor getColors={getColors}>
                <img src={nftImgUrl}
                    style={{
                        width: fullScreen?'480px':'280px',
                        height: fullScreen?'400px':'200px',
                        // marginTop: 5,
                        borderRadius: 20,
                        objectFit: 'cover'
                    }}
                />
            </ColorExtractor>
        )
    }

    const generateImageColumn = () => {
        var nums = [];
        // nums.push(setMainImage());

        for (var i = 0; i < numberOfSymbolsPerSlot; i++) {
            var randomIndex = Math.floor(Math.random() * spins.length);
            nums.push(setImage(randomIndex, i));
        }

        return nums;
    }

    const getSpinnerNFT = (slotRef) => {
        if (!account || !token) {
            openSnackbar('Please login', 'error');
            return;
        }

        setSpinning(true);

        const body = { account, collection: collection.name };

        // https://api.xrpnft.com/api/account/spinnernft
        axios.post(`${BASE_URL}/account/spinnernft`, body, {headers: {'x-access-token': token}})
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret && ret.nft) {
                    setNft(ret.nft);
                    // setCongrats(true);
                }
            }).catch(err => {
                console.log("Error on getting exchanges!!!", err);
            }).then(function () {
                // always executed
                // slotRef.current.style.animation = ``;
                setTimeout(() => {
                    setCongrats(true);
                    setSpinning(false);
                    play();
                }, 3000);
            });
    }

    const spin = () => {
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

            <BuySpinDialog
                open={openBuySpin}
                setOpen={setOpenBuySpin}
                infoSPIN={infoSPIN}
                openSnackbar={openSnackbar}
                minter={minter}
            />

            <Confetti
                width={width}
                height={height*2}
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
                                <Stack
                                    ref={slotRef}
                                    onAnimationStart={onAnimationStart}
                                    onAnimationEnd={onAnimationEnd}
                                    style={{
                                        animation: spinning?`spinner 0.5s infinite forwards ease-in-out`:``,
                                        // filter: 'blur(10px)',
                                        // WebkitMask: 'linear-gradient(rgb(255, 255, 255), transparent)'
                                    }}
                                >
                                    <ColorExtractor getColors={getColors}>
                                        <img src={nftImgUrl}
                                            style={{
                                                width: fullScreen?'480px':'280px',
                                                height: fullScreen?'400px':'200px',
                                                // marginTop: 5,
                                                // borderRadius: 20,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </ColorExtractor>
                                    {reelSymbols[0]}
                                </Stack>
                            </SlotBox>
                            
                            
                            <Stack alignItems="center" sx={{mt:1}}>
                                <Typography variant='h2a'>{nft.name}</Typography>
                            </Stack>
                            <Divider sx={{mt:0.8, mb:2}}/>
                            <Button
                                variant='contained'
                                onClick={() => spin()}
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
                            <Stack spacing={2} sx={{pl:5, pr:5}}>
                                <Button
                                    variant='contained'
                                    onClick={() => setOpenBuySpin(true)}
                                >
                                    Buy SPINs With {infoSPIN.name}
                                </Button>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    target="_blank"
                                    href={`/buy-xrp`}
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
        </>
    );
};
