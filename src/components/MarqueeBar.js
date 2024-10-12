import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Link, Tooltip } from '@mui/material';
import axios from 'axios';

const MarqueeContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 0), // Reduced vertical padding
    position: 'relative',
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)', // Reduced shadow
    borderBottom: `1px solid ${theme.palette.divider}`
}));

const MarqueeContent = styled(Box)(({ theme, startPosition }) => ({
    display: 'flex',
    animation: `marquee 80s linear infinite`,
    animationDelay: `${startPosition}s`,
    '&:hover': {
        animationPlayState: 'paused'
    },
    '@keyframes marquee': {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(-100%)' }
    }
}));

const MarqueeItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: theme.spacing(0, 2), // Reduced horizontal padding
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: theme.palette.action.hover,
        borderRadius: theme.shape.borderRadius
    }
}));

const NFTImage = styled('img')({
    width: '32px', // Reduced size
    height: '32px', // Reduced size
    marginRight: '12px', // Reduced margin
    borderRadius: '6px', // Slightly reduced border radius
    objectFit: 'cover',
    border: '1px solid #fff', // Thinner border
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' // Reduced shadow
});

const MarqueeBar = ({ isVisible = true }) => {
    const [nfts, setNfts] = useState([]);
    const [startPosition, setStartPosition] = useState(0);
    const BASE_URL = 'https://api.xrpnft.com/api';
    const theme = useTheme();

    useEffect(() => {
        // Set a random start position between -80 and 0
        setStartPosition(Math.random() * -80);

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
                console.log('API response:', response.data);

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

                setNfts(newNfts);
                console.log('Sorted NFTs:', newNfts);
            } catch (error) {
                console.error('Error fetching recent NFTs:', error);
            }
        };

        fetchRecentNFTs();
        const interval = setInterval(fetchRecentNFTs, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    console.log('Rendering MarqueeBar with', nfts.length, 'NFTs'); // Add this log

    const getEventText = (updateEvent) => {
        switch (updateEvent) {
            case 'SALE':
                return 'Buy';
            case 'MINT':
                return 'Newly Minted';
            case 'TRANSFER':
                return 'Transfer'; // Changed from 'Transferred' to 'Transfer'
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

    return (
        <MarqueeContainer>
            <MarqueeContent startPosition={startPosition}>
                {nfts.map((nft, index) => (
                    <Link
                        key={nft.NFTokenID || index}
                        href={`/nft/${nft.NFTokenID}`}
                        underline="none"
                        color="inherit" // Use inherit to respect the parent's text color
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
                                    variant="body2" // Changed from subtitle1 to body2
                                    sx={{ fontWeight: 600 }}
                                >
                                    <NameDisplay
                                        name={nft.name}
                                        maxLength={18} // Reduced max length
                                    />
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ opacity: 0.8, fontSize: '0.7rem' }} // Reduced font size
                                >
                                    {nft.collection && (
                                        <NameDisplay
                                            name={nft.collection}
                                            maxLength={12} // Reduced max length
                                        />
                                    )}
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption" // Changed from body2 to caption
                                sx={{
                                    marginLeft: 1.5, // Reduced margin
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
                                    variant="caption" // Changed from body2 to caption
                                    sx={{
                                        marginLeft: 1.5, // Reduced margin
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
                    </Link>
                ))}
            </MarqueeContent>
        </MarqueeContainer>
    );
};

export default MarqueeBar;
