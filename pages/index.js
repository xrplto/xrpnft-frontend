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
    ButtonGroup
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <svg width={width} height={height}>
                <polyline points={points} fill="none" stroke={trendColor} strokeWidth="2" strokeLinecap="round" />
                {dataPoints.map((value, index) => {
                    const x = (index / (dataPoints.length - 1)) * width;
                    const y = height - ((value - minValue) / range) * height;
                    return <circle key={index} cx={x} cy={y} r="2" fill={trendColor} opacity={index === dataPoints.length - 1 ? 1 : 0.6} />;
                })}
            </svg>
            <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600, fontSize: '0.7rem' }}>
                {formatXRP(currentFloor)}
            </Typography>
        </Box>
    );
};

export default function Overview({ collections = [] }) {
    const { darkMode } = useContext(AppContext);
    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [displayLimit, setDisplayLimit] = useState(10);

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

            <BackgroundWrapper
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    opacity: darkMode ? 0.2 : 0.3
                }}
            />

            <Header />

            <Container maxWidth="xl"> 
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                    <Box sx={{ mb: { xs: 4, md: 6 } }}>
                        <Typography
                            variant="h2"
                            fontWeight={700}
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em',
                                mb: 2
                            }}
                        >
                            XRP NFT Marketplace
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                fontWeight: 400,
                                mb: 3
                            }}
                        >
                            Trade XRP NFTs <AnimatedText>{animatedText}</AnimatedText>
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
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
                    </Box>

                    {collections.length > 0 && (
                        <Box sx={{ mt: { xs: 4, md: 6 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" fontWeight={600}>
                                    Top Collections
                                </Typography>
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
                                        {!isMobile && <TableCell align="center">Floor</TableCell>}
                                        {!isMobile && <TableCell align="right">Top Offer</TableCell>}
                                        {!isMobile && <TableCell align="right">Change</TableCell>}
                                        <TableCell align="right">24h Volume</TableCell>
                                        {!isMobile && <TableCell align="right">Sales</TableCell>}
                                        {!isMobile && <TableCell align="right">Listed</TableCell>}
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
                                                        <Typography variant="subtitle2" fontWeight={600}>
                                                            {collection.name}
                                                            {collection.verified === 'yes' && (
                                                                <Typography component="span" sx={{ color: 'primary.main', ml: 0.5, fontSize: '1rem' }}>
                                                                    ✓
                                                                </Typography>
                                                            )}
                                                        </Typography>
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
                                                <TableCell align="center">
                                                    <Sparkline collection={collection} theme={theme} />
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

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getStaticProps() {
    let collections = [];
    
    try {
        const response = await fetch('https://api.xrpnft.com/api/collections?limit=100&orderBy=totalVol24h&order=desc&compact=true');
        
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
            console.log('Successfully fetched', collections.length, 'collections');
        } else {
            console.error('API did not return success or collections missing', data);
        }
    } catch (error) {
        console.error('Error fetching collections:', error.message);
    }

    return {
        props: {
            collections
        },
        revalidate: 300 // Revalidate every 5 minutes
    };
}