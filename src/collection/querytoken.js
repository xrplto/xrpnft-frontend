import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { ClipLoader } from "react-spinners";

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FacebookIcon from '@mui/icons-material/Facebook';
import CancelIcon from '@mui/icons-material/Cancel';

// Iconify
import { Icon } from '@iconify/react';
import arrowsExchange from '@iconify/icons-gg/arrows-exchange';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN, TOKEN_FLAGS } from 'src/utils/constants';
import { fNumber } from 'src/utils/formatNumber';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import LoadingTextField from 'src/components/LoadingTextField';

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

const CardWrapperCircle = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 50%;
    padding: 5px;
    width: fit-content;
    overflow: hidden;
    &:hover {
        cursor: pointer;
    }
`
);

const CardWrapper3 = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    // width: fit-content;
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

const CardOverlayCircle = styled('div')(
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

const DisabledButton = withStyles({
    root: {
        "&.Mui-disabled": {
            pointerEvents: "unset", // allow :hover styles to be triggered
            cursor: "not-allowed", // and custom cursor can be defined without :hover state
        }
    }
})(Button);

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border_left: 'none'
    }
}));

export default function QueryToken({cost, setCost, token, setToken}) {
    const API_XRPL_TO_URL = 'https://api.xrpl.to/api';

    const [loading, setLoading] = useState(false);

    const [tokens, setTokens] = useState([]);
    const [filter, setFilter] = useState('');
    const [select, setSelect] = useState('');

    const loadTokens = () => {
        setLoading(true);
        // https://api.xrpl.to/api/simple/tokens?filter=
        axios.get(`${API_XRPL_TO_URL}/simple/tokens?filter=${filter}`)
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    if (ret.tokens.length > 0)
                        setTokens(ret.tokens);
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
    };

    useEffect(() => {
        loadTokens();
    }, [filter]);

    const handleChangeToken = (e) => {
        const value = e.target.value;
        setSelect(value);

        let newToken = null;
        for (var t of tokens) {
            if (t.md5 === value) {
                newToken = t;
                break;
            }
        }
        setToken(newToken);
    };

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleChangeCost = (e) => {
        const value = e.target.value;
        const newCost = value?value.replace(/[^0-9.]/g, ""):'';
        setCost(newCost);
    }
    
    return (
        <Stack spacing={2}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center">
                    <Typography variant='p2'>Mint Currency <Typography variant='s2'>*</Typography></Typography>
                    {token &&
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

                <CustomSelect
                    id='select_token'
                    value={select}
                    onChange={handleChangeToken}
                    MenuProps={{ disableScrollLock: true }}
                    // renderValue={(idx) => (
                    //     <>
                    //     {(collections.length > 0 && idx > -1 && collections.length > idx) &&
                    //         <Stack direction='row' alignItems="center">
                    //             <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${collections[idx].logoImage}`} sx={{ mr:2, width: 32, height: 32 }} />
                    //             <Typography variant='d4'>{collections[idx].name}</Typography>
                    //         </Stack>
                    //     }
                    //     </>
                    // )}
                >
                    <TextField
                        id='textFilter'
                        // autoFocus
                        fullWidth
                        variant='standard'
                        placeholder='Filter'
                        margin='dense'
                        onChange={handleChangeFilter}
                        autoComplete='new-password'
                        inputProps={{autoComplete: 'off'}}
                        value={filter}
                        defaultValue={filter}
                        onFocus={event => {
                            event.target.select();
                        }}
                        sx={{
                            pl:2,pr:2,pb:2,pt:2.5
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    {loading && <ClipLoader color='#ff0000' size={15} /> }
                                </InputAdornment>
                            ),
                        }}
                    />
                    {tokens.map((token, idx) => (
                        <MenuItem
                            key={token.md5}
                            value={token.md5}
                            sx={{pt:1, pb:1}}
                        >
                            <Stack direction='row' alignItems="center">
                                <Avatar alt="C" src={`https://xrpl.to/static/tokens/${token.md5}.${token.ext}`} sx={{ mr: 2 }} />
                                <Stack spacing={0.5}>
                                    <Stack direction="row">
                                        <Typography variant='d4'>{token.name}</Typography>
                                        <Typography variant='d4' sx={{ml: 2}} noWrap><Icon icon={rippleSolid} width={12} height={12}/> {fNumber(token.exch)}</Typography>
                                    </Stack>
                                    <Stack direction="row">
                                        <Typography variant='p3'>{token.issuer}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </MenuItem>
                    ))}
                </CustomSelect>
            </Stack>

            {token &&
                <Stack spacing={2}>
                    <Typography variant='p2'>Cost per Spin <Typography variant='s2'>*</Typography></Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            id='id_txt_costperspin'
                            // autoFocus
                            variant='outlined'
                            placeholder=''
                            onChange={handleChangeCost}
                            autoComplete='new-password'
                            value={cost}
                            defaultValue={cost}
                            onFocus={event => {
                                event.target.select();
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                            // sx={{width: 100}}
                        />
                        <Typography variant='p2'>{token.name}</Typography>
                    </Stack>
                </Stack>
            }

        </Stack>
    );
}
