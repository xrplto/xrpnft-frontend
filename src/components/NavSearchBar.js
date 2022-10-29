import axios from 'axios';
import * as React from 'react';
import { useState, useEffect } from 'react';

// Material
import {
    Autocomplete,
    CircularProgress,
    IconButton,
    InputAdornment,
    OutlinedInput,
    TextField,
    Typography
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    const [options, setOptions] = useState(topFilms);
    
    const [search, setSearch] = useState('');

    const [nfts, setNfts] = useState([]);
    const [collections, setCollections] = useState([]);

    const [loading, setLoading] = useState(false);

    const getData = (search) => {

        // type = SEARCH_ITEM_COLLECTION_ACCOUNT
        // type = SEARCH_ITEM_NAME_OR_ATTRIBUTE

        if (!search) return;
  
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
                    setNfts(ret.nfts);
                    setCollections(ret.collections);
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
            id={id}
            sx={{
                // width: '100%',
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
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    autoComplete='new-password'
                    margin='dense'
                    value={search}
                    onChange={handleSearch}
                    InputProps={{
                        ...params.InputProps,
                        autoComplete: 'off',
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
                                {params.InputProps.endAdornment}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
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
