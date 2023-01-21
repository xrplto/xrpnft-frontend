import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { normalizeAmount } from 'src/utils/normalizers';

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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PaymentsIcon from '@mui/icons-material/Payments';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader, ClipLoader } from "react-spinners";

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { Mint, getMinterName } from 'src/utils/constants';

// Components
import ListToolbar from './ListToolbar';
import ConfirmResolveDialog from './ConfirmResolveDialog';

function statusToString(status) {
    for (const [key, value] of Object.entries(Mint)) {
        if (value === status)
            return key;
    }
    return 'NONE';
}

// ----------------------------------------------------------------------
export default function Mints({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);

    const [mints, setMints] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sync, setSync] = useState(0);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [resolveMint, setResolveMint] = useState(null);

    const [choice, setChoice] = useState('all');

    const [filter, setFilter] = useState('');

    useEffect(() => {
        function getMints() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            const body = { account, choice, filter };

            axios.post(`${BASE_URL}/admin/mints?page=${page}&limit=${rows}`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setMints(ret.mints);
                    }
                }).catch(err => {
                    console.log("Error on getting mints list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getMints();
    }, [page, rows, accountAdmin, accountToken, account, filter, choice, sync]);

    const onResolveMint = async (mint) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const {
                xuuid,
                action
            } = mint;

            const body = { xuuid, action };

            const res = await axios.post(`${BASE_URL}/admin/resolve_mint`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar('Successfully submitted', 'success');
                setSync(sync + 1);
            } else {
                openSnackbar(ret.err, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading(false);
    };

    const handleResolve = (mint, action) => {
        mint.action = action;
        if (action === 4 || action === 5) { // If action is XUMM get or cancel, call directly, don't show confirm dialog
            onResolveMint(mint);
        } else {
            setResolveMint(mint);
            setOpenConfirm(true);
        }
    }

    const onContinueResolve = () => {
        onResolveMint(resolveMint);
    }

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
                <ToggleButton value="paid" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Paid</ToggleButton>
                <ToggleButton value="notpaid" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Not Paid</ToggleButton>
                <ToggleButton value="account" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>By Account</ToggleButton>
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

            {mints && mints.length === 0 &&
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

            <ConfirmResolveDialog open={openConfirm} setOpen={setOpenConfirm} onContinue={onContinueResolve} />

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
                        mints && mints.map((row) => {
                            // {xuuid, InvoiceID, account, destination: collection.minter, cid, cname: collection.name, cslug: collection.slug, amount: Amount, quantity, cost, time}
                            const {
                                xuuid,
                                uuid,
                                InvoiceID,
                                account,
                                cid,
                                cslug,
                                cname,
                                amount,
                                quantity,
                                cost,
                                minter,
                                dest,
                                status,
                                time,

                                // XUMM
                                meta,
                                resolved,
                                resolved_at,
                                dispatched_result,
                                xumm_signer,
                                xumm_account,
                                xumm_txid,


                                //
                                t1,
                                t2,
                                t3,
                                t4,
                                t5
                            } = row;

                            const strDateTime = formatDateTime(time);

                            const time1 = formatDateTime(t1);
                            const time2 = formatDateTime(t2);
                            const time3 = formatDateTime(t3);
                            const time4 = formatDateTime(t4);
                            const time5 = formatDateTime(t5);

                            // InvoiceID: 18E0E841D26B9B4A5EA2B217C71781A59C4D82AE4C999CBBC0E242B89E498670

                            /*
                            { meta
                                exists: true,
                                uuid: 'a5c3e591-40c6-4774-b753-a26654ac07d4',
                                multisign: false,
                                submit: true,
                                pathfinding: null,
                                destination: 'r3AGSrv9SHzzhe5BxqG8sFiRSxNs26tEVs',
                                resolved_destination: 'r3AGSrv9SHzzhe5BxqG8sFiRSxNs26tEVs',
                                resolved: true,
                                signed: false,
                                cancelled: true,
                                expired: true,
                                pushed: true,
                                app_opened: true,
                                opened_by_deeplink: true,
                                return_url_app: null,
                                return_url_web: null,
                                is_xapp: false,
                                signers: null
                            }
                            */

                            return (
                                <TableRow
                                    // hover
                                    key={xuuid}
                                    sx={{
                                        [`& .${tableCellClasses.root}`]: {
                                            // color: (error ? '#B72136' : '#B72136')
                                        }
                                    }}
                                >
                                    <TableCell align="left">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {/* <Avatar alt="C" src='/static/account_logo.png' /> */}
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Typography variant="s6">{account}</Typography>
                                                    <Link
                                                        underline="none"
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${account}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Tooltip title="Check on Bithomp">
                                                            <IconButton edge="end" aria-label="bithomp" size="small">
                                                                <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                    <CopyToClipboard text={account} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Copy Account'>
                                                            <IconButton size="small">
                                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                    <CopyToClipboard text={InvoiceID} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Copy InvoiceID'>
                                                            <IconButton size="small">
                                                                <PaymentsIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                </Stack>

                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Typography variant="s7">{minter} <Typography variant="s2">({getMinterName(minter)})</Typography></Typography>
                                                    <Link
                                                        underline="none"
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${minter}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Tooltip title="Check on Bithomp">
                                                            <IconButton edge="end" aria-label="bithomp" size="small">
                                                                <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                    <CopyToClipboard text={minter} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Copy Minter'>
                                                            <IconButton size="small">
                                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                </Stack>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Collection: </Typography>
                                                    <Typography variant="s6">{cname}</Typography>
                                                </Stack>

                                                <Typography variant='s7'>{xuuid}</Typography>
                                                <Typography variant="s7">{strDateTime}</Typography>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Status: </Typography>
                                                    <Typography variant="s6">{status} - {statusToString(status)}</Typography>
                                                </Stack>

                                                {resolved &&
                                                    <Stack spacing={0.5}>
                                                        <Typography variant='s7'>XUMM</Typography>
                                                        <Typography variant='s7'>Resolved_at: {resolved_at}</Typography>
                                                        <Typography variant='s7'>Dispatched_result: {dispatched_result}</Typography>
                                                        <Typography variant='s7'>Expired: {meta?.expired?'Yes':'No'}</Typography>
                                                        <Typography variant='s7'>Cancelled: {meta?.cancelled?'Yes':'No'}</Typography>
                                                        <Typography variant='s7'>App Opened: {meta?.app_opened?'Yes':'No'}</Typography>
                                                        <Typography variant='s7'>Open Deeplink: {meta?.opened_by_deeplink?'Yes':'No'}</Typography>
                                                        <Typography variant='s7'>Signer: {xumm_signer}</Typography>
                                                        <Typography variant='s7'>Account: {xumm_account}</Typography>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <Typography variant='s7'>Tx: {xumm_txid}</Typography>
                                                            {xumm_txid &&
                                                                <Link
                                                                    underline="none"
                                                                    color="inherit"
                                                                    target="_blank"
                                                                    href={`https://bithomp.com/explorer/${xumm_txid}`}
                                                                    rel="noreferrer noopener nofollow"
                                                                >
                                                                    <Tooltip title="Check on Bithomp">
                                                                        <IconButton edge="end" aria-label="bithomp" size="small">
                                                                            <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Link>
                                                            }
                                                        </Stack>
                                                        {/* <Typography variant='s7'>meta: {JSON.stringify(meta)}</Typography> */}
                                                    </Stack>
                                                }

                                                <Typography variant="s7">T1: {time1} - Mint.BUY</Typography>
                                                <Typography variant="s7">T2: {time2} - Mint.REMOVE</Typography>
                                                <Typography variant="s7">T3: {time3} - Mint.CANCEL</Typography>
                                                <Typography variant="s7">T4: {time4} - Mint.PAID(tx)</Typography>
                                                <Typography variant="s7">T5: {time5} - Mint.PAID(api)</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mr={3}>
                                                <Stack direction='row' spacing={0.8} alignItems="center">
                                                    <Avatar alt="C" src={`https://xrpl.to/static/tokens/${cost.md5}.${cost.ext}`} />
                                                    <Typography variant='p4' color="#EB5757">{cost.amount}</Typography>
                                                    <Typography variant='s2'>{cost.name}</Typography>
                                                </Stack>
                                                <Typography variant='p4' color="#33C2FF">{quantity}</Typography>
                                            </Stack>

                                            {status !== Mint.PAID &&
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 4)}>
                                                            XUMM
                                                        </Button>
                                                        <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 5)}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 2)}>
                                                            Remove
                                                        </Button>
                                                        <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 3)}>
                                                            Set as Paid
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            }

                                            {status === Mint.PAID &&
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 10)}>
                                                            Refund
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            }
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
