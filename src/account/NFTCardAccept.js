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

const CardWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backdropFilter: 'blur(20px)',
  background: alpha(theme.palette.background.paper, 0.15),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
    background: alpha(theme.palette.background.paper, 0.2),
  }
}));

const AddressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.08),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 1.5),
  minWidth: 0,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
}));

export default function NFTCardAccept({ nft, handleApprove, profileAccount }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;

    // Enhanced console log with collection name
    console.log('NFTCardAccept - NFT Data:', {
        nft,
        profileAccount,
        accountLogin,
        owner: nft.owner,
        destination: nft.destination,
        collectionName: nft.meta?.collection?.name || 'No Collection'
    });

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

    // Simplified sender logic - we just need the owner since this is a transfer card
    const sender = owner;

    console.log('Transfer details:', {
        sender,
        isOwner: owner === profileAccount,
        isDestination: destination === profileAccount,
        canAccept: accountLogin === destination,
        collectionName: meta?.collection?.name || 'No Collection'
    });

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
        <CardWrapper>
            <Stack direction="row" alignItems="center" spacing={3}>
                {/* Left: NFT Image */}
                <Box
                    sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    <CardMedia
                        component={loadingImg ? 
                            () => <Skeleton variant='rectangular' sx={{width: '100%', height: '100%'}}/> 
                            : isVideo ? 'video' : 'img'
                        }
                        image={imgUrl}
                        loading={loadingImg.toString()}
                        alt={'NFT' + uuid}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <img src={imgUrl} style={{ display: 'none' }} onLoad={onImageLoaded} />
                    {isVideo && <video src={imgUrl} style={{ display: 'none' }} onCanPlay={onImageLoaded} />}
                </Box>

                {/* Middle: NFT Info & Addresses */}
                <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                    {/* NFT Name & Price */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack spacing={0.5}>
                            <Link href={`/nft/${NFTokenID}`} underline='none'>
                                <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 600,
                                    '&:hover': {
                                        color: 'primary.main'
                                    }
                                }}>
                                    {name}
                                </Typography>
                            </Link>
                            <Typography variant="body2" color="text.secondary">
                                {meta?.collection?.name || 'No Collection'}
                            </Typography>
                        </Stack>
                        {amount.amount !== 0 && amount.currency === "XRP" && (
                            <Chip
                                icon={<Icon icon={rippleSolid} width={16} height={16} />}
                                label={fNumber(amount.amount)}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    borderRadius: 1,
                                    '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        )}
                    </Stack>

                    {/* Addresses */}
                    <AddressBox>
                        <Typography variant="caption" sx={{ 
                            fontFamily: 'monospace',
                            flex: 1,
                            fontSize: '0.75rem'
                        }}>
                            {truncateString(nft.owner, 20)}
                        </Typography>
                        <Icon 
                            icon="material-symbols:arrow-right-alt-rounded" 
                            width={20} 
                            style={{ 
                                color: theme.palette.text.secondary,
                                margin: '0 8px'
                            }}
                        />
                        <Typography variant="caption" sx={{ 
                            fontFamily: 'monospace',
                            flex: 1,
                            fontSize: '0.75rem'
                        }}>
                            {truncateString(nft.destination, 20)}
                        </Typography>
                    </AddressBox>
                </Stack>

                {/* Right: Status & Action */}
                <Stack alignItems="flex-end" spacing={1.5}>
                    <Chip
                        label="Pending"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    />
                    {accountLogin === profileAccount && (
                        <Button 
                            variant="contained" 
                            color="success" 
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => handleApprove(nft)}
                            sx={{
                                px: 2,
                                py: 0.75,
                                borderRadius: 1,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Accept
                        </Button>
                    )}
                </Stack>
            </Stack>
        </CardWrapper>
    );
};
