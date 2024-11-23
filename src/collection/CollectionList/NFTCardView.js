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
    useMediaQuery
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { fNumber, fIntNumber } from 'src/utils/formatNumber';

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
                <Grid item xs={12} sm={6} md={3} lg={12/7} key={item.uuid}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease-in-out',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            boxShadow: theme.shadows[2],
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: theme.shadows[8],
                            },
                        }}
                    >
                        <Link
                            href={isMine ? `/collection/${item.slug}/edit` : `/collection/${item.slug}`}
                            underline="none"
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
                        </Link>
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    noWrap 
                                    sx={{ 
                                        flexGrow: 1,
                                        fontWeight: 600,
                                        fontSize: isMobile ? '1rem' : '1.125rem'
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                {item.verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerifiedIcon
                                            fontSize={isMobile ? 'small' : 'medium'}
                                            sx={{ 
                                                color: theme.palette.primary.main,
                                                ml: 1
                                            }}
                                        />
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
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default NFTCardView;
