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

const CardWrapper = styled('div')(
    ({ theme }) => `
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 20px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 10px;
        text-align: center;
        object-fit: cover;
        cursor: pointer;
        overflow: hidden;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
  `
);

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: black;
    inset: 0;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.5s;
    // border-radius: 20px;
    &:hover {
        opacity: 0.3;
    }
`
);

const IconCover = styled('div')(
    ({ theme }) => `
        width: 78px;
        height: 78px;
        border: 4px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        overflow: hidden;
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 70px;
        height: 70px;
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
    border-radius: 10px;
  `
);

export default function CollectionCard({ name, bSrc, iSrc, onClick }) {
    const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);

    const like = () => setIsLike(!isLike);

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    return (
        <CardWrapper
            style={{
                width: 320,
                height: 300,
                padding: 0,
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
                <img src={bSrc}
                    style={{
                        width: 320,
                        height: 220,
                        objectFit: 'cover',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                />
            </ColorExtractor>
            <Stack direction="row" spacing={1.5} sx={{p:3, mt:-6}} alignItems="center">
                <IconCover>
                    <IconWrapper>
                        <IconImage src={iSrc}/>
                    </IconWrapper>
                </IconCover>
                <Typography variant="p1" sx={{pt:2}}>{name}</Typography>
            </Stack>
            <CardOverlay />
        </CardWrapper>
    );
};
