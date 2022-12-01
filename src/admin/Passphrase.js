import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Decimal from 'decimal.js';

// Material
import {
    useTheme,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockResetIcon from '@mui/icons-material/LockReset';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Utils
import { fNumber, fIntNumber, fPercent } from 'src/utils/formatNumber';
import { NFToken } from 'src/utils/constants';

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

function statusToString(status) {

    for (const [key, value] of Object.entries(NFToken)) {
        if (value === status)
            return key;
    }
    return 'NONE';
    // switch (status) {
    //     case NFToken
    // }
}

/**
 * Converts hex to its string equivalent. Useful to read the Domain field and some Memos.
 *
 * @param hex - The hex to convert to a string.
 * @param encoding - The encoding to use. Defaults to 'utf8' (UTF-8). 'ascii' is also allowed.
 * @returns The converted string.
 * @category Utilities
 */
 function convertHexToString(hex, encoding = 'utf8') {
    let ret = '';
    try {
        ret = Buffer.from(hex, 'hex').toString(encoding);
    } catch (err) {
    }
    return ret;
}

export default function Passphrase({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [tookTime, setTookTime] = useState('');
    const [pass, setPass] = useState({password: '', count: 0});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getAccountPass() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            axios.get(`${BASE_URL}/admin/pass?account=${account}`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTookTime(ret.took);
                        if (ret.pass)
                            setPass(ret.pass);
                        else
                            setPass({password: '', count: 0});
                    }
                }).catch(err => {
                    console.log("Error on getting passphrase!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getAccountPass();
    }, [account, accountAdmin, accountToken]);

    const doResetPassphrase = async () => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        setLoading(true);

        axios.get(`${BASE_URL}/admin/reset_passphrase?account=${account}`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    setTookTime(ret.took);
                    if (ret.pass)
                        setPass(ret.pass);
                    else
                        setPass({password: '', count: 0});
                }
            }).catch(err => {
                console.log("Error on resetting passphrase!!!", err);
            }).then(function () {
                // always executed
                setLoading(false);
            });
    }

    const onResetPassphrase = async () => {
        doResetPassphrase();
    }

    return (
        <>
            {loading &&
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            }
            <Stack>
                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "0px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Time: </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography variant="s6">{tookTime} ms</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Account: </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="s6">{account}</Typography>
                                    <CopyToClipboard text={account} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                        <Tooltip title='Click to copy'>
                                            <IconButton size="small">
                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} color="#33C2FF" />
                                            </IconButton>
                                        </Tooltip>
                                    </CopyToClipboard>
                                </Stack>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Passphrase: </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="s3" color="#33C2FF">{pass.password}</Typography>
                                    <CopyToClipboard text={pass.password} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                        <Tooltip title='Click to copy'>
                                            <IconButton size="small">
                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} color="#33C2FF" />
                                            </IconButton>
                                        </Tooltip>
                                    </CopyToClipboard>
                                    <Tooltip title='Click to reset'>
                                        <IconButton size="small" onClick={onResetPassphrase}>
                                            <LockResetIcon fontSize="small" sx={{ width: 24, height: 24 }} color="#33C2FF" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Count: </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography variant="s6">{pass.count}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Stack>
        </>
    );
}
