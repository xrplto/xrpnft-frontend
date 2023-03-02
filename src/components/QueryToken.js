import React from 'react';
import axios from 'axios'
import { useState, useEffect, useRef } from 'react';
import { ClipLoader } from "react-spinners";

// Material
import {
    styled,
    Avatar,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils
import { fNumber } from 'src/utils/formatNumber';
import { XRP_TOKEN } from 'src/utils/constants';

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border_left: 'none'
    }
}));

export default function QueryToken({token, setToken}) {
    const API_XRPL_TO_URL = 'https://api.xrpl.to/api';

    const [loading, setLoading] = useState(false);

    const [tokens, setTokens] = useState([XRP_TOKEN]);
    const [filter, setFilter] = useState('');

    const loadTokens = () => {
        setLoading(true);
        // https://api.xrpl.to/api/xrpnft/tokens?filter=
        axios.get(`${API_XRPL_TO_URL}/xrpnft/tokens?filter=${filter}`)
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    const newTokens = [XRP_TOKEN].concat(ret.tokens);

                    setTokens(newTokens);
                    // if (ret.tokens.length > 0)
                    //     setTokens(ret.tokens);
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

        let newToken = null;
        for (var t of tokens) {
            if (t.md5 === value) {
                newToken = t;
                break;
            }
        }
        if (newToken)
            setToken(newToken);
    };

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    return (
        <Stack spacing={2}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center">
                    <Typography variant='p2'>Currency <Typography variant='s2'>*</Typography></Typography>
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

                <CustomSelect
                    id='select_token'
                    value={token.md5}
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

            
        </Stack>
    );
}
