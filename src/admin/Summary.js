import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Decimal from 'decimal.js';

// Material
import {
    useTheme,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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

export default function Summary({}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [tookTime, setTookTime] = useState('');

    const [nfts1, setNfts1] = useState(0); // XRPL NFTs
    const [nfts2, setNfts2] = useState(0); // XRPNFT.com NFTs
    const [nfts3, setNfts3] = useState(0); // Account/Owner NFTs
    const [nfts4, setNfts4] = useState(0); // Account/Owner NFTs2

    const [activities, setActivities] = useState(0); // Activities

    const [profiles, setProfiles] = useState(0); // Profiles

    const [xrpnftAccounts, setXrpnftAccounts] = useState([]); // XRPNFT.com accounts

    const [buyMintQueue, setBuyMintQueue] = useState(0);

    const [loading, setLoading] = useState(true);

    let pNfts2 = 0;
    let pNfts3 = 0;
    let pNfts4 = 0;

    if (nfts1 > 0) {
        pNfts2 = new Decimal(nfts2).mul(100).div(nfts1).toDP(1, Decimal.ROUND_DOWN);
        pNfts3 = new Decimal(nfts3).mul(100).div(nfts1).toDP(1, Decimal.ROUND_DOWN);
        pNfts4 = new Decimal(nfts4).mul(100).div(nfts1).toDP(1, Decimal.ROUND_DOWN);
    }

    const dNfts2 = nfts2 - nfts1;
    const dNfts3 = nfts3 - nfts1;
    const dNfts4 = nfts4 - nfts1;
    
    useEffect(() => {
        function getSummary() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            axios.get(`${BASE_URL}/admin/summary`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTookTime(ret.took);
                        setNfts1(ret.nfts1);
                        setNfts2(ret.nfts2);
                        setNfts3(ret.nfts3);
                        setNfts4(ret.nfts4);

                        setActivities(ret.activities);
                        setProfiles(ret.profiles);

                        setXrpnftAccounts(ret.xrpnftAccounts);

                        setBuyMintQueue(ret.buyMintQueue);
                    }
                }).catch(err => {
                    console.log("Error on getting summary!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getSummary();
    }, [accountAdmin, accountToken]);

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
                            <TableCell align="right">
                                <Typography variant="s6">{tookTime} ms</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">XRPL NFTs: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(nfts1)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">XRPNFT.com NFTs: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(nfts2)} <Typography variant="s6" color="#33C2FF">({fPercent(pNfts2)}%, {fIntNumber(dNfts2)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Owner DB NFTs: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(nfts3)} <Typography variant="s6" color="#33C2FF">({fPercent(pNfts3)}%, {fIntNumber(dNfts3)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Owner DB NFTs 2: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(nfts4)} <Typography variant="s6" color="#33C2FF">({fPercent(pNfts4)}%, {fIntNumber(dNfts4)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Total Activities: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(activities)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Registered Users: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(profiles)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right">
                                <Typography variant="s4">Buy Mint Queue: </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="s6">{fIntNumber(buyMintQueue)}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "0px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                    {
                        xrpnftAccounts.map((row, idx) => {
                            const {
                                account,
                                balance
                            } = row;
                        
                            return (
                                <TableRow key={account}>
                                    <TableCell align="left">
                                        <Typography variant="s4">XRPNFT {idx+1}</Typography>
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={0}>
                                            <Typography variant="s7" color="#CB3C1D">{account}</Typography>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left">
                                        {/* <Typography variant="p5" color="#33C2FF">{balance}</Typography> */}
                                        <Typography variant='d4' color="#33C2FF" sx={{ml: 2}} noWrap><Icon icon={rippleSolid} width={12} height={12}/> {fNumber(balance)}</Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </Stack>
        </>
    );
}
