import axios from 'axios';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    useTheme,
    useMediaQuery,
    Box,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
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

export default function CollectedCreatedNFTs({ type, account, limit, collection }) {
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
    // const [filter, setFilter] = useState(collection?.imported === 'yes' ? 0 : 4);
    const [filter, setFilter] = useState(0);

    const [subFilter, setSubFilter] = useState('pricexrpasc');

    const [onSaleCount, setOnSaleCount] = useState(0);

    const [sync, setSync] = useState(0);

    const fetchNfts = () => {
        setLoading(true);

        //const limit = 20;

        // const body = { page, limit, flag, cid: collection?.uuid, search, filter, subFilter };

        const body = { type, account, page, limit, search, filter, subFilter, collection };

        axios
            .post(`${BASE_URL}/account/collectedCreated`, body)
            .then((res) => {
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
            .then(function () {
                // always executed
                setLoading(false);
            });
    };

    useEffect(() => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
        //setSync(sync + 1); // webxtor: disable duplicate loading on start
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, search, filter, subFilter]);

    useEffect(() => {
        fetchNfts();
    }, [sync, flag, search, filter, subFilter]);

    useEffect(() => {
        if (fullScreen) setShowFilter(false);
    }, [fullScreen]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleShowFilter = (e) => {
        setShowFilter(!showFilter);
    };

    const handleBack = () => {
        window.location.href = `/account/${account}`;
    };

    const nftItems = () => (
        <Grid container spacing={1}>
          {nfts.map((nft) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2.4}
              xl={1.5}
              key={nft.uuid}
            >
              {collection ? (
                <NFTCard nft={nft} />
              ) : (
                <CollectionCard collectionData={nft} type={type} account={account} />
              )}
            </Grid>
          ))}
        </Grid>
    );

    return (
        <>
            <Box
                id="nfts"
                display="flex"
                alignItems="center"
                // sx={{ pl: 0, pr:0 }}
            >
                <IconButton aria-label="filter" onClick={handleShowFilter}>
                    <FilterListIcon fontSize="large" />
                </IconButton>
                <TextField
                    id="textFilter"
                    // autoFocus
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or attribute"
                    margin="dense"
                    onChange={handleChangeSearch}
                    autoComplete="new-password"
                    inputProps={{ autoComplete: 'off' }}
                    value={search}
                    onFocus={(event) => {
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
                                {loading && (
                                    <ClipLoader color="#ff0000" size={15} />
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            {collection && (
                <Box display="flex" justifyContent="center">
                    <IconButton onClick={handleBack}>
                        <ArrowBackIcon fontSize="large" />
                        <Typography variant="s3" fontSize="medium">Go back</Typography>
                    </IconButton>
                </Box>
            )}
            <Grid container spacing={1} justifyContent="space-between" mt={1}>
                {showFilter && (
                    <Grid item xs={12} md={3} xl={2} pt={0.5}>
                        <FilterDetail
                            onSaleCount={onSaleCount}
                            filter={filter}
                            setFilter={setFilter}
                            subFilter={subFilter}
                            setSubFilter={setSubFilter}
                            setPage={setPage}
                        />
                    </Grid>
                )}
                <Grid
                    item
                    xs={12}
                    md={showFilter ? 9 : 12}
                    xl={showFilter ? 10 : 12}
                >
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
                    ) : nftItems()}
                </Grid>
            </Grid>
        </>
    );
}
