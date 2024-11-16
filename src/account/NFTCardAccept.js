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
    Dialog,
    DialogContent,
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

export default function NFTCardAccept({ nft, handleApprove, profileAccount, disabled }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { meta, files, collection } = nft;
    const name = meta?.name || nft?.Name || 'No Name';
    const collectionName = collection || meta?.collection?.name || '';
    const imgUrl = getNftCoverUrl({ files }, 'small');
    const isVideo = false; // Update if you have video detection logic

    return (
        <Card elevation={3} sx={{ mb: 2 }}>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Link href={`/nft/${nft.NFTokenID}`} underline="none">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CardMedia
                                    component={isVideo ? 'video' : 'img'}
                                    image={imgUrl}
                                    alt={name}
                                    sx={{
                                        width: isMobile ? 48 : 64,
                                        height: isMobile ? 36 : 48,
                                        borderRadius: 1,
                                        cursor: 'pointer'
                                    }}
                                />
                                <Stack>
                                    {collectionName && (
                                        <Link
                                            href={`/collection/${nft.cslug}`}
                                            underline="none"
                                        >
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {collectionName}
                                            </Typography>
                                        </Link>
                                    )}
                                    <Typography
                                        variant={isMobile ? 'body2' : 'subtitle2'}
                                        noWrap
                                    >
                                        {name}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Link 
                            href={`https://bithomp.com/explorer/${nft.NFTokenID}`}
                            target="_blank"
                            underline="hover"
                            color="text.secondary"
                        >
                            <Typography variant="caption" display="block">
                                {truncate(nft.NFTokenID, isMobile ? 8 : 10)}
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="row" spacing={1} justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleApprove(nft)}
                                disabled={disabled}
                            >
                                Accept
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

// Helper function to truncate text
function truncate(str, n) {
    if (!str) return '';
    return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}
