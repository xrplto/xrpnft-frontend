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

const CardWrapper = styled('div')(
    ({ theme }) => `
        width: 300px;
        height: 300px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 500px;
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

export default function Congrats({ nft }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const token = accountProfile?.token;

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(true);

    const [openBuySpin, setOpenBuySpin] = useState(false);

    const nftImgUrl = nft?`https://gateway.xrpnft.com/ipfs/${nft.meta.image}`:'/static/unknown.png';

    // const description = "This is the test collection that spinns the nfts very fast and you can won and purchase nfts"

    const getColors = (colors, idx) => {
        setColors(c => [...c, ...colors]);
    }

    useEffect(() => {
        if (congrats) {
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    return (
        <>
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
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h1a" >Congratulations!</Typography>
                    <img src='/static/party-popper.png'
                        style={{
                            width: 32,
                            height: 32
                        }}
                    />
                </Stack>

                <Stack spacing={2} alignItems="center" sx={{pt: 3}}>
                    <Typography variant="d3" >Your NFT has been minted on the XRP Ledger.</Typography>

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
                            <img src={nftImgUrl}
                                style={{
                                    width: fullScreen?'480px':'280px',
                                    height: fullScreen?'480px':'280px',
                                    // marginTop: 5,
                                    borderRadius: 20,
                                    objectFit: 'cover'
                                }}
                            />
                        </ColorExtractor>
                    </CardWrapper>
                </Stack>

            </Stack>
        </>
    );
};
