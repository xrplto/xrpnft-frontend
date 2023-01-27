import axios from 'axios'
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
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
import NFTCard from './NFTCard';
import FilterDetail from './FilterDetail';

export default function NFTs({ collection }) {

    const BASE_URL = 'https://api.xrpnft.com/api'

    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(true);
    // const [filter, setFilter] = useState(collection?.imported === 'yes' ? 0 : 4);
    const [filter, setFilter] = useState(0);

    // const [subFilter, setSubFilter] = useState('pricexrpasc');
    const [subFilter, setSubFilter] = useState(0);

    // const [filterAttrs, _setFilterAttrs] = useState({});
    const [filterAttrs, setFilterAttrs] = useState([]);

    const [sync, setSync] = useState(0);

    const [attrSync, setAttrSync] = useState(0);

    const fetchNfts = () => {
        setLoading(true);

        const limit = 20;

        const body = { page, limit, flag, cid: collection?.uuid, search, filter, subFilter, filterAttrs };

        axios.post(`${BASE_URL}/nfts`, body)
            .then(res => {
                const newNfts = res.data.nfts;
                const length = newNfts.length;
                if (length < 20) {
                    setHasMore(false)
                } else {
                    setHasMore(true)
                }
                if (length > 0) {
                    setNfts([...nfts, ...newNfts])
                }
            }).catch(err => {
                console.log("Error on getting nfts!", err);
            }).then(function () {
                // always executed
                setLoading(false);
            });
    };

    useEffect(() => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
        setSync(sync + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, search, filter, subFilter, attrSync, filterAttrs]);

    useEffect(() => {
        fetchNfts();
    }, [sync]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleShowFilter = (e) => {
        setShowFilter(!showFilter);
    }

    // const setFilterAttrs = (value) => {
    //     _setFilterAttrs(value);
    //     setAttrSync(attrSync + 1);
    // }

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
            // sx={{ margin: 1, padding: 1 }}
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
                    sx={{ pl: 2, pr: 0, pt: 0, pb: 0, mt: 0 }}
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
                            collection={collection}
                            filter={filter}
                            setFilter={setFilter}
                            subFilter={subFilter}
                            setSubFilter={setSubFilter}
                            setFilterAttrs={setFilterAttrs}
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
                                    <Grid item xs={6} sm={4} md={3} lg={2.4} xl={1.5} key={nft.uuid}>
                                        <NFTCard nft={nft} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </>
    );
};
