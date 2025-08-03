import { ColorExtractor } from 'react-color-extractor';
import React, { useEffect, useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

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
    Toolbar,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon to use as X

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
        background: linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter} 100%);
        min-height: 100vh;
`
);

const CardWrapper = styled(motion.div)(
    ({ theme }) => `
        width: 300px;
        height: 300px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 500px;
        }
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        }
  `
);

const ShareButton = styled(Button)(({ theme }) => ({
    minWidth: 'auto',
    padding: theme.spacing(1.5),
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
    '&:hover': {
        backgroundColor: theme.palette.background.default,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)'
    }
}));

const ActionButton = styled(Button)(
    ({ theme }) => `
    padding: 12px 24px;
    font-weight: 600;
    font-size: 1rem;
    text-transform: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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
`
);

const GradientTypography = styled(motion.div)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const AnimatedBackground = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    '@keyframes gradientBG': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' }
    }
});

// Add this new custom X icon component
const XIcon = ({ color, size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill={color}
        />
    </svg>
);

// Add this custom Facebook icon component
const FacebookIcon = ({ color, size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
            fill={color}
        />
    </svg>
);

// Modify the CollectionTypography to be a clickable link
const CollectionTypography = styled(Link)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${
        theme.palette.secondary.main
    });
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
        padding: ${theme.spacing(1, 2)};
        border-radius: ${theme.shape.borderRadius}px;
        border: 1px solid ${theme.palette.primary.main};
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        text-decoration: none;
        cursor: pointer;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
    `
);

export default function Congrats() {
    const router = useRouter();
    const { nfTokenID } = router.query;
    const theme = useTheme();
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
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    const fetchNFTData = async (nfTokenID) => {
        try {
            const response = await fetch(
                `https://api.xrpnft.com/api/nft/${nfTokenID}`
            );
            const data = await response.json();
            if (data.res === 'success') {
                setNft(data.nft);
            } else {
                console.error('Error fetching NFT data:', data);
            }
        } catch (error) {
            console.error('Error fetching NFT data:', error);
        }
    };

    const getColors = (colors) => {
        setColors((prevColors) => [...prevColors, ...colors]);
    };


    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    if (!nft) {
        return <Typography>Loading...</Typography>;
    }

    const { name, meta, NFTokenID, collection, cslug } = nft;

    const imgUrl = meta?.image
        ? `https://gateway.xrpnft.com/ipfs/${meta.image.replace('ipfs://', '')}`
        : '';
    const isVideo = false; // Adjust this if you need to handle video NFTs
    const url = `https://xrpnft.com/nft/${NFTokenID}`;
    const title = name || 'My New NFT';
    const desc =
        meta?.description ||
        `XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.`;

    const generateShareMessage = () => {
        if (!nft) return '';

        const collectionInfo = nft.collection
            ? `from the "${nft.collection}" collection `
            : '';
        const rarityInfo = nft.rarity_rank
            ? `Rarity rank: ${nft.rarity_rank}/${nft.total}. `
            : '';
        const categoryInfo = nft.category ? `Category: ${nft.category}. ` : '';

        return `I just minted "${nft.name}" ${collectionInfo}on XRPNFT! ${rarityInfo}${categoryInfo}Check it out!`;
    };

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="lg">
                <Fade in={true} timeout={1000}>
                    <Stack
                        spacing={6}
                        sx={{ mt: 12, mb: 12, alignItems: 'center' }}
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <GradientTypography
                                    variants={textVariants}
                                    component={Typography}
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
                                <motion.img
                                    src="/static/party-popper.png"
                                    alt="Party popper"
                                    style={{
                                        width: 56,
                                        height: 56
                                    }}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            </Stack>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                        >
                            <Typography
                                variant="h5"
                                textAlign="center"
                                color="text.secondary"
                                sx={{ maxWidth: '600px' }}
                            >
                                Your NFT has been successfully minted on the XRP
                                Ledger. You're now part of an exclusive digital art
                                community.
                            </Typography>
                        </motion.div>

                        <CardWrapper
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <ColorExtractor getColors={getColors}>
                                <img
                                    src={imgUrl}
                                    alt={name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 16,
                                        objectFit: 'contain',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                                    }}
                                />
                            </ColorExtractor>
                        </CardWrapper>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={textVariants}
                        >
                            <GradientTypography
                                component={Typography}
                                variant="h3"
                                fontWeight="medium"
                                sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                {title}
                            </GradientTypography>
                        </motion.div>
                        {collection && cslug && (
                            <CollectionTypography
                                variant="h6"
                                href={`/collection/${cslug}`}
                                underline="none"
                            >
                                Collection: {collection}
                            </CollectionTypography>
                        )}

                        <Stack
                            direction="row"
                            spacing={3}
                            justifyContent="center"
                        >
                            <ShareButton
                                component={TwitterShareButton}
                                title={generateShareMessage()}
                                url={url}
                                hashtags={['XRPNFT', 'NFT']}
                            >
                                <XIcon
                                    color={theme.palette.primary.contrastText}
                                    size={24}
                                />
                            </ShareButton>
                            <ShareButton
                                component={FacebookShareButton}
                                url={url}
                                quote={generateShareMessage()}
                                hashtag="#XRPNFT"
                            >
                                <FacebookIcon
                                    color={theme.palette.primary.contrastText}
                                    size={24}
                                />
                            </ShareButton>
                        </Stack>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={3}
                            sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
                        >
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

            <ScrollToTop />

            <Footer />
        </OverviewWrapper>
    );
}