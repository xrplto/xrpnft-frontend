import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Link, Tooltip } from '@mui/material';
import axios from 'axios';

const MarqueeContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    background: theme.palette.primary.main, // Change background to make it more visible
    color: theme.palette.primary.contrastText, // Adjust text color for contrast
    padding: theme.spacing(1, 0), // Add some padding
    position: 'relative', // Ensure it's not hidden behind other elements
    zIndex: 1000, // Bring it to the front
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Add a subtle shadow
}));

const MarqueeContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    animation: 'marquee 60s linear infinite',
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
    padding: theme.spacing(0, 2),
    color: theme.palette.primary.contrastText,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)' // Slight zoom effect on hover
    }
}));

const NFTImage = styled('img')({
    width: '30px',
    height: '30px',
    marginRight: '8px',
    borderRadius: '4px',
    objectFit: 'cover' // Ensure the image covers the area nicely
});

const MarqueeBar = () => {
    const [nfts, setNfts] = useState([]);
    const BASE_URL = 'https://api.xrpnft.com/api';

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
                return 'Transferred';
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

    return (
        <MarqueeContainer>
            <MarqueeContent>
                {nfts.map((nft, index) => (
                    <Link
                        key={nft.NFTokenID || index}
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
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                <NameDisplay name={nft.name} maxLength={20} />
                                {nft.collection && (
                                    <span style={{ opacity: 0.8 }}>
                                        {' - '}
                                        <NameDisplay name={nft.collection} maxLength={15} />
                                    </span>
                                )}
                                <span style={{ marginLeft: '8px', fontWeight: 'bold', color: theme => theme.palette.secondary.main }}>
                                    {getEventText(nft.updateEvent)}
                                </span>
                                {nft.cost && (
                                    <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                                        {` - ${Number(nft.cost.amount).toFixed(2)} XRP`}
                                    </span>
                                )}
                            </Typography>
                        </MarqueeItem>
                    </Link>
                ))}
            </MarqueeContent>
        </MarqueeContainer>
    );
};

export default MarqueeBar;
