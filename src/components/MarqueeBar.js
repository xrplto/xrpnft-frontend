import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Link, Tooltip } from '@mui/material';
import axios from 'axios';
import { keyframes } from '@emotion/react'; // Import keyframes

// Define the keyframes outside of the component
const marqueeAnimation = keyframes`
    0% { transform: translateX(0%) }
    100% { transform: translateX(-100%) }
`;

const MarqueeContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    padding: theme.spacing(0.4, 0),
    position: 'relative',
    zIndex: 1000,
    backgroundColor: theme.palette.mode === 'dark' 
        ? '#0A1628' 
        : '#F7FAFC',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#1E3A5F' : '#E1E8ED'}`,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(90deg, #0A1628 0%, #0F2744 100%)'
        : 'linear-gradient(90deg, #F7FAFC 0%, #EDF2F7 100%)'
}));

const MarqueeContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'animationDuration' && prop !== 'isPaused'
})(({ theme, animationDuration, isPaused }) => ({
    display: 'inline-flex',
    animation: `${marqueeAnimation} ${animationDuration}s linear infinite`,
    animationPlayState: isPaused ? 'paused' : 'running',
    willChange: 'transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '&:hover': {
        animationPlayState: 'paused'
    }
}));

const MarqueeItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: theme.spacing(0.4, 1.5),
    margin: theme.spacing(0, 0.5),
    borderRadius: theme.spacing(1),
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-1px)',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(59, 130, 246, 0.1)'
            : 'rgba(59, 130, 246, 0.05)'
    }
}));

const NFTImage = styled('img')(({ theme }) => ({
    width: '24px',
    height: '24px',
    marginRight: '8px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: `1px solid ${theme.palette.mode === 'dark' ? '#1E3A5F' : '#E1E8ED'}`,
    willChange: 'transform',
    contain: 'layout style paint'
}));

const Divider = styled('div')(({ theme }) => ({
    width: '1px',
    height: '20px',
    backgroundColor: theme.palette.mode === 'dark' ? '#1E3A5F' : '#E1E8ED',
    margin: theme.spacing(0, 1),
    flexShrink: 0,
    alignSelf: 'center',
    opacity: 0.5
}));

const NFTLink = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
});

const MarqueeBar = ({ isVisible = true }) => {
    const [nfts, setNfts] = useState([]);
    const [animationDuration, setAnimationDuration] = useState(50); // Default duration
    const [isInView, setIsInView] = useState(true); // Start as true
    const [isPaused, setIsPaused] = useState(false);
    const [imageErrors, setImageErrors] = useState(new Set());
    const marqueeContainerRef = useRef(null);
    const marqueeContentRef = useRef(null);
    const observerRef = useRef(null);
    const BASE_URL = 'https://api.xrpnft.com/api';
    const theme = useTheme();

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!isVisible) {
            setIsInView(false);
            return;
        }
        
        // Set initial view state to true
        setIsInView(true);
        
        if (!marqueeContainerRef.current) return;
        
        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
                if (!entry.isIntersecting) {
                    setIsPaused(true);
                } else {
                    setIsPaused(false);
                }
            },
            { threshold: 0.01, rootMargin: '100px' }
        );
        
        observerRef.current.observe(marqueeContainerRef.current);
        
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isVisible]);

    const fetchRecentNFTs = useCallback(async () => {
        if (!isInView) return;
        
        try {
            const body = {
                page: 0,
                limit: 24,
                flag: 0,
                search: '',
                filter: 0,
                subFilter: 'pricexrpasc',
                filterAttrs: []
            };

            const response = await axios.post(`${BASE_URL}/nfts`, body);

            let newNfts = response.data.nfts.map((nft) => ({
                ...nft,
                cost:
                    nft.cost && Number(nft.cost.amount) > 0
                        ? nft.cost
                        : null,
                name: nft.meta?.name || nft.name || `NFT #${nft.sequence}`,
                image: nft.files?.[0]?.thumbnail?.small || ''
            }));

            // Sort NFTs, putting those with prices first
            newNfts.sort((a, b) => {
                if (a.cost && b.cost) {
                    return Number(a.cost.amount) - Number(b.cost.amount);
                }
                if (a.cost) return -1;
                if (b.cost) return 1;
                return 0;
            });

            setNfts(prevNfts => {
                if (JSON.stringify(newNfts) !== JSON.stringify(prevNfts)) {
                    return newNfts;
                }
                return prevNfts;
            });
        } catch (error) {
            console.error('Error fetching recent NFTs:', error);
        }
    }, [isInView, BASE_URL]);

    useEffect(() => {
        if (!isInView) return;
        
        fetchRecentNFTs();
        const interval = setInterval(fetchRecentNFTs, 90000); // Refresh every 1.5 minutes
        return () => clearInterval(interval);
    }, [isInView, fetchRecentNFTs]);

    const calculateAnimationDuration = useCallback(() => {
        if (marqueeContainerRef.current && marqueeContentRef.current) {
            const contentWidth = marqueeContentRef.current.offsetWidth / 2;
            const speed = 35;
            const duration = contentWidth / speed;
            setAnimationDuration(duration);
        }
    }, []);

    useEffect(() => {
        if (!isInView || nfts.length === 0) return;
        
        const timeoutId = setTimeout(calculateAnimationDuration, 100);
        
        const handleResize = () => {
            requestAnimationFrame(calculateAnimationDuration);
        };
        
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [nfts, isInView, calculateAnimationDuration]);

    const getEventText = useCallback((updateEvent) => {
        switch (updateEvent) {
            case 'SALE':
                return 'Buy';
            case 'MINT':
                return 'MINT';
            case 'TRANSFER':
                return 'Transfer';
            default:
                return updateEvent;
        }
    }, []);

    const truncateName = useCallback((name, maxLength = 20) => {
        if (!name || typeof name !== 'string') return '';
        if (name.length <= maxLength) return name;
        return name.slice(0, maxLength - 3) + '...';
    }, []);

    const NameDisplay = useMemo(() => ({ name, maxLength }) => {
        if (!name || typeof name !== 'string') {
            return <span></span>;
        }
        const truncatedName = truncateName(name, maxLength);
        return (
            <Tooltip title={name} arrow placement="top" enterDelay={500}>
                <span>{truncatedName}</span>
            </Tooltip>
        );
    }, [truncateName]);

    const handleImageError = useCallback((nftId) => {
        setImageErrors(prev => new Set(prev).add(nftId));
    }, []);

    if (!isVisible) {
        return null;
    }

    // Duplicate the content twice to ensure seamless scrolling
    const duplicatedNfts = useMemo(() => [...nfts, ...nfts], [nfts]);

    return (
        <MarqueeContainer ref={marqueeContainerRef}>
            <MarqueeContent
                ref={marqueeContentRef}
                animationDuration={animationDuration}
                isPaused={isPaused}
            >
                {duplicatedNfts.map((nft, index) => (
                    <React.Fragment key={`${nft.NFTokenID}-${index}`}>
                        <NFTLink
                            href={`/nft/${nft.NFTokenID}`}
                            underline="none"
                            color="inherit"
                        >
                            <MarqueeItem>
                                {nft.image && !imageErrors.has(nft.NFTokenID) && (
                                    <NFTImage
                                        src={`https://s2.xrpnft.com/d1/${nft.image}`}
                                        alt={nft.name}
                                        loading="lazy"
                                        decoding="async"
                                        onError={() => handleImageError(nft.NFTokenID)}
                                        width="32"
                                        height="32"
                                    />
                                )}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ 
                                            fontWeight: 600,
                                            fontSize: '0.8rem',
                                            letterSpacing: '-0.01em',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        <NameDisplay
                                            name={nft.name}
                                            maxLength={18}
                                        />
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.6,
                                            fontSize: '0.65rem',
                                            marginTop: '1px'
                                        }}
                                    >
                                        {nft.collection && typeof nft.collection === 'string' && (
                                            <NameDisplay
                                                name={nft.collection}
                                                maxLength={12}
                                            />
                                        )}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        marginLeft: 1.5,
                                        fontWeight: 600,
                                        color: '#3B82F6',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        fontSize: '0.6rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                    }}
                                >
                                    {getEventText(nft.updateEvent)}
                                </Typography>
                                {nft.cost && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            marginLeft: 1,
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            color: '#10B981'
                                        }}
                                    >
                                        {`${Number(nft.cost.amount).toFixed(
                                            2
                                        )} XRP`}
                                    </Typography>
                                )}
                            </MarqueeItem>
                        </NFTLink>
                        {index < duplicatedNfts.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </MarqueeContent>
        </MarqueeContainer>
    );
};

export default MarqueeBar;
