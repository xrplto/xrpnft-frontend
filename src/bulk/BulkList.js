import axios from 'axios'
import { useState, useEffect } from 'react';

// Material
import { withStyles } from '@mui/styles';
import {
    styled, useTheme,
    Avatar,
    Box,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Divider
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fNumber } from 'src/utils/formatNumber';
import { normalizeCurrencyCodeXummImpl } from 'src/utils/normalizers';

// Loader
import { ClipLoader } from "react-spinners";

// Components
import BulkToolbar from './BulkToolbar';

// ----------------------------------------------------------------------
const CancelTypography = withStyles({
    root: {
        color: "#FF6C40",
        borderRadius: '6px',
        border: '0.05em solid #FF6C40',
        //fontSize: '0.5rem',
        lineHeight: '1',
        paddingLeft: '3px',
        paddingRight: '3px',
    }
})(Typography);

const BuyTypography = withStyles({
    root: {
        color: "#007B55",
        borderRadius: '6px',
        border: '0.05em solid #007B55',
        //fontSize: '0.5rem',
        lineHeight: '1',
        paddingLeft: '3px',
        paddingRight: '3px',
    }
})(Typography);

const SellTypography = withStyles({
    root: {
        color: "#B72136",
        borderRadius: '6px',
        border: '0.05em solid #B72136',
        //fontSize: '0.5rem',
        lineHeight: '1',
        paddingLeft: '3px',
        paddingRight: '3px',
    }
})(Typography);

// ----------------------------------------------------------------------

function truncate(str, n){
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

const STATUS_INITIAL = 0;
const STATUS_DOWNLOAD_START = 1;
const STATUS_DOWNLOAD_ERROR = 2;
const STATUS_DOWNLOAD_SUCCESS = 3;
const STATUS_EXTRACT_START = 4;
const STATUS_EXTRACT_ERROR = 5;
const STATUS_EXTRACT_SUCCESS = 6
const STATUS_PINNING_START = 7;
const STATUS_PINNING_ERROR = 8;
const STATUS_PINNING_SUCCESS = 9;
const STATUS_ALL_DONE = 10;

function getStatusString(status) {
    if (status === STATUS_INITIAL) return 'PENDING';
    if (status === STATUS_DOWNLOAD_START) return 'Started downloading ...';
    if (status === STATUS_DOWNLOAD_ERROR) return 'Error on downloading ...';
    if (status === STATUS_DOWNLOAD_SUCCESS) return 'Success on downloading ...';
    if (status === STATUS_EXTRACT_START) return 'Started extractiong ...';
    if (status === STATUS_EXTRACT_ERROR) return 'Error on extracting ...';
    if (status === STATUS_EXTRACT_SUCCESS) return 'Success on extracting ...';
    if (status === STATUS_PINNING_START) return 'Started pinning to IPFS ...';
    if (status === STATUS_PINNING_ERROR) return 'Error on pinning to IPFS ...';
    if (status === STATUS_PINNING_SUCCESS) return 'Success on pinning to IPFS ...';
    return 'EXTRA ERROR';
}

export default function BulkList({data}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile.account;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [count, setCount] = useState(0);
    const [bulks, setBulks] = useState([]);
    
    useEffect(() => {
        function getBulks() {
            // https://api.xrpnft.com/api/bulk/list?account=rhhh&page=0&limit=10
            axios.get(`${BASE_URL}/bulk/list?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setCount(ret.count);
                        setBulks(ret.bulks);
                    }
                }).catch(err => {
                    console.log("Error on getting exchanges!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getBulks();
    }, [account, page, rows]);

    return (
        <>
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
                        borderBottomColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                    {
                        // exchs.slice(page * rows, page * rows + rows)
                        bulks.map((row) => {
                                const {
                                    uuid,
                                    url,
                                    status,
                                    logo,
                                    name,
                                    created
                                } = row;
                                const nDate = new Date(created);
                                const year = nDate.getFullYear();
                                const month = nDate.getMonth() + 1;
                                const day = nDate.getDate();
                                const hour = nDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const min = nDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const sec = nDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

                                const error = status === STATUS_DOWNLOAD_ERROR || status === STATUS_EXTRACT_ERROR || status === STATUS_PINNING_ERROR;

                                //const strTime = (new Date(date)).toLocaleTimeString('en-US', { hour12: false });
                                //const strTime = nDate.format("YYYY-MM-DD HH:mm:ss");
                                const strDate = `${year}-${month}-${day}`;
                                const strTime = `${hour}:${min}:${sec}`;

                                return (
                                    <TableRow
                                        hover
                                        key={uuid}
                                        sx={{
                                            [`& .${tableCellClasses.root}`]: {
                                                // color: (error ? '#B72136' : '#B72136')
                                            }
                                        }}
                                    >
                                        {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                        <TableCell align="left" width='15%'>
                                            <Avatar alt="C" src={`https://s3.xrpnft.com/bulk/${logo}`} sx={{ mr:2, width: 128, height: 128 }} />
                                        </TableCell>
                                        
                                        <TableCell align="left">
                                            <Stack spacing={1}>
                                                <Typography variant="h3">{name}</Typography>
                                                <Link
                                                    underline="none"
                                                    color="inherit"
                                                    target="_blank"
                                                    href={url}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="d4">{url}</Typography>
                                                </Link>
                                                <Typography variant="d4" color={error ? '#B72136' : ''}>{getStatusString(status)}</Typography>
                                                <Stack direction="row" spacing={4}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <ClipLoader color='#FFA319' size={30} />
                                                        <Typography variant="s4">Download</Typography>
                                                    </Stack>
                                                    <Divider orientation="vertical" flexItem/>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <CheckCircleIcon fontSize='large' color='success'/>
                                                        <Typography variant="s4">Unzip</Typography>
                                                    </Stack>
                                                    <Divider orientation="vertical" flexItem/>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <ErrorIcon fontSize='large' color='error'/>
                                                        <Typography variant="s4">Pin to IPFS</Typography>
                                                    </Stack>
                                                </Stack>
                                                
                                            </Stack>
                                        </TableCell>
                                        
                                        <TableCell align="left">
                                            
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </Box>
            { count > 0 &&
                <BulkToolbar
                    count={count}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }
        </>
    );
}
