import axios from 'axios';
import { useState, useEffect, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    useTheme, useMediaQuery,
    Box,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// Loader
import { ClipLoader } from "react-spinners";

// Components
import NFTCard from 'src/explore/NFTCard';
import FilterDetail from './FilterDetail';

export default function CollectedNFTs({ account }) {

    const BASE_URL = 'https://api.xrpnft.com/api';

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showFilter, setShowFilter] = useState(true);
    const [filter, setFilter] = useState(0);
    const [subFilter, setSubFilter] = useState('pricexrpasc');
    const [onSaleCount, setOnSaleCount] = useState(0);

    const fetchNfts = useCallback(async () => {
        setLoading(true);

        const limit = 20;
        const body = { account, page, limit, search, filter, subFilter };

        try {
            const res = await axios.post(`${BASE_URL}/account/collected`, body);
            const newNfts = res.data.nfts;
            setHasMore(newNfts.length === limit);
            setNfts(prevNfts => [...prevNfts, ...newNfts]);
        } catch (err) {
            console.error("Error on getting nfts!", err);
        } finally {
            setLoading(false);
        }
    }, [account, page, search, filter, subFilter]);

    useEffect(() => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
        fetchNfts();
    }, [fetchNfts]);

    useEffect(() => {
        setShowFilter(!fullScreen);
    }, [fullScreen]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleShowFilter = () => {
        setShowFilter(prevShowFilter => !prevShowFilter);
    };

    // Memoized InfiniteScroll component to avoid re-renders
    const infiniteScroll = useMemo(() => (
        <InfiniteScroll
            dataLength={nfts.length}
            next={() => setPage(prevPage => prevPage + 1)}
            hasMore={hasMore}
            scrollThreshold={0.6}
        >
            <Grid container spacing={1}>
                {nfts.map((nft) => (
                    <Grid item xs={6} sm={4} md={3} lg={2.4} xl={1.5} key={nft.uuid}>
                        <NFTCard nft={nft} />
                    </Grid>
                ))}
            </Grid>
        </InfiniteScroll>
    ), [nfts, hasMore]);


    return (
        <>
            <Box
                id='nfts'
                display="flex"
                alignItems="center"
                // sx={{ pl: 0, pr:0 }}
            >
                <IconButton
                    aria-label='filter'
                    onClick={handleShowFilter}
                >
                    <FilterListIcon fontSize="large" />
                </IconButton>
                <TextField
                    id='textFilter'
                    // autoFocus
                    fullWidth
                    variant='outlined'
                    placeholder='Search by name or attribute'
                    margin='dense'
                    onChange={handleChangeSearch}
                    autoComplete='new-password'
                    inputProps={{ autoComplete: 'off' }}
                    value={search}
                    onFocus={event => {
                        event.target.select();
                    }}
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
                                {loading && <ClipLoader color='#ff0000' size={15} />}
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Grid container spacing={1} justifyContent='space-between' mt={1}>
                {showFilter &&
                    <Grid item xs={12} md={3} xl={2} pt={0.5}>
                        <FilterDetail
                            onSaleCount={onSaleCount}
                            filter={filter}
                            setFilter={setFilter}
                            subFilter={subFilter}
                            setSubFilter={setSubFilter}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={showFilter ? 9 : 12} xl={showFilter ? 10 : 12}>
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={() => {
                            setPage(page + 1);
                            setSync(sync + 1);
                        }}
                        hasMore={hasMore}
                        scrollThreshold={0.6}
                    >

                        <Grid
                            container
                            spacing={1}
                        >
                            {

                                nfts.map((nft) => (

                                    <Grid item xs={6} sm={4} md={3} lg={2.4} xl={1.5} key={nft.uuid}
                                    >
                                        <NFTCard
                                            nft={nft}
                                        />
                                    </Grid>
                                ))

                                // .filter(getNFTimage_info(URI)!==null)
                            }
                        </Grid>
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </>
    );
};
