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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { NFToken, Mint } from 'src/utils/constants';

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';
import ConfirmResolveDialog from './ConfirmResolveDialog';
import { timelineDotClasses } from '@mui/lab';

// ----------------------------------------------------------------------

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

export default function AutoPay() {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);

    const [autoPays, setAutoPays] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sync, setSync] = useState(0);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [resolveAutoPay, setResolveAutoPay] = useState(null);

    useEffect(() => {
        function getAutoPays() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            axios.get(`${BASE_URL}/admin/autopays?page=${page}&limit=${rows}`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setAutoPays(ret.autoPays);
                    }
                }).catch(err => {
                    console.log("Error on getting autopays list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getAutoPays();
    }, [page, rows, accountAdmin, accountToken, sync]);

    const onResolveAutoPay = async (autoPay) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const {
                xuuid,
                action
            } = autoPay;

            const body = { xuuid, action };

            const res = await axios.post(`${BASE_URL}/admin/resolve_autopay`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

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

    const handleResolve = (autoPay, action) => {
        autoPay.action = action;
        setResolveAutoPay(autoPay);
        setOpenConfirm(true);
    }

    const onContinueResolve = () => {
        onResolveAutoPay(resolveAutoPay);
    }

    return (
        <>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                autoPays && autoPays.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 5}}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
            )
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
                        autoPays && autoPays.map((row) => {
                            // {xuuid, InvoiceID, account, destination: collection.minter, cid, cname: collection.name, cslug: collection.slug, amount: Amount, quantity, cost, time}
                            const {
                                uuid,
                                InvoiceID,
                                account,
                                dest,
                                cid,
                                cname,
                                cslug,
                                amount,
                                quantity,
                                cost,
                                time,
                                hash,
                                status,
                                royalty,

                                meta,
                                resolved,
                                resolved_at,
                                dispatched_result
                            } = row;
                        
                            let strDateTime = '';

                            if (timelineDotClasses) {
                                const nDate = new Date(time);
                                const year = nDate.getFullYear();
                                const month = (nDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                                const day = nDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                                const hour = nDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const min = nDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const sec = nDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

                                //const strTime = (new Date(date)).toLocaleTimeString('en-US', { hour12: false });
                                //const strTime = nDate.format("YYYY-MM-DD HH:mm:ss");
                                strDateTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
                                // const strTime = `${hour}:${min}:${sec}`;
                            }

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
                                    key={uuid}
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
                                                        <Tooltip title='Click to copy'>
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
                                                <Typography variant='s7'>UUID: {uuid}</Typography>
                                                <Typography variant='s7'>Hash: {hash}</Typography>
                                                <Typography variant="s7">{strDateTime}</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Status: </Typography>
                                                    <Typography variant="s6">{status} - {statusToString(status)}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mr={3}>
                                                <Stack direction='row' spacing={0.8} alignItems="center">
                                                    <Avatar alt="C" src={`https://xrpl.to/static/tokens/${cost.md5}.${cost.ext}`} />
                                                    <Typography variant='p4' color="#EB5757">{amount.value || amount}</Typography>
                                                    <Typography variant='s2'>{cost.name}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant='p4' color="#33C2FF">{royalty} %</Typography>
                                                    <RequestQuoteIcon />
                                                </Stack>
                                            </Stack>

                                            <Stack direction="row" spacing={0.2} alignItems="center">
                                                <Typography variant="s6">{dest}</Typography>
                                                <Link
                                                    underline="none"
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${dest}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Tooltip title="Check on Bithomp">
                                                        <IconButton edge="end" aria-label="bithomp" size="small">
                                                            <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                                <CopyToClipboard text={dest} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                    <Tooltip title='Click to copy'>
                                                        <IconButton size="small">
                                                            <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 2)}>
                                                        Fund
                                                    </Button>
                                                    <Button variant="outlined" color="primary" size="small" onClick={()=>handleResolve(row, 3)}>
                                                        Set as Funded
                                                    </Button>
                                                </Stack>
                                            </Stack>
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
