import Head from 'next/head';
import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, 
    Container, 
    styled, 
    Toolbar,
    Button,
    Stack,
    Typography,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Link,
    useMediaQuery,
    alpha,
    ButtonGroup,
    Chip
} from '@mui/material';

// Context
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

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

const SimpleTable = styled(Table)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.6),
    borderRadius: 12,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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

// Helper function to format compact numbers
const formatCompact = (value) => {
    if (!value || value === 0) return '0';
    
    if (value < 1000) {
        return parseFloat(value).toFixed(0);
    }
    else if (value < 1000000) {
        return `${(value/1000).toFixed(1)}K`;
    }
    else {
        return `${(value/1000000).toFixed(1)}M`;
    }
};

// Sparkline Component for Floor Price History
const Sparkline = ({ collection, theme }) => {
    const currentFloor = collection.floor?.amount || 0;
    const floor24hAgo = collection.floor24hAgo?.amount || currentFloor;
    const floor7dAgo = collection.floor7dAgo?.amount || currentFloor;
    const floor30dAgo = collection.floor30dAgo?.amount || currentFloor;
    
    const dataPoints = [floor30dAgo, floor7dAgo, floor24hAgo, currentFloor];
    const minValue = Math.min(...dataPoints);
    const maxValue = Math.max(...dataPoints);
    const range = maxValue - minValue || 1;
    
    const width = 60;
    const height = 20;
    const points = dataPoints.map((value, index) => {
        const x = (index / (dataPoints.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
    }).join(' ');
    
    const trendColor = currentFloor > floor24hAgo ? theme.palette.success.main : 
                      currentFloor < floor24hAgo ? theme.palette.error.main : 
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

export default function Overview({ collections = [], gmetrics = null }) {
    const { darkMode } = useContext(AppContext);
    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [displayLimit, setDisplayLimit] = useState(10);
    const [chartPeriod, setChartPeriod] = useState('7d');
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [featuredIndex, setFeaturedIndex] = useState(0);

    // Use first collection's logo for background
    const backgroundImage = collections.length > 0 && collections[0]?.logoImage 
        ? `https://s1.xrpnft.com/collection/${collections[0].logoImage}`
        : null;

    // Debug: Log collections data
    console.log('Collections count:', collections.length);
    console.log('Display limit:', displayLimit);
    console.log('Collections data:', collections.slice(0, 3)); // Show first 3 for debugging
    console.log('Slice result:', collections.slice(0, displayLimit).length); // Check what slice returns

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setAnimatedText(phrases[currentIndex]);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    // Auto-rotate featured collections
    useEffect(() => {
        const rotationInterval = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 1) % 4); // 4 is the number of featured collections
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(rotationInterval);
    }, []);

    return (
        <OverviewWrapper>
            <Head>
                <title>XRPNFT - Your Premier XRP NFT Platform</title>
                <meta name="description" content="Discover, buy, and sell unique NFTs on the XRP Ledger. XRPNFT is your gateway to digital collectibles on XRP." />
                
                <meta property="og:title" content="XRPNFT - Your Premier XRP NFT Platform" />
                <meta property="og:description" content="Discover, buy, and sell unique NFTs on the XRP Ledger" />
                <meta property="og:image" content="https://xrpnft.com/logo/xrpnft-logo-black.svg" />
                <meta property="og:url" content="https://xrpnft.com" />
                
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="XRPNFT - Your Premier XRP NFT Platform" />
                <meta name="twitter:description" content="Discover, buy, and sell unique NFTs on the XRP Ledger" />
                <meta name="twitter:image" content="https://xrpnft.com/logo/xrpnft-logo-black.svg" />
                
                <meta name="keywords" content="XRP, NFT, XRPL, digital collectibles, blockchain, cryptocurrency" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://xrpnft.com" />
            </Head>

            <Toolbar id="back-to-top-anchor" />


            <Header />

            <Container maxWidth="xl"> 
                <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 } }}>
                    {/* Featured Collections and Chart Row */}
                    <Box sx={{ 
                        mb: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 4, md: 4 },
                        alignItems: 'flex-start'
                    }}>
                        {/* Featured Collections Section - Left Side */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                {(() => {
                                    const collections = [
                                        { name: 'Fuzzybears', slug: 'fuzzybears', image: '1754245929256_e702449529933a912d6e667d311d9d5a.webp' },
                                        { name: 'Fuzzy Bars', slug: 'fuzzy-bars', image: '1754245929492_d103e6a50c4e19e711d7c5a5c9fd2649.webp' },
                                        { name: 'SEAL', slug: 'seals', image: '1754246357046_2515466dd42ea300ce63dbfe80f10d40.webp' },
                                        { name: 'PIGEONS', slug: 'pigeons-2', image: 'thumbnail-1f6a41da02f65ed39a7c46b668e89bb1.webp' }
                                    ];
                                    
                                    const displayedCollections = [
                                        collections[featuredIndex],
                                        collections[(featuredIndex + 1) % collections.length],
                                        collections[(featuredIndex + 2) % collections.length]
                                    ];
                                    
                                    return (
                                        <Box sx={{ position: 'relative' }}>
                                            {/* Next Button Overlay */}
                                            <Box
                                                onClick={() => {
                                                    setFeaturedIndex((prev) => (prev + 1) % collections.length);
                                                }}
                                                sx={{ 
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: '-12px',
                                                    transform: 'translateY(-50%)',
                                                    zIndex: 10,
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: alpha(theme.palette.background.paper, 0.8),
                                                    backdropFilter: 'blur(8px)',
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        background: theme.palette.background.paper,
                                                        borderColor: alpha(theme.palette.primary.main, 0.3),
                                                        transform: 'translateY(-50%) translateX(2px)'
                                                    },
                                                    '&:active': {
                                                        transform: 'translateY(-50%) scale(0.95)'
                                                    }
                                                }}
                                            >
                                                <svg 
                                                    width="16" 
                                                    height="16" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none"
                                                    style={{ color: theme.palette.text.secondary }}
                                                >
                                                    <path 
                                                        d="M9 18l6-6-6-6" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Box>
                                            
                                            <Box sx={{ 
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 2
                                            }}>
                                            {displayedCollections.map((collection, index) => (
                                                <Box
                                                    key={`${collection.slug}-${featuredIndex}-${index}`}
                                                    component="a"
                                                    href={`/collection/${collection.slug}`}
                                                    sx={{
                                                        display: 'block',
                                                        textDecoration: 'none',
                                                        borderRadius: 1.5,
                                                        background: alpha(theme.palette.background.paper, 0.4),
                                                        backdropFilter: 'blur(8px)',
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                        overflow: 'hidden',
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        aspectRatio: '1',
                                                        backgroundImage: `url(https://s1.xrpnft.com/collection/${collection.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        position: 'relative'
                                                    }}>
                                                        {/* Featured Badge */}
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: '0 8px 0 8px',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                                            boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.3)}`
                                                        }}>
                                                            <span style={{ fontSize: '0.7rem' }}>⭐</span>
                                                            FEATURED
                                                        </Box>
                                                        
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            background: `linear-gradient(transparent, ${alpha(theme.palette.common.black, 0.7)})`,
                                                            p: 1.5
                                                        }}>
                                                            <Typography 
                                                                variant="subtitle2" 
                                                                color="white" 
                                                                fontWeight={600}
                                                                sx={{ 
                                                                    fontSize: '0.8rem',
                                                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                                                }}
                                                            >
                                                                {collection.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                            </Box>
                                        </Box>
                                    );
                                })()}
                        </Box>

                        {/* Market Chart - Right Side */}
                        {gmetrics && gmetrics.graphData30d && (
                            <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
                                    {(() => {
                                        const data = chartPeriod === '24h' 
                                            ? gmetrics.graphData30d.slice(-1)
                                            : chartPeriod === '7d' 
                                            ? gmetrics.graphData30d.slice(-7) 
                                            : gmetrics.graphData30d || [];
                                        const totalVol = data.reduce((sum, d) => sum + (d.volume || 0), 0);
                                        const totalSales = data.reduce((sum, d) => sum + (d.sales || 0), 0);
                                        const maxVol = Math.max(...data.map(d => d.volume || 0));
                                        const maxSales = Math.max(...data.map(d => d.sales || 0), 1);
                                        
                                        // Chart dimensions
                                        const chartWidth = 100; // percentage
                                        const chartHeight = 280;
                                        const barWidth = (chartWidth / data.length) * 0.6; // 60% of available space per bar
                                        
                                        return (
                                            <Box sx={{ 
                                                borderRadius: 2,
                                                background: alpha(theme.palette.background.paper, 0.6),
                                                backdropFilter: 'blur(10px)',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                overflow: 'visible',
                                                height: 'fit-content',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative'
                                            }}>
                                                {/* Chart Header */}
                                                <Box sx={{ p: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body1" fontWeight={600}>
                                                            Market Activity
                                                        </Typography>
                                                        <ButtonGroup size="small">
                                                            <Button
                                                                variant={chartPeriod === '24h' ? 'contained' : 'outlined'}
                                                                onClick={() => setChartPeriod('24h')}
                                                                sx={{ fontSize: '0.7rem', py: 0.25, px: 0.75 }}
                                                            >
                                                                24H
                                                            </Button>
                                                            <Button
                                                                variant={chartPeriod === '7d' ? 'contained' : 'outlined'}
                                                                onClick={() => setChartPeriod('7d')}
                                                                sx={{ fontSize: '0.7rem', py: 0.25, px: 0.75 }}
                                                            >
                                                                7D
                                                            </Button>
                                                            <Button
                                                                variant={chartPeriod === '30d' ? 'contained' : 'outlined'}
                                                                onClick={() => setChartPeriod('30d')}
                                                                sx={{ fontSize: '0.7rem', py: 0.25, px: 0.75 }}
                                                            >
                                                                30D
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                                Volume
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="success.main">
                                                                {formatCompact(totalVol)} XRP
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                                Sales
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                                {formatCompact(totalSales)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                
                                                {/* Chart Area */}
                                                <Box sx={{ 
                                                    position: 'relative',
                                                    p: 2,
                                                    height: 195,
                                                    display: 'flex',
                                                    gap: 1,
                                                    overflow: 'visible'
                                                }}>
                                                    {/* Y-axis labels */}
                                                    {data.length > 0 && (
                                                        <Box sx={{ 
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                            width: '40px',
                                                            py: 0.5
                                                        }}>
                                                            {[100, 75, 50, 25, 0].map((percent) => (
                                                                <Typography 
                                                                    key={percent}
                                                                    variant="caption" 
                                                                    sx={{ 
                                                                        fontSize: '0.6rem',
                                                                        color: 'text.secondary',
                                                                        textAlign: 'right',
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    {percent === 100 ? formatCompact(maxVol) : 
                                                                     percent === 0 ? '0' : 
                                                                     formatCompact(maxVol * (percent / 100))}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    )}
                                                    
                                                    {data.length > 0 ? (
                                                        <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
                                                            <Box sx={{ 
                                                                position: 'absolute',
                                                                inset: 0,
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                gap: 1,
                                                                px: 1
                                                            }}>
                                                                {data.map((point, index) => {
                                                                    const barHeight = maxVol > 0 ? (point.volume / maxVol) * 100 : 0;
                                                                    const salesHeight = maxSales > 0 ? (point.sales / maxSales) * 100 : 0;
                                                                    
                                                                    // Debug
                                                                    if (index === 0) {
                                                                        console.log('Chart data:', { 
                                                                            point, 
                                                                            barHeight, 
                                                                            salesHeight, 
                                                                            maxVol, 
                                                                            maxSales,
                                                                            dataLength: data.length 
                                                                        });
                                                                    }
                                                                    
                                                                    return (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                flex: 1,
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'flex-end',
                                                                                position: 'relative',
                                                                                height: '100%',
                                                                                cursor: 'pointer',
                                                                                '&:hover .volume-bar': {
                                                                                    opacity: 1
                                                                                },
                                                                                '&:hover .data-point': {
                                                                                    transform: 'scale(1.5)'
                                                                                }
                                                                            }}
                                                                            onMouseEnter={() => setHoveredPoint({ index, volume: point.volume, sales: point.sales })}
                                                                            onMouseLeave={() => setHoveredPoint(null)}
                                                                        >
                                                                            {/* Volume Bar */}
                                                                            <Box
                                                                                className="volume-bar"
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    bottom: 0,
                                                                                    width: '80%',
                                                                                    height: barHeight > 0 ? `${barHeight}%` : '2px',
                                                                                    minHeight: barHeight > 0 ? '5px' : '2px',
                                                                                    background: barHeight > 0 
                                                                                        ? `linear-gradient(to top, ${alpha(theme.palette.success.main, 0.3)}, ${theme.palette.success.main})`
                                                                                        : theme.palette.divider,
                                                                                    borderRadius: '4px 4px 0 0',
                                                                                    opacity: hoveredPoint?.index === index ? 1 : 0.8,
                                                                                    transition: 'all 0.3s ease'
                                                                                }}
                                                                            />
                                                                            
                                                                            {/* Sales Point */}
                                                                            <Box
                                                                                className="data-point"
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    bottom: salesHeight > 0 ? `${salesHeight}%` : '5px',
                                                                                    width: 10,
                                                                                    height: 10,
                                                                                    borderRadius: '50%',
                                                                                    background: theme.palette.primary.main,
                                                                                    border: `2px solid ${theme.palette.background.paper}`,
                                                                                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                                                    transition: 'all 0.3s ease',
                                                                                    zIndex: 3
                                                                                }}
                                                                            />
                                                                            
                                                                            {/* Hover Info */}
                                                                            {hoveredPoint?.index === index && (
                                                                                <Box sx={{
                                                                                    position: 'absolute',
                                                                                    bottom: `${Math.min(Math.max(barHeight, salesHeight) + 5, 75)}%`,
                                                                                    background: theme.palette.background.paper,
                                                                                    p: 1,
                                                                                    borderRadius: 1,
                                                                                    boxShadow: 2,
                                                                                    zIndex: 1200,
                                                                                    minWidth: '120px'
                                                                                }}>
                                                                                    <Typography variant="caption" fontWeight={700} color="text.primary">
                                                                                        {point.date || `Day ${index + 1}`}
                                                                                    </Typography>
                                                                                    <Box sx={{ mt: 0.5 }}>
                                                                                        <Typography variant="caption" color="success.main" fontWeight={600}>
                                                                                            Vol: {formatXRP(point.volume)} XRP
                                                                                        </Typography>
                                                                                        {point.volumeByPlatform && Object.keys(point.volumeByPlatform).length > 0 && (
                                                                                            <Box sx={{ ml: 1, mt: 0.25 }}>
                                                                                                {Object.entries(point.volumeByPlatform)
                                                                                                    .sort(([,a], [,b]) => b - a)
                                                                                                    .slice(0, 3)
                                                                                                    .map(([platform, vol]) => (
                                                                                                        <Typography key={platform} variant="caption" sx={{ display: 'block', fontSize: '0.6rem', color: 'text.secondary' }}>
                                                                                                            {platform}: {formatCompact(vol)}
                                                                                                        </Typography>
                                                                                                    ))
                                                                                                }
                                                                                            </Box>
                                                                                        )}
                                                                                    </Box>
                                                                                    <Box sx={{ mt: 0.5 }}>
                                                                                        <Typography variant="caption" color="primary.main" fontWeight={600}>
                                                                                            Sales: {point.sales}
                                                                                        </Typography>
                                                                                        {point.salesByPlatform && Object.keys(point.salesByPlatform).length > 0 && (
                                                                                            <Box sx={{ ml: 1, mt: 0.25 }}>
                                                                                                {Object.entries(point.salesByPlatform)
                                                                                                    .sort(([,a], [,b]) => b - a)
                                                                                                    .slice(0, 3)
                                                                                                    .map(([platform, sales]) => (
                                                                                                        <Typography key={platform} variant="caption" sx={{ display: 'block', fontSize: '0.6rem', color: 'text.secondary' }}>
                                                                                                            {platform}: {sales}
                                                                                                        </Typography>
                                                                                                    ))
                                                                                                }
                                                                                            </Box>
                                                                                        )}
                                                                                    </Box>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                            
                                                            {/* Grid lines and Sales Line */}
                                                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                                                                {/* Horizontal grid lines */}
                                                                {[0, 25, 50, 75, 100].map((y) => (
                                                                    <line
                                                                        key={y}
                                                                        x1="0"
                                                                        y1={y}
                                                                        x2="100"
                                                                        y2={y}
                                                                        stroke={theme.palette.divider}
                                                                        strokeWidth="0.5"
                                                                        opacity="0.3"
                                                                        strokeDasharray="2 2"
                                                                    />
                                                                ))}
                                                                
                                                                {/* Sales line */}
                                                                <polyline
                                                                    points={data.map((point, index) => {
                                                                        const x = (index + 0.5) * (100 / data.length);
                                                                        const y = 100 - (maxSales > 0 ? (point.sales / maxSales) * 100 : 0);
                                                                        return `${x},${y}`;
                                                                    }).join(' ')}
                                                                    fill="none"
                                                                    stroke={theme.palette.primary.main}
                                                                    strokeWidth="2"
                                                                    opacity="0.8"
                                                                />
                                                            </svg>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            height: '100%'
                                                        }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                No chart data available
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                                
                                                {/* Chart Legend */}
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'center', 
                                                    gap: 2, 
                                                    py: 1,
                                                    px: 2,
                                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ 
                                                            width: 12, 
                                                            height: 12, 
                                                            borderRadius: '2px',
                                                            background: theme.palette.success.main
                                                        }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Volume
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ 
                                                            width: 8, 
                                                            height: 8, 
                                                            borderRadius: '50%',
                                                            background: theme.palette.primary.main
                                                        }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Sales
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    })()}
                            </Box>
                        )}
                    </Box>
                    {collections.length > 0 && (
                        <Box sx={{ mt: { xs: 0.5, md: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                {gmetrics && (
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatCompact(gmetrics.total24hVolume || 0)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                24h Vol
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {gmetrics.activeCollections24h || 0}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                Active
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatCompact(gmetrics.totalCollections || 0)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                Total
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                <Link 
                                    href="/collections" 
                                    underline="hover" 
                                    sx={{ 
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&:hover': {
                                            color: 'primary.dark'
                                        }
                                    }}
                                >
                                    View All Collections →
                                </Link>
                            </Box>
                            
                            <SimpleTable>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Collection</TableCell>
                                        {!isMobile && <TableCell align="right">Floor</TableCell>}
                                        {!isMobile && <TableCell align="right">Top Offer</TableCell>}
                                        {!isMobile && <TableCell align="right">Change</TableCell>}
                                        <TableCell align="right">24h Volume</TableCell>
                                        {!isMobile && <TableCell align="right">Sales</TableCell>}
                                        {!isMobile && <TableCell align="right">Listed</TableCell>}
                                        {!isMobile && <TableCell align="center">Trend</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {collections.slice(0, displayLimit).map((collection, index) => (
                                        <TableRow 
                                            key={collection.uuid} 
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => window.location.href = `/collection/${collection.slug}`}
                                        >
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                        {index + 1}
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
                                                            <Typography variant="caption" color="text.secondary">
                                                                Floor: {collection.floor?.amount ? formatXRP(collection.floor.amount) : '-'} XRP • Vol: {formatXRP(collection.totalVol24h || 0)} XRP
                                                                {collection.sales24h > 0 && ` • Sales: ${collection.sales24h}`}
                                                                {collection.topOffer?.amount && ` • Top: ${formatXRP(collection.topOffer.amount)} XRP`}
                                                                {collection.floor1dPercent && (
                                                                    <Typography component="span" 
                                                                        color={collection.floor1dPercent > 0 ? 'success.main' : 'error.main'}
                                                                        sx={{ ml: 1, fontWeight: 600 }}
                                                                    >
                                                                        {collection.floor1dPercent > 0 ? '+' : ''}{collection.floor1dPercent.toFixed(1)}%
                                                                    </Typography>
                                                                )}
                                                            </Typography>
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
                                                    <Typography variant="body2" color="warning.main" fontWeight={600}>
                                                        {collection.sales24h || '0'}
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </SimpleTable>
                            
                            <Box sx={{ 
                                mt: 3, 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap'
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    Show:
                                </Typography>
                                <ButtonGroup variant="outlined" size="small">
                                    {[10, 25, 50, 100].map((limit) => (
                                        <Button
                                            key={limit}
                                            variant={displayLimit === limit ? 'contained' : 'outlined'}
                                            onClick={() => setDisplayLimit(limit)}
                                            sx={{ minWidth: '48px' }}
                                        >
                                            {limit}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                    Showing {Math.min(displayLimit, collections.length)} of {collections.length} collections
                                </Typography>
                                {collections.length === 1 && (
                                    <Typography variant="caption" color="warning.main" sx={{ ml: 2 }}>
                                        (Only 1 collection available from API - Check server logs)
                                    </Typography>
                                )}
                                {collections.length < displayLimit && collections.length > 1 && (
                                    <Typography variant="caption" color="info.main" sx={{ ml: 2 }}>
                                        (API returned fewer collections than requested)
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Container>
            </Container>

            <Container maxWidth="xl"> 
                <Container maxWidth="lg">
                    {/* P2P Marketplace Section */}
                    <Box sx={{ mt: { xs: 6, md: 8 } }}>
                        <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
                            P2P Marketplace
                        </Typography>
                        
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                            gap: 4,
                            mb: 4 
                        }}>
                            <Box sx={{ 
                                p: 4, 
                                borderRadius: 2, 
                                background: alpha(theme.palette.background.paper, 0.6),
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                                    No Broker Fees
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Trade directly peer-to-peer with zero intermediary fees. Unlike traditional marketplaces charging 1-2% commission, keep 100% of your profits through true P2P trading on the XRP Ledger.
                                </Typography>
                            </Box>

                            <Box sx={{ 
                                p: 4, 
                                borderRadius: 2, 
                                background: alpha(theme.palette.background.paper, 0.6),
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                                    Interoperability
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    List once, sell anywhere. Your NFTs and offers work seamlessly across all XRP marketplaces, accepting any XRPL token for maximum reach and liquidity.
                                </Typography>
                            </Box>

                            <Box sx={{ 
                                p: 4, 
                                borderRadius: 2, 
                                background: alpha(theme.palette.background.paper, 0.6),
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
                                    Secure Transactions
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Built on XRP Ledger's native NFT standard (XLS-20), every trade is cryptographically secured, instantly finalized on-chain with no custody risk and minimal fees.
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <HeroButton variant="contained" href="/collections" sx={{ mr: 2 }}>
                                Start Trading P2P
                            </HeroButton>
                            <HeroButton variant="outlined" href="/how-it-works">
                                Learn More
                            </HeroButton>
                        </Box>
                    </Box>
                </Container>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getStaticProps() {
    let collections = [];
    let gmetrics = null;
    
    try {
        const response = await fetch('https://api.xrpnft.com/api/collections?limit=100&orderBy=totalVol24h&order=desc&compact=true&gmetrics=true');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API Response:', {
            result: data.result,
            count: data.count,
            collectionsLength: data.collections?.length,
            took: data.took
        });
        
        if (data.result === 'success' && data.collections) {
            collections = data.collections;
            gmetrics = data.gmetrics;
            console.log('Successfully fetched', collections.length, 'collections');
            console.log('Global metrics:', gmetrics ? 'Available' : 'Not available');
        } else {
            console.error('API did not return success or collections missing', data);
        }
    } catch (error) {
        console.error('Error fetching collections:', error.message);
    }

    return {
        props: {
            collections,
            gmetrics
        },
        revalidate: 300 // Revalidate every 5 minutes
    };
}