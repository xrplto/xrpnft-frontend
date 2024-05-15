import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";
import { useState } from "react";

// Material
import {
    styled, useTheme,
    Box,
    Button,
    CardMedia,
    Chip,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    Skeleton,
    Card,
    Grid,
    CardContent
} from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
// import infoFilled from '@iconify/icons-ep/info-filled';

// Utils
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import { getNftCoverUrl } from 'src/utils/parse';
import { normalizeAmount } from 'src/utils/normalizers';

// Components
// import FlagsContainer from 'src/components/Flags';

const CardWrapper = styled(Card)(
    ({ theme }) => `
        // box-shadow: 0px -0.5px 4px rgba(100, 100, 111, 0.9);
        // filter: drop-shadow(16px 16px 10px rgba(0,0,0,0.8));
        // filter: drop-shadow(0 0 0.2rem rgba(0,0,0,0.8));
        border-radius: 10px;
        backdrop-filter: blur(50px);
        // background: rgb(2, 0, 36);
        padding: 0px;
        // text-align: center;
        object-fit: cover;
        cursor: pointer;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        padding-bottom: 0px;
  `
);

export default function NFTCardAccept({ nft, handleApprove }) {
    const theme = useTheme();

    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    // const accountToken = accountProfile?.token;

    const {
        uuid,
        account,
        owner,
        destination,
        meta,
        dfile,
        files,
        NFTokenID,
    } = nft;

    const amount = normalizeAmount(nft.amount || '0');

    const imgUrl = getNftCoverUrl(nft); // `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;

    const isVideo = meta?.video ? true : false;

    const [loadingImg, setLoadingImg] = useState(true)

    const name = nft.meta?.name || meta?.Name || 'No Name';

    const onImageLoaded = () => {
        setLoadingImg(false)
    }

    return (
        <CardWrapper
            sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 1,
                width: '100%',
                // maxWidth: 200,
                // height: 250,
                // aspectRatio: '2 / 3'
            }}
        >
            <Box
                sx={{ 
                    padding: 0,
                    marginBottom: 0 
                }}
            >
                <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'} px={1}>
                    <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt:0, pl:0, pr:0}}>
                        <Stack direction="row" alignItems='center' justifyContent='flex-start' sx={{mt:0, pl:0, pr:0}}>
                            <Link href={`/nft/${NFTokenID}`} underline='none'>
                                <CardMedia
                                    component={
                                        loadingImg ? () =>
                                            <Skeleton
                                                variant='rectangular'
                                                // animation='wave'
                                                sx={{
                                                    width: 80,
                                                    height: 50
                                                }}
                                            /> :
                                            isVideo ? 'video' : 'img'}
                                    image={imgUrl}
                                    loading={loadingImg.toString()}
                                    alt={'NFT' + uuid}
                                    // controls={isVideo}
                                    // autoPlay={isVideo}
                                    // loop={isVideo}
                                    sx={{
                                        width: 80,
                                        height: 50,
                                        maxWidth: 280,
                                        maxHeight: 250,
                                        marginTop: 0,
                                        // borderTopLeftRadius: 20,
                                        // borderTopRightRadius: 20,
                                        // borderBottomLeftRadius: 0,
                                        // borderBottomRightRadius: 0,
                                        objectFit: 'cover'
                                    }}
                                />
                                <img src={imgUrl}
                                    style={{ display: 'none' }}
                                    onLoad={onImageLoaded} />
                                {
                                    isVideo &&
                                    <video src={imgUrl}
                                        style={{ display: 'none' }}
                                        onCanPlay={onImageLoaded}
                                    />
                                }
                            </Link>
                            <Link href={`/nft/${NFTokenID}`} underline='none'>
                                <Stack direction="column" sx={{mt:0, pl:2, pr:0}}>
                                    {amount.amount === 0 ?
                                        <Typography variant="s8">Claim NFT</Typography>
                                        :
                                        <>
                                        {amount.currency === "XRP" ?
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Icon icon={rippleSolid} width="14" height="14" />
                                                <Typography variant="s8">{fNumber(amount.amount)}</Typography>
                                            </Stack>
                                            :
                                            <Typography variant="s8">{fNumber(amount.amount)} {normalizeCurrencyCodeXummImpl(amount.currency)}</Typography>
                                        }
                                        </>
                                    }
                                    <Stack direction="row" alignItems='center' sx={{mt:0, pl:0, pr:0}}>
                                        <Tooltip title={`Transferred, Click Approve to accept`}>
                                            <SportsScoreIcon fontSize="small" />
                                        </Tooltip>
                                        {name.length > 20 ?
                                            <Box display='flex'>
                                                <Typography
                                                    variant="s8"
                                                    textOverflow='ellipsis'
                                                    overflow='hidden'
                                                    whiteSpace='nowrap'
                                                    sx={{mt:0.5, mb:0.5}}
                                                >
                                                    {name.slice(0, -5)}&nbsp;
                                                </Typography>
                                                <Typography
                                                    variant="s8"
                                                    sx={{mt:0.5, mb:0.5, width: 45}}
                                                >
                                                    {name.slice(-5)}
                                                </Typography>
                                            </Box>
                                            :
                                            <Typography
                                                variant="s8"
                                                sx={{mt:0.5, mb:0.5}}
                                            >
                                                {name}
                                            </Typography>
                                        }
                                    </Stack>
                                </Stack>
                            </Link>
                        </Stack>
                        <Link href={`/nft/${NFTokenID}`} underline='none'>
                            <Typography variant="s8">{NFTokenID}</Typography>
                        </Link>
                        <Typography variant="s8">Waiting to accept</Typography>
                        <Tooltip title="Accept NFT">
                            <Button variant="outlined" size="small" onClick={() => handleApprove(nft)}>Accept</Button>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>
            {/* <Divider sx={{mt:0.8, mb:0.3}}/>
            <Stack direction="row" justifyContent='space-between' sx={{mt:1, pl:1, pr:1}}>
                <FlagsContainer Flags={flag} />
                <FavoriteIcon />
            </Stack> */}

        </CardWrapper>
    );
};
