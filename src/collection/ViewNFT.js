import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon } from 'react-share';
import axios from 'axios';
import useSound from 'use-sound';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    useMediaQuery,
    Box,
    IconButton,
    Link,
    Popover,
    Stack,
    Tooltip,
    Typography,
    Button
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { formatMonthYear } from 'src/utils/formatTime';
import { fNumber, fVolume } from 'src/utils/formatNumber';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import ExploreNFT from 'src/explore';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import Watch from 'src/components/Watch';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 102px;
        height: 102px;
        margin-top: -56px;
        margin-bottom: 16px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 132px;
            height: 132px;
            margin-top: -86px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 192px;
            height: 192px;
            margin-top: -156px;
        }
        border: 6px solid ${theme.colors.alpha.black[50]};
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

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

export default function ViewNFT({ collection }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const anchorRef = useRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [play, { stop }] = useSound(
        '/static/sounds/mixkit-fireworks-bang-in-sky-2989.wav'
    );
    const { accountProfile, openSnackbar, sync, setSync } =
        useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const [spinning, setSpinning] = useState(false);

    const [openShare, setOpenShare] = useState(false);

    const [congrats, setCongrats] = useState(false);

    const [mints, setMints] = useState(0);

    const [xrpBalance, setXrpBalance] = useState(0);

    const [pendingNfts, setPendingNfts] = useState(0);

    // "collection": {
    //     "_id": "6310c27cf81fe46884ef89ba",
    //     "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "name": "collection1",
    //     "slug": "collection-1",
    //     "description": "",
    //     "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
    //     "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
    //     "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
    //     "created": 1662042748016,
    //     "creator": "xrpnft.com",
    //     "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
    // }
    const {
        uuid,
        account,
        accountName,
        name,
        slug,
        items,
        type,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        costs,
        extra,
        minter,
        verified,
        created,
        volume,
        totalVolume,
        floor
    } = collection;

    const floorPrice = floor?.amount || 0;
    let volume1 = fVolume(volume || 0);
    let volume2 = fVolume(totalVolume || 0);

    const shareUrl = `https://xrpnft.com/collection/${slug}`;
    const shareTitle = name;
    const shareDesc = description || '';

    const handleOpenShare = () => {
        setOpenShare(true);
    };

    const handleCloseShare = () => {
        setOpenShare(false);
    };

    const getOneNFT = () => {
        if (spinning) return;

        if (!accountLogin || !accountToken) {
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

        const body = { account: accountLogin, cid: uuid };

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

    useEffect(() => {
        function getMints() {
            if (!accountLogin || !accountToken) {
                openSnackbar('Please login', 'error');
                // setMints(0);
                // setXrpBalance(0);
                // return;
            }

            // https://api.xrpnft.com/api/spin/count?account=rhhh
            axios
                .get(
                    `${BASE_URL}/spin/count?account=${accountLogin}&cid=${uuid}`,
                    {
                        headers: { 'x-access-token': accountToken }
                    }
                )
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
    }, [accountLogin, accountToken, sync]);

    useEffect(() => {
        if (congrats) {
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
        }
    }, [congrats]);

    return (
        <>
            <Popover
                open={openShare}
                onClose={handleCloseShare}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        // mt: 1.5,
                        // ml: 0.5,
                        // overflow: 'inherit',
                        // boxShadow: (theme) => theme.customShadows.z20,
                        // border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
                        // width: 'auto',
                    }
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ pt: 1.5, pl: 1, pr: 1, pb: 1 }}
                >
                    <FacebookShareButton
                        url={shareUrl}
                        quote={shareTitle}
                        hashtag={'#'}
                        description={shareDesc}
                        onClick={handleCloseShare}
                    >
                        <FacebookIcon size={24} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        title={shareTitle}
                        url={shareUrl}
                        hashtag={'#'}
                        onClick={handleCloseShare}
                    >
                        <TwitterIcon size={24} round />
                    </TwitterShareButton>
                </Stack>
            </Popover>
            <IconCover>
                <IconWrapper>
                    <IconImage
                        src={`https://s1.xrpnft.com/collection/${logoImage}`}
                    />
                    {accountLogin === collection.account && (
                        <Link
                            href={`/collection/${slug}/edit`}
                            underline="none"
                        >
                            <CardOverlay>
                                <EditIcon
                                    className="MuiIconEditButton-root"
                                    // color='primary'
                                    fontSize="large"
                                    sx={{ opacity: 0, zIndex: 1 }}
                                />
                            </CardOverlay>
                            <ImageBackdrop className="MuiImageBackdrop-root" />
                        </Link>
                    )}
                </IconWrapper>
            </IconCover>
            <Stack
                direction={fullScreen ? 'column' : 'row'}
                spacing={2}
                justifyContent="space-between"
                sx={{ mt: 1, mb: 1 }}
            >
                <Stack direction="row" spacing={1}>
                    <Typography variant="h1a">{name}</Typography>
                    {verified === 'yes' && (
                        <Tooltip title="Verified">
                            <VerifiedIcon style={{ color: '#4589ff' }} />
                        </Tooltip>
                    )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {accountLogin === collection.account && (
                        <Link
                            href={`/collection/${slug}/edit`}
                            underline="none"
                        >
                            <Tooltip title="Edit your collection">
                                <IconButton size="medium" sx={{ padding: 1 }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    )}

                    <Tooltip title="Add to watchlist">
                        {/*<IconButton size='medium' sx={{ padding: 1 }}
                            onClick={() => {
                            }}
                        >
                            <StarBorderIcon />
                        </IconButton>*/}
                        <Watch collection={collection} />
                    </Tooltip>

                    <Tooltip title="Share">
                        <IconButton
                            size="medium"
                            sx={{ padding: 1 }}
                            ref={anchorRef}
                            onClick={handleOpenShare}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        size="medium"
                        sx={{ padding: 1 }}
                        onClick={() => {}}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack direction="row" sx={{ mt: 2, mb: 3 }} spacing={1}>
                <Typography variant="s5" style={{ wordBreak: 'break-word' }}>
                    By&nbsp;
                    <Link
                        color="inherit"
                        // target="_blank"
                        href={`/account/${account}`}
                        // rel="noreferrer noopener nofollow"
                    >
                        <Typography variant="s5" color="#33C2FF">
                            {accountName ||
                                account.slice(0, 4) + '...' + account.slice(-4)}
                        </Typography>
                    </Link>
                    <Typography variant="s10">
                        &nbsp;&nbsp;·&nbsp;Created{' '}
                        <Typography variant="s3">
                            {formatMonthYear(created)}
                        </Typography>
                    </Typography>
                </Typography>
            </Stack>

            <SeeMoreTypography variant="d3" text={description} />

            {/* {description &&
                <Typography variant="d3" style={{ wordBreak: "break-word" }}>{description}</Typography>
            } */}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    width: '100%',
                    '& > *': {
                        scrollSnapAlign: 'center'
                    },
                    '::-webkit-scrollbar': { display: 'none' }
                }}
            >
                <Stack
                    direction="row"
                    width="100%"
                    sx={{ mt: 2, mb: { xs: 0, sm: 3 } }}
                    spacing={{ xs: 3, sm: 5 }}
                    alignItems="flex-end"
                    justifyContent={{ xs: 'space-around', sm: 'flex-start' }}
                >
                    <Stack>
                        <Typography variant="d5">{items}</Typography>
                        <Typography variant="s13">items</Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="d5">{extra.owners}</Typography>
                        <Typography variant="s13">owners</Typography>
                    </Stack>
                    <Stack>
                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                        >
                            <Icon icon={rippleSolid} width="20" height="20" />
                            <Typography variant="d5" noWrap>
                                {volume2}
                            </Typography>
                            <Stack direction="row" sx={{ pb: 1.5 }}>
                                <Tooltip
                                    title={
                                        <Stack alignItems="center">
                                            <Typography variant="body2">
                                                Volume on XRPNFT
                                            </Typography>
                                            <Typography variant="body2">
                                                {volume1}
                                            </Typography>
                                        </Stack>
                                    }
                                >
                                    <Icon icon={infoFilled} />
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Typography variant="s13" noWrap>
                            total volume
                        </Typography>
                    </Stack>
                    <Stack>
                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                        >
                            <Icon icon={rippleSolid} width="20" height="20" />
                            <Typography variant="d5" noWrap>
                                {fNumber(floorPrice)}
                            </Typography>
                        </Stack>
                        <Typography variant="s13" noWrap>
                            floor price
                        </Typography>
                    </Stack>
                </Stack>

                <Box sx={{ my: { xs: 2, sm: 3 } }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => getOneNFT()}
                    >
                        Mint
                    </Button>
                </Box>
            </Box>

            <ExploreNFT collection={collection} />

            {/* <Button component={Link} href="/collection/create" variant="contained" color="primary">
                Create a collection
            </Button> */}
            {/* <Stack sx={{mt:5, minHeight: '50vh'}}>
            </Stack> */}
        </>
    );
}
