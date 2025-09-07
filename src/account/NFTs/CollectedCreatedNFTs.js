import axios from 'axios';
import { useState, useEffect, useCallback, memo } from 'react';
import { Grid } from '@mui/material';

// Custom Components
import { NFTCard } from 'src/collection/ExploreNFT';
import CollectionCard from 'src/account/CollectionCard';

const CollectedCreatedNFTs = memo(function CollectedCreatedNFTs({
    type,
    account,
    limit,
    collection,
    setHasCreatedNFTs,
    setCreatedNFTsLoaded,
    setCreatedNFTsCount
}) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNfts = useCallback(async () => {
        try {
            const params = new URLSearchParams({
                type,
                account,
                page: 0,
                limit
            });
            
            if (collection) {
                params.append('collection', collection);
            }

            const response = await axios.get(`${BASE_URL}/account/collectedCreated?${params.toString()}`);
            
            if (response.data?.nfts) {
                setNfts(response.data.nfts);
                
                if (type === 'created') {
                    const count = response.data.nfts.length;
                    if (setHasCreatedNFTs) setHasCreatedNFTs(count > 0);
                    if (setCreatedNFTsLoaded) setCreatedNFTsLoaded(true);
                    if (setCreatedNFTsCount) setCreatedNFTsCount(count);
                }
            }
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        } finally {
            setLoading(false);
        }
    }, [type, account, collection, limit, setHasCreatedNFTs, setCreatedNFTsLoaded, setCreatedNFTsCount]);

    useEffect(() => {
        fetchNfts();
    }, [fetchNfts]);

    if (loading) {
        return null;
    }

    return (
        <Grid container spacing={0} sx={{ width: '100%', margin: 0, padding: 0.15 }}>
            {nfts.map((nft, index) => (
                <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    xl={1.5}
                    key={nft.id || nft._id || index}
                    sx={{ padding: { xs: '1px', sm: '2px', md: '3px' } }}
                >
                    {collection ? (
                        <NFTCard nft={nft} />
                    ) : nft.collection ? (
                        <CollectionCard
                            item={nft.collection}
                            isMine={type === 'created'}
                            nftCount={nft.nftCount}
                            nftsForSale={nft.nftsForSale}
                            account={account}
                            type={type}
                        />
                    ) : (
                        <NFTCard nft={nft} />
                    )}
                </Grid>
            ))}
        </Grid>
    );
});

export default CollectedCreatedNFTs;