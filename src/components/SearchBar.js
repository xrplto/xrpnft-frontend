import axios from 'axios';
import { useState, useEffect } from 'react';

// Material
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Chip,
    Fade,
    ClickAwayListener
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CollectionsIcon from '@mui/icons-material/Collections';
import ImageIcon from '@mui/icons-material/Image';

// Loader
import { ClipLoader } from "react-spinners";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

export default function SearchBar({ id, placeholder, type, fullSearch, setFullSearch}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [search, setSearch] = useState('');

    const [nfts, setNfts] = useState([]);
    const [collections, setCollections] = useState([]);

    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const getData = (search) => {

        // type = SEARCH_ITEM_COLLECTION_ACCOUNT
        // type = SEARCH_ITEM_NAME_OR_ATTRIBUTE

        if (!search) {
            setShowResults(false);
            return;
        }
  
        setLoading(true);
        const body = {};
        body.search = search;
        body.type = type;
        // https://api.xrpnft.com/api/search
        axios.post(`${BASE_URL}/search`, body).then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    console.log(ret);
                    setNfts(ret.nfts || []);
                    setCollections(ret.collections || []);
                    setShowResults(true);
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(err => {
            console.log("err->>", err);
        }).then(function () {
            // Always executed
            setLoading(false);
        });
    }

    useEffect(() => {
        var timer = null;

        const handleValue = () => {
            getData(search);
        }

        timer = setTimeout(handleValue, 500);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClear = (e) => {
        setSearch('');
        setNfts([]);
        setCollections([]);
        setShowResults(false);
    }

    const handleBack = (e) => {
        setFullSearch(false);
        setSearch('');
        setNfts([]);
        setCollections([]);
        setShowResults(false);
    }

    const handleResultClick = (item, itemType) => {
        // Navigate to item detail page or collection page
        if (itemType === 'nft' && item.tokenId) {
            window.location.href = `/nft/${item.tokenId}`;
        } else if (itemType === 'collection' && item.id) {
            window.location.href = `/collection/${item.id}`;
        }
        handleClear();
    }

    const handleClickAway = () => {
        setShowResults(false);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }}>
                <OutlinedInput
                id={id}
                placeholder={placeholder}
                value={search}
                onChange={handleSearch}
                // autoFocus
                // onFocus={event => {
                //     event.target.select();
                // }}
                autoComplete='new-password'
                inputProps={{autoComplete: 'off', maxLength: 120}}
                margin='dense'
                endAdornment={
                    <InputAdornment position="end">
                        {loading ?
                            (
                                <ClipLoader color='#ff0000' size={15} />
                            )
                            :
                            (search &&
                                <IconButton
                                    aria-label='clear'
                                    onClick={handleClear}
                                >
                                    <CloseIcon />
                                </IconButton>
                            )
                        }
                    </InputAdornment>
                }
                startAdornment={
                    <InputAdornment position="start" sx={{mr:0.7}}>
                        {fullSearch ?
                            <IconButton
                                aria-label='back'
                                onClick={handleBack}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            :
                            <SearchIcon />
                        }
                    </InputAdornment>
                }
                sx={{
                    // width: '100%',
                    width: { xs: '100%', md: 500 },
                    '&.MuiTextField-root': {
                        marginTop: 1
                    }
                }}
            />
            
            <Fade in={showResults && (nfts.length > 0 || collections.length > 0)}>
                <Paper 
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        maxHeight: 400,
                        overflow: 'auto',
                        zIndex: 1300,
                        display: showResults && (nfts.length > 0 || collections.length > 0) ? 'block' : 'none',
                        borderRadius: 2
                    }}
                >
                    {collections.length > 0 && (
                        <Box>
                            <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Collections ({collections.length})
                                </Typography>
                            </Box>
                            <List dense sx={{ py: 0 }}>
                                {collections.slice(0, 5).map((collection, index) => (
                                    <ListItem 
                                        key={index} 
                                        button 
                                        onClick={() => handleResultClick(collection, 'collection')}
                                        sx={{ 
                                            '&:hover': { bgcolor: 'action.hover' },
                                            py: 1
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <CollectionsIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography variant="body2" noWrap>
                                                    {collection.name || 'Unnamed Collection'}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {collection.description || `${collection.itemCount || 0} items`}
                                                </Typography>
                                            }
                                        />
                                        {collection.verified && (
                                            <Chip label="Verified" size="small" color="primary" variant="outlined" />
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    
                    {collections.length > 0 && nfts.length > 0 && <Divider />}
                    
                    {nfts.length > 0 && (
                        <Box>
                            <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    NFTs ({nfts.length})
                                </Typography>
                            </Box>
                            <List dense sx={{ py: 0 }}>
                                {nfts.slice(0, 10).map((nft, index) => (
                                    <ListItem 
                                        key={index} 
                                        button 
                                        onClick={() => handleResultClick(nft, 'nft')}
                                        sx={{ 
                                            '&:hover': { bgcolor: 'action.hover' },
                                            py: 1
                                        }}
                                    >
                                        <ListItemAvatar>
                                            {nft.image ? (
                                                <Avatar src={nft.image} variant="rounded">
                                                    <ImageIcon />
                                                </Avatar>
                                            ) : (
                                                <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main' }}>
                                                    <ImageIcon />
                                                </Avatar>
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography variant="body2" noWrap>
                                                    {nft.name || `NFT #${nft.tokenId || index}`}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="caption" color="text.secondary" noWrap>
                                                        {nft.collection || 'Unknown Collection'}
                                                    </Typography>
                                                    {nft.price && (
                                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                            {nft.price} XRP
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    
                    {(collections.length > 5 || nfts.length > 10) && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Showing {Math.min(collections.length, 5) + Math.min(nfts.length, 10)} of {collections.length + nfts.length} results
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Fade>
            
            {showResults && nfts.length === 0 && collections.length === 0 && !loading && search && (
                <Paper 
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        p: 3,
                        zIndex: 1300,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No results found for "{search}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Try searching with different keywords
                    </Typography>
                </Paper>
            )}
            </Box>
        </ClickAwayListener>
    );
}
