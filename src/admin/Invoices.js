import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    useTheme,
    Avatar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Table,
    TableBody,
    TableRow,
    TableCell,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PaymentsIcon from '@mui/icons-material/Payments';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader, ClipLoader } from "react-spinners";

// Utils
import { NFToken, Mint } from 'src/utils/constants';

// Components
import ListToolbar from './ListToolbar';
import { formatDateTime } from 'src/utils/formatTime';

function statusToString(status) {

    for (const [key, value] of Object.entries(Mint)) {
        if (value === status)
            return key;
    }
    return 'NONE';
    // switch (status) {
    //     case NFToken
    // }
}

// ----------------------------------------------------------------------
export default function Invoices({}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sync, setSync] = useState(0);

    const [choice, setChoice] = useState('all');

    const [filter, setFilter] = useState('');

    useEffect(() => {
        function getInvoices() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            const body = { filter, choice };

            axios.post(`${BASE_URL}/admin/invoices?page=${page}&limit=${rows}`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setInvoices(ret.invoices);
                    }
                }).catch(err => {
                    console.log("Error on getting invoices list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getInvoices();
    }, [page, rows, accountAdmin, accountToken, filter, choice]);

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
    };

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    return (
        <>
            <ToggleButtonGroup
                color="primary"
                value={choice}
                exclusive
                onChange={handleChangeChoice}
            >
                <ToggleButton value="all" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>All</ToggleButton>
                <ToggleButton value="buymint" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Buy Mint</ToggleButton>
                <ToggleButton value="autopay" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Auto Pay</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                id='textFilter'
                // autoFocus
                // fullWidth
                variant='outlined'
                placeholder='Invoice'
                margin='dense'
                onChange={handleChangeFilter}
                autoComplete='new-password'
                inputProps={{autoComplete: 'off'}}
                value={filter}
                onFocus={event => {
                    event.target.select();
                }}
                sx={{pl:2, pr:2, pt: 0, pb: 0, mt: 4, mb: 4}}
                onKeyDown={(e) => e.stopPropagation()}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            {loading && <ClipLoader color='#ff0000' size={15} /> }
                        </InputAdornment>
                    ),
                }}
            />

            {invoices && invoices.length === 0 &&
                <Stack alignItems="center" sx={{mt: 5}}>
                    <Typography variant="s7">No Items</Typography>
                </Stack>
            }

            {total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    py: 1,
                    overflow: "auto",
                    width: "100%",
                    "& > *": {
                        scrollSnapAlign: "center",
                    },
                    "::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "1px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                    {
                        invoices && invoices.map((row, idx) => {
                            // {xuuid, InvoiceID, account, destination: collection.minter, cid, cname: collection.name, cslug: collection.slug, amount: Amount, quantity, cost, time}
                            const {
                                InvoiceID,
                                hash,
                                src,
                                dest,
                                amount,
                                type,
                                time
                            } = row;
                        
                            let strDateTime = formatDateTime(time);

                            return (
                                <TableRow
                                    // hover
                                    key={time + "" + idx}
                                    sx={{
                                        [`& .${tableCellClasses.root}`]: {
                                            // color: (error ? '#B72136' : '#B72136')
                                        }
                                    }}
                                >
                                    <TableCell align="left">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Invoice: </Typography>
                                            <Typography variant="s8">{InvoiceID}</Typography>
                                            <CopyToClipboard text={InvoiceID} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                <Tooltip title='Copy InvoiceID'>
                                                    <IconButton size="small">
                                                        <PaymentsIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Hash: </Typography>
                                            <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${hash}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant="s7">{hash}</Typography>
                                            </Link>
                                            <Link
                                                underline="none"
                                                color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${hash}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Tooltip title="Check on Bithomp">
                                                    <IconButton edge="end" aria-label="bithomp" size="small">
                                                        <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Link>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Src: </Typography>
                                            <Typography variant="s7">{src}</Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Dest: </Typography>
                                            <Typography variant="s7">{dest}</Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Type: </Typography>
                                            <Typography variant="s7">{type === 1?'Buy Mint':'Auto Pay'}</Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="s7">Time: </Typography>
                                            <Typography variant="s7">{strDateTime}</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}
