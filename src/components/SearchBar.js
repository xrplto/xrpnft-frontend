import axios from 'axios';
import { useState, useEffect } from 'react';

// Material
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    OutlinedInput
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// Loader
import { ClipLoader } from "react-spinners";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

export default function SearchBar({ type, ...props }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [search, setSearch] = useState('');

    const [nfts, setNfts] = useState([]);
    const [collections, setCollections] = useState([]);

    const [loading, setLoading] = useState(false);

    const getData = (search) => {

        // type = SEARCH_ITEM_COLLECTION_ACCOUNT
        // type = SEARCH_ITEM_NAME_OR_ATTRIBUTE
  
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

    return (
        <OutlinedInput
            {...props}
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
                        (
                            <>
                                {search &&
                                    <IconButton
                                        aria-label='clear'
                                        onClick={handleClear}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
                            </>
                        )
                    }
                </InputAdornment>
            }
            startAdornment={
                <InputAdornment position="start" sx={{mr:0.7}}>
                    <SearchIcon />
                </InputAdornment>
            }
            sx={{
                // width: '75%',
                width: { sm: 200, md: 500 },
                '&.MuiTextField-root': {
                    marginTop: 1
                }
            }}
        />
    );
}
