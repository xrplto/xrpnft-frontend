import axios from 'axios';
import * as React from 'react';
import { useState, useEffect } from 'react';

// Material
import {
    Avatar,
    Autocomplete,
    CardMedia,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
    Box,
    Divider,
    Fade,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CasinoIcon from '@mui/icons-material/Casino';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnimationIcon from '@mui/icons-material/Animation';
import VerifiedIcon from '@mui/icons-material/Verified';

// Loader
import { getNftCoverUrl } from 'src/utils/parse';
import useDebounce from 'src/hooks/useDebounce';

// Utils
import { getHashIcon } from 'src/utils/parse';

import { useTheme, alpha } from '@mui/material/styles';

// Add this helper function at the top of the file, outside of any component
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toFixed(2);
    }
};

const RenderOption = ({
    uuid,
    meta,
    files,
    option_type,
    NFTokenID,
    logoImage,
    logo,
    account,
    name,
    verified,
    type,
    slug,
    floor,
    totalVolume
 }) => {

    const [hLink, setHLink] = useState('')
    const [isVideo, setIsVideo] = useState(false)
    const [imgUrl, setImgUrl] = useState('')

    const initOption = (option_type) => {
        switch (option_type) {
            case 'NFTS':
                const imgUrl = getNftCoverUrl({files}, 'small');
                setImgUrl(imgUrl)
                //setIsVideo(meta?.video ? true : false)
                setHLink(`/nft/${NFTokenID}`)
                break;
            case 'COLLECTIONS':
                logoImage &&
                    setImgUrl(`https://s1.xrpnft.com/collection/${logoImage}`)
                setHLink(`/collection/${slug}`)
                break;
            case 'ACCOUNTS':
                const imgurl = logo ? ` https://s1.xrpnft.com/profile/${logo}` : getHashIcon(account);
                setImgUrl(imgurl)
                setHLink(`/account/${account}`)
                break;
            default:
                setHLink(`/`)
                break;
        }
    }

    useEffect(() => {
        initOption(option_type)
    }, [uuid])


    return (
        <Fade in={true} timeout={500}>
            <Link
                color="inherit"
                underline='none'
                href={hLink}
            >
                <MenuItem sx={{ 
                    pt: 0.75,
                    pb: 0.75,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    }
                }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" width="100%">
                        <Avatar
                            alt={name || 'Item'}
                            variant={option_type === "NFTS" ? "rounded" : logo ? "circular" : "square"}
                            sx={{
                                backgroundColor: 'transparent',
                                borderRadius: option_type === "NFTS" ? '6px' : undefined,
                                overflow: 'hidden',
                                width: 36,
                                height: 36,
                                boxShadow: 1,
                            }}
                        >
                            <CardMedia
                                component={isVideo ? "video" : 'img'}
                                src={imgUrl}
                                alt={name || 'Item'}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: option_type === "NFTS" ? '6px' : undefined,
                                }}
                            />
                        </Avatar>
                        <Stack direction="column" spacing={0} flexGrow={1}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">{name ?? ''}</Typography>
                                {
                                    option_type === 'COLLECTIONS' && <>
                                        {verified === 'yes' &&
                                            <Tooltip title='Verified'>
                                                <VerifiedIcon fontSize="small" style={{color: "#4589ff", fontSize: '0.9rem'}} />
                                            </Tooltip>
                                        }
                                        {type === "random" &&
                                            <Tooltip title="Random Collection">
                                                <CasinoIcon color='info' style={{fontSize: '0.9rem'}} />
                                            </Tooltip>
                                        }
                                        {type === "sequence" &&
                                            <Tooltip title="Sequence Collection">
                                                <AnimationIcon color='info' style={{fontSize: '0.9rem'}} />
                                            </Tooltip>
                                        }
                                    </>
                                }
                            </Stack>
                            {
                                option_type === 'COLLECTIONS' &&
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    {floor && <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Floor: <span style={{color: 'inherit', fontWeight: 'bold'}}>{floor.amount} {floor.currency}</span></Typography>}
                                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Volume: <span style={{color: 'inherit', fontWeight: 'bold'}}>{formatNumber(totalVolume)} XRP</span></Typography>
                                </Stack>
                            }
                            {
                                option_type === 'ACCOUNTS' &&
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>{account}</Typography>
                            }
                        </Stack>
                    </Stack>
                </MenuItem>
            </Link>
        </Fade>
    )
}

const getOptionLabel = (option) => {
    if (option.option_type === "NFTS") {
        return option.meta?.name ?? '';
    } else if (option.option_type === "COLLECTIONS") {
        return option.name ?? '';
    } else if (option.option_type === "ACCOUNTS") {
        return (option.name || option.account) ?? '';
    } else return ''
}

export default function NavSearchBar({ id, placeholder, type, fullSearch, setFullSearch }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const [open, setOpen] = useState(fullSearch);
    const [options, setOptions] = useState([]);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000)

    const [loading, setLoading] = useState(false);

    const getData = (search) => {
        setLoading(true);
        const body = {};
        body.search = search;
        body.type = type;
        axios.post(`${BASE_URL}/search`, body).then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    const newOptions = [];

                    // Sort collections to prioritize verified ones
                    const sortedCollections = ret.collections.sort((a, b) => {
                        if (a.verified === 'yes' && b.verified !== 'yes') return -1;
                        if (a.verified !== 'yes' && b.verified === 'yes') return 1;
                        return 0;
                    });

                    // Add NFTs (up to 5)
                    for (const nft of ret.nfts.slice(0, 5)) {
                        nft.option_type = "NFTS";
                        newOptions.push(nft);
                    }

                    // Add sorted collections (up to 5)
                    for (const collection of sortedCollections.slice(0, 5)) {
                        collection.option_type = "COLLECTIONS";
                        newOptions.push(collection);
                    }

                    // Add accounts (up to 5)
                    for (const account of ret.accounts.slice(0, 5)) {
                        account.option_type = "ACCOUNTS";
                        newOptions.push(account);
                    }

                    setOptions(newOptions);
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(err => {
            console.log("err->>", err);
        }).then(function () {
            setLoading(false);
        });
    }

    useEffect(() => {
        getData(debouncedSearch);
    }, [debouncedSearch]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClear = (e) => {
        setSearch('');
        // setNfts([]);
        // setCollections([]);
    }

    const handleBack = (e) => {
        setFullSearch(false);
        setSearch('');
        // setNfts([]);
        // setCollections([]);
    }

    const theme = useTheme();

    return (
        <Autocomplete
            freeSolo
            disableClearable
            selectOnFocus
            disablePortal
            // size="small"
            // clearOnBlur
            // handleHomeEndKeys
            id={id}
            sx={{
                width: '100%',
                '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        borderWidth: 2,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                    },
                },
                '&.MuiTextField-root': {
                    marginTop: 1
                }
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            // isOptionEqualToValue={(option, value) => option.title === value.title}
            groupBy={(option) => option.option_type}
            getOptionLabel={(option) => getOptionLabel(option)}
            options={options}
            renderOption={(props, option) => <RenderOption {...option} />}
            loading={loading}
            renderGroup={(params) => (
                <Box key={params.key}>
                    <Divider textAlign="left" sx={{ my: 0.75 }}>
                        <Typography variant="overline" color="primary" fontWeight="bold" fontSize="0.6rem">
                            {params.group}
                        </Typography>
                    </Divider>
                    {params.children}
                </Box>
            )}
            noOptionsText={
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        No results found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your search or filter to find what you're looking for.
                    </Typography>
                </Box>
            }
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        autoComplete='new-password'
                        // margin='dense'
                        value={search}
                        onChange={handleSearch}
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: 'off',
                            type: 'search',
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                    {fullSearch ?
                                        <IconButton
                                            aria-label='back'
                                            onClick={handleBack}
                                            sx={{ 
                                                color: theme.palette.primary.main,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                }
                                            }}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                        :
                                        <SearchIcon sx={{ color: theme.palette.primary.main }} />
                                    }
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {params.InputProps.endAdornment}
                                    {loading && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                            <CircularProgress size={20} color="primary" />
                                        </Box>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                )
            }}
        />
    );
}