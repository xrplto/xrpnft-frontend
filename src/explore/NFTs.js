import axios from 'axios';
import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import debounce from 'lodash.debounce';
import { styled, alpha } from '@mui/material/styles';

// Material
import {
    useTheme,
    useMediaQuery,
    Box,
    Grid,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// Loader
import { ClipLoader } from 'react-spinners';

// Components
import NFTCard from './NFTCard';
import FilterDetail from './FilterDetail';
import { AppContext } from 'src/AppContext';

const GlassyBox = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputBase-input': {
        color: theme.palette.text.primary,
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
    },
}));

const sortNFTs = (nfts, sortOption) => {
    if (sortOption === 'pricexrpasc') {
        return nfts.sort((a, b) => {
            const aAmount = a.cost ? Number(a.cost.amount) : 0;
            const bAmount = b.cost ? Number(b.cost.amount) : 0;
            
            // Move unlisted (amount: 0) NFTs to the end
            if (aAmount === 0 && bAmount !== 0) return 1;
            if (aAmount !== 0 && bAmount === 0) return -1;
            
            // Sort by price ascending, ignoring unlisted NFTs
            return aAmount - bAmount;
        });
    }
    return nfts; // Return unsorted if not 'pricexrpasc'
};

export default function NFTs({ collection }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const theme = useTheme();
    const { setDeletingNfts } = useContext(AppContext);

    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState(0);
    const [subFilter, setSubFilter] = useState(0);
    const [filterAttrs, setFilterAttrs] = useState([]);
    const [sync, setSync] = useState(0);
    const [attrSync, setAttrSync] = useState(0);

    const fetchNfts = useCallback(() => {
        setLoading(true);
        const limit = 32; // 32 per page as per your API response
        const body = {
            page,
            limit,
            flag,
            cid: collection?.uuid,
            search,
            filter,
            subFilter,
            filterAttrs
        };

        axios
            .post(`${BASE_URL}/nfts`, body)
            .then((res) => {
                console.log('XRPNFT API Response:', res.data); // Logs the full API response

                let newNfts = res.data.nfts.map(nft => ({
                    ...nft,
                    cost: nft.cost && Number(nft.cost.amount) === 0 ? null : nft.cost
                }));

                // Apply sorting
                newNfts = sortNFTs(newNfts, subFilter);

                const length = newNfts.length;
                setHasMore(length === limit);
                setNfts((prevNfts) => [...prevNfts, ...newNfts]);
                setDeletingNfts((prevNfts) => [...prevNfts, ...newNfts]);
            })
            .catch((err) => {
                console.log('Error on getting nfts!', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, flag, search, filter, subFilter, filterAttrs, collection?.uuid, setDeletingNfts]);

    useEffect(() => {
        setNfts([]);
        setDeletingNfts([]);
        setPage(0);
        setHasMore(true);
        // setSync((prevSync) => prevSync + 1); // webxtor: disable duplicate loading on start
    }, [flag, search, filter, subFilter, attrSync, filterAttrs, setDeletingNfts]);

    useEffect(() => {
        fetchNfts();
    }, [sync, fetchNfts, flag, search, filter, subFilter, attrSync, filterAttrs]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleShowFilter = () => {
        setShowFilter((prevShow) => !prevShow);
    };

    const handleRemove = (NFTokenID) => {
        setLoading(true);
        axios
            .delete(`${BASE_URL}/nfts`, {
                data: {
                    issuer: collection?.account,
                    taxon: collection?.taxon,
                    cid: collection?.uuid,
                    idsToDelete: NFTokenID
                }
            })
            .then((res) => {
                location.reload();
            })
            .catch((err) => {
                console.log('Error on removing nfts!', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // useMemo to avoid unnecessary re-renders
    const inputProps = useMemo(
        () => ({
            startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.7 }}>
                    <SearchIcon color="primary" />
                </InputAdornment>
            ),
            endAdornment: (
                <InputAdornment position="start">
                    {loading && <ClipLoader color={theme.palette.primary.main} size={15} />}
                </InputAdornment>
            )
        }),
        [loading, theme.palette.primary.main]
    );

    return (
        <>
            <GlassyBox sx={{ mb: 2, p: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton 
                    aria-label="filter" 
                    onClick={handleShowFilter}
                    sx={{
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                    }}
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
                    sx={{ pl: 2, pr: 0, pt: 0, pb: 0, mt: 0 }}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={inputProps}
                />
            </GlassyBox>
            <Grid container spacing={1} justifyContent="space-between" mt={1}>
                {showFilter && (
                    <Grid item xs={12} md={3} xl={2} pt={0.5}>
                        <GlassyBox sx={{ p: 2 }}>
                            <FilterDetail
                                collection={collection}
                                filter={filter}
                                setFilter={setFilter}
                                subFilter={subFilter}
                                setSubFilter={setSubFilter}
                                setFilterAttrs={setFilterAttrs}
                                setPage={setPage}
                            />
                        </GlassyBox>
                    </Grid>
                )}
                <Grid
                    item
                    xs={12}
                    md={showFilter ? 9 : 12}
                    xl={showFilter ? 10 : 12}
                >
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={() => {
                            setPage((prevPage) => prevPage + 1);
                            setSync((prevSync) => prevSync + 1);
                        }}
                        hasMore={hasMore}
                        scrollThreshold={0.6}
                        loader={
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <ClipLoader color={theme.palette.primary.main} size={30} />
                            </Box>
                        }
                    >
                        <Grid container spacing={1}>
                            {nfts.map((nft, index) => (
                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                    lg={2.4}
                                    xl={1.5}
                                    key={nft.NFTokenID || index}
                                >
                                    <NFTCard
                                        nft={nft}
                                        handleRemove={handleRemove}
                                        imageComponent={
                                            <LazyLoadImage
                                                src={nft.imageUrl}
                                                alt={nft.name}
                                                effect="blur"
                                                wrapperProps={{
                                                    style: { 
                                                        display: 'block', 
                                                        height: '100%', 
                                                        width: '100%',
                                                        borderRadius: theme.shape.borderRadius,
                                                        overflow: 'hidden',
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </>
    );
}
