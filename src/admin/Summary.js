import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Decimal from 'decimal.js';

// Material
import {
    useTheme,
    Avatar,
    IconButton,
    Link,
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
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

    const [collections, setCollections] = useState(0) // XRPNFT.com Collections

    const [nfts1, setNfts1] = useState(0); // XRPL NFTs
    const [nfts2, setNfts2] = useState(0); // XRPNFT.com NFTs
    const [nfts3, setNfts3] = useState(0); // Account/Owner NFTs

    const [activities, setActivities] = useState(0); // Activities

    const [profiles, setProfiles] = useState(0); // Profiles

    const [offers, setOffers] = useState(0); // Offers

    const [dNFTs, setDNFTs] = useState(0); // Duplicated NFTs

    const [orphaned, setOrphaned] = useState(0); // Orphaned Offers

    const [xrpnftAccounts, setXrpnftAccounts] = useState([]); // XRPNFT.com accounts

    const [nftScanner, setNftScanner] = useState({index: 0, nfts: 0});
    const [txScanner, setTxScanner] = useState({index: 0, nfts: 0});
    const [txScannerReal, setTxScannerReal] = useState({index: 0, nfts: 0});

    const [loading, setLoading] = useState(true);

    let pNfts2 = 0;
    let pNfts3 = 0;

    if (nfts1 > 0) {
        pNfts2 = new Decimal(nfts2).mul(100).div(nfts1).toDP(1, Decimal.ROUND_DOWN);
        pNfts3 = new Decimal(nfts3).mul(100).div(nfts1).toDP(1, Decimal.ROUND_DOWN);
    }

    const dNfts2 = nfts2 - nfts1;
    const dNfts3 = nfts3 - nfts1;
    
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
                        setCollections(ret.collections);
                        setNfts1(ret.nfts1);
                        setNfts2(ret.nfts2);
                        setNfts3(ret.nfts3);

                        setActivities(ret.activities);
                        setProfiles(ret.profiles);
                        setOffers(ret.offers);
                        setOrphaned(ret.orphaned);

                        setDNFTs(ret.dNFTs);

                        setXrpnftAccounts(ret.xrpnftAccounts);

                        setNftScanner(ret.nftScanner);
                        setTxScanner(ret.txScanner);
                        setTxScannerReal(ret.txScannerReal);
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

    const onResolveDuplicated = async (type) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const body = { type };

            const res = await axios.post(`${BASE_URL}/admin/resolve_duplicate`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            const ret = res.data;
            if (ret) {
                if (ret.status) {
                    openSnackbar('Successfully submitted', 'success');
                } else {
                    openSnackbar(ret.err, 'error');
                }
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading(false);
    };

    const handleCheckDuplicatedAgain = (e) => {
        onResolveDuplicated(1);
    }

    const handleBurnDuplicatedNFTs = (e) => {
        onResolveDuplicated(2);
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
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Time: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{tookTime} ms</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Collections: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(collections)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">XRPNFT.com NFTs: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(nfts2)} <Typography variant="s6" color="#33C2FF">({fPercent(pNfts2)}%, {fIntNumber(dNfts2)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">XRPL NFTs (30 min): </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(nfts1)} / {fIntNumber(txScanner.nfts)} <Typography variant="s6" color="#33C2FF">(#{fIntNumber(txScanner.index)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">XRPL NFTs (Realtime): </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s5" color="error">{fIntNumber(nfts3)} <Typography variant="s6" color="#CB3C1D">({fPercent(pNfts3)}%, {dNfts3>0?'+':''}{fIntNumber(dNfts3)})</Typography> <Typography variant="s6" color="#33C2FF">(#{fIntNumber(txScannerReal.index)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Activities (2 Weeks): </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(activities)} <Typography variant="s2" color="#33C2FF">(XRPL)</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Registered Users: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(profiles)}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Offers <Typography variant="s2" color="#33C2FF">(Orphaned)</Typography>: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s6">{fIntNumber(offers)} <Typography variant="s2" color="#33C2FF">({fIntNumber(orphaned)})</Typography></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Typography variant="s4">Duplicated NFTs: </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{pt: 1, pb: 1}}>
                                <Stack direction="row" sx={{width: "100%"}} spacing={0.2} alignItems="center" justifyContent="end">
                                    <Typography variant="s6" pr={2}>{fIntNumber(dNFTs)}</Typography>
                                    <Tooltip title="Check duplicated NFTs again">
                                        <IconButton size="small" onClick={handleCheckDuplicatedAgain}>
                                            <RefreshIcon fontSize="small" color="warning" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Burn these NFTs'>
                                        <IconButton size="small" onClick={handleBurnDuplicatedNFTs}>
                                            <DeleteForeverIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
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
                                    <TableCell align="left" sx={{pt: 1, pb: 1}}>
                                        <Typography variant="s4">XRPNFT {idx+1}</Typography>
                                    </TableCell>

                                    <TableCell align="left" sx={{pt: 1, pb: 1}}>
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
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left" sx={{pt: 1, pb: 1}}>
                                        {/* <Typography variant="p5" color="#33C2FF">{balance}</Typography> */}
                                        <Typography variant='d4' color={balance<200?"error":"#33C2FF"} sx={{ml: 2}} noWrap><Icon icon={rippleSolid} width={12} height={12}/> {fNumber(balance)}</Typography>
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
