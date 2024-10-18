// React
import React, { useState, useEffect, useContext } from 'react';

// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    Container,
    Box,
    Paper,
    Avatar,
    Fab,
    Tooltip,
    useTheme
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

// Components
import CollectionList from './CollectionList';

// Context
import { AppContext } from 'src/AppContext';

// Utils
import { getNftCoverUrl } from 'src/utils/parse';

// Third-party
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Add this import at the top of the file
import Image from 'next/image';

const AutoStack = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: flex-start;
        }
    `
);

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const HeroButton = styled(Button)(
    ({ theme }) => `
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
    `
);

// Add this new styled component for the animated text
const AnimatedText = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    minWidth: '200px',
    fontWeight: 'bold',
    color: theme.palette.primary.main
}));

// Add the new styled components from CollectionPreview
const CustomImage = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
}));

const CustomCarousel = styled(Carousel)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    '& .slide': {
        background: 'transparent !important',
        boxShadow: 'none !important'
    }
}));

const CollectionCard = styled(Paper)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 16px ${theme.palette.primary.main}20`
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, ${theme.palette.background.default}00 70%, ${theme.palette.background.default}B3 100%)`,
        pointerEvents: 'none'
    },
    width: '100%',
    height: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper
}));

const CollectionInfo = styled(Stack)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(1),
    zIndex: 1
}));

const GradientText = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
}));

export default function Landing({ collections }) {
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);

    // Add the new state and effect for text animation
    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setAnimatedText(phrases[currentIndex]);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    // Add the fadeAnimationHandler from CollectionPreview
    const fadeAnimationHandler = (props, state) => {
        const transitionTime = props.transitionTime + 'ms';
        const transitionTimingFunction = 'ease-in-out';

        let slideStyle = {
            position: 'absolute',
            display: 'block',
            zIndex: -2,
            minHeight: '100%',
            opacity: 0,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            transitionTimingFunction: transitionTimingFunction,
            msTransitionTimingFunction: transitionTimingFunction,
            MozTransitionTimingFunction: transitionTimingFunction,
            WebkitTransitionTimingFunction: transitionTimingFunction,
            OTransitionTimingFunction: transitionTimingFunction
        };

        if (!state.swiping) {
            slideStyle = {
                ...slideStyle,
                WebkitTransitionDuration: transitionTime,
                MozTransitionDuration: transitionTime,
                OTransitionDuration: transitionTime,
                transitionDuration: transitionTime,
                msTransitionDuration: transitionTime
            };
        }

        return {
            slideStyle,
            selectedStyle: {
                ...slideStyle,
                opacity: 1,
                zIndex: 2,
                position: 'relative'
            },
            prevStyle: { ...slideStyle }
        };
    };

    return (
        <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2, md: 3 } }}>
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
                <Grid
                    container
                    spacing={0}
                    sx={{
                        mt: { xs: 0, sm: 0, md: 1 },
                        mb: { xs: 2, md: 6 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={1}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    />
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            pl: { xs: 0, md: 4 }
                        }}
                    >
                        <AutoStack
                            spacing={3}
                            sx={{
                                maxWidth: { xs: '100%', sm: '100%', md: '90%' },
                                px: { xs: 0.5, sm: 0 }
                            }}
                        >
                            <GradientTypography
                                variant="h1"
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: '2rem',
                                        sm: '2.5rem',
                                        md: '3rem',
                                        lg: '3.5rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' },
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                XRP NFT Marketplace
                            </GradientTypography>

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{
                                    fontSize: {
                                        xs: '1.25rem',
                                        sm: '1.5rem',
                                        md: '1.75rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' }
                                }}
                            >
                                Trade XRP NFTs{' '}
                                <AnimatedText component="span">
                                    {animatedText}
                                </AnimatedText>
                            </Typography>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mt: 4, width: '100%' }}
                            >
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collections`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="contained" fullWidth>
                                        Explore Collections
                                    </HeroButton>
                                </Link>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="outlined" fullWidth>
                                        Create NFT
                                    </HeroButton>
                                </Link>
                            </Stack>

                            {/* Updated Supported Marketplaces section */}
                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: {
                                        xs: 'center',
                                        md: 'flex-start'
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    Supported Marketplaces: xrp.cafe, bidds, Art
                                    Dept
                                </Typography>
                            </Box>
                        </AutoStack>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: { xs: '100%', sm: '500px' },
                                aspectRatio: '1 / 1',
                                mx: 'auto',
                                px: { xs: 1, sm: 0 }
                            }}
                        >
                            <CustomCarousel
                                interval={4000}
                                transitionTime={2000}
                                showArrows={false}
                                showStatus={false}
                                showIndicators={false}
                                infiniteLoop={true}
                                showThumbs={false}
                                useKeyboardArrows={true}
                                autoPlay={true}
                                stopOnHover={false}
                                swipeable={false}
                                animationHandler={fadeAnimationHandler}
                                emulateTouch={true}
                            >
                                {collections.slice(0, 1).map((item, idx) => {
                                    const {
                                        uuid,
                                        name,
                                        slug,
                                        logoImage,
                                        verified,
                                        nft
                                    } = item;

                                    let imgUrl = getNftCoverUrl(nft ? nft : {});

                                    if (!imgUrl || nft?.meta?.video) {
                                        imgUrl = `https://s1.xrpnft.com/collection/${logoImage}`;
                                    }

                                    return (
                                        <CollectionCard key={idx} elevation={0}>
                                            <Link
                                                underline="none"
                                                color="inherit"
                                                href={`/collection/${slug}`}
                                                sx={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            >
                                                <CustomImage
                                                    src={imgUrl}
                                                    alt={name}
                                                />
                                                <CollectionInfo
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        padding: 2
                                                    }}
                                                >
                                                    <GradientText
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: theme.palette
                                                                .text.primary,
                                                            fontWeight: 600,
                                                            textShadow: `0 1px 2px ${theme.palette.primary.main}80`,
                                                            textAlign: 'center',
                                                            flexGrow: 1,
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                            whiteSpace:
                                                                'nowrap',
                                                            fontSize: '1.5rem'
                                                        }}
                                                    >
                                                        {name}
                                                    </GradientText>
                                                    {verified === 'yes' && (
                                                        <Tooltip title="Verified">
                                                            <VerifiedIcon
                                                                fontSize="large"
                                                                sx={{
                                                                    color: theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                                    flexShrink: 0
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </CollectionInfo>
                                            </Link>
                                        </CollectionCard>
                                    );
                                })}
                            </CustomCarousel>
                        </Box>
                    </Grid>
                </Grid>

                {/* Collection List */}
                <Box
                    sx={{
                        mt: { xs: 3, md: 8 },
                        mb: { xs: 3, md: 8 },
                        px: { xs: 0.5, sm: 2 },
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '100%', md: '95%', lg: '90%' },
                        margin: '0 auto'
                    }}
                >
                    <CollectionList collections={collections} />
                </Box>

                <Box sx={{ height: { xs: 24, md: 48 } }} />
            </Box>
        </Container>
    );
}
