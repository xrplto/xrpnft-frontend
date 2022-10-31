import axios from 'axios'
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    useTheme, styled,
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

// Loader
import { ClipLoader } from "react-spinners";

// Components
import NFTCard from './NFTCard';
import FilterDetail from './FilterDetail';
// import { getNFTokenInfo } from 'utils/utils';

// import getNFTimage_info from 'components/NFTCard/NFTimage_info'

export default function ExploreNFT({collection}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api'

    const { enqueueSnackbar } = useSnackbar();
    const [nfTokens, setNfTokens] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(true);
    const [filter, setFilter] = useState(0);

    const fetchNfts = (nfTokensParam, offsetParam) => {
        const _nfTokens = nfTokensParam ? nfTokensParam : nfTokens
        const page = offsetParam === 0 ? offsetParam : offset
        const limit = 30;

        setLoading(true);

        const body = { page, limit, flag, cid: collection.uuid, search, filter};

        axios.post(`${BASE_URL}/nfts?page=${page}&limit=30&flag=${flag}`, body)
            .then(res => {
                const newNfts = res.data.nfts;
                if (newNfts.length < 10) {
                    setHasMore(false)
                } else {
                    setHasMore(true)
                }

                if (search || filter > 0) {
                    setNfTokens(newNfts)
                } else
                    setNfTokens([..._nfTokens, ...res.data.nfts])
                // enqueueSnackbar('Fetch:' + _offset, {
                //     variant: 'success'
                // })
                setOffset(page + 1)
            }).catch(err => {
                console.log("Error on getting nfts!", err);
            }).then(function () {
                // always executed
                setLoading(false);
            });
    };

    const reset = (search, filter) => {
        if (!search && !filter)
            setNfTokens([])
        setOffset(0)
        fetchNfts([], 0)
    }

    useEffect(() => {
        reset(search, filter)
        setHasMore(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, search, filter]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleShowFilter = (e) => {
        setShowFilter(!showFilter);
    }

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                sx={{ margin: 1, padding: 1 }}
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
                    // placeholder='Search by name or attribute'
                    placeholder='Search by name'
                    margin='dense'
                    onChange={handleChangeSearch}
                    autoComplete='new-password'
                    inputProps={{autoComplete: 'off'}}
                    value={search}
                    onFocus={event => {
                        event.target.select();
                    }}
                    sx={{pl:2, pr:2, pt: 0, pb: 0, mt: 0}}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{mr:0.7}}>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">
                                {loading && <ClipLoader color='#ff0000' size={15} /> }
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Grid container spacing={2} justifyContent='center'>
                {showFilter &&
                    <Grid item xs={12} md={3}>
                        <FilterDetail filter={filter} setFilter={setFilter} />
                    </Grid>
                }
                <Grid item xs={12} md={showFilter?9:12}>
                    <InfiniteScroll
                        dataLength={nfTokens.length}
                        next={() => fetchNfts()}
                        hasMore={hasMore}
                        // loader={<p>loading...</p>}
                    >   
                    
                        <Grid container spacing={2}
                            style={{
                                display: 'grid',
                                justifyContent: 'center',
                                alignContent: 'flex-start',
                                gridGap: '50px',
                                gridTemplateColumns: 'repeat(auto-fill, 300px)',
                                marginTop: '30px'
                            }}
                        >
                            {   
                            
                                nfTokens.map((nft) => (
                                    
                                    // <Grid item key={nft.uuid}
                                    // >
                                        <NFTCard
                                            key={nft.uuid}
                                            nft={nft}
                                            collection={collection}
                                        />
                                    //  </Grid>
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
