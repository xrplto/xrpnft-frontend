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
        <Box sx={{ 
            p: 1.5,
            mb: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
        }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                {/* Left: NFT Image */}
                <Link href={`/nft/${NFTokenID}`} underline='none'>
                    <CardMedia
                        component={loadingImg ? 
                            () => <Skeleton variant='rectangular' sx={{width: 50, height: 50}}/> 
                            : isVideo ? 'video' : 'img'
                        }
                        image={imgUrl}
                        loading={loadingImg.toString()}
                        alt={'NFT' + uuid}
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 0.5,
                            objectFit: 'cover'
                        }}
                    />
                    <img src={imgUrl} style={{ display: 'none' }} onLoad={onImageLoaded} />
                    {isVideo && <video src={imgUrl} style={{ display: 'none' }} onCanPlay={onImageLoaded} />}
                </Link>

                {/* Middle: NFT Info & Addresses */}
                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                    {/* NFT Name & Price */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Tooltip title={`Transferred, Click Approve to accept`}>
                            <SportsScoreIcon sx={{ fontSize: 16 }} />
                        </Tooltip>
                        <Typography variant="s8" noWrap>
                            {name}
                        </Typography>
                        {amount.amount !== 0 && amount.currency === "XRP" && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Icon icon={rippleSolid} width="12" height="12" />
                                <Typography variant="s8">{fNumber(amount.amount)}</Typography>
                            </Stack>
                        )}
                    </Stack>

                    {/* Addresses */}
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: alpha(theme.palette.background.paper, 0.04),
                        borderRadius: 0.5,
                        py: 0.5,
                        px: 1,
                        minWidth: 0
                    }}>
                        <Typography variant="caption" sx={{ 
                            fontFamily: 'monospace',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                            fontSize: '0.7rem'
                        }}>
                            {nft.owner}
                        </Typography>
                        <Icon 
                            icon="material-symbols:arrow-right-alt-rounded" 
                            width={16} 
                            style={{ 
                                color: theme.palette.text.secondary,
                                margin: '0 4px'
                            }}
                        />
                        <Typography variant="caption" sx={{ 
                            fontFamily: 'monospace',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            flex: 1,
                            fontSize: '0.7rem'
                        }}>
                            {nft.destination}
                        </Typography>
                    </Box>
                </Stack>

                {/* Right: Status & Action */}
                <Stack alignItems="flex-end" spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                        Waiting
                    </Typography>
                    {accountLogin === profileAccount && (
                        <Button 
                            variant="outlined" 
                            color="success" 
                            size="small" 
                            onClick={() => handleApprove(nft)}
                            sx={{
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                borderColor: theme.palette.success.main,
                                color: theme.palette.success.main,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                },
                            }}
                        >
                            Accept
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
