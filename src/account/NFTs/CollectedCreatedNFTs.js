import axios from 'axios';
import { useState, useEffect, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { styled, alpha } from '@mui/material/styles';

// Material-UI Components
import {
    useTheme,
    useMediaQuery,
    Box,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/KeyboardBackspace';

// Loader
import { ClipLoader } from 'react-spinners';

// Custom Components
import NFTCard from 'src/explore/NFTCard';
import CollectionCard from 'src/explore/CollectionCard';
import FilterDetail from '../FilterDetail';

// Styled Components
const GlassyBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent'
        },
        '&:hover fieldset': {
            borderColor: 'transparent'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent'
        }
    }
}));

/**
 * CollectedCreatedNFTs Component
 *
 * This component handles the display of both collected and created NFTs based on the `type` prop.
 *
 * Props:
 * - type: 'collected' | 'created' - Determines the type of NFTs to display.
 * - account: string - User account identifier.
 * - limit: number - Number of NFTs to fetch per API call.
 * - collection: string (optional) - Specific collection to filter NFTs.
 * - setHasCreatedNFTs: function (optional) - Callback to set if there are created NFTs.
 * - setCreatedNFTsLoaded: function (optional) - Callback to set if created NFTs have been loaded.
 * - setCreatedNFTsCount: function (optional) - Callback to set the count of created NFTs.
 */
export default function CollectedCreatedNFTs({
    type,
    account,
    limit,
    collection,
    setHasCreatedNFTs,
    setCreatedNFTsLoaded,
    setCreatedNFTsCount
}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // State Variables
    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState(0);
    const [subFilter, setSubFilter] = useState('pricexrpasc');
    const [onSaleCount, setOnSaleCount] = useState(0);

    const [sync, setSync] = useState(0);

    /**
     * Memoize the fetchNfts function to prevent unnecessary re-creation
     */
    const fetchNfts = useCallback(() => {
        setLoading(true);

        const body = {
            type,
            account,
            page,
            limit,
            search,
            filter,
            subFilter,
            collection
        };

        axios
            .post(`${BASE_URL}/account/collectedCreated`, body)
            .then((res) => {
                console.log('API response from xrpnft:', res.data);
                const newNfts = res.data.nfts;
                const length = newNfts.length;

                setHasMore(length >= limit);

                if (length > 0) {
                    setNfts((prevNfts) => [...prevNfts, ...newNfts]);
                }
            })
            .catch((err) => {
                console.error('Error fetching NFTs:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [type, account, page, limit, search, filter, subFilter, collection]);

    /**
     * Reset NFT state when filters or search terms change.
     */
    const resetNfts = () => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
    };

    // Effect to reset NFTs when dependencies change
    useEffect(() => {
        resetNfts();
    }, [flag, search, filter, subFilter, collection]);

    // Use useEffect to fetch NFTs only when necessary
    useEffect(() => {
        fetchNfts();
    }, [fetchNfts, sync]);

    // Effect to handle responsiveness for filter visibility
    useEffect(() => {
        if (fullScreen) setShowFilter(false);
    }, [fullScreen]);

    // Effect to handle created NFTs specific callbacks
    useEffect(() => {
        if (type === 'created') {
            console.log('Created NFTs count:', nfts.length);
            if (setHasCreatedNFTs) {
                setHasCreatedNFTs(nfts.length > 0);
            }
            if (setCreatedNFTsLoaded) {
                setCreatedNFTsLoaded(true);
            }
            if (setCreatedNFTsCount) {
                setCreatedNFTsCount(nfts.length); // Update created NFTs count
            }
        }
    }, [
        nfts,
        type,
        setHasCreatedNFTs,
        setCreatedNFTsLoaded,
        setCreatedNFTsCount
    ]);

    /**
     * Handle search input changes.
     * @param {Event} e - Input change event.
     */
    const handleChangeSearch = (e) => {
        resetNfts();
        setSearch(e.target.value);
    };

    /**
     * Toggle filter visibility.
     */
    const handleShowFilter = () => {
        setShowFilter((prev) => !prev);
    };

    /**
     * Navigate back to the account page.
     */
    const handleBack = () => {
        window.location.href = `/account/${account}`;
    };

    /**
     * Memoize the nftItems to prevent unnecessary re-renders
     */
    const nftItems = useMemo(() => (
        <Grid container spacing={1}>
            {nfts.map((nft, index) => (
                <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    xl={1.5}
                    key={nft.id || index}
                    sx={{
                        py: { xs: 0.5, sm: 2 },
                        px: { xs: 0.5, sm: 1 },
                        pr: { xs: 1.5, sm: 2 }
                    }}
                >
                    {collection ? (
                        <NFTCard nft={nft} />
                    ) : (
                        <CollectionCard
                            collectionData={nft}
                            type={type}
                            account={account}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    ), [nfts, collection, type, account]);

    return (
        <>
            {(type !== 'created' || nfts.length > 0) && (
                <>
                    {/* Search and Filter Bar */}
                    <GlassyBox
                        sx={{
                            mb: 2,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {collection && ( // Show filter button only for NFTs within a collection
                            <IconButton
                                aria-label="filter"
                                onClick={handleShowFilter}
                                sx={{ color: theme.palette.primary.main }}
                            >
                                <FilterListIcon fontSize="large" />
                            </IconButton>
                        )}
                        <SearchTextField
                            id="textFilter"
                            fullWidth
                            variant="outlined"
                            placeholder="Search by name or attribute"
                            margin="dense"
                            onChange={handleChangeSearch}
                            autoComplete="new-password"
                            inputProps={{ autoComplete: 'off' }}
                            value={search}
                            onFocus={(event) => event.target.select()}
                            sx={{ pl: 2, pr: 1, pt: 0, pb: 0, mt: 0 }}
                            onKeyDown={(e) => e.stopPropagation()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ mr: 0.7 }}
                                    >
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {loading && (
                                            <ClipLoader
                                                color="#ff0000"
                                                size={15}
                                            />
                                        )}
                                    </InputAdornment>
                                )
                            }}
                        />
                    </GlassyBox>

                    {/* Back Button for Collection View */}
                    {collection && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <IconButton
                                onClick={handleBack}
                                sx={{
                                    p: 1,
                                    '&:hover': {
                                        background:
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(255, 255, 255, 0.8)'
                                    }
                                }}
                            >
                                <ArrowBackIcon fontSize="large" />
                                <Typography
                                    variant="body2"
                                    fontSize="medium"
                                    sx={{ ml: 1 }}
                                >
                                    Go back
                                </Typography>
                            </IconButton>
                        </Box>
                    )}

                    {/* Main Content Grid */}
                    <Grid container spacing={2} justifyContent="space-between">
                        {/* Filter Sidebar */}
                        {showFilter && collection && (
                            <Grid item xs={12} md={3} xl={2}>
                                <GlassyBox sx={{ p: 2 }}>
                                    <FilterDetail
                                        onSaleCount={onSaleCount}
                                        filter={filter}
                                        setFilter={setFilter}
                                        subFilter={subFilter}
                                        setSubFilter={setSubFilter}
                                        setPage={setPage}
                                    />
                                </GlassyBox>
                            </Grid>
                        )}

                        {/* NFTs Display Area */}
                        <Grid
                            item
                            xs={12}
                            md={showFilter && collection ? 9 : 12}
                            xl={showFilter && collection ? 10 : 12}
                        >
                            {collection ? (
                                <InfiniteScroll
                                    dataLength={nfts.length}
                                    next={() => {
                                        setPage((prevPage) => prevPage + 1);
                                        setSync((prevSync) => prevSync + 1);
                                    }}
                                    hasMore={hasMore}
                                    loader={
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            mt={2}
                                        >
                                            <ClipLoader
                                                color="#ff0000"
                                                size={35}
                                            />
                                        </Box>
                                    }
                                    endMessage={
                                        <Typography
                                            variant="body2"
                                            align="center"
                                            mt={2}
                                        >
                                            {nfts.length === 0
                                                ? 'No NFTs found.'
                                                : 'You have seen all NFTs.'}
                                        </Typography>
                                    }
                                    scrollThreshold={0.6}
                                >
                                    {nftItems}
                                </InfiniteScroll>
                            ) : (
                                // If not filtering by collection, display NFTs without infinite scroll
                                <>
                                    {nfts.length > 0 ? (
                                        nftItems
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            align="center"
                                            mt={2}
                                        >
                                            No NFTs found.
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </>
            )}

            {/* Optional: Display message if type is 'created' but no NFTs are present */}
            {type === 'created' && nfts.length === 0 && (
                <Typography variant="body2" align="center" mt={4}>
                    You haven't created any NFTs yet.
                </Typography>
            )}
        </>
    );
}
