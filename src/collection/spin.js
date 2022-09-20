import React, { useEffect, useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
    styled,
    Button,
    CardContent,
    CardMedia,
    Divider,
    Link,
    Skeleton,
    Stack,
    Typography
} from '@mui/material';

const CardWrapper = styled('div')(
    ({ theme }) => `
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

export default function SpinNFT({ collection, spins }) {

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
        uuid,
        name,
        flag,
        account,
        date,
        meta,
        URI        
    } = nft;

    const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image}`;

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    return (
        <CardWrapper
            style={{
                width: 480,
                height: 360,
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
                        width: 280,
                        height: 220,
                        marginTop: 5,
                        borderRadius: 20,
                        objectFit: 'cover'
                    }}
                />
            </ColorExtractor>
            <Stack direction="row" justifyContent='space-between' sx={{mt:1}}>
                <Typography variant='h2a'>{name}</Typography>
            </Stack>
            <Divider sx={{mt:0.8, mb:0.3}}/>
        </CardWrapper>
    );
};
