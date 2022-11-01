import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    useTheme,
    Avatar,
    Box,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { NFToken } from 'src/utils/constants';

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';

// ----------------------------------------------------------------------

export default function TrustSet() {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);

    const [choice, setChoice] = useState('all');
    const [trusts, setTrusts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getTrusts() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            axios.get(`${BASE_URL}/admin/trusts?page=${page}&limit=${rows}&choice=${choice}`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setTrusts(ret.trusts);
                    }
                }).catch(err => {
                    console.log("Error on getting trusts list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getTrusts();
    }, [page, rows, accountAdmin, accountToken, choice]);

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
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
                <ToggleButton value="error" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Error</ToggleButton>
            </ToggleButtonGroup>

            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                trusts && trusts.length === 0 &&
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
                        trusts && trusts.map((row) => {
                            const {
                                uuid,
                                account,
                                minter,
                                minterName,
                                cost,
                                amount,
                                status,
                                date
                            } = row;
                        
                            let strDateTime = '';

                            if (date) {
                                const nDate = new Date(date);
                                const year = nDate.getFullYear();
                                const month = (nDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                                const day = nDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                                const hour = nDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const min = nDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                                const sec = nDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

                                //const strTime = (new Date(date)).toLocaleTimeString('en-US', { hour12: false });
                                //const strTime = nDate.format("YYYY-MM-DD HH:mm:ss");
                                strDateTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
                                // const strTime = `${hour}:${min}:${sec}`;
                            }

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
                                            <Avatar alt="C" src='/static/account_logo.png' />
                                            <Stack spacing={0.5}>
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
                                                <Stack direction="row" spacing={0.2} alignItems="center">
                                                    <Typography variant="s6">{minter} <Typography variant="s2">({minterName})</Typography></Typography>
                                                    <Link
                                                        underline="none"
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${minter}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Tooltip title="Check on Bithomp">
                                                            <IconButton edge="end" aria-label="bithomp" size="small">
                                                                <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Link>
                                                    <CopyToClipboard text={minter} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                        <Tooltip title='Click to copy'>
                                                            <IconButton size="small">
                                                                <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CopyToClipboard>
                                                </Stack>
                                                <Typography variant="s7">{strDateTime}</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    
                                    <TableCell align="left">
                                        <Stack direction='row' spacing={0.8} alignItems="center">
                                            <Avatar alt="C" src={`https://xrpl.to/static/tokens/${cost.md5}.${cost.ext}`} />
                                            <Typography variant='p4' color="#EB5757">{amount}</Typography>
                                            <Typography variant='s2'>{cost.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="left">
                                        {status === 1 ?
                                            <Tooltip title="Success">
                                                <CheckCircleIcon color="success" />
                                            </Tooltip>
                                            :
                                            <Tooltip title={`Fail - ${status}`}>
                                                <ErrorIcon color="error" />
                                            </Tooltip>
                                        }
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
