// React
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    Container,
    Box,
    Paper,
    Avatar,
    Fab,
    Tooltip,
    useTheme,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    useMediaQuery,
    ToggleButtonGroup,
    ToggleButton,
    alpha,
    IconButton
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

// Components
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import { ColorExtractor } from 'react-color-extractor';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

// Context
import { AppContext } from 'src/AppContext';

// Utils
import { getNftCoverUrl } from 'src/utils/parse';
import { formatDateTime, formatMonthYearDate } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fPercent, fVolume } from 'src/utils/formatNumber';

// Iconify
import { Icon } from '@iconify/react';
import arrowsExchange from '@iconify/icons-gg/arrows-exchange';

// Styled Components
const HeroButton = styled(Button)(({ theme }) => ({
    padding: '10px 20px',
    fontWeight: 500,
    fontSize: '0.9375rem',
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-1px)'
    }
}));

const AnimatedText = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 500
}));

const CustomImage = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
}));

const CustomCarousel = styled(Carousel)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    '& .slide': {
        background: 'transparent !important',
        boxShadow: 'none !important'
    }
}));

const FeaturedCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    background: theme.palette.background.paper,
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'scale(1.02)'
    }
}));


const VerificationBadge = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(0.5),
    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
    border: `1.5px solid ${alpha(theme.palette.common.white, 0.2)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '& svg': { fontSize: 12, fontWeight: 'bold' }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-root': {
        borderBottom: 'none',
        padding: theme.spacing(1, 1),
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: alpha(theme.palette.text.secondary, 0.6),
        backgroundColor: 'transparent'
    }
}));

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: 'sticky',
        zIndex: 100,
        top: 0,
        left: 24,
        backgroundColor: theme.palette.background.paper
    },
    body: {
        position: 'sticky',
        zIndex: 100,
        left: 24,
        backgroundColor: theme.palette.background.paper
    }
}))(TableCell);

const TransitionTypo = styled(Typography)(
    ({ theme }) => `
        transition: background-color 300ms linear, color 1s linear;
        color: ${theme.palette.text.primary};
    `
);


const CollectionIcon = styled('img')(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
        width: 32,
        height: 32
    }
}));

const AdminImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden',
    '&:hover': {
        cursor: 'pointer',
        opacity: 0.6
    }
}));

const TokenImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden'
}));

// Table Head Component
const TABLE_HEAD = (isMobile, volumeType, currency) => {
    if (isMobile) {
        return [
            {
                id: 'name',
                label: 'Collection',
                align: 'left',
                width: '60%',
                order: false
            },
            {
                id: 'floorAndVolume',
                label: 'Floor / Volume',
                align: 'right',
                width: '40%',
                order: false
            }
        ];
    }
    return [
        {
            id: 'name',
            label: 'Collection',
            align: 'left',
            width: '40%',
            order: false
        },
        {
            id: 'floor.amount',
            label: `Floor (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: volumeType === '24h' ? 'totalVol24h' : 'totalVolume',
            label: `${volumeType === '24h' ? '24h Vol' : 'Total Vol'} (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'owners',
            label: 'Owners',
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'items',
            label: 'Supply',
            align: 'right',
            width: '15%',
            order: true
        }
    ];
};

function ListHead({ order, orderBy, onRequestSort, volumeType, currency }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <StyledTableHead>
            <TableRow>
                {TABLE_HEAD(isMobile, volumeType, currency).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={headCell.order ? createSortHandler(headCell.id) : undefined}
                        >
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                fontWeight="600"
                                noWrap
                            >
                                {headCell.label}
                            </Typography>
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </StyledTableHead>
    );
}

ListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    onRequestSort: PropTypes.func.isRequired,
    volumeType: PropTypes.oneOf(['24h', 'all']).isRequired,
    currency: PropTypes.string.isRequired
};

// Row Component
function Row({ id, item, volumeType, currency, convertToUsd }) {
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
        floor,
        owners,
        totalVol24h
    } = item;

    const floorPrice = floor?.amount || 0;
    
    const formatFloorPrice = (price) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        return `${fNumber(value)} ${currency}`;
    };

    const formatVolume = (volume) => {
        const value = currency === 'USD' ? convertToUsd(volume) : volume;
        return `${fIntNumber(value)} ${currency}`;
    };

    const featuredImageUrl = `https://s1.xrpnft.com/collection/${featuredImage}`;
    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;

    const [colors, setColors] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const handleRowClick = () => {
        document.location = `/collection/${slug}`;
    };

    const displayVolume = volumeType === '24h' ? totalVol24h : totalVolume;

    return (
        <TableRow
            hover
            key={uuid}
            onClick={handleRowClick}
            sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.02),
                    transform: 'translateX(2px)'
                }
            }}
        >
            <TableCell align="left" sx={{ py: 1.5, px: { xs: 0.5, sm: 2 }, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ py: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        sx={{
                            color: theme.palette.text.secondary,
                            minWidth: isMobile ? '16px' : '24px',
                            fontWeight: 600
                        }}
                    >
                        {id}
                    </Typography>
                    <CollectionIcon
                        src={logoImageUrl}
                        alt={`${name} logo`}
                    />

                    <Link underline="none" href={`/collection/${slug}`}>
                        <Stack spacing={0.5}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography
                                    variant={isMobile ? 'body2' : 'subtitle2'}
                                    noWrap
                                    sx={{
                                        maxWidth: isMobile ? '120px' : '200px',
                                        textOverflow: 'ellipsis',
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {name}
                                </Typography>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified Collection" placement="top" arrow>
                                        <VerificationBadge>
                                            <CheckIcon />
                                        </VerificationBadge>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>

            {isMobile ? (
                <TableCell align="right" sx={{ py: 1.5, px: 0.5, border: 'none' }}>
                    <Stack spacing={0.5}>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            Floor: {formatFloorPrice(floorPrice)}
                        </Typography>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            Vol: {formatVolume(displayVolume)}
                        </Typography>
                    </Stack>
                </TableCell>
            ) : (
                <>
                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            {formatFloorPrice(floorPrice)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            {formatVolume(displayVolume)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                        >
                            {fIntNumber(owners || 0)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                        >
                            {fIntNumber(items)}
                        </Typography>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}

// CollectionList Component
function CollectionList({ collections }) {
    const [visibleRows, setVisibleRows] = useState(10);
    const [volumeType, setVolumeType] = useState('24h');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('totalVol24h');
    const [currency, setCurrency] = useState('XRP');
    const [xrpToUsdRate, setXrpToUsdRate] = useState(0.64);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchXRPRate = async () => {
            try {
                const response = await fetch('https://api.xrpl.to/api/tokens?start=0&limit=0&sortBy=vol24hxrp&sortType=desc&filter=');
                const data = await response.json();
                if (data.exch && data.exch.USD) {
                    setXrpToUsdRate(data.exch.USD);
                }
            } catch (error) {
                console.error('Error fetching XRP rate:', error);
                setXrpToUsdRate(0.64);
            }
        };

        fetchXRPRate();
        
        const intervalId = setInterval(fetchXRPRate, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleViewMore = () => {
        setVisibleRows(prev => Math.min(prev + 10, collections.length));
    };

    const handleVolumeTypeChange = (event, newVolumeType) => {
        if (newVolumeType !== null) {
            setVolumeType(newVolumeType);
            setOrderBy(newVolumeType === '24h' ? 'totalVol24h' : 'totalVolume');
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleCurrencyChange = (event, newCurrency) => {
        if (newCurrency !== null) {
            setCurrency(newCurrency);
        }
    };

    const convertToUsd = (xrpValue) => {
        return Math.floor(xrpValue / xrpToUsdRate);
    };

    const sortedCollections = React.useMemo(() => {
        const comparator = (a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        };

        return [...collections].sort((a, b) => {
            const orderValue = order === 'desc' ? 1 : -1;
            return orderValue * comparator(a, b);
        });
    }, [collections, order, orderBy]);

    return (
        <Box
            sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.2),
                backdropFilter: 'blur(6px)',
                borderRadius: theme.shape.borderRadius / 4,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.02)}`,
                boxShadow: 'none'
            }}
        >
            <Box sx={{ 
                p: 1.5, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.02)}`
            }}>
                <Stack direction="row" spacing={1}>
                    <ToggleButtonGroup
                        value={volumeType}
                        exclusive
                        onChange={handleVolumeTypeChange}
                        size="small"
                        sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 1.5, fontSize: '0.8125rem' } }}
                    >
                        <ToggleButton value="24h">24h</ToggleButton>
                        <ToggleButton value="all">All</ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        value={currency}
                        exclusive
                        onChange={handleCurrencyChange}
                        size="small"
                        sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 1.5, fontSize: '0.8125rem' } }}
                    >
                        <ToggleButton value="XRP">XRP</ToggleButton>
                        <ToggleButton value="USD">USD</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                <Link href="/collections" underline="hover" sx={{ fontSize: '0.875rem' }}>
                    View All →
                </Link>
            </Box>
            <Table
                size="small"
                sx={{
                    '& td, & th': {
                        py: 1,
                        px: { xs: 0.5, sm: 0.75, md: 1, lg: 2 }
                    }
                }}
            >
                <ListHead
                    volumeType={volumeType}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    currency={currency}
                />
                <TableBody>
                    {sortedCollections
                        .slice(0, visibleRows)
                        .map((collection, index) => (
                            <Row
                                key={collection.uuid}
                                id={index + 1}
                                item={collection}
                                volumeType={volumeType}
                                currency={currency}
                                convertToUsd={convertToUsd}
                            />
                        ))}
                </TableBody>
            </Table>
            {visibleRows < collections.length && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button
                        onClick={handleViewMore}
                        variant="text"
                        size="small"
                    >
                        Load More
                    </Button>
                </Box>
            )}
        </Box>
    );
}

// Main Landing Component
export default function Landing({ collections = [] }) {
    const theme = useTheme();
    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];
    const safeCollections = Array.isArray(collections) ? collections : [];

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setAnimatedText(phrases[currentIndex]);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);


    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
                        <Typography
                            variant="h2"
                            fontWeight={600}
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            XRP NFT Marketplace
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '1.125rem', md: '1.25rem' },
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            Trade XRP NFTs <AnimatedText>{animatedText}</AnimatedText>
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                            <HeroButton variant="contained" href="/collections">
                                Explore Collections
                            </HeroButton>
                            <HeroButton variant="outlined" href="/create">
                                Create NFT
                            </HeroButton>
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                            Works with: xrp.cafe • bidds • Art Dept • XPMarket • Opul
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    {safeCollections.length > 0 && (
                        <FeaturedCard>
                            <Link
                                href={`/collection/${safeCollections[0].slug}`}
                                sx={{ display: 'block', position: 'relative' }}
                            >
                                <Box sx={{ aspectRatio: '1', overflow: 'hidden' }}>
                                    <img
                                        src={`https://s1.xrpnft.com/collection/${safeCollections[0].logoImage}`}
                                        alt={safeCollections[0].name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: 2,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {safeCollections[0].name}
                                        {safeCollections[0].verified === 'yes' && (
                                            <VerificationBadge>
                                                <CheckIcon />
                                            </VerificationBadge>
                                        )}
                                    </Typography>
                                </Box>
                            </Link>
                        </FeaturedCard>
                    )}
                </Grid>
            </Grid>

            <Box sx={{ mt: { xs: 6, md: 10 } }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                    Top Collections
                </Typography>
                <CollectionList collections={safeCollections} />
            </Box>
        </Container>
    );
}