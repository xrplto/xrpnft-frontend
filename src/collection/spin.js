import React, { useEffect, useState, createRef } from "react";
import { ColorExtractor } from 'react-color-extractor';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

// Material
import { useTheme } from '@mui/material/styles';
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
    Typography,
    useMediaQuery
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Components

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
        line-height: 4;
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
    const { width, height } = useWindowSize();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [nft, setNft] = useState(spins[0]);

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(false);

    const nftImgUrl = `https://gateway.xrpnft.com/ipfs/${nft.meta.image}`;

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
        description,
        infoSPIN,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp
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
            }, 5000);
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
            <ColorExtractor getColors={(colors)=> getColors(colors, index)} key={key}>
                <img
                    alt="Oops..."
                    src={imgUrl}
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

        for (var i = 0; i < numberOfSymbolsPerSlot; i++) {
            var randomIndex = Math.floor(Math.random() * spins.length);
            nums.push(setImage(randomIndex, i));
        }

        return nums;
    }

    const spin = () => {
        // resetAllSlots();

        // setReelArraySymbols().then((syms) => {
        //     setReelSymbols(syms);
        // });

        // console.log(arrayRotate(['1', '2', '3', '4', '5']));
        slotRef.current.style.animation = `spinner 0.5s forwards ease-in-out`;
    }

    return (
        <>
            <Confetti
                width={width}
                height={height*2}
                initialVelocityX={4}
                initialVelocityY={100}
                run={true}
                recycle={congrats}
                gravity={0.2}
                numberOfPieces={width / 2}
                tweenDuration={1000}
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
                                <div
                                    // className="SlotReelContainer"
                                    ref={slotRef}
                                    onAnimationStart={onAnimationStart}
                                    onAnimationEnd={onAnimationEnd}
                                >
                                    {reelSymbols[0]}
                                </div>

                                {state.spin === 0 &&
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
                                }
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
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
