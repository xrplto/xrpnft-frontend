import axios from 'axios';
import * as React from 'react';
import { useState, useEffect } from 'react';

// Material
import {
    Avatar,
    Autocomplete,
    CardMedia,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CasinoIcon from '@mui/icons-material/Casino';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnimationIcon from '@mui/icons-material/Animation';
import VerifiedIcon from '@mui/icons-material/Verified';

// Loader
import { ClipLoader } from "react-spinners";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export default function NavSearchBar({ id, placeholder, type, fullSearch, setFullSearch}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    
    const [search, setSearch] = useState('');

    const [nfts, setNfts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(false);

    const getData = (search) => {

        // type = SEARCH_ITEM_COLLECTION_ACCOUNT
        // type = SEARCH_ITEM_NAME_OR_ATTRIBUTE

        // if (!search) return;
  
        setLoading(true);
        const body = {};
        body.search = search;
        body.type = type;
        // https://api.xrpnft.com/api/search
        axios.post(`${BASE_URL}/search`, body).then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    const newOptions = [];
                    for (var nft of ret.nfts) {
                        nft.option_type = "NFTS";
                        newOptions.push(nft);
                    }
                    for (var collection of ret.collections) {
                        collection.option_type = "COLLECTIONS";
                        newOptions.push(collection);
                    }
                    for (var account of ret.accounts) {
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
    }

    const handleBack = (e) => {
        setFullSearch(false);
        setSearch('');
        setNfts([]);
        setCollections([]);
    }

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
                // width: '100%',
                // zIndex: 10001,
                width: { xs: '100%', md: 500 },
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
            getOptionLabel={(option) => {
                if (option.option_type === "NFTS") {
                    return option.meta.name;
                } else if (option.option_type === "COLLECTIONS") {
                    return option.name;
                } else if (option.option_type === "ACCOUNTS") {
                    return option.name || option.account;
                }
            }}
            options={options}
            renderOption={(props, option) => {
                if (option.option_type === "NFTS") {
                    const {
                        uuid,
                        name,
                        meta,
                        collection,
                        NFTokenID
                    } = option;

                    const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
                    const isVideo = meta.video;
                    return (
                        <Link
                            key={uuid}
                            color="inherit"
                            // target="_blank"
                            underline='none'
                            href={`/assets/${uuid}`}
                            // rel="noreferrer noopener nofollow"
                        >
                            <MenuItem sx={{pt:1, pb:1}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {isVideo ?
                                        <Avatar alt="nft">
                                            <CardMedia
                                                component="video"
                                                image={imgUrl}
                                                title='title'
                                                controls
                                                style={{
                                                    width: 96,
                                                    height: 96,
                                                    filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                }}
                                            />
                                        </Avatar>
                                        :
                                        <Avatar alt="nft" src={imgUrl} />
                                    }
                                    <Typography variant="s5">{name}</Typography>
                                </Stack>
                            </MenuItem>
                        </Link>
                    );
                } else if (option.option_type === "COLLECTIONS") {
                    const {
                        uuid,
                        name,
                        slug,
                        items,
                        type,
                        logoImage,
                        verified
                    } = option;

                    const imgUrl = `https://s1.xrpnft.com/collection/${logoImage}`;
                    return (
                        <Link
                            key={uuid}
                            color="inherit"
                            // target="_blank"
                            underline='none'
                            href={`/collection/${slug}`}
                            // rel="noreferrer noopener nofollow"
                        >
                            <MenuItem sx={{pt:1, pb:1}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar alt="nft" src={imgUrl} />
                                    <Stack>
                                        <Stack direction="row" spacing={1}>
                                            <Typography variant="s5">{name}</Typography>
                                            {verified === 'yes' &&
                                                <Tooltip title='Verified'>
                                                    <VerifiedIcon fontSize="small" color="success" />
                                                </Tooltip>
                                            }
                                            {type === "random" &&
                                                <Tooltip title="Random Collection">
                                                    <CasinoIcon color='info' fontSize="small"/>
                                                </Tooltip>
                                            }
                                            {type === "sequence" &&
                                                <Tooltip title="Sequence Collection">
                                                    <AnimationIcon color='info' fontSize="small"/>
                                                </Tooltip>
                                            }
                                        </Stack>
                                        <Typography variant="s7">{items} items</Typography>
                                    </Stack>
                                </Stack>
                            </MenuItem>
                        </Link>
                    );
                } else if (option.option_type === "ACCOUNTS") {
                    const {
                        account,
                        name,
                        logo,
                        banner,
                        description,
                        minterWallet,
                        timestamp
                    } = option;
                    const logoImage = logo?`https://s1.xrpnft.com/profile/${logo}`:'/static/account_logo.png';
                    return (
                        <Link
                            key={account}
                            color="inherit"
                            // target="_blank"
                            underline='none'
                            href={`/account/${account}`}
                            // rel="noreferrer noopener nofollow"
                        >
                            <MenuItem sx={{pt:1, pb:1}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar alt="nft" src={logoImage} />
                                    <Stack>
                                        <Typography variant="s5">{name||''}</Typography>
                                        <Typography variant="s7">{account}</Typography>
                                    </Stack>
                                </Stack>
                            </MenuItem>
                        </Link>
                    );
                }
            }}
            loading={loading}
            renderInput={(params) => {
                // console.log(params);
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
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
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

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];
