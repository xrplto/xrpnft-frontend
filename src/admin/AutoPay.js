import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    useTheme,
    Avatar,
    Box,
    Button,
    IconButton,
    Link,
    Stack,
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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { Mint } from 'src/utils/constants';
import { formatDateTime } from 'src/utils/formatTime';

// Loader
import { PulseLoader } from "react-spinners";

// Components
import ListToolbar from './ListToolbar';
import ConfirmResolveDialog from './ConfirmResolveDialog';
import Decimal from 'decimal.js';

// ----------------------------------------------------------------------

function statusToString(status) {

    for (const [key, value] of Object.entries(Mint)) {
        if (value === status)
            return key;
    }
    return 'NONE';
}

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

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

    const [choice, setChoice] = useState('all');

    useEffect(() => {
        function getAutoPays() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            const body = { choice };

            axios.post(`${BASE_URL}/admin/autopays?page=${page}&limit=${rows}`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
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
    }, [page, rows, accountAdmin, accountToken, choice, sync]);

    const onResolveAutoPay = async (autoPay) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const {
                uuid,
                action
            } = autoPay;

            const body = { uuid, action };

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

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
    };

    return (
        <>
            <ToggleButtonGroup
                color="primary"
                value={choice}
                exclusive
                onChange={handleChangeChoice}
            >
                <ToggleButton value="all" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>All</ToggleButton>
                <ToggleButton value="notfunded" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Not Funded</ToggleButton>
                {/* <ToggleButton value="error" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Error</ToggleButton> */}
            </ToggleButtonGroup>

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
                                error
                            } = row;

                            const strDateTime = formatDateTime(time);

                            const value = typeof amount === 'object' ? amount.value : new Decimal(amount).div(1000000).toString();

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
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="s7">Src: </Typography>
                                                        <Typography variant="s8">{account}</Typography>
                                                    </Stack>
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
                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="s7">Dest: </Typography>
                                                        <Typography variant="s8">{dest}</Typography>
                                                    </Stack>
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
                                                <Typography variant='s7'>UUID: {uuid}</Typography>
                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="s7">Hash: </Typography>
                                                        <Typography variant="s7">{truncate(hash, 31)}</Typography>
                                                    </Stack>
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
                                                    <CopyToClipboard text={hash} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Click to copy'>
                                                            <IconButton size="small">
                                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                </Stack>
                                                <Typography variant="s7">{strDateTime}</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Status: </Typography>
                                                    <Typography variant="s6">{status} - {statusToString(status)}</Typography>
                                                </Stack>
                                                {error &&
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="s7">Error: </Typography>
                                                        <Typography variant="s6">{JSON.stringify(error)}</Typography>
                                                    </Stack>
                                                }
                                            </Stack>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mr={3}>
                                                <Stack direction='row' spacing={0.8} alignItems="center">
                                                    <Avatar alt="C" src={`https://s1.xrpl.to/token/${cost.md5}`} />
                                                    <Typography variant='p4' color="#EB5757">{value}</Typography>
                                                    <Typography variant='s2'>{cost.name}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant='p4' color="#33C2FF">{100 - royalty} %</Typography>
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

                                            {status !== Mint.FUNDED &&
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
