import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Container,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    useTheme,
    useMediaQuery,
    alpha,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Link,
    Tooltip,
    styled,
    Stack,
    IconButton,
    Pagination,
    Toolbar,
    Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';
import Layout from 'src/components/Layout';
import ScrollToTop from 'src/components/ScrollToTop';
import { fNumber, fIntNumber } from 'src/utils/formatNumber';

// Styled Components
const OverviewWrapper = styled(Box)(({ theme }) => ({
    flex: 1
}));

const BackgroundWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: -1
}));

const SimpleTable = styled(Table)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.6),
    borderRadius: 12,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    minWidth: '2800px', // Wide enough for all columns
    '& .MuiTableCell-root': {
        border: 'none',
        padding: theme.spacing(2),
        fontSize: '0.875rem'
    },
    '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
            background: alpha(theme.palette.primary.main, 0.1),
            fontWeight: 600,
            color: theme.palette.primary.main,
            fontSize: '0.8125rem'
        },
        '& .MuiTableRow-root:first-of-type': {
            '& .MuiTableCell-root:first-of-type': {
                borderTopLeftRadius: 12
            },
            '& .MuiTableCell-root:last-of-type': {
                borderTopRightRadius: 12
            }
        }
    },
    '& .MuiTableBody-root': {
        '& .MuiTableRow-root:last-of-type': {
            '& .MuiTableCell-root:first-of-type': {
                borderBottomLeftRadius: 12
            },
            '& .MuiTableCell-root:last-of-type': {
                borderBottomRightRadius: 12
            }
        }
    },
    '& .MuiTableRow-root': {
        '&:hover': {
            background: alpha(theme.palette.action.hover, 0.05)
        }
    }
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
}));

const CollectionIcon = styled('img')(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
        width: 32,
        height: 32
    }
}));

const VerifiedBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginLeft: theme.spacing(0.5),
    fontSize: '10px',
    fontWeight: 600,
    boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: `0 3px 6px ${alpha(theme.palette.primary.main, 0.4)}`
    },
    '& svg': {
        width: 12,
        height: 12,
        fill: 'currentColor'
    }
}));

// Helper function to format XRP values
const formatXRP = (value) => {
    if (!value || value === 0) return '0';
    
    // For very small values, show more decimals
    if (value < 1) {
        return parseFloat(value).toFixed(4);
    }
    // For values 1-999, show 2 decimals
    else if (value < 1000) {
        return parseFloat(value).toFixed(2);
    }
    // For large values, round to whole numbers
    else {
        return Math.floor(value).toLocaleString();
    }
};

// Sparkline Component for Floor Price History
const Sparkline = ({ collection, theme }) => {
    // Extract floor price data points
    const currentFloor = collection.floor?.amount || 0;
    const floor24hAgo = collection.floor24hAgo?.amount || currentFloor;
    const floor7dAgo = collection.floor7dAgo?.amount || currentFloor;
    const floor30dAgo = collection.floor30dAgo?.amount || currentFloor;
    
    // Create data points array (30d ago -> 7d ago -> 24h ago -> current)
    const dataPoints = [floor30dAgo, floor7dAgo, floor24hAgo, currentFloor];
    
    // Calculate min/max for scaling
    const minValue = Math.min(...dataPoints);
    const maxValue = Math.max(...dataPoints);
    const range = maxValue - minValue || 1; // Avoid division by zero
    
    // Generate SVG path
    const width = 60;
    const height = 20;
    const points = dataPoints.map((value, index) => {
        const x = (index / (dataPoints.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
    }).join(' ');
    
    // Determine trend color
    const isUptrend = currentFloor > floor24hAgo;
    const isDowntrend = currentFloor < floor24hAgo;
    const trendColor = isUptrend ? theme.palette.success.main : 
                      isDowntrend ? theme.palette.error.main : 
                      theme.palette.text.secondary;
    
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={width} height={height}>
                <polyline points={points} fill="none" stroke={trendColor} strokeWidth="2" strokeLinecap="round" />
                {dataPoints.map((value, index) => {
                    const x = (index / (dataPoints.length - 1)) * width;
                    const y = height - ((value - minValue) / range) * height;
                    return <circle key={index} cx={x} cy={y} r="2" fill={trendColor} opacity={index === dataPoints.length - 1 ? 1 : 0.6} />;
                })}
            </svg>
        </Box>
    );
};

export default function CollectionsPage() {
    const { darkMode } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State management
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('totalVol24h');
    const [order, setOrder] = useState('desc');
    const [filter, setFilter] = useState('all');
    const [currency, setCurrency] = useState('XRP');
    const [volumeType, setVolumeType] = useState('24h');
    const [page, setPage] = useState(0); // API uses 0-based page indexing
    const [xrpToUsdRate, setXrpToUsdRate] = useState(null);
    const [total, setTotal] = useState(0);
    const rowsPerPage = 100; // Match the corrected query limit

    // Table header columns exactly like index.js
    const tableColumns = isMobile ? [
        { id: 'collection', label: 'Collection' },
        { id: 'volume', label: '24h Volume' }
    ] : [
        { id: 'collection', label: 'Collection' },
        { id: 'floor', label: 'Floor' },
        { id: 'topOffer', label: 'Top Offer' },
        { id: 'change', label: 'Change' },
        { id: 'volume', label: '24h Volume' },
        { id: 'sales', label: 'Sales' },
        { id: 'listed', label: 'Listed' }
    ];

    // Fetch exchange rate
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await axios.get('https://api.xrpl.to/api/tokens');
                if (response.data?.exch?.USD) {
                    setXrpToUsdRate(response.data.exch.USD);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            }
        };
        fetchExchangeRate();
    }, []);

    // Fetch collections
    useEffect(() => {
        console.log('fetchCollections useEffect triggered with:', {
            orderBy, order, page, filter, volumeType
        });
        
        const fetchCollections = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    limit: rowsPerPage.toString(),
                    orderBy: volumeType === '24h' ? 'totalVol24h' : 'totalVolume',
                    order: order,
                    compact: 'true',
                    page: page.toString()
                });

                if (filter === 'verified') {
                    params.append('verified', 'yes');
                }

                const apiUrl = `https://api.xrpnft.com/api/collections?${params.toString()}`;
                console.log('API URL:', apiUrl);
                
                const response = await axios.get(apiUrl);
                console.log('API Response:', response.data);
                
                if (response.data && response.data.result === 'success') {
                    console.log('First collection:', response.data.collections[0]);
                    setCollections(response.data.collections || []);
                    setTotal(response.data.count || 0);
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [orderBy, order, page, filter, volumeType]);

    // Filter collections based on search term
    const filteredCollections = collections.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Search term:', searchTerm);
    console.log('Total collections from API:', collections.length);
    console.log('Filtered collections:', filteredCollections.length);
    if (filteredCollections.length > 0) {
        console.log('First filtered collection:', filteredCollections[0].name);
    }

    // Convert XRP to USD
    const convertToUsd = (xrpValue) => {
        if (!xrpToUsdRate || !xrpValue) return null;
        return Number((xrpValue / xrpToUsdRate).toFixed(2));
    };

    // Format price display
    const formatPrice = (price, isVolume = false) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        const formattedValue = isVolume ? fIntNumber(value || 0) : fNumber(value || 0);
        return `${currency === 'USD' ? '$' : '✕'} ${formattedValue}`;
    };

    // Handle sort request
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0); // Reset to first page (0-based)
    };

    // Handle currency change
    const handleCurrencyChange = (event, newCurrency) => {
        if (newCurrency !== null) {
            setCurrency(newCurrency);
        }
    };

    // Handle filter change
    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
            setPage(0); // Reset to first page (0-based)
        }
    };

    // Handle volume type change
    const handleVolumeTypeChange = (event, newType) => {
        if (newType !== null) {
            setVolumeType(newType);
            setOrderBy(newType === '24h' ? 'totalVol24h' : 'totalVolume');
            setPage(0); // Reset to first page (0-based)
        }
    };

    // Handle page change
    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1); // Convert from 1-based UI to 0-based API
    };


    // Use first collection's logo for background
    const backgroundImage = collections.length > 0 && collections[0]?.logoImage 
        ? `https://s1.xrpnft.com/collection/${collections[0].logoImage}`
        : null;

    return (
        <>
            <Head>
                <title>Explore Collections - XRPNFT</title>
                <meta name="description" content="Discover the leading NFT collections on XRPNFT, ranked by volume, floor price, and other key metrics." />
            </Head>
            <BackgroundWrapper />
            <Layout>
                <Box sx={{ py: 0, background: 'transparent' }}>
                    <Box 
                        sx={{ 
                            width: '100vw',
                            marginLeft: 'calc(-50vw + 50%)',
                            borderBottom: theme => `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                            background: theme => `linear-gradient(90deg, 
                                ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                                ${alpha(theme.palette.background.paper, 0.5)} 50%,
                                ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
                            backdropFilter: 'blur(40px)',
                            mb: 4,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: theme => `linear-gradient(90deg, 
                                    transparent 0%, 
                                    ${alpha(theme.palette.primary.main, 0.2)} 10%,
                                    transparent 90%)`
                            }
                        }}
                    >
                        <Box sx={{ 
                            px: { xs: 2, sm: 3, md: 4 }, 
                            py: { xs: 2.5, sm: 3.5 },
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 2, sm: 3 }
                        }}>
                            <Box sx={{ 
                                width: 3,
                                height: 40,
                                background: theme => `linear-gradient(180deg, 
                                    ${theme.palette.primary.main} 0%, 
                                    ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                                borderRadius: 1
                            }} />
                            <Box>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 300,
                                        fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
                                        letterSpacing: '-0.03em',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        flexWrap: 'wrap',
                                        gap: { xs: 0.5, sm: 1 }
                                    }}
                                >
                                    <Box component="span" sx={{ 
                                        fontWeight: 800,
                                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Collections
                                    </Box>
                                    <Box component="span" sx={{ 
                                        fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                                        color: 'text.secondary',
                                        fontWeight: 300,
                                        letterSpacing: '-0.01em',
                                        opacity: 0.9
                                    }}>
                                        Top NFT collections by volume and metrics
                                    </Box>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ 
                        width: '100vw', 
                        marginLeft: 'calc(-50vw + 50%)', 
                        px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 },
                        boxSizing: 'border-box',
                        background: 'transparent'
                    }}>
                        <ControlsContainer>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: 2,
                            alignItems: isMobile ? 'stretch' : 'center',
                            justifyContent: 'space-between'
                        }}>
                            {/* Left Controls */}
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                {/* Filter Buttons */}
                                <ToggleButtonGroup
                                    value={filter}
                                    exclusive
                                    onChange={handleFilterChange}
                                    size="small"
                                >
                                    <ToggleButton value="all">All</ToggleButton>
                                    <ToggleButton value="verified">Verified</ToggleButton>
                                </ToggleButtonGroup>

                                {/* Search */}
                                <TextField
                                    size="small"
                                    placeholder="Search collections..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ minWidth: 200 }}
                                />

                                {/* Volume Type */}
                                <ToggleButtonGroup
                                    value={volumeType}
                                    exclusive
                                    onChange={handleVolumeTypeChange}
                                    size="small"
                                >
                                    <ToggleButton value="24h">24h</ToggleButton>
                                    <ToggleButton value="all">All</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {/* Right Controls */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                {/* Currency Toggle */}
                                <ToggleButtonGroup
                                    value={currency}
                                    exclusive
                                    onChange={handleCurrencyChange}
                                    size="small"
                                >
                                    <ToggleButton value="XRP">XRP</ToggleButton>
                                    <ToggleButton value="USD">USD</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    </ControlsContainer>

                    {/* Collections Table - Same as index.js */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : filteredCollections.length > 0 ? (
                        <Box sx={{ width: '100%', overflowX: 'auto', background: 'transparent' }}>
                            <SimpleTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Collection</TableCell>
                                    {!isMobile && <TableCell align="right">Floor</TableCell>}
                                    {!isMobile && <TableCell align="right">Top Offer</TableCell>}
                                    {!isMobile && <TableCell align="right">Change</TableCell>}
                                    <TableCell align="right">24h Volume</TableCell>
                                    {!isMobile && <TableCell align="right">Total Volume</TableCell>}
                                    {!isMobile && <TableCell align="right">Market Cap</TableCell>}
                                    {!isMobile && <TableCell align="right">Sales 24h</TableCell>}
                                    {!isMobile && <TableCell align="right">Total Sales</TableCell>}
                                    {!isMobile && <TableCell align="right">Listed</TableCell>}
                                    {!isMobile && <TableCell align="center">Trend</TableCell>}
                                    {!isMobile && <TableCell align="right">Owners</TableCell>}
                                    {!isMobile && <TableCell align="right">Items</TableCell>}
                                    {!isMobile && <TableCell align="right">Active</TableCell>}
                                    {!isMobile && <TableCell align="right">Burned</TableCell>}
                                    {!isMobile && <TableCell align="right">Type</TableCell>}
                                    {!isMobile && <TableCell align="right">Category</TableCell>}
                                    {!isMobile && <TableCell align="right">Rarity</TableCell>}
                                    {!isMobile && <TableCell align="right">Private</TableCell>}
                                    {!isMobile && <TableCell align="right">Verified</TableCell>}
                                    {!isMobile && <TableCell align="right">Created</TableCell>}
                                    {!isMobile && <TableCell align="right">Updated</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCollections.map((collection, index) => (
                                    <TableRow 
                                        key={collection.uuid} 
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => window.location.href = `/collection/${collection.slug}`}
                                    >
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                    {page * rowsPerPage + index + 1}
                                                </Typography>
                                                <CollectionIcon
                                                    src={`https://s1.xrpnft.com/collection/${collection.logoImage}`}
                                                    alt={`${collection.name} logo`}
                                                />
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="subtitle2" fontWeight={600}>
                                                            {collection.name}
                                                        </Typography>
                                                        {collection.verified === 'yes' && (
                                                            <VerifiedBadge title="Verified Collection">
                                                                <svg viewBox="0 0 24 24">
                                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                                </svg>
                                                            </VerifiedBadge>
                                                        )}
                                                    </Box>
                                                    {isMobile && (
                                                        <>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Floor: {collection.floor?.amount ? formatXRP(collection.floor.amount) : '-'} XRP • 
                                                                Top: {collection.topOffer?.amount ? formatXRP(collection.topOffer.amount) : '-'} XRP •
                                                                24h Vol: {formatXRP(collection.totalVol24h || 0)} XRP
                                                                {collection.floor1dPercent && (
                                                                    <Typography component="span" 
                                                                        color={collection.floor1dPercent > 0 ? 'success.main' : 'error.main'}
                                                                        sx={{ ml: 1, fontWeight: 600 }}
                                                                    >
                                                                        {collection.floor1dPercent > 0 ? '+' : ''}{collection.floor1dPercent.toFixed(1)}%
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                                Sales: {collection.sales24h || '0'} • Listed: {collection.listedCount || '0'} • 
                                                                Owners: {collection.owners?.toLocaleString() || '0'} • Items: {collection.items?.toLocaleString() || '0'}
                                                                {collection.burnedItems > 0 && ` • Burned: ${collection.burnedItems}`}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                                Type: {collection.type || '-'} • Category: {collection.category || '-'} • 
                                                                Market Cap: {collection.marketcap?.amount ? formatXRP(collection.marketcap.amount) : '-'} XRP
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600}>
                                                    {collection.floor?.amount ? `${formatXRP(collection.floor.amount)} XRP` : '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600} color="success.main">
                                                    {collection.topOffer?.amount ? `${formatXRP(collection.topOffer.amount)} XRP` : '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                {collection.floor1dPercent ? (
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight={600}
                                                        color={collection.floor1dPercent > 0 ? 'success.main' : 'error.main'}
                                                    >
                                                        {collection.floor1dPercent > 0 ? '+' : ''}{collection.floor1dPercent.toFixed(1)}%
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">-</Typography>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight={600} color="success.main">
                                                {collection.totalVol24h ? `${formatXRP(collection.totalVol24h)} XRP` : '0 XRP'}
                                            </Typography>
                                        </TableCell>
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600} color="info.main">
                                                    {collection.totalVolume ? `${formatXRP(collection.totalVolume)} XRP` : '0 XRP'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={600} color="secondary.main">
                                                    {collection.marketcap?.amount ? `${formatXRP(collection.marketcap.amount)} XRP` : '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="warning.main" fontWeight={600}>
                                                    {collection.sales24h || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="warning.dark" fontWeight={500}>
                                                    {collection.totalSales || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {(() => {
                                                        const items = collection.items || 0;
                                                        const listed = collection.listedCount || 0;
                                                        const itemsFormatted = items >= 1000 ? `${(items/1000).toFixed(1)}K` : items.toString();
                                                        const percentage = items > 0 ? ((listed / items) * 100).toFixed(1) : '0.0';
                                                        return `${itemsFormatted} (${percentage}%)`;
                                                    })()}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="center">
                                                <Sparkline collection={collection} theme={theme} />
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.owners?.toLocaleString() || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.items?.toLocaleString() || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.activeItems?.toLocaleString() || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="error.main">
                                                    {collection.burnedItems?.toLocaleString() || '0'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.type || '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.category || '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {collection.rarity || '-'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    color={collection.private === 'yes' ? 'error.main' : 'success.main'}
                                                    fontWeight={500}
                                                >
                                                    {collection.private === 'yes' ? 'Yes' : 'No'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography 
                                                    variant="body2" 
                                                    color={collection.verified === 'yes' ? 'success.main' : 'text.secondary'}
                                                    fontWeight={collection.verified === 'yes' ? 600 : 500}
                                                >
                                                    {collection.verified === 'yes' ? '✓ Yes' : 'No'}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(collection.created).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        {!isMobile && (
                                            <TableCell align="right">
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(collection.updated || collection.modified).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                            </SimpleTable>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No collections found
                            </Typography>
                        </Box>
                    )}

                    {/* Pagination */}
                    {!loading && total > rowsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={Math.ceil(total / rowsPerPage)}
                                page={page + 1}
                                onChange={handlePageChange}
                                size={isMobile ? 'small' : 'medium'}
                                color="primary"
                            />
                        </Box>
                    )}
                    </Box>
                </Box>  {/* Close full-width content area */}
                <ScrollToTop />
            </Layout>
        </>
    );
}

// Static Props for SEO
export async function getStaticProps() {
    return {
        props: {
            ogp: {
                canonical: 'https://xrpnft.com/collections',
                title: 'NFT Collections on XRP Ledger | XRPNFT',
                url: 'https://xrpnft.com/collections',
                imgUrl: 'https://xrpnft.com/static/ogp.png',
                desc: 'Explore and browse NFT collections on the XRP Ledger. Discover unique digital assets and collectibles on XRPNFT.'
            }
        }
    };
}