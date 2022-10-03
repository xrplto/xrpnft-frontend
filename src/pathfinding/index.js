import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import Decimal from 'decimal.js';
import { utils } from "xrpl-txdata";

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
    Tooltip,
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

// Loader
import { FallingLines, Comment } from 'react-loader-spinner';

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

export default function PathFinding() {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const API_XRPL_TO_URL = 'https://api.xrpl.to/api';
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const user_token = accountProfile?.user_token;

    const [destAccount, setDestAccount] = useState('rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ');
    const [sourceAccount, setSourceAccount] = useState('rpePPeRpC89vpCY3CDzhzMCs78nPoNnAKm');

    const [token, setToken] = useState(XRP_TOKEN);
    const [amount, setAmount] = useState('');

    const [displayResult, setDisplayResult] = useState(false);

    const [loading, setLoading] = useState(false);

    const [paths, setPaths] = useState(false);

    let canFindPath = destAccount && sourceAccount && token && amount;

    // https://github.com/XRPL-Labs/XUMM-Issue-Tracker/issues/392

    const onFindPath = async () => {
        let value = 0;
        try {
            value = new Decimal(amount).toNumber();
        } catch (e) {
        }

        if (value <= 0) {
            openSnackbar('Invalid Amount', 'error');
            return;
        }
        
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

        /*
        {
            "command": "ripple_path_find",
            "subcommand": "create",
            "source_account": "rpePPeRpC89vpCY3CDzhzMCs78nPoNnAKm",
            "destination_account": "rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ",
            "destination_amount": "1000000"
        }
        */


        setLoading(true);
        setDisplayResult(false);
        try {
            let res;
            const data = {};
            data.source_account = sourceAccount;
            data.destination_account = destAccount;
            if (token.currency === 'XRP') {
                data.destination_amount = new Decimal(amount).mul(1000000).toString();
            } else {
                data.destination_amount = {
                    value: value.toString(),
                    currency: token.currency,
                    issuer: token.issuer
                }
            }

            res = await axios.post(`${API_XRPL_TO_URL}/extra/ripplepathfind`, data);

            if (res.status === 200) {
                const ret = res.data?.paths;
                console.log(ret);

                if (ret) {
                    if (ret.error && ret.error_message) {
                        openSnackbar(ret.error_message, 'error')
                    } else {
                        const newPaths = ret.alternatives || [];
                        
                        setPaths(newPaths);
                        console.log(newPaths);
                        /*
                        [
                            {
                                "paths_canonical": [],
                                "paths_computed": [
                                    [
                                        {
                                            "account": "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D",
                                            "type": 1
                                        },
                                        {
                                            "currency": "XRP",
                                            "type": 16
                                        }
                                    ]
                                ],
                                "source_amount": {
                                    "currency": "434F524500000000000000000000000000000000",
                                    "issuer": "rpePPeRpC89vpCY3CDzhzMCs78nPoNnAKm",
                                    "value": "2.573936320815423"
                                }
                            },
                            {
                                "paths_canonical": [],
                                "paths_computed": [
                                    [
                                        {
                                            "account": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
                                            "type": 1
                                        },
                                        {
                                            "currency": "XRP",
                                            "type": 16
                                        }
                                    ]
                                ],
                                "source_amount": {
                                    "currency": "534F4C4F00000000000000000000000000000000",
                                    "issuer": "rpePPeRpC89vpCY3CDzhzMCs78nPoNnAKm",
                                    "value": "3.499422652996957"
                                }
                            }
                        ]
                        */
                    }
                } else {
                    openSnackbar("Error on path finding 1", 'error')
                }
                // openSnackbar('Path finding successful!', 'success')
                // window.location.href = `/assets/${uuid_nft}`;
            } else {
                openSnackbar("Error on path finding 2", 'error')
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        setDisplayResult(true);
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
                    Unique address of the account that would receive funds in a transaction. (rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ)
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
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Source Account <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    Unique address of the account that would send funds in a transaction. (rpePPeRpC89vpCY3CDzhzMCs78nPoNnAKm)
                </Typography>
                

                <TextField required placeholder='Source' margin='dense'
                    onChange={(e) => {
                        setSourceAccount(e.target.value)
                    }}
                    value={sourceAccount}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                />
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Currency <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='s2'>In our case, we will receive this amount to sell Mints(the same as cost per Mint). But these are defined by the collection creator.</Typography>

                <Stack direction="row" alignItems="center">
                    <Typography variant='p3'>
                        Currency that the destination account would receive in a transaction. 
                    </Typography>

                    {token && token.currency !== 'XRP' &&
                        <Link
                            underline="none"
                            color="inherit"
                            target="_blank"
                            href={`https://bithomp.com/explorer/${token.issuer}`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Tooltip title="Check on Bithomp">
                                <IconButton edge="end" aria-label="bithomp">
                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    }
                </Stack>

                <QueryToken
                    token={token}
                    setToken={setToken}
                />
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p2'>Amount <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    Amount that the destination account would receive in a transaction. 
                </Typography>

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

            <Stack spacing={2} mb={3}>
                <Typography variant='p2'>Paths Found</Typography>

                {displayResult && (
                        paths.length>0?(
                            <Typography variant='p3'>
                                You should pay one of the following amount of assets in your wallet to deliver <Typography variant='s3' color='error'>{amount} {token.name}</Typography> worth to the destination account &nbsp;
                                <Link
                                    underline="always"
                                    color="#33C2FF"
                                    target="_blank"
                                    href={`https://bithomp.com/explorer/${destAccount}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    {destAccount}
                                </Link>
                            </Typography>
                        ):(
                            <Typography variant='p3'>
                                You don't have enough amount of assets to deliver <Typography variant='s3' color='error'>{amount} {token.name}</Typography> worth to the destination account  &nbsp;
                                <Link
                                    underline="always"
                                    color="#33C2FF"
                                    target="_blank"
                                    href={`https://bithomp.com/explorer/${destAccount}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    {destAccount}
                                </Link>
                            </Typography>
                        )
                    )
                }

                {loading?(
                    <Stack alignItems="center">
                        <Comment
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="comment-loading"
                            wrapperStyle={{}}
                            wrapperClass="comment-wrapper"
                            color="#fff"
                            backgroundColor="#F4442E"
                        />
                        <Typography variant='d4'>Finding ...</Typography>
                    </Stack>
                ):(
                    paths.length>0?
                        (
                            paths.map((path, idx) => (
                                <Stack direction="row" spacing={1} alignItems="center" key={idx}>
                                    <Stack direction="row" spacing={1}>
                                        <Typography variant='d4'>{idx+1}. </Typography>
                                        {/* <Typography variant='d4'>{path.paths_computed?.[0]?.[0]?.account}</Typography> */}
                                        <Typography variant='d4'>{typeof path.source_amount === "string"
                                            ? "XRP"
                                            : utils.currencyCodeFormat(path.source_amount.currency)}
                                        </Typography>
                                    </Stack>

                                    <Typography variant='d4' color="error">{typeof path.source_amount === "string"
                                        ? path.source_amount
                                        : path.source_amount.value}
                                    </Typography>
                                </Stack>
                            ))
                        ):(
                            <Stack alignItems="center">
                                <Comment
                                    visible={true}
                                    height="80"
                                    width="80"
                                    ariaLabel="comment-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="comment-wrapper"
                                    color="#fff"
                                    backgroundColor="#F4442E"
                                />
                                <Typography variant='d4'>No Paths</Typography>
                            </Stack>
                        )
                )}
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
                    sx={{ mt: 2, mb: 6 }}
                >
                    Find Path
                </LoadingButton>
            </Stack>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </Stack>
    );
}
