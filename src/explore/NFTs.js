import axios from 'axios';
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import debounce from 'lodash.debounce';
import { styled, alpha } from '@mui/material/styles';

// Material
import {
    useTheme,
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
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent'
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.3)
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main
        }
    },
    '& .MuiInputBase-input': {
        color: theme.palette.text.primary
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: theme.palette.primary.main
    }
}));

const sortNFTs = (nfts, sortOption) => {
    switch (sortOption) {
        case 'pricexrpasc':
            return nfts.sort((a, b) => {
                const aAmount =
                    a.cost && a.cost.currency === 'XRP'
                        ? Number(a.cost.amount)
                        : Infinity;
                const bAmount =
                    b.cost && b.cost.currency === 'XRP'
                        ? Number(b.cost.amount)
                        : Infinity;
                return aAmount - bAmount;
            });
        case 'pricexrpdesc':
            return nfts.sort((a, b) => {
                const aAmount =
                    a.cost && a.cost.currency === 'XRP'
                        ? Number(a.cost.amount)
                        : -Infinity;
                const bAmount =
                    b.cost && b.cost.currency === 'XRP'
                        ? Number(b.cost.amount)
                        : -Infinity;
                return bAmount - aAmount;
            });
        case 'pricenoxrp':
            return nfts.sort((a, b) => {
                const aIsXRP = a.cost && a.cost.currency === 'XRP';
                const bIsXRP = b.cost && b.cost.currency === 'XRP';
                if (aIsXRP === bIsXRP) return 0;
                return aIsXRP ? 1 : -1;
            });
        default:
            return nfts;
    }
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
    const [subFilter, setSubFilter] = useState('latestActivity');
    const [filterAttrs, setFilterAttrs] = useState([]);

    const fetchNfts = useCallback(() => {
        if (loading) return;

        setLoading(true);
        const limit = 32;
        const body = {
            page,
            limit,
            flag,
            cid: collection?.uuid,
            search,
            filter,
            subFilter: subFilter === 'latestActivity' ? '' : subFilter,
            filterAttrs
        };

        axios
            .post(`${BASE_URL}/nfts`, body)
            .then((res) => {
                console.log('XRPNFT API Response:', res.data);

                let newNfts = res.data.nfts.map((nft) => ({
                    ...nft,
                    cost: nft.cost && Number(nft.cost.amount) === 0 ? null : nft.cost
                }));

                if (subFilter !== 'latestActivity') {
                    newNfts = sortNFTs(newNfts, subFilter);
                }

                const length = newNfts.length;
                setHasMore(length === limit);
                setNfts((prevNfts) => (page === 0 ? newNfts : [...prevNfts, ...newNfts]));
                setDeletingNfts((prevNfts) => (page === 0 ? newNfts : [...prevNfts, ...newNfts]));
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
    }, [flag, search, filter, subFilter, filterAttrs, setDeletingNfts]);

    useEffect(() => {
        fetchNfts();
    }, [fetchNfts]);

    const handleChangeSearch = debounce((e) => {
        setSearch(e.target.value);
    }, 300);

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

    const handleSortChange = (newSubFilter) => {
        setSubFilter(newSubFilter);
        setPage(0);
        setNfts([]);
        setDeletingNfts([]);
        setHasMore(true);

        let newFilter = filter;
        if (newSubFilter !== 'latestActivity') {
            newFilter |= 4;
        } else {
            newFilter &= ~4;
        }
        setFilter(newFilter);
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, hasMore]);

    return (
        <Box sx={{ width: '100%' }}>
            <GlassyBox sx={{ mb: 2, p: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton
                    aria-label="filter"
                    onClick={handleShowFilter}
                    sx={{
                        color: 'primary.main',
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
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
                    onFocus={(event) => event.target.select()}
                    sx={{ pl: 2, pr: 0, pt: 0, pb: 0, mt: 0 }}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={{
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
                    }}
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
                                setSubFilter={handleSortChange}
                                setFilterAttrs={setFilterAttrs}
                                setPage={setPage}
                            />
                        </GlassyBox>
                    </Grid>
                )}
                <Grid item xs={12} md={showFilter ? 9 : 12} xl={showFilter ? 10 : 12}>
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <ClipLoader color={theme.palette.primary.main} size={30} />
                            </Box>
                        }
                        scrollThreshold={0.9}
                    >
                        <Grid container spacing={0.5}>
                            {nfts.map((nft, index) => (
                                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={1.5} key={nft.NFTokenID || index}>
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
                                                        overflow: 'hidden'
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
        </Box>
    );
}