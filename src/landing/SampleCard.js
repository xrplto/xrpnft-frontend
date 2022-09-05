import React, { useEffect, useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    Button,
    Stack,
    Typography
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Iconify
import { Icon } from '@iconify/react';

// Components

const CardWrapper = styled('div') (
    ({ theme }) => `
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 30px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 10px;
        text-align: center;
        object-fit: cover;
        cursor: pointer;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
  `
);

export default function SampleCard({ nftname, title, nftSrc, onClick }) {
    const [isLike, setIsLike] = useState(false);
    const like = () => setIsLike(!isLike);

    const [colors, setColors] = useState([]);
    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    return (
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
            onClick={onClick}
        >
            <ColorExtractor getColors={getColors}>
                <img src={nftSrc}
                    style={{
                        width: 250,
                        height: 220,
                        marginTop: 5,
                        borderRadius: 20
                    }}
                />
            </ColorExtractor>
            <Stack spacing={1.5}>
                <Typography variant="p1">{title}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="p2">{nftname}</Typography>
                    <Stack direction="row" alignItems="center">
                        <Icon icon="teenyicons:ripple-solid" />
                        <Typography variant="p2">455</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        color='info'
                        onClick={onClick}
                        size="small"
                        sx={{p:0}}
                    >
                        Buy
                    </Button>

                    <FavoriteIcon />
                </Stack>
            </Stack>
        </CardWrapper>
    );
};
