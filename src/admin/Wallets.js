import axios from 'axios';
import { useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { fNumber } from 'src/utils/formatNumber';

// Components

export default function Wallets({}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [xrpnftAccounts, setXrpnftAccounts] = useState([]); // XRPNFT.com accounts

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getWallets() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            axios.get(`${BASE_URL}/admin/wallets`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setXrpnftAccounts(ret.xrpnftAccounts);
                    }
                }).catch(err => {
                    console.log("Error on getting wallets!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getWallets();
    }, [accountAdmin, accountToken]);

    return (
        <>
            {loading &&
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            }
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
                                    <Typography variant="s7">XRPNFT {idx+1}</Typography>
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
                                                    <Avatar alt="xaman" src="/public/xaman-logo.png" sx={{ width: 16, height: 16 }} />
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
        </>
    );
}
