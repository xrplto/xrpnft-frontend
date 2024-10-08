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
    Typography
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

import { useTheme } from '@mui/material/styles';

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
    items,
    type,
    slug
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
        <Link
            color="inherit"
            underline='none'
            href={hLink}
        >
            <MenuItem sx={{ pt: 1, pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {
                        <Avatar
                            alt="X"
                            variant={option_type === "NFTS" ? "rounded" : logo ? "circular" : "square"}
                            sx={{
                                backgroundColor: '#00000000',
                                borderRadius: option_type === "NFTS" ? '8px' : undefined,
                                overflow: 'hidden', // Add this line to ensure the image respects the border radius
                            }}
                        >
                            <CardMedia
                                component={isVideo ? "video" : 'img'}
                                src={imgUrl}
                                alt='X'
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: option_type === "NFTS" ? '8px' : undefined,
                                }}
                            />
                        </Avatar>
                    }
                    <Typography variant="s5">{name ?? ''}</Typography>
                    {
                        option_type === 'COLLECTIONS' && <>
                            {verified === 'yes' &&
                                <Tooltip title='Verified'>
                                    <VerifiedIcon fontSize="small" style={{color: "#4589ff"}} />
                                </Tooltip>
                            }
                            {type === "random" &&
                                <Tooltip title="Random Collection">
                                    <CasinoIcon color='info' fontSize="small" />
                                </Tooltip>
                            }
                            {type === "sequence" &&
                                <Tooltip title="Sequence Collection">
                                    <AnimationIcon color='info' fontSize="small" />
                                </Tooltip>
                            }
                            <Typography variant="s7">{items} items</Typography>
                        </>
                    }
                    {
                        option_type === 'ACCOUNTS' &&
                        <Typography variant="s7">{account}</Typography>
                    }
                </Stack>
            </MenuItem>
        </Link>
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
                    for (const nft of ret.nfts.slice(0, 5)) {
                        nft.option_type = "NFTS";
                        newOptions.push(nft);
                    }
                    for (const collection of ret.collections.slice(0, 5)) {
                        collection.option_type = "COLLECTIONS";
                        newOptions.push(collection);
                    }
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
                    '& fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.dark,
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
                                            sx={{ color: theme.palette.primary.main }}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                        :
                                        <SearchIcon sx={{ color: theme.palette.primary.main }} />
                                    }
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end"
                                // onClick={handleClear}
                                >
                                    {params.InputProps.endAdornment}
                                    {/* {loading &&
                                        <ClipLoader color='#ff0000' size={15} />
                                    } */}
                                </InputAdornment>
                            ),
                        }}
                    />
                )
            }}
        />
    );
}
