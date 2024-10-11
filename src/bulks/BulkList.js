import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { withStyles } from '@mui/styles';
import {
    styled, useTheme,
    Avatar,
    Backdrop,
    Box,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Divider,
    CircularProgress,
    Skeleton,
    Chip
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import PushPinIcon from '@mui/icons-material/PushPin';
import CollectionsIcon from '@mui/icons-material/Collections';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import CasinoIcon from '@mui/icons-material/Casino';
import AnimationIcon from '@mui/icons-material/Animation';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';
import { formatDateTime } from 'src/utils/formatTime';

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import QRDialog from 'src/components/QRDialog';
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

const STATUS_PENDING = 0;
const STATUS_START = 1;
const STATUS_ERROR = 2;
const STATUS_SUCCESS = 3;

// FLAG_MINT specific status
const STATUS_ERR_MINTER = 4; // Minter not set to the account
const STATUS_ERR_BALANCE = 5; // Minter balance is not enough to mint

const FLAG_GOOGLE = 0;
const FLAG_UNZIP = 1;
const FLAG_IPFS = 2;
const FLAG_MINT = 3;

function getBulkStatus(bulk, flag) {
    const status = bulk.status;
    if (flag === FLAG_GOOGLE)
        return status & 0x03;
    else if (flag === FLAG_UNZIP)
        return (status >> 2) & 0x03;
    else if (flag === FLAG_IPFS)
        return (status >> 4) & 0x03;
    else if (flag === FLAG_MINT)
        return (status >> 6) & 0x0F;
}

// Modify the StatusContainer to accept theme as a prop
function StatusContainer({bulk, flag, theme}) {
    const status = getBulkStatus(bulk, flag);
    return (
        <>
        {status === STATUS_PENDING &&
            <Tooltip title='PENDING'>
                <PendingIcon fontSize='large' sx={{ color: theme.palette.text.secondary }} />
            </Tooltip>
        }
        {status === STATUS_START &&
            <Tooltip title='WORKING'>
                <CircularProgress size={24} thickness={4} />
            </Tooltip>
        }
        {status === STATUS_ERROR &&
            <Tooltip title='ERROR'>
                <ErrorIcon color='error' fontSize='large' />
            </Tooltip>
        }
        {status === STATUS_SUCCESS &&
            <Tooltip title='OK'>
                <CheckCircleIcon color='success' fontSize='large' />
            </Tooltip>
        }
        </>
    )
}

export default function BulkList() {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [count, setCount] = useState(0);
    const [bulks, setBulks] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBulkCollections = useCallback(() => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        axios.get(`${BASE_URL}/collection/list?account=${account}&page=${page}&limit=${rows}&type=bulk`, {headers: {'x-access-token': accountToken}})
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    setCount(ret.count);
                    setBulks(ret.collections);
                }
            }).catch(err => {
                console.log("Error on getting bulk list!!!", err);
            }).finally(() => {
                setLoading(false);
            });
    }, [account, accountToken, page, rows, openSnackbar]);

    useEffect(() => {
        getBulkCollections();
    }, [getBulkCollections]);

    return (
        <>
            <Box sx={{ width: "100%", overflow: "auto" }}>
                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "1px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                    {loading ? (
                        // Show skeleton loader when loading
                        [...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell width='15%'>
                                    <Skeleton variant="rectangular" width={160} height={160} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="40%" />
                                </TableCell>
                                <TableCell width='15%'>
                                    <Skeleton variant="circular" width={56} height={56} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        bulks && bulks.map((row) => {
                            const {
                                uuid,
                                slug,
                                bulkUrl,
                                status,
                                logoImage,
                                name,
                                created,
                                description,
                                infoDOWNLOAD, // {size: '1.34 GB'}
                                infoUNZIP, // {count: 1000}
                                infoIPFS,
                                infoMINT, // {count: 0, length: metadata.length};
                                minter,
                                minterName,
                                category,
                                type
                            } = row;

                            const strDateTime = formatDateTime(created);

                            return (
                                <TableRow
                                    key={uuid}
                                    hover
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    <TableCell align="left" width='15%'>
                                        <Avatar 
                                            alt={name} 
                                            src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                            variant="rounded"
                                            sx={{
                                                width: 160,
                                                height: 160,
                                                borderRadius: '16px', // This creates rounded corners
                                                filter: infoIPFS && infoIPFS.cid 
                                                    ? `drop-shadow(0 4px 8px rgba(0,0,0,0.1))` 
                                                    : 'grayscale(100%)',
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Link href={`/collection/${slug}`} underline="hover">
                                                    <Typography variant="h5" color="primary">{name}</Typography>
                                                </Link>
                                                {type === "random" &&
                                                    <Tooltip title='Random Collection'>
                                                        <CasinoIcon color='info' fontSize="small" />
                                                    </Tooltip>
                                                }
                                                {type === "sequence" &&
                                                    <Tooltip title='Sequence Collection'>
                                                        <AnimationIcon color='info' fontSize="small" />
                                                    </Tooltip>
                                                }
                                                <Chip label={category} size="small" color="primary" variant="outlined" />
                                            </Stack>

                                            {infoIPFS && infoIPFS.cid &&
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {/* <Typography variant="d3" color="#FFA319">Please check the following CID before Bulk-Mint your items</Typography> */}
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://gateway.xrpnft.com/ipfs/${infoIPFS.cid}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="d3" color="#33C2FF">{infoIPFS.cid}</Typography>
                                                    </Link>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://gateway.xrpnft.com/ipfs/${infoIPFS.cid}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Tooltip title='Check on IPFS'>
                                                            <IconButton>
                                                                <OpenInNewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                    <CopyToClipboard text={`${infoIPFS.cid}`} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Click to copy'>
                                                            <IconButton>
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                </Stack>
                                            }
                                            {description &&
                                                <Typography variant="d4" sx={{mb: 1}}>{description}</Typography>
                                            }
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="p3">{strDateTime}</Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={bulkUrl}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="p3">{bulkUrl}</Typography>
                                                </Link>
                                            </Stack>
                                            <Stack direction="row" spacing={3} sx={{mt:1}}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <StatusContainer bulk={row} flag={FLAG_GOOGLE} theme={theme} />
                                                    <Stack>
                                                        <Typography variant="s4">Download</Typography>
                                                        {infoDOWNLOAD &&
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <CloudDownloadIcon fontSize='small' color='info'/>
                                                                <Typography variant="d4" color="primary">{infoDOWNLOAD.size}</Typography>
                                                                {/* <PushPinIcon fontSize='small' color='warning'/> */}
                                                            </Stack>
                                                        }
                                                    </Stack>
                                                </Stack>
                                                <Divider orientation="vertical" flexItem/>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <StatusContainer bulk={row} flag={FLAG_UNZIP} theme={theme} />
                                                    <Stack>
                                                        <Typography variant="s4">Unzip</Typography>
                                                        {infoUNZIP &&
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <FolderZipIcon fontSize='small' color='info'/>
                                                                <Typography variant="d4" color="primary">{fIntNumber(infoUNZIP.count)}</Typography>
                                                                {/* <PushPinIcon fontSize='small' color='warning'/> */}
                                                            </Stack>
                                                        }
                                                    </Stack>
                                                </Stack>
                                                <Divider orientation="vertical" flexItem/>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <StatusContainer bulk={row} flag={FLAG_IPFS} theme={theme} />
                                                    <Stack>
                                                        <Typography variant="s4">Pin to IPFS</Typography>
                                                        {infoIPFS && infoIPFS.count &&
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <FiberPinIcon fontSize='small' color='info'/>
                                                                <Typography variant="d4" color="primary">{fIntNumber(infoIPFS.count)}</Typography>
                                                                {/* <PushPinIcon fontSize='small' color='warning'/> */}
                                                            </Stack>
                                                        }
                                                    </Stack>
                                                </Stack>
                                                <Divider orientation="vertical" flexItem/>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <StatusContainer bulk={row} flag={FLAG_MINT} theme={theme} />
                                                    <Typography variant="s4">Mint</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="left">
                                        {infoIPFS && infoIPFS.cid && status === 0x3F && // 0x3F = b0011 1111
                                            <Stack alignItems="center">
                                                <Link
                                                    color="inherit"
                                                    // target="_blank"
                                                    href={`/bulks/mint/${slug}`}
                                                    // rel="noreferrer noopener nofollow"
                                                >
                                                    <IconButton aria-label='bulk-mint'>
                                                        <CollectionsIcon sx={{width:56, height:56}} />
                                                    </IconButton>
                                                </Link>
                                                <Typography variant="d4">Bulk Mint</Typography>
                                            </Stack>
                                        }
                                        {infoMINT &&
                                            <Stack alignItems="center">
                                                {infoMINT.count !== infoMINT.length?(
                                                    <RotatingSquare
                                                        height="100"
                                                        width="100"
                                                        color="#4fa94d"
                                                        ariaLabel="rotating-square-loading"
                                                        strokeWidth="4"
                                                        wrapperStyle={{}}
                                                        wrapperClass=""
                                                        visible={true}
                                                    />
                                                ):(
                                                    <Vortex
                                                        visible={true}
                                                        height="80"
                                                        width="80"
                                                        ariaLabel="vortex-loading"
                                                        wrapperStyle={{}}
                                                        wrapperClass="vortex-wrapper"
                                                        colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                                    />
                                                )}


                                                <Typography variant="d4" color="#33C2FF">{infoMINT.count} / {infoMINT.length}</Typography>
                                            </Stack>
                                        }
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
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
                    onRefresh={getBulkCollections}  // Add this line
                />
            }
            <Box sx={{ py: 4 }} />
        </>
    );
}