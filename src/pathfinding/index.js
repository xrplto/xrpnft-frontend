import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import Decimal from 'decimal.js';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, TOKEN_FLAGS, CATEGORIES, XRP_TOKEN } from 'src/utils/constants';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import QueryToken from './QueryToken';

const CardWrapper = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`
);

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: black;
    inset: 0;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.5s;
    &:hover {
        opacity: 0.6;
    }
`
);

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border: 'none'
    }
}));

export default function Minting() {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const user_token = accountProfile?.user_token;

    const [destAccount, setDestAccount] = useState('');
    const [sourceAccount, setSourceAccount] = useState('');

    const [token, setToken] = useState(XRP_TOKEN);
    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(false);

    let canFindPath = destAccount && sourceAccount && token && amount;

    // https://github.com/XRPL-Labs/XUMM-Issue-Tracker/issues/392

    const onFindPath = async () => {
        // {
        //     "id": 8,
        //     "command": "ripple_path_find",
        //     "source_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        //     "source_currencies": [
        //         {
        //             "currency": "XRP"
        //         },
        //         {
        //             "currency": "USD"
        //         }
        //     ],
        //     "destination_account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        //     "destination_amount": {
        //         "value": "0.001",
        //         "currency": "USD",
        //         "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
        //     }
        // }

        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        try {
            let res;
            const data = {};
            data.name = nftName;
            data.external_link = extLink;
            data.description = description;
            data.collection = collectionName;
            data.category = category;
            data.royalty = royalty;
            data.explicit = explicit;
            data.flag = flag;
            if (properties && properties.length > 0)
                data.properties = properties;

            const formdata = new FormData();
            formdata.append('nft', file);
            formdata.append('account', account);
            formdata.append('user_token', user_token);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/account/mintone`, formdata, {
                headers: { "Content-Type": "multipart/form-data", 'x-access-token': accountToken }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const uuid_nft = ret.uuid_nft;
                    const uuid = ret.uuid;
                    const qrlink = ret.qrUrl;
                    const nextlink = ret.next;

                    // openSnackbar('Path finding successful!', 'success')
                    // window.location.href = `/assets/${uuid_nft}`;
                } else {
                    // { status: false, data: null, err: 'ERR_URL_SLUG' }
                    const err = ret.err;
                    openSnackbar(err, 'error')
                }
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // const handleChangeCategory = (event) => {
    //     const value = event.target.value;
    //     setCategory(value);
    // }

    const handleChangeAmount = (e) => {
        const value = e.target.value;
        const newAmount = value?value.replace(/[^0-9.]/g, ""):'';
        setAmount(newAmount);
    }

    return (
        <Stack sx={{mt:5, minHeight: '50vh'}}>
            <Stack spacing={1} sx={{mb:3}}>
                <Typography variant="h1a" >Path Finding</Typography>
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Destination Account <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    Unique address of the account that would receive funds in a transaction.
                </Typography>
                

                <TextField required placeholder='Destination' margin='dense'
                    onChange={(e) => {
                        setDestAccount(e.target.value)
                    }}
                    value={destAccount}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                />

                <QueryToken
                    token={token}
                    setToken={setToken}
                />
            </Stack>

            <Stack spacing={2} sx={{mt: 3}}>
                <Typography variant='p2'>Amount <Typography variant='s2'>*</Typography></Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        id='id_txt_amount'
                        // autoFocus
                        variant='outlined'
                        placeholder=''
                        onChange={handleChangeAmount}
                        autoComplete='new-password'
                        value={amount}
                        onFocus={event => {
                            event.target.select();
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        // sx={{width: 100}}
                    />
                    <Typography variant='p2'>{token?.name}</Typography>
                </Stack>
            </Stack>


            {/* <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Category</Typography>
                <Typography variant='p3'>
                </Typography>
                <CustomSelect
                    id='select_category'
                    value={category}
                    onChange={handleChangeCategory}
                    MenuProps={{ disableScrollLock: true }}
                >
                    {CATEGORIES.map((cat, idx) => (
                        <MenuItem
                            key={idx}
                            value={cat.title}
                            sx={{pt:2, pb:2}}
                        >
                            <Stack direction='row' spacing={1} alignItems="center">
                                {cat.icon}
                                <Typography variant='d4'>{cat.title}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </CustomSelect>
            </Stack> */}

            <Stack alignItems='right'>
                <LoadingButton
                    disabled={!canFindPath}
                    variant='contained'
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<SendIcon />}
                    onClick={onFindPath}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Find Path
                </LoadingButton>
            </Stack>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </Stack>
    );
}
