import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { ColorExtractor } from 'react-color-extractor';
import useWindowSize from 'react-use/lib/useWindowSize';
import React, { useEffect, useState, createRef } from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Button,
    Link,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

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
  
export default function Congrats({ data }) {
    const theme = useTheme();
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const nft = data.nft;
    const collection = data.collection;
    const isEditCollection = data.isEditCollection;
    const isBuyAssets = data.isBuyAssets;
    const isBurnNft = data.isBurnNft;
    const isMintNft = data.isMintNft;

    const [colors, setColors] = useState([]);

    const [congrats, setCongrats] = useState(true);

    let imgUrl;
    let url, title, desc;
    if (nft) {
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
        // }
        const {
            uuid,
            name,
            description,
            collection,
            meta,
        } = nft;
        imgUrl = `https://gateway.xrpnft.com/ipfs/${nft.meta.image}`;
        url = `https://xrpnft.com/assets/${uuid}`;
        title = `${name}`;
        desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;
    } else {
        const {
            name,
            slug,
            items,
            type,
            description,
            logoImage,
            featuredImage,
            bannerImage,
            timestamp
        } = collection;

        imgUrl = `https://s1.xrpnft.com/collection/${collection.logoImage}`;
        url = `https://xrpnft.com/collection/${slug}`;
        title = `${name}`;
        desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;
    }

    const getColors = (colors, idx) => {
        setColors(c => [...c, ...colors]);
    }

    useEffect(() => {
        if (congrats) {
            play();
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
                    {nft &&
                        <>
                            {isMintNft &&
                                <Typography variant="d3">Your NFT has been minted on the XRP Ledger.</Typography>
                            }
                            {isBuyAssets &&
                                <Typography variant="d3">You've successfully purchased a NFT.</Typography>
                            }
                            {isBurnNft &&
                                <Typography variant="d3">Your NFT has been burnt from the XRP Ledger.</Typography>
                            }
                        </>
                    }
                    
                    {collection &&
                        <>
                            {isEditCollection ? (
                                <Typography variant="d3" >Your collection has been edited.</Typography>
                            ):(
                                <Typography variant="d3" >Your collection has been created.</Typography>
                            )
                            }
                        </>
                    }

                    <Stack direction="row" spacing={2}>
                        <FacebookShareButton
                            url={url}
                            quote={title}
                            hashtag={"#"}
                            description={desc}
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                            title={title}
                            url={url}
                            hashtag={"#"}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </Stack>

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
                            <img src={imgUrl}
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

                    {nft && 
                        <>
                            {isBuyAssets &&
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collection/${nft.cslug}`}
                                >
                                    <Button variant="outlined">Buy another NFT</Button>
                                </Link>
                            }
                            {isBurnNft &&
                                <>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/collection/${nft.cslug}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Button variant="contained">Burn another NFT</Button>
                                    </Link>
                                </>
                            }
                            {isMintNft &&
                                <>
                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/assets/${nft.uuid}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Button variant="contained">View NFT Detail</Button>
                                    </Link>

                                    <Link
                                        underline="none"
                                        color="inherit"
                                        href={`/create`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Button variant="outlined">Create another NFT</Button>
                                    </Link>
                                </>
                            }
                        </>
                    }

                    {collection && 
                        <>
                            {collection.type !== 'normal' &&
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/bulks`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Button variant="contained">Manage Bulks</Button>
                                </Link>
                            }

                            <Link
                                underline="none"
                                color="inherit"
                                href={`/collection/${collection.slug}`}
                                rel="noreferrer noopener nofollow"
                            >
                                <Button variant="contained">View Collection</Button>
                            </Link>

                            <Link
                                underline="none"
                                color="inherit"
                                href={`/collection/create`}
                                rel="noreferrer noopener nofollow"
                            >
                                <Button variant="outlined">Create another Collection</Button>
                            </Link>
                        </>
                    }
                    
                </Stack>

            </Stack>
        </>
    );
};
