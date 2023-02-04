import axios from 'axios';
import { useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { withStyles } from '@mui/styles';
import {
    styled, useTheme,
    Avatar,
    Backdrop,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Divider
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedIcon from '@mui/icons-material/Verified';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import GridOnIcon from '@mui/icons-material/GridOn';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ImportExportIcon from '@mui/icons-material/ImportExport';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';
import { formatDateTime } from 'src/utils/formatTime';

// Loader
import { PulseLoader, ClipLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import ListToolbar from '../ListToolbar';
import ConfirmRemoveDialog from './ConfirmRemoveDialog';

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

function StatusContainer({bulk, flag}) {
    const status = getBulkStatus(bulk, flag);
    // return (
    //     <ClockLoader color='#FFA319' size={30} />
    // )
    return (
        <>
        {status === STATUS_PENDING &&
            <Tooltip title='PENDING'>
                <PendingIcon fontSize='large'/>
            </Tooltip>
        }
        {status === STATUS_START &&
            <Tooltip title='WORKING'>
                <Stack>
                    <ClockLoader color='#FFA319' size={30} />
                </Stack>
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

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-input' : {
        paddingTop: '8px',
        paddingBottom: '8px'
    },
    '& .MuiOutlinedInput-notchedOutline' : {
        border: 'none'
    }
}));

export default function Collections({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setLoading } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [count, setCount] = useState(0);
    const [collections, setCollections] = useState([]);

    const [filter, setFilter] = useState('');
    const [choice, setChoice] = useState('all');

    const [openConfirm, setOpenConfirm] = useState(false);

    const [loading1, setLoading1] = useState(false);

    const [sync, setSync] = useState(0);

    const [removeCid, setRemoveCid] = useState('');

    const [costIdx, setCostIdx] = useState(0);

    useEffect(() => {
        function getCollections() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading1(true);

            const body = { filter, choice };

            axios.post(`${BASE_URL}/admin/collections?account=${account}&page=${page}&limit=${rows}`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setCount(ret.count);
                        for (const c of ret.collections) {
                            c.newRarity = c.rarity;
                        }
                        setCollections(ret.collections);
                    }
                }).catch(err => {
                    console.log("Error on getting collection list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading1(false);
                });
        }
        getCollections();
    }, [account, accountAdmin, accountToken, page, rows, filter, choice, sync]);

    const onRemoveCollection = async (cid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading1(true);
        try {
            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/remove_collection`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
                setSync(sync + 1);
            } else {
                openSnackbar(ret.msg, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading1(false);
    };

    const onResolveMetadata = async (cid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading1(true);
        try {
            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/resolve_metadata`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
            } else {
                openSnackbar(ret.err, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading1(false);
    };

    const onSetTrustlines = async (cid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading1(true);
        try {
            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/set_trustlines`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
            } else {
                openSnackbar(ret.err, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading1(false);
    };

    const onCalcProps = async (cid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading1(true);
        try {
            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/calc_props`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
            } else {
                openSnackbar(ret.err, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading1(false);
    };

    const onSetVerified = async (cid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/set_verified`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
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

    const handleResolveMetadata = (collection) => {
        onResolveMetadata(collection.uuid);
    }

    const handleSetTrustlines = (collection) => {
        onSetTrustlines(collection.uuid);
    }

    const handleCalcProperties = (collection) => {
        onCalcProps(collection.uuid);
    }

    const handleRemove = (collection) => {
        setRemoveCid(collection.uuid);
        setOpenConfirm(true);

        /*
        if (collection.items > 0) {
            openSnackbar('You can not remove this collection. (items > 0)', 'error');
        } else {
            setRemoveCid(collection.uuid);
            setOpenConfirm(true);
        }
        */
    }

    const onContinueRemove = () => {
        onRemoveCollection(removeCid);
    }

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
    };

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleChangeCost = (e) => {
        const value = e.target.value;
        setCostIdx(value);
    };

    const handleSetVerified = (collection) => {
        onSetVerified(collection.uuid);
    }

    const handleChangeRaritySelect = (e, idx) => {
        const value = e.target.value;
        console.log(`${value} - ${idx}`);
        const newCollections = [];
        for (const c of collections) {
            newCollections.push(c);
        }
        newCollections[idx].newRarity = value;
        setCollections(newCollections);
    };

    const handleChangeRarity = async (collection) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const cid = collection.uuid;
            const newRarity = collection.newRarity;

            const body = { cid, newRarity };

            const res = await axios.post(`${BASE_URL}/admin/change_rarity`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
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

    const handleImportAgain = async (collection) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const cid = collection.uuid;

            const body = { cid };

            const res = await axios.post(`${BASE_URL}/admin/import_again`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}});

            let ret = res.data;
            if (ret.status) {
                openSnackbar(ret.msg, 'success');
            } else {
                openSnackbar(ret.err, 'error');
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading(false);
    };

    return (
        <>
            <ToggleButtonGroup
                color="primary"
                value={choice}
                exclusive
                // size="small"
                onChange={handleChangeChoice}
            >
                <ToggleButton value="all" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>All</ToggleButton>
                <ToggleButton value="normal" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Normal</ToggleButton>
                <ToggleButton value="bulk" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Bulk</ToggleButton>
                <ToggleButton value="account" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>By Account</ToggleButton>
                <ToggleButton value="nometa" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>No Metadata</ToggleButton>
                <ToggleButton value="imported" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Imported</ToggleButton>
                <ToggleButton value="itemsmismatch" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Items Mismatch</ToggleButton>
            </ToggleButtonGroup>

            <Stack direction="row">
                <TextField
                    id='textFilter'
                    // autoFocus
                    // fullWidth
                    variant='outlined'
                    placeholder='Filter'
                    margin='dense'
                    onChange={handleChangeFilter}
                    autoComplete='new-password'
                    inputProps={{autoComplete: 'off'}}
                    value={filter}
                    onFocus={event => {
                        event.target.select();
                    }}
                    sx={{pl:0, pr:0, pt: 0, pb: 0, mt: 4}}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                {loading1 && <ClipLoader color='#ff0000' size={15} /> }
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            {
                collections && collections.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 5}}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
            }

            { count > 0 &&
                <ListToolbar
                    count={count}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }

            <ConfirmRemoveDialog open={openConfirm} setOpen={setOpenConfirm} onContinue={onContinueRemove} />

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
                        collections && collections.map((row, idx) => {
                            const {
                                account,
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
                                type,
                                items,
                                txitems,
                                costs,
                                verified,
                                category,
                                nometa,
                                rarity,
                                newRarity,
                                imported
                            } = row;

                            const strDateTime = formatDateTime(created);

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
                                    {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                    {/* <TableCell align="left" width='15%'>
                                        <Stack spacing={1}>
                                            <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                                sx={{
                                                    mr:2,
                                                    width: 128,
                                                    height: 128,
                                                    filter: ((type !== 'normal') && (!infoIPFS || !infoIPFS.cid))?'grayscale(100%)':`drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`,
                                                }}
                                            />
                                        </Stack>
                                    </TableCell> */}

                                    <TableCell align="left">
                                        <Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {type === "normal" && imported !== "yes" &&
                                                    <Tooltip title='Normal Collection'>
                                                        <GridOnIcon color='info'/>
                                                    </Tooltip>
                                                }
                                                {imported === "yes" &&
                                                    <Tooltip title='Imported Collection'>
                                                        <ImportExportIcon color='info'/>
                                                    </Tooltip>
                                                }
                                                {type === "bulk" &&
                                                    <Tooltip title='Bulk Collection'>
                                                        <ViewCompactIcon color='info'/>
                                                    </Tooltip>
                                                }
                                                {type === "random" &&
                                                    <Tooltip title='Random Collection'>
                                                        <CasinoIcon color='info'/>
                                                    </Tooltip>
                                                }
                                                {type === "sequence" &&
                                                    <Tooltip title='Sequence Collection'>
                                                        <AnimationIcon color='info'/>
                                                    </Tooltip>
                                                }
                                                <Link href={`/collection/${slug}`}>
                                                    <Typography variant="s3" color="#33C2FF">{name} <Typography variant="s5" color={items !== txitems ? "error":"success"}>({items} / {txitems || 0} items)</Typography></Typography>
                                                </Link>

                                                <Tooltip title='Click to toggle verified'>
                                                    <IconButton onClick={()=>handleSetVerified(row)}>
                                                        <VerifiedIcon style={{color: verified === 'yes' ? "#4589ff":""}} />
                                                    </IconButton>
                                                </Tooltip>

                                                {(imported === 'yes' || (choice === 'itemsmismatch' && type === 'normal')) && items !== txitems &&
                                                    <Tooltip title='Import collection again'>
                                                        <IconButton onClick={()=>handleImportAgain(row)}>
                                                            <ImportExportIcon fontSize="medium" color="success" />
                                                        </IconButton>
                                                    </Tooltip>
                                                }

                                                <Tooltip title='Calculate Properties % again'>
                                                    <IconButton onClick={()=>handleCalcProperties(row)}>
                                                        <AssignmentIcon fontSize="medium" color="success" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title='Remove Collection'>
                                                    <IconButton onClick={()=>handleRemove(row)}>
                                                        <DeleteForeverIcon fontSize="medium" color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="s7" mr={1}>Rarity by:</Typography>
                                                <Stack direction="row" spacing={0} alignItems="center">
                                                    <CustomSelect
                                                        id='select_rarity'
                                                        value={newRarity}
                                                        onChange={(e)=>handleChangeRaritySelect(e, idx)}
                                                    >
                                                        <MenuItem
                                                            key='standard'
                                                            value='standard'
                                                        >
                                                            <Typography variant='s6' color="#EB5757">Standard</Typography>
                                                        </MenuItem>
                                                        <MenuItem
                                                            key='average'
                                                            value='average'
                                                        >
                                                            <Typography variant='s6' color="#EB5757">Average</Typography>
                                                        </MenuItem>
                                                        <MenuItem
                                                            key='statistical'
                                                            value='statistical'
                                                        >
                                                            <Typography variant='s6' color="#EB5757">Statistical</Typography>
                                                        </MenuItem>
                                                        <MenuItem
                                                            key='score'
                                                            value='score'
                                                        >
                                                            <Typography variant='s6' color="#EB5757">Score</Typography>
                                                        </MenuItem>
                                                        <MenuItem
                                                            key='self'
                                                            value='self'
                                                        >
                                                            <Typography variant='s6' color="#EB5757">Self</Typography>
                                                        </MenuItem>
                                                    </CustomSelect>
                                                    {rarity !== newRarity &&
                                                        <Tooltip title='Change Rarity'>
                                                            <IconButton size="small" onClick={()=>handleChangeRarity(row)}>
                                                                <LeaderboardOutlinedIcon fontSize="small" color="success" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </Stack>
                                            </Stack>

                                            {nometa && nometa.count > 0 &&
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="s7">No Meta:</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="s6">{nometa.count}</Typography>
                                                        <Typography variant="s7">{formatDateTime(nometa.time)}</Typography>
                                                        <Tooltip title='Resolve metadata again.'>
                                                            <IconButton size="small" onClick={()=>handleResolveMetadata(row)}>
                                                                <DocumentScannerIcon fontSize="small" color="success" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            }

                                            {costs && costs.length > 0 &&
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Typography variant="s7" mr={2}>Costs:</Typography>
                                                        <Stack direction="row" spacing={0} alignItems="center">
                                                            {/* <Typography variant="p4">Cost</Typography> */}
                                                            <CustomSelect
                                                                id='select_cost'
                                                                value={costIdx}
                                                            >
                                                                {costs.map((cost, idx) => (
                                                                    <MenuItem
                                                                        key={cost.md5}
                                                                        value={idx}
                                                                    >
                                                                        <Stack direction='row' alignItems="center">
                                                                            <Avatar alt="C" src={`https://xrpl.to/static/tokens/${cost.md5}.${cost.ext}`} sx={{ width: 18, height:18, mr: 1 }} />
                                                                            <Typography variant='s6' color="#EB5757">{cost.amount} {cost.name}</Typography>
                                                                        </Stack>
                                                                    </MenuItem>
                                                                ))}
                                                            </CustomSelect>
                                                            <Tooltip title='Set Trustlines manually again'>
                                                                <IconButton size="small" onClick={()=>handleSetTrustlines(row)}>
                                                                    <AdminPanelSettingsIcon fontSize="small" color="success" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                </Stack>
                                            }

                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Stack>
                                                    <Stack direction="row" spacing={0} alignItems="center">
                                                        <Link
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${account}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Typography variant="s7" color="#33C2FF"><Typography variant="s7">Creator:</Typography> {account}</Typography>
                                                        </Link>
                                                        <Link
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${account}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Tooltip title='Check on Bithomp'>
                                                                <IconButton size="small">
                                                                    <OpenInNewIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        <CopyToClipboard text={account} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                            <Tooltip title='Click to copy'>
                                                                <IconButton size="small">
                                                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>

                                                    {minter &&
                                                        <Stack direction="row" spacing={0} alignItems="center">
                                                            <Link
                                                                color="inherit"
                                                                target="_blank"
                                                                href={`https://bithomp.com/explorer/${minter}`}
                                                                rel="noreferrer noopener nofollow"
                                                            >
                                                                <Typography variant="s7" color="#33C2FF"><Typography variant="s7">Minter:</Typography> {minter} <Typography variant="s2">({minterName})</Typography></Typography>
                                                            </Link>
                                                            <Link
                                                                color="inherit"
                                                                target="_blank"
                                                                href={`https://bithomp.com/explorer/${minter}`}
                                                                rel="noreferrer noopener nofollow"
                                                            >
                                                                <Tooltip title='Check on Bithomp'>
                                                                    <IconButton size="small">
                                                                        <OpenInNewIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Link>
                                                            <CopyToClipboard text={minter} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                                <Tooltip title='Click to copy'>
                                                                    <IconButton size="small">
                                                                        <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </CopyToClipboard>
                                                        </Stack>
                                                    }

                                                    <Stack direction="row" spacing={0.3} alignItems="center">
                                                        <Typography variant="s7">Category: </Typography>
                                                        <Typography variant="s7" color="#33C2FF">{category}</Typography>
                                                    </Stack>

                                                    {infoIPFS && infoIPFS.cid &&
                                                        <Stack direction="row" spacing={0} alignItems="center">
                                                            <Typography variant="s7">IPFS CID:&nbsp;</Typography>
                                                            <Link
                                                                color="inherit"
                                                                target="_blank"
                                                                href={`https://gateway.xrpnft.com/ipfs/${infoIPFS.cid}`}
                                                                rel="noreferrer noopener nofollow"
                                                            >
                                                                <Typography variant="s7" color="#33C2FF">{infoIPFS.cid}</Typography>
                                                            </Link>
                                                            <Link
                                                                color="inherit"
                                                                target="_blank"
                                                                href={`https://gateway.xrpnft.com/ipfs/${infoIPFS.cid}`}
                                                                rel="noreferrer noopener nofollow"
                                                            >
                                                                <Tooltip title='Check on IPFS'>
                                                                    <IconButton size="small">
                                                                        <OpenInNewIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Link>
                                                            <CopyToClipboard text={`${infoIPFS.cid}`} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                                <Tooltip title='Click to copy'>
                                                                    <IconButton size="small">
                                                                        <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </CopyToClipboard>
                                                        </Stack>
                                                    }
                                                </Stack>
                                                <Stack>
                                                    {infoIPFS && infoIPFS.cid && status === 0x3F && // 0x3F = b0011 1111
                                                        <Stack alignItems="center">
                                                            <Link
                                                                color="inherit"
                                                                // target="_blank"
                                                                href={`/bulks/mint/${slug}`}
                                                                // rel="noreferrer noopener nofollow"
                                                            >
                                                                <IconButton aria-label='bulk-mint'>
                                                                    <CollectionsIcon sx={{width:48, height:48}} />
                                                                </IconButton>
                                                            </Link>
                                                            <Typography variant="d4">Bulk Mint</Typography>
                                                        </Stack>
                                                    }
                                                    {infoMINT &&
                                                        <Stack alignItems="center">
                                                            {infoMINT.count !== infoMINT.length?(
                                                                <RotatingSquare
                                                                    height="70"
                                                                    width="70"
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
                                                                    height="56"
                                                                    width="56"
                                                                    ariaLabel="vortex-loading"
                                                                    wrapperStyle={{}}
                                                                    wrapperClass="vortex-wrapper"
                                                                    colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                                                />
                                                            )}


                                                            <Typography variant="s7" color="#33C2FF">{infoMINT.count} / {infoMINT.length}</Typography>
                                                        </Stack>
                                                    }
                                                </Stack>
                                            </Stack>
                                            {description &&
                                                <Typography variant="s7" sx={{mb: 1}}>{description}</Typography>
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
                                            {(type === 'bulk' || type === 'random') &&
                                                <Stack direction="row" spacing={3} sx={{mt:1}}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <StatusContainer bulk={row} flag={FLAG_GOOGLE} />
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
                                                        <StatusContainer bulk={row} flag={FLAG_UNZIP} />
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
                                                        <StatusContainer bulk={row} flag={FLAG_IPFS} />
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
                                                        <StatusContainer bulk={row} flag={FLAG_MINT} />
                                                        <Typography variant="s4">Mint</Typography>
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
