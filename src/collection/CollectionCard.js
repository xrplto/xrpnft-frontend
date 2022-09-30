import React, { useEffect, useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    Box,
    ButtonBase,
    IconButton,
    Link,
    Stack,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

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
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
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
    border-radius: 0px;
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
  
export default function CollectionCard({ item, isAll }) {

    // {
    //     "_id": "6310c27cf81fe46884ef89ba",
    //     "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "name": "collection1",
    //     "slug": "collection-1",
    //     "description": "",
    //     "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
    //     "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
    //     "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
    //     "timestamp": 1662042748016,
    //     "creator": "xrpnft.com",
    //     "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
    // }

    const {
        uuid,
        name,
        slug,
        account,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp
    } = item;

    const [colors, setColors] = useState([]);

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
        >
            <ColorExtractor getColors={getColors}>
                <img src={`https://s1.xrpnft.com/collection/${featuredImage}`}
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
                        <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`}/>
                    </IconWrapper>
                </IconCover>
                <Typography variant="p1" sx={{pt:2}}>{name}</Typography>
            </Stack>

            <Link href={`/collection/${slug}`} underline='none'>
                <ImageBackdrop className="MuiImageBackdrop-root" />
            </Link>

            {!isAll &&
                <Link href={`/collection/${slug}/edit`} underline='none'>
                    <IconButton
                        className="MuiIconEditButton-root"
                        aria-label='edit'
                        sx={true ? { position: 'absolute', right: '1vw', top: '1vh', opacity: 0, zIndex: 1 } : { display: 'none' }}
                    >
                        <EditIcon color='primary' fontSize="large" />
                    </IconButton>
                </Link>
            }
        </CardWrapper>
    );
};
