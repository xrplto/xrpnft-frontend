import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSound from 'use-sound';
import Decimal from 'decimal.js';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

// Material
import { useTheme, alpha } from '@mui/material/styles';
import {
    styled,
    Box,
    Button,
    CardMedia,
    Container,
    Divider,
    Grid,
    CircularProgress,
    LinearProgress,
    Link,
    Paper,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { getNftCoverUrl } from 'src/utils/parse';

// Components
import BuyMintDialog from './BuyMintDialog';
import { useRouter } from 'next/router';

const CardWrapper = styled(Paper)(({ theme }) => ({
    maxWidth: 420,
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    objectFit: 'cover',
    transition: 'all 0.3s ease-in-out',
    WebkitTapHighlightColor: 'transparent',
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.12)}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.16)}`,
    }
}));

const IconCover = styled('div')(({ theme }) => ({
    width: 102,
    height: 102,
    marginTop: -56,
    marginBottom: 16,
    border: `6px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: 10,
    boxShadow: `0 5px 10px ${alpha(theme.palette.common.black, 0.08)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
        width: 132,
        height: 132,
        marginTop: -86,
    },
    [theme.breakpoints.up('md')]: {
        width: 192,
        height: 192,
        marginTop: -156,
    },
}));

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

const SlotBox = styled('div')(
    ({ theme }) => `
        // padding-top: 40px;
        // width: 280px;
        // height: 200px;
        // @media (min-width: ${theme.breakpoints.values.md}px) {
        //     width: 480px;
        //     height: 400px;
        // }
        // margin-bottom: 20px;
        // margin-top: 20px;
        // border-style: solid;
        justify-content: center;
        overflow: hidden;
        // line-height: 4;
        border-radius: 20px;
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
    transition: theme.transitions.create('opacity')
}));

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
`
);

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.primary.main,
    },
}));

function LinearProgressWithLabel(props) {
    const progressColor = props.progressColor;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                {/* <LinearProgress variant="determinate" {...props} /> */}
                <BorderLinearProgress
                    variant="determinate"
                    {...props}
                    sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                            borderRadius: 5,
                            backgroundColor: progressColor
                        }
                    }}
                />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {props.value}%
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired
};

function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[
                            theme.palette.mode === 'light' ? 200 : 800
                        ]
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="determinate"
                disableShrink
                sx={{
                    position: 'absolute',
                    left: 0
                }}
                size={40}
                thickness={4}
                {...props}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

const NFTImageContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    '& img, & video': {
        width: '100%',
        height: 'auto',
        display: 'block',
        transition: 'transform 0.3s ease-in-out',
    },
    '&:hover img, &:hover video': {
        transform: 'scale(1.02)',
    }
}));

export default function SpinNFT({ collection, setView }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { width, height } = useWindowSize();
    const [play, { stop }] = useSound(
        '/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav'
    );
    // const fullScreen = useMediaQuery(theme.breakpoints.up('md'));

    const { darkMode, accountProfile, openSnackbar, sync, setSync } =
        useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [congrats, setCongrats] = useState(false);

    const [openBuyMint, setOpenBuyMint] = useState(false);

    const [mints, setMints] = useState(0);

    const [xrpBalance, setXrpBalance] = useState(0);

    const [pendingNfts, setPendingNfts] = useState(0);

    const {
        uuid,
        name,
        slug,
        items,
        type,
        description,
        logoImage,
        // featuredImage,
        // bannerImage,
        spinnerImage,
        // created,
        costs,
        // minter,
        verified,
        extra
    } = collection;

    const [nft, setNft] = useState(extra?.sampleNft);

    const [spinning, setSpinning] = useState(false);

    const imgUrl = getNftCoverUrl(nft);// , 480

    const img_dark = '/static/default_mint_black.svg';
    const img_light = '/static/default_mint_white.svg';

    const defaultImage = darkMode ? img_light : img_dark;

    let nftImgUrl = imgUrl || defaultImage; // '/static/empty.png';

    const isVideo = nft?.meta?.video;

    const spinImgUrl = spinnerImage
        ? `https://s1.xrpnft.com/collection/${spinnerImage}`
        : '/static/spin.gif';

    const pendingProgress =
        items > 0
            ? new Decimal(pendingNfts)
                  .mul(100)
                  .div(items)
                  .toDP(1, Decimal.ROUND_DOWN)
                  .toNumber()
            : 0;

    let progressColor = '#FF1943';
    if (pendingProgress > 50) {
        progressColor = '#33C2FF';
    } else if (pendingProgress > 25) {
        progressColor = '#FFA319';
    }

    // useEffect(() => {
    //     window.addEventListener("resize", () => {
    //         // setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    //         console.log({ width: window.innerWidth, height: window.innerHeight });
    //         console.log(`Window innerHeight: ${window.innerHeight}`);
    //         console.log(`Window outerHeight: ${window.outerHeight}`);

    //         console.log(window.pageYOffset)
    //     });
    // }, []);

    useEffect(() => {
        function getMints() {
            if (!account || !accountToken) {
                openSnackbar('Please login', 'error');
                // setMints(0);
                // setXrpBalance(0);
                // return;
            }

            // https://api.xrpnft.com/api/spin/count?account=rhhh
            axios
                .get(`${BASE_URL}/spin/count?account=${account}&cid=${uuid}`, {
                    headers: { 'x-access-token': accountToken }
                })
                .then((res) => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        // console.log(`Mints: ${ret.mints}`);
                        setMints(ret.mints);
                        setXrpBalance(ret.xrpBalance);
                        setPendingNfts(ret.pendingNfts);
                    }
                })
                .catch((err) => {
                    console.log('Error on getting mint count!!!', err);
                })
                .then(function () {
                    // always executed
                });
        }
        getMints();
    }, [account, accountToken, sync]);

    useEffect(() => {
        if (congrats) {
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    const getOneNFT = () => {
        if (spinning) return;

        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        if (mints < 1) {
            openSnackbar('You do not have enough Mints', 'error');
            return;
        }

        if (pendingNfts < 1) {
            openSnackbar('There are no NFTs left', 'error');
            return;
        }

        setSpinning(true);
        // setNft(null);

        const body = { account, cid: uuid };

        axios
            .post(`${BASE_URL}/spin/chooseone`, body, {
                headers: { 'x-access-token': accountToken }
            })
            .then((res) => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    const newNft = ret.nft;
                    if (newNft) {
                        setNft(newNft);
                        setSync(sync + 1);
                        setCongrats(true);
                        play();
                    } else {
                        openSnackbar(ret.error, 'error');
                    }
                }
            })
            .catch((err) => {
                console.log('Error on choosing NFT!!!', err);
            })
            .then(function () {
                // always executed
                setSpinning(false);
            });
    };

    return (
        <>
            <BuyMintDialog
                open={openBuyMint}
                setOpen={setOpenBuyMint}
                type="random"
                cid={uuid}
                costs={costs}
                setMints={setMints}
                setXrpBalance={setXrpBalance}
            />

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
            <Stack alignItems="center" sx={{ mb: 8, mt: 2 }}>
                <IconCover>
                    <IconWrapper>
                        <IconImage
                            src={`https://s1.xrpnft.com/collection/${logoImage}`}
                        />
                        {account === collection.account && (
                            <Link
                                href={`/collection/${slug}/edit`}
                                underline="none"
                            >
                                <CardOverlay>
                                    <EditIcon
                                        className="MuiIconEditButton-root"
                                        fontSize="large"
                                        sx={{ opacity: 0, zIndex: 1, color: theme.palette.primary.main }}
                                    />
                                </CardOverlay>
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                            </Link>
                        )}
                    </IconWrapper>
                </IconCover>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h1a" color="primary.main">{name}</Typography>
                    {verified === 'yes' && (
                        <Tooltip title="Verified">
                            <VerifiedIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                        </Tooltip>
                    )}
                </Stack>
                {description && (
                    <Typography 
                        variant="d3" 
                        maxWidth="600px" 
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 2 }}
                    >
                        {description}
                    </Typography>
                )}
                <Link
                    component="button"
                    underline="always"
                    variant="body2"
                    color="primary.main"
                    onClick={() => {
                        setView('');
                    }}
                >
                    <Typography sx={{ ml: 0 }}>View Minted Items</Typography>
                </Link>
            </Stack>

            <Container maxWidth="lg" sx={{ pl: 0, pr: 0 }}>
                <Grid
                    container
                    rowSpacing={2}
                    alignItems="center"
                    sx={{ mb: 10 }}
                >
                    <Grid
                        container
                        item
                        xs={12}
                        md={6}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CardWrapper>
                            <img
                                src={spinImgUrl}
                                style={{
                                    width: '100%',
                                    // height: fullScreen?'360px':'200px',
                                    // marginTop: 5,
                                    // borderRadius: 20,
                                    objectFit: 'cover',
                                    display: spinning ? 'block' : 'none'
                                }}
                            />
                            {isVideo ? (
                                <CardMedia
                                    component="video"
                                    image={nftImgUrl}
                                    title="title"
                                    controls
                                    style={{
                                        width: '100%',
                                        // height: fullScreen?'360px':'200px',
                                        // marginTop: 5,
                                        // borderRadius: 20,
                                        objectFit: 'cover',
                                        display: spinning ? 'none' : 'block'
                                    }}
                                />
                            ) : (
                                <img
                                    src={nftImgUrl}
                                    style={{
                                        width: '100%',
                                        // height: fullScreen?'360px':'200px',
                                        // marginTop: 5,
                                        // borderRadius: 20,
                                        objectFit: 'cover',
                                        display: spinning ? 'none' : 'block'
                                    }}
                                />
                            )}

                            {/* <Stack alignItems="center" sx={{mt:1}}>
                                <Typography variant='h2a'>{spinning?'Please Wait!':(nft?nft.name:'Spin to Mint')}</Typography>
                            </Stack> */}
                            <Divider sx={{ mt: 0.8, mb: 2 }} />
                            <Stack alignItems="center">

                            {/*
                                <Button
                                    variant="contained"
                                    disabled={spinning}
                                    onClick={() => getOneNFT()}
                                    sx={{ mb: 2 }}
                                >
                                    Mint
                                </Button>

                                */}

                            </Stack>
                        </CardWrapper>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        md={6}
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Stack 
                            spacing={3} 
                            sx={{ 
                                mt: 3, 
                                mb: 6,
                                width: '100%',
                                maxWidth: 480,
                                p: 3,
                                borderRadius: 2,
                                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6)
                            }}
                        >
                            <Typography variant="h4" color="primary.main">
                                Collection Stats
                            </Typography>
                            
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Your Mints</Typography>
                                    <Typography variant="h5" color="#33C2FF">{mints}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Available XRP</Typography>
                                    <Typography variant="h5" color="#33C2FF">{xrpBalance}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">Remaining NFTs</Typography>
                                    <Typography variant="h5" color={progressColor}>
                                        {pendingNfts} / {items}
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgressWithLabel
                                        variant="determinate"
                                        value={pendingProgress}
                                        progressColor={progressColor}
                                    />
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => setOpenBuyMint(true)}
                                    startIcon={<ShoppingCartIcon />}
                                >
                                    Buy Mints
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={Link}
                                    href="/buy-crypto"
                                    target="_blank"
                                    startIcon={<AccountBalanceWalletIcon />}
                                >
                                    Buy XRP
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* <Stack sx={{mt:5, minHeight: '20vh'}}>
            </Stack> */}
        </>
    );
}