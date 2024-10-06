import axios from 'axios';
import { useState, useEffect, useContext } from 'react';

// Material
import {
    useTheme,
    Box,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";

// Loader
import { PulseLoader } from "react-spinners";

// Context
import { AppContext } from 'src/AppContext';

// Utils
import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";

function truncate(str, n) {
    if (!str) return '';
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York',
        timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
}

function formatAmount(amount) {
    return parseFloat(amount).toFixed(1);
}

export default function HistoryList({ nft }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, sync } = useContext(AppContext);
    const [hists, setHists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function getHistories() {
            setLoading(true);
            axios.get(`${BASE_URL}/history/${nft.NFTokenID}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setHists(ret.histories);
                    }
                    setLoading(false);
                }).catch(err => {
                    console.error("Error on getting nft history list!!!", err);
                    setLoading(false);
                });
        }
        getHistories();
    }, [sync]);

    return (
        <>
            {loading ? (
                <Stack alignItems="center" mt={1}>
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ) : (
                <Stack mt={1}>
                    <Box
                        sx={{
                            width: "100%",
                            overflowX: "hidden",
                            "::-webkit-scrollbar": { display: "none" },
                        }}
                    >
                        <Table size="small" sx={{
                            [`& .${tableCellClasses.root}`]: {
                                borderBottom: "0px solid",
                                borderColor: theme.palette.divider,
                                padding: '4px 8px',
                            },
                            minWidth: "100%",
                        }}>
                            <TableBody>
                                {hists && hists.slice().reverse().map((row) => (
                                    <TableRow key={row.uuid}>
                                        <TableCell align="left" width='15%'>
                                            <Typography variant='caption' noWrap>{row.type}</Typography>
                                        </TableCell>
                                        <TableCell align="left" width='30%'>
                                            <Link href={`/account/${row.account}`}>
                                                <Typography variant='caption' noWrap>{truncate(row.account, 12)}</Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left" width='25%'>
                                            {row.type === 'SALE' ?
                                                <Typography variant='caption' noWrap>{formatAmount(row.cost.amount)} {normalizeCurrencyCodeXummImpl(row.cost.currency)}</Typography>
                                                :
                                                <Typography variant='caption' noWrap>- - -</Typography>
                                            }
                                        </TableCell>
                                        <TableCell align="left" width='30%'>
                                            <Typography variant='caption' noWrap>{formatDateTime(row.time)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Stack>
            )}
        </>
    );
}
