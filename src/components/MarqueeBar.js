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
    padding: theme.spacing(1, 0),
    position: 'relative',
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    borderBottom: `1px solid ${theme.palette.divider}`
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
    padding: theme.spacing(0, 2),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.shape.borderRadius
    }
}));

const NFTImage = styled('img')({
    width: '32px',
    height: '32px',
    marginRight: '12px',
    borderRadius: '6px',
    objectFit: 'cover',
    border: '1px solid #fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
});

const Divider = styled('div')(({ theme }) => ({
    width: '1px',
    height: '28px',
    backgroundColor: theme.palette.divider,
    margin: theme.spacing(0, 1),
    flexShrink: 0,
    alignSelf: 'center',
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
                const speed = 50; // Adjust this value to make the marquee slower or faster

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
        if (name.length <= maxLength) return name;
        return name.slice(0, maxLength - 3) + '...';
    };

    const NameDisplay = ({ name, maxLength }) => {
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
                                        sx={{ fontWeight: 600 }}
                                    >
                                        <NameDisplay
                                            name={nft.name}
                                            maxLength={18}
                                        />
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.8,
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {nft.collection && (
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
                                        fontWeight: 500,
                                        color: theme.palette.primary.main,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
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
                                            color: theme.palette.success.main
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
