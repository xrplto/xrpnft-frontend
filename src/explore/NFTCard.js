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
import FavoriteIcon from '@mui/icons-material/Favorite';

// Iconify
import { Icon } from '@iconify/react';

// Utils
import { getNFTokenInfo, convertHexToString, getNFTfromURI } from 'src/utils/parse';

// Components
import FlagsContainer from './Flags';
import PriceContainer from './Price';

const CardWrapper = styled('div')(
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

export default function NFTCard({ Flags, Issuer, NFTokenID, URI }) {
    const [type, setType] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(null);

    const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);

    const like = () => setIsLike(!isLike);

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    useEffect(() => {
        let mounted = true
        const getImgUrl = async () => {
            setLoading(true);

            const res = await getNFTokenInfo(URI);
            setType(res.type);

            console.log(res);
            
            if (mounted) {
                setImgUrl('/static/nft.png');
                // setImgUrl(res.image)

                // console.log("image url", res.image);
            }
            setLoading(false);
            // if(res.description.name){
            // setName(res.description.name)}
        }

        getImgUrl()

        return () => {
            mounted = false
        }
    }, [URI])

    return (
        <Link href={`/nft/${NFTokenID}/${URI}`} underline='none'>
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
            >
                <ColorExtractor getColors={getColors}>
                    <img src={imgUrl}
                        style={{
                            width: 250,
                            height: 220,
                            marginTop: 5,
                            borderRadius: 20
                        }}
                    />
                </ColorExtractor>
                {/* {
                  !loading
                    ?
                    <CardMedia
                        component='img'
                        image={imgUrl}
                        alt={imgUrl}
                        style={{
                            width: 260,
                            height: 220,
                            marginTop: 4,
                            borderRadius:20
                        }}
                    />
                    :
                    <Skeleton
                        animation='wave'
                        variant='rectangular' 
                        style={{
                            width: 260,
                            height: 220,
                            marginTop: 4,
                            borderRadius:20
                        }}
                    />
                } */}
                <Stack direction="row" justifyContent='space-between' sx={{mt:1}}>
                    <Typography variant='s2'>{type.toUpperCase()}</Typography>
                    <Typography variant='s2'>Price</Typography>
                </Stack>
                <Stack direction="row" justifyContent='space-between' sx={{mt:1}}>
                    <Typography variant='s2'>{name}</Typography>
                    <PriceContainer price="2000" />
                </Stack>
                <Divider sx={{mt:0.8, mb:0.3}}/>
                <Stack direction="row" justifyContent='space-between' sx={{mt:1}}>
                    <FlagsContainer Flags={Flags} />
                    {/* <IconButton aria-label='buy'> */}
                      {/* <Icon icon="bxs:cart-alt" /> */}
                    {/* </IconButton> */}
                    {/* <IconButton aria-label='share'> */}
                      <FavoriteIcon />
                    {/* </IconButton> */}
                </Stack>
            </CardWrapper>
        </Link>
    );
};
