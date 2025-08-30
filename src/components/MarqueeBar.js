import React, { useEffect, useState, useRef } from 'react';
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
    padding: theme.spacing(0.5, 0),
    position: 'relative',
    zIndex: 1000,
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.95)' 
        : 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
        : '0 2px 15px rgba(0, 0, 0, 0.08)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(to bottom, rgba(30, 30, 30, 0.95), rgba(18, 18, 18, 0.95))'
        : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(248, 248, 248, 0.98))'
}));

const MarqueeContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'animationDuration'
})(({ theme, animationDuration }) => ({
    display: 'inline-flex',
    animation: `${marqueeAnimation} ${animationDuration}s linear infinite`,
    animationPlayState: 'running',
    '&:hover': {
        animationPlayState: 'paused'
    }
}));

const MarqueeItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: theme.spacing(0.5, 2),
    margin: theme.spacing(0, 0.5),
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
}));

const NFTImage = styled('img')(({ theme }) => ({
    width: '28px',
    height: '28px',
    marginRight: '10px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: theme.palette.mode === 'dark'
        ? '2px solid rgba(255, 255, 255, 0.1)'
        : '2px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    }
}));

const Divider = styled('div')(({ theme }) => ({
    width: '1px',
    height: '24px',
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.08)',
    margin: theme.spacing(0, 1),
    flexShrink: 0,
    alignSelf: 'center',
    opacity: 0.6
}));

const NFTLink = styled(Link)({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
});

const MarqueeBar = ({ isVisible = true }) => {
    const [nfts, setNfts] = useState([]);
    const [animationDuration, setAnimationDuration] = useState(50); // Default duration
    const marqueeContainerRef = useRef(null);
    const marqueeContentRef = useRef(null);
    const BASE_URL = 'https://api.xrpnft.com/api';
    const theme = useTheme();

    useEffect(() => {
        const fetchRecentNFTs = async () => {
            try {
                const body = {
                    page: 0,
                    limit: 32,
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

                // Only update state if data has changed to prevent animation reset
                if (JSON.stringify(newNfts) !== JSON.stringify(nfts)) {
                    setNfts(newNfts);
                }
            } catch (error) {
                console.error('Error fetching recent NFTs:', error);
            }
        };

        fetchRecentNFTs();
        const interval = setInterval(fetchRecentNFTs, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [nfts]);

    useEffect(() => {
        // Calculate animation duration based on content width
        const calculateAnimationDuration = () => {
            if (marqueeContainerRef.current && marqueeContentRef.current) {
                const containerWidth = marqueeContainerRef.current.offsetWidth;
                const contentWidth = marqueeContentRef.current.offsetWidth / 2; // Since content is duplicated
                const totalWidth = contentWidth;

                // Desired speed in pixels per second
                const speed = 40; // Slower, smoother scrolling

                // Calculate duration
                const duration = totalWidth / speed;

                setAnimationDuration(duration);
            }
        };

        calculateAnimationDuration();

        // Recalculate on window resize
        window.addEventListener('resize', calculateAnimationDuration);
        return () => window.removeEventListener('resize', calculateAnimationDuration);
    }, [nfts]);

    const getEventText = (updateEvent) => {
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
    };

    const truncateName = (name, maxLength = 20) => {
        if (!name || typeof name !== 'string') return '';
        if (name.length <= maxLength) return name;
        return name.slice(0, maxLength - 3) + '...';
    };

    const NameDisplay = ({ name, maxLength }) => {
        if (!name || typeof name !== 'string') {
            return <span></span>;
        }
        const truncatedName = truncateName(name, maxLength);
        return (
            <Tooltip title={name} arrow placement="top">
                <span>{truncatedName}</span>
            </Tooltip>
        );
    };

    if (!isVisible) {
        return null;
    }

    // Duplicate the content twice to ensure seamless scrolling
    const duplicatedNfts = [...nfts, ...nfts];

    return (
        <MarqueeContainer ref={marqueeContainerRef}>
            <MarqueeContent
                ref={marqueeContentRef}
                animationDuration={animationDuration}
            >
                {duplicatedNfts.map((nft, index) => (
                    <React.Fragment key={`${nft.NFTokenID}-${index}`}>
                        <NFTLink
                            href={`/nft/${nft.NFTokenID}`}
                            underline="none"
                            color="inherit"
                        >
                            <MarqueeItem>
                                {nft.image && (
                                    <NFTImage
                                        src={`https://s2.xrpnft.com/d1/${nft.image}`}
                                        alt={nft.name}
                                    />
                                )}
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ 
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            letterSpacing: '-0.01em',
                                            lineHeight: 1.3
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
                                            opacity: 0.7,
                                            fontSize: '0.7rem',
                                            letterSpacing: '0.02em',
                                            marginTop: '2px'
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
                                        marginLeft: 2,
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        fontSize: '0.7rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(144, 202, 249, 0.12)'
                                            : 'rgba(33, 150, 243, 0.08)'
                                    }}
                                >
                                    {getEventText(nft.updateEvent)}
                                </Typography>
                                {nft.cost && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            marginLeft: 1.5,
                                            fontWeight: 700,
                                            color: theme.palette.success.main,
                                            fontSize: '0.8rem',
                                            letterSpacing: '-0.02em'
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
