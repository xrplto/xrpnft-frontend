import axios from 'axios';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { styled, alpha } from '@mui/material/styles';

// Material
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

// Components
import NFTCard from 'src/explore/NFTCard';
import CollectionCard from 'src/explore/CollectionCard';
import FilterDetail from '../FilterDetail';

const GlassyBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: 'transparent',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent',
        },
    },
}));

export default function CollectedCreatedNFTs({
    type,
    account,
    limit,
    collection,
    setHasCreatedNFTs,
    setCreatedNFTsLoaded,
    setCreatedNFTsCount // Add this prop
}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(collection ? true : false);
    const [filter, setFilter] = useState(0);

    const [subFilter, setSubFilter] = useState('pricexrpasc');

    const [onSaleCount, setOnSaleCount] = useState(0);

    const [sync, setSync] = useState(0);

    const fetchNfts = () => {
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
                console.log('API response from xrpnft:', res.data); // Added console.log here
                const newNfts = res.data.nfts;
                const length = newNfts.length;
                if (length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                if (length > 0) {
                    setNfts([...nfts, ...newNfts]);
                }
            })
            .catch((err) => {
                console.log('Error on getting nfts!', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const resetNfts = () => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
    };

    useEffect(() => {
        resetNfts();
    }, [flag, search, filter, subFilter]);

    useEffect(() => {
        fetchNfts();
    }, [sync, flag, search, filter, subFilter]);

    useEffect(() => {
        if (fullScreen) setShowFilter(false);
    }, [fullScreen]);

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
                setCreatedNFTsCount(nfts.length); // Set the created NFTs count
            }
        }
    }, [nfts, type, setHasCreatedNFTs, setCreatedNFTsLoaded, setCreatedNFTsCount]);

    const handleChangeSearch = (e) => {
        resetNfts();
        setSearch(e.target.value);
    };

    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };

    const handleBack = () => {
        window.location.href = `/account/${account}`;
    };

    const nftItems = () => (
        <Grid container spacing={1}>
            {nfts.map((nft, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={1.5} key={index} sx={{ py: 2 }}> 
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
    );

    return (
        <>
            {(type !== 'created' || nfts.length > 0) && (
                <>
                    <GlassyBox sx={{ mb: 2, p: 1, display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            aria-label="filter"
                            onClick={handleShowFilter}
                            sx={{ color: theme.palette.primary.main }}
                        >
                            <FilterListIcon fontSize="large" />
                        </IconButton>
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
                                    <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="start">
                                        {loading && <ClipLoader color="#ff0000" size={15} />}
                                    </InputAdornment>
                                )
                            }}
                        />
                    </GlassyBox>
                    {collection && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <IconButton
                                onClick={handleBack}
                                sx={{
                                    p: 1,
                                    '&:hover': {
                                        background: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'rgba(255, 255, 255, 0.8)',
                                    },
                                }}
                            >
                                <ArrowBackIcon fontSize="large" />
                                <Typography variant="s3" fontSize="medium" sx={{ ml: 1 }}>
                                    Go back
                                </Typography>
                            </IconButton>
                        </Box>
                    )}
                    <Grid container spacing={2} justifyContent="space-between">
                        {showFilter && (
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
                        <Grid item xs={12} md={showFilter ? 9 : 12} xl={showFilter ? 10 : 12}>
                            {collection && collection !== '' ? (
                                <InfiniteScroll
                                    dataLength={nfts.length}
                                    next={() => {
                                        setPage(page + 1);
                                        setSync(sync + 1);
                                    }}
                                    hasMore={hasMore}
                                    scrollThreshold={0.6}
                                >
                                    {nftItems()}
                                </InfiniteScroll>
                            ) : (
                                nftItems()
                            )}
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}