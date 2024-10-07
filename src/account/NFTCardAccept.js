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
    CardContent,
    useMediaQuery,
    alpha,
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

const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
    }
}));

export default function NFTCardAccept({ nft, handleApprove, profileAccount }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        collection,
        cslug
    } = nft;

    const sender = owner == profileAccount && destination ? destination : owner; //const sender = account == profileAccount ? destination : account;

    const amount = normalizeAmount(nft.amount || '0');

    const imgUrl = getNftCoverUrl(nft, 'small'); // `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;

    const isVideo = meta?.video ? true : false;

    const [loadingImg, setLoadingImg] = useState(true)

    const name = nft.meta?.name || meta?.Name || 'No Name';

    const onImageLoaded = () => {
        setLoadingImg(false)
    }

    const truncateString = (str, maxLength) => {
        if (str.length <= maxLength) {
            return str;
        } else {
            var truncated = str.substr(0, Math.floor(maxLength / 2)) + "..." + str.substr(-Math.floor(maxLength / 2));
            return truncated;
        }
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
                <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'} px={isMobile ? 2 : 1}>
                    {!isMobile && (
                        <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{my:1, pl:0, pr:0}}>
                            <Stack direction="row" alignItems='center' justifyContent='flex-start' sx={{mt:0, pl:0, pr:0}}>
                                <Link href={`/nft/${NFTokenID}`} underline='none'>
                                    <CardMedia
                                        component={
                                            loadingImg ? () =>
                                                <Skeleton
                                                    variant='rectangular'
                                                    // animation='wave'
                                                    sx={{
                                                        width: isMobile ? 60 : 80,
                                                        height: 60,
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
                                            width: isMobile ? 60 : 80,
                                            height: 60,
                                            maxWidth: 280,
                                            maxHeight: 250,
                                            marginTop: 0,
                                            borderRadius: 0.5,
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
                                    <Stack direction="column" sx={{mt:isMobile?2:0, pl:isMobile?1:2, pr:0}}>
                                        {amount.amount === 0 ?
                                            <Link href={`/collection/${cslug}`} underline='none'><Typography variant="s8">{collection || ''}</Typography></Link>
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
                                                    sx={{mt:0, mb:0.5}}
                                                >
                                                    {name}
                                                </Typography>
                                            }
                                        </Stack>
                                    </Stack>
                                </Link>
                            </Stack>
                            <Link href={`/account/${sender}`} underline='none'>
                                {!isMobile && <Typography variant="s8">{sender}</Typography>}
                            </Link>
                            <Typography variant="s8" style={{ textAlign: 'center' }}>Waiting to accept</Typography>
                            {accountLogin === profileAccount ? 
                            (<Tooltip title="Accept NFT">
                                <Button 
                                    variant="outlined" 
                                    color="success" 
                                    size="small" 
                                    onClick={() => handleApprove(nft)}
                                    sx={{
                                        borderColor: theme.palette.success.main,
                                        color: theme.palette.success.main,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                                        },
                                    }}
                                >
                                    Accept
                                </Button>
                            </Tooltip>):(
                                <Typography variant="s8" style={{ textAlign: 'center' }}></Typography>
                            )}
                        </Stack>
                    )}
                    {isMobile && (
                        <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'}>
                            <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt:1, pl:0, pr:0}}>
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
                                                            height: 60,
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
                                                height: 60,
                                                maxWidth: 280,
                                                maxHeight: 250,
                                                marginTop: 0,
                                                borderRadius: 0.5,
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
                                                <Link href={`/collection/${cslug}`} underline='none'><Typography variant="s8">{collection || ''}</Typography></Link>
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
                                                        sx={{mt:0, mb:0.5}}
                                                    >
                                                        {name}
                                                    </Typography>
                                                }
                                            </Stack>
                                        </Stack>
                                    </Link>
                                </Stack>
                                <Link href={`/account/${sender}`} underline='none'>
                                    {!isMobile && <Typography variant="s8">{sender}</Typography>}
                                </Link>
                            </Stack>
                            <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mb:1, pl:0, pr:0}}>
                                <Typography variant="s8" alignItems='center' justifyContent='space-evenly' sx={{mt:1}}>Waiting to accept</Typography>
                                {accountLogin === profileAccount && 
                                    <Tooltip title="Accept NFT">
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            color="success" 
                                            onClick={() => handleApprove(nft)}
                                            sx={{
                                                borderColor: theme.palette.success.main,
                                                color: theme.palette.success.main,
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                },
                                            }}
                                        >
                                            Accept
                                        </Button>
                                    </Tooltip>
                                }
                            </Stack>
                        </Box>
                    )}
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