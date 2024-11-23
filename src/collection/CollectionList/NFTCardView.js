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
        <Grid container spacing={3}>
            {collections.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.uuid}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'translateY(-5px)',
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
                            />
                        </Link>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1 }}>
                                    {item.name}
                                </Typography>
                                {item.verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerifiedIcon
                                            fontSize={isMobile ? 'small' : 'medium'}
                                            style={{ color: theme.palette.primary.main }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Floor: {formatPrice(item.floor?.amount || 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Volume: {formatPrice(volumeType === '24h' ? item.totalVol24h : item.totalVolume, true)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Items: {fIntNumber(item.items)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default NFTCardView;
