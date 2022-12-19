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
    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState(4);
    const [subFilter, setSubFilter] = useState('pricexrpasc');

    const [filterAttrs, _setFilterAttrs] = useState({});

    const [sync, setSync] = useState(0);

    const [attrSync, setAttrSync] = useState(0);

    const fetchNfts = () => {
        setLoading(true);

        const limit = 20;

        const body = { page, limit, flag, cid: collection?.uuid, search, filter, subFilter};

        axios.post(`${BASE_URL}/nfts`, body)
            .then(res => {
                const newNfts = res.data.nfts;
                const length = newNfts.length;
                if (length < 10) {
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
    }, [flag, search, filter, subFilter, attrSync]);

    useEffect(() => {
        fetchNfts();
    }, [sync]);

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleShowFilter = (e) => {
        setShowFilter(!showFilter);
    }

    const setFilterAttrs = (value) => {
        _setFilterAttrs(value);
        setAttrSync(attrSync + 1);
    }

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
                    inputProps={{autoComplete: 'off'}}
                    value={search}
                    onFocus={event => {
                        event.target.select();
                    }}
                    sx={{pl:2, pr:1, pt: 0, pb: 0, mt: 0}}
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
            <Grid container spacing={0} justifyContent='space-between'>
                {showFilter &&
                    <Grid item xs={12} md={3}>
                        <FilterDetail
                            collection={collection}
                            filter={filter}
                            setFilter={setFilter}
                            subFilter={subFilter}
                            setSubFilter={setSubFilter}
                            filterAttrs={filterAttrs}
                            setFilterAttrs={setFilterAttrs}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={showFilter?9:12}>
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={() => {
                            setPage(page + 1);
                            setSync(sync + 1);
                        }}
                        hasMore={hasMore}
                        // loader={<p>loading...</p>}
                    >   
                    
                        <Grid container spacing={0}
                            style={{
                                display: 'grid',
                                justifyContent: 'space-between',
                                alignContent: 'flex-start',
                                gridGap: '20px',
                                gridTemplateColumns: 'repeat(auto-fill, 280px)',
                                marginTop: '10px',
                                padding: '10px'
                            }}
                        >
                            {   
                            
                                nfts.map((nft) => (
                                    
                                    // <Grid item key={nft.uuid}
                                    // >
                                        <NFTCard
                                            key={nft.uuid}
                                            nft={nft}
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
