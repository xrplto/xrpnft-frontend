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
// import { getNFTokenInfo } from 'utils/utils';

// import getNFTimage_info from 'components/NFTCard/NFTimage_info'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function ExploreNFT({collection}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api'

    const { enqueueSnackbar } = useSnackbar();
    const [nfTokens, setNfTokens] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const [showFilter, setShowFilter] = useState(true);

    const fetchNfts = (nfTokensParam, offsetParam) => {
        const _nfTokens = nfTokensParam ? nfTokensParam : nfTokens
        const page = offsetParam === 0 ? offsetParam : offset
        const limit = 30;

        setLoading(true);

        const body = { page, limit, flag, cid: collection.uuid, filter};

        axios.post(`${BASE_URL}/nfts?page=${page}&limit=30&flag=${flag}`, body)
            .then(res => {
                if (res.data.nfts.length < 10) {
                    setHasMore(false)
                }

                if (filter)
                    setNfTokens(res.data.nfts)
                else 
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

    const reset = () => {
        if (!filter)
            setNfTokens([])
        setOffset(0)
        fetchNfts([], 0)
    }

    useEffect(() => {
        reset(filter)
        setHasMore(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, filter]);

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleShowFilter = (e) => {
        setShowFilter(!showFilter);
    }

    const handleDrawerClose = (e) => {
        setShowFilter(false);
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
                    onChange={handleChangeFilter}
                    autoComplete='new-password'
                    inputProps={{autoComplete: 'off'}}
                    value={filter}
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
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={showFilter}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
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
                </Main>
            </Box>
        </>
    );
};
