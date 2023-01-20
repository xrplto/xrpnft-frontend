import axios from 'axios';
import { useState, useEffect } from 'react';

// Material
import {
    useTheme,
    Avatar,
    Backdrop,
    Box,
    Divider,
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

// Loader
import { PuffLoader, PulseLoader } from "react-spinners";
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { normalizeCurrencyCodeXummImpl } from "src/utils/normalizers";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

export default function HistoryList({ nft }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const isOwner = accountLogin === nft.account;

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
                        // console.log(ret.histories);
                    }
                }).catch(err => {
                    console.log("Error on getting nft history list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getHistories();
    }, [sync]);

    return (
        <>
            {loading ?
                <Stack alignItems="center" mt={1}>
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            :
                <Stack mt={1}>
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
                                borderBottom: "0px solid",
                                borderColor: theme.palette.divider
                            }
                        }}>
                            <TableBody>
                            {
                                hists && hists.map((row, id) => {
                                    const {
                                        uuid,
                                        type,
                                        account,
                                        NFTokenID,
                                        URI,
                                        cost,
                                        self,
                                        ledger,
                                        hash,
                                        time
                                    } = row;

                                    let strDateTime = formatDateTime(time);

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
                                            <TableCell align="left" width='8%' sx={{pt:0.5, pb:0.5}}>
                                                <Typography variant="s7">{id+1}</Typography>
                                            </TableCell>
                                            <TableCell align="left" width='15%' sx={{pt:0.5, pb:0.5}}>
                                                <Typography variant='s11' noWrap>{type}</Typography>
                                            </TableCell>
                                            <TableCell align="left" width='15%' sx={{pt:0.5, pb:0.5}}>
                                                <Link
                                                    // color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${account}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant='s11' noWrap> {truncate(account, 16)}</Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="left" width='15%' sx={{pt:0.5, pb:0.5}}>
                                                {type === 'SALE' ?
                                                    <Typography variant='s11' noWrap>{cost.amount} {normalizeCurrencyCodeXummImpl(cost.currency)}</Typography>
                                                    :
                                                    <Typography variant='s11' noWrap>- - -</Typography>
                                                }

                                            </TableCell>
                                            <TableCell align="left" sx={{pt:0.5, pb:0.5}}>
                                                <Typography variant='s7' noWrap>{strDateTime}</Typography>
                                            </TableCell>
                                            <TableCell align="left" width='3%' sx={{pt:0.5, pb:0.5}}>
                                                <Link
                                                    underline="none"
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${hash}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Tooltip title="Check Tx on Bithomp">
                                                        <IconButton edge="end" aria-label="bithomp" size="small">
                                                            <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                            </TableBody>
                        </Table>
                    </Box>
                </Stack>
            }
        </>
    );
}
