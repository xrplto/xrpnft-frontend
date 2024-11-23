import React from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Link,
    Box,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import styled from '@emotion/styled';

const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '& svg': {
        fontSize: 12,
    },
}));

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
    position: 'relative',

    '&:hover': {
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px',
        zIndex: 2
    }
}));

const NFTCardView = ({ collections, isMine, currency, convertToUsd, volumeType }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formatPrice = (price, isVolume = false) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        const formattedValue = isVolume ? fIntNumber(value) : fNumber(value);
        return `${currency === 'USD' ? '$' : '✕'} ${formattedValue}`;
    };

    return (
        <Grid container spacing={2}>
            {collections.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} lg={12/7} key={item.uuid} 
                    sx={{
                        padding: { xs: '2px', sm: '5px', md: '10px' },
                        '&:hover': {
                            zIndex: 1
                        },
                        isolation: 'isolate',
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <CardWrapper>
                        <Link
                            href={isMine ? `/collection/${item.slug}/edit` : `/collection/${item.slug}`}
                            underline="none"
                            sx={{ display: 'block' }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={`https://s1.xrpnft.com/collection/${item.logoImage}`}
                                alt={item.name}
                                sx={{
                                    objectFit: 'cover',
                                }}
                                loading="lazy"
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Typography 
                                        variant="h6" 
                                        component="div" 
                                        noWrap 
                                        sx={{ 
                                            flexGrow: 1,
                                            fontWeight: 600,
                                            fontSize: isMobile ? '1rem' : '1.125rem',
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        {item.name}
                                    </Typography>
                                    {item.verified === 'yes' && (
                                        <Tooltip title="Verified">
                                            <VerificationBadge>
                                                <CheckIcon />
                                            </VerificationBadge>
                                        </Tooltip>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: theme.palette.text.secondary,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <span>Floor</span>
                                        <span style={{ fontWeight: 600 }}>{formatPrice(item.floor?.amount || 0)}</span>
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: theme.palette.text.secondary,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <span>Volume</span>
                                        <span style={{ fontWeight: 600 }}>
                                            {formatPrice(volumeType === '24h' ? item.totalVol24h : item.totalVolume, true)}
                                        </span>
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: theme.palette.text.secondary,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <span>Items</span>
                                        <span style={{ fontWeight: 600 }}>{fIntNumber(item.items)}</span>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Link>
                    </CardWrapper>
                </Grid>
            ))}
        </Grid>
    );
};

export default NFTCardView;
