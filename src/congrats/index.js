import useSound from 'use-sound';
import Confetti from 'react-confetti';
import { ColorExtractor } from 'react-color-extractor';
import useWindowSize from 'react-use/lib/useWindowSize';
import React, { useEffect, useState } from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import { useRouter } from 'next/router';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Button,
    Container,
    Link,
    Stack,
    Typography,
    useMediaQuery,
    Box,
    Fade,
} from '@mui/material';

const CardWrapper = styled('div')(
    ({ theme }) => `
        width: 300px;
        height: 300px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 500px;
        }
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease-in-out;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
  `
);

const ShareButton = styled(Button)(({ theme }) => ({
    minWidth: 'auto',
    padding: theme.spacing(1.5),
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
}));

const ActionButton = styled(Button)(({ theme }) => `
    padding: 12px 24px;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &.MuiButton-contained {
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        color: ${theme.palette.common.white};
        border: none;

        &:hover {
            background: linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark});
        }
    }

    &.MuiButton-outlined {
        border: 2px solid ${theme.palette.primary.main};
        color: ${theme.palette.primary.main};

        &:hover {
            background: rgba(${theme.palette.primary.main}, 0.05);
        }
    }
`);


const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const AnimatedBackground = styled('div')(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 99%, ${theme.palette.secondary.light} 100%)`,
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    '@keyframes gradientBG': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' },
    },
}));

export default function Congrats() {
    const router = useRouter();
    const { nfTokenID } = router.query;
    const theme = useTheme();
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound('/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav');
    const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const [nft, setNft] = useState(null);
    const [colors, setColors] = useState([]);
    const [congrats, setCongrats] = useState(true);

    useEffect(() => {
        if (nfTokenID) {
            fetchNFTData(nfTokenID);
        }
    }, [nfTokenID]);

    useEffect(() => {
        if (congrats) {
            play();
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats, play]);

    const fetchNFTData = async (nfTokenID) => {
        try {
            const response = await fetch(`https://api.xrpnft.com/api/nft/${nfTokenID}`);
            const data = await response.json();
            if (data.res === "success") {
                setNft(data.nft);
            } else {
                console.error('Error fetching NFT data:', data);
            }
        } catch (error) {
            console.error('Error fetching NFT data:', error);
        }
    };

    const getColors = (colors) => {
        setColors(prevColors => [...prevColors, ...colors]);
    }

    if (!nft) {
        return <Typography>Loading...</Typography>;
    }

    const {
        name,
        meta,
        NFTokenID,
        collection,
    } = nft;

    const imgUrl = meta?.image ? `https://gateway.xrpnft.com/ipfs/${meta.image.replace('ipfs://', '')}` : '';
    const isVideo = false; // Adjust this if you need to handle video NFTs
    const url = `https://xrpnft.com/nft/${NFTokenID}`;
    const title = name || "My New NFT";
    const desc = meta?.description || `XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.`;

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
                numberOfPieces={width / 4}
                tweenDuration={100}
                colors={[theme.palette.primary.light, theme.palette.secondary.light, theme.palette.success.light, theme.palette.warning.light]}
            />
            <AnimatedBackground />
            <Container maxWidth="md">
                <Fade in={true} timeout={1000}>
                    <Stack spacing={6} sx={{ mt: 12, mb: 12, alignItems: 'center' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <GradientTypography
                                variant="h2"
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: '2rem',
                                        sm: '2.5rem',
                                        md: '3rem',
                                        lg: '3.5rem'
                                    },
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                Congratulations!
                            </GradientTypography>
                            <img src='/static/party-popper.png'
                                alt="Party popper"
                                style={{
                                    width: 56,
                                    height: 56
                                }}
                            />
                        </Stack>

                        <Typography variant="h5" textAlign="center" color="text.secondary" sx={{ maxWidth: '600px' }}>
                            Your NFT has been successfully minted on the XRP Ledger. You're now part of an exclusive digital art community.
                        </Typography>

                        <CardWrapper>
                            <ColorExtractor getColors={getColors}>
                                <img src={imgUrl}
                                    alt={name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 16,
                                        objectFit: 'cover',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                            </ColorExtractor>
                        </CardWrapper>

                        <GradientTypography variant="h3" fontWeight="medium" sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>{title}</GradientTypography>
                        {collection && (
                            <Typography variant="h6" color="text.secondary">
                                Collection: {collection}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={3} justifyContent="center">
                            <ShareButton
                                component={FacebookShareButton}
                                url={url}
                                quote={title}
                                hashtag={"#XRPNFT"}
                                description={desc}
                            >
                                <FacebookIcon size={32} round bgStyle={{ fill: 'transparent' }} iconFillColor={theme.palette.primary.contrastText} />
                            </ShareButton>
                            <ShareButton
                                component={TwitterShareButton}
                                title={title}
                                url={url}
                                hashtag={"#XRPNFT"}
                            >
                                <TwitterIcon size={32} round bgStyle={{ fill: 'transparent' }} iconFillColor={theme.palette.primary.contrastText} />
                            </ShareButton>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/nft/${NFTokenID}`}
                                rel="noreferrer noopener nofollow"
                            >
                                <ActionButton variant="contained" size="large">
                                    View NFT Details
                                </ActionButton>
                            </Link>

                            <Link
                                underline="none"
                                color="inherit"
                                href={`/create`}
                                rel="noreferrer noopener nofollow"
                            >
                                <ActionButton variant="outlined" size="large">
                                    Create Another NFT
                                </ActionButton>
                            </Link>
                        </Stack>
                    </Stack>
                </Fade>
            </Container>
        </>
    );
}