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
    CircularProgress,
    Chip,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CasinoIcon from '@mui/icons-material/Casino';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
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
    if (num === undefined || num === null) {
        return 'N/A';
    }
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
                    py: 0.375,
                    px: 1.25,
                    borderRadius: 0,
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    },
                    '&:last-child': {
                        borderBottom: 'none'
                    }
                }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" width="100%">
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                alt={name || 'Item'}
                                variant={option_type === "NFTS" ? "rounded" : "circular"}
                                sx={{
                                    backgroundColor: 'grey.100',
                                    borderRadius: option_type === "NFTS" ? '8px' : '50%',
                                    overflow: 'hidden',
                                    width: 32,
                                    height: 32,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    border: '2px solid',
                                    borderColor: 'background.paper',
                                    transition: 'all 0.2s ease',
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
                                        borderRadius: option_type === "NFTS" ? '9px' : '50%',
                                    }}
                                />
                            </Avatar>
                            {option_type === 'COLLECTIONS' && verified === 'yes' && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -1,
                                    right: -1,
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    <VerifiedIcon sx={{ fontSize: 10, color: 'white' }} />
                                </Box>
                            )}
                        </Box>
                        <Stack direction="column" spacing={0.125} flexGrow={1} sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" width="100%">
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 1, minWidth: 0 }}>
                                    <Typography 
                                        variant="body2" 
                                        fontWeight={600} 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontSize: '0.85rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {name ?? ''}
                                    </Typography>
                                    {
                                        option_type === 'COLLECTIONS' && <>
                                            {type === "random" &&
                                                <Chip 
                                                    label="Launch" 
                                                    size="small" 
                                                    color="warning"
                                                    variant="filled"
                                                    icon={<RocketLaunchOutlinedIcon />}
                                                    sx={{ 
                                                        height: 18, 
                                                        fontSize: '0.6rem',
                                                        fontWeight: 500,
                                                        '& .MuiChip-icon': {
                                                            fontSize: '0.7rem'
                                                        }
                                                    }}
                                                />
                                            }
                                            {type === "sequence" &&
                                                <Chip 
                                                    label="Sequence" 
                                                    size="small" 
                                                    color="info" 
                                                    variant="filled"
                                                    icon={<AnimationIcon />}
                                                    sx={{ 
                                                        height: 18, 
                                                        fontSize: '0.6rem',
                                                        fontWeight: 500,
                                                        '& .MuiChip-icon': {
                                                            fontSize: '0.7rem'
                                                        }
                                                    }}
                                                />
                                            }
                                        </>
                                    }
                                </Stack>
                                {
                                    option_type === 'COLLECTIONS' &&
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexShrink: 0 }}>
                                        {floor && (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'primary.main', 
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    ✕{floor.amount}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'text.secondary',
                                                        fontSize: '0.6rem',
                                                        fontWeight: 400,
                                                        whiteSpace: 'nowrap',
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    Floor
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: 'success.main', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    lineHeight: 1
                                                }}
                                            >
                                                ✕{formatNumber(totalVolume)}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    fontSize: '0.6rem',
                                                    fontWeight: 400,
                                                    whiteSpace: 'nowrap',
                                                    lineHeight: 1
                                                }}
                                            >
                                                Volume
                                            </Typography>
                                        </Box>
                                    </Stack>
                                }
                            </Stack>
                            {
                                option_type === 'ACCOUNTS' &&
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: 'text.primary', 
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace',
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px'
                                    }}
                                >
                                    {account}
                                </Typography>
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

                    // Sort collections by volume (highest to lowest), then by verified status
                    const sortedCollections = ret.collections.sort((a, b) => {
                        // First sort by volume (highest to lowest)
                        const volumeA = a.totalVolume || 0;
                        const volumeB = b.totalVolume || 0;
                        if (volumeA !== volumeB) {
                            return volumeB - volumeA;
                        }
                        // If volumes are equal, prioritize verified collections
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
                '& .MuiAutocomplete-paper': {
                    borderRadius: 1,
                    boxShadow: '0 12px 48px 0 rgba(0,0,0,0.15)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 0.5,
                    overflow: 'visible'
                },
                '& .MuiAutocomplete-listbox': {
                    padding: 0,
                    maxHeight: 'none',
                    overflow: 'visible'
                },
                '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
                    paddingTop: 0.125,
                    paddingBottom: 0.125,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 1,
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        borderWidth: 1.5,
                    },
                    '&:hover fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
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
                    <Box sx={{ 
                        px: 1.75, 
                        py: 0.5, 
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                    }}>
                        <Typography 
                            variant="overline" 
                            sx={{
                                color: 'primary.main',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                letterSpacing: 1
                            }}
                        >
{params.group === 'NFTS' ? 'NFTs' : params.group === 'COLLECTIONS' ? 'Collections' : 'Accounts'}
                        </Typography>
                    </Box>
                    {params.children}
                </Box>
            )}
            noOptionsText={
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '50%',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                    }}>
                        <SearchIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 600 }}>
                        No results found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try different keywords or check your spelling
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
