import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { withStyles } from '@mui/styles';
import {
    styled, useTheme,
    Avatar,
    Backdrop,
    Box,
    Button,
    CardMedia,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';

// Loader
import { PulseLoader, ClockLoader, ClipLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import QRDialog from 'src/components/QRDialog';
import ListToolbar from './ListToolbar';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

export default function ProfileList({setCounterAccount}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [profiles, setProfiles] = useState([]);
    const [filter, setFilter] = useState('');

    const [loading, setLoading] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(-1);
        
    useEffect(() => {
        function getProfiles() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);
            axios.get(`${BASE_URL}/admin/profiles?page=${page}&limit=${rows}&filter=${filter}`, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setProfiles(ret.profiles);
                    }
                }).catch(err => {
                    console.log("Error on getting nft offers list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getProfiles();
    }, [accountAdmin, accountToken, page, rows, filter]);

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        const selAccount = profiles[index].account;
        setCounterAccount(selAccount);
    };

    return (
        <Stack>
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
                sx={{pl:2, pr:2, pt: 0, pb: 0, mt: 4}}
                onKeyDown={(e) => e.stopPropagation()}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            {loading && <ClipLoader color='#ff0000' size={15} /> }
                        </InputAdornment>
                    ),
                }}
            />
            <List sx={{ width: '100%' }}>
                {profiles && profiles.map((row, idx) => {
                    const {
                        account,
                        name,
                        logo,
                        banner,
                        description,
                        minterWallet,
                        timestamp
                    } = row;
                
                    const logoImage = logo?`https://s1.xrpnft.com/profile/${logo}`:'/static/account_logo.png';

                    let strDateTime = '';

                    const nDate = new Date(timestamp);
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
                    return (
                        <Stack key={account}>
                            <ListItemButton
                                selected={selectedIndex === idx}
                                onClick={(event) => handleListItemClick(event, idx)}
                                sx={{pt: 2, pb: 2}}
                            >
                                <ListItemAvatar>
                                    <Avatar alt="C" src={logoImage}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="s3" color="#33C2FF">{name || "[No Name]"}</Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Stack direction="row" spacing={0.2} alignItems="center">
                                                <Typography variant="s6">{account}</Typography>
                                                <Link
                                                    underline="none"
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://xls20.bithomp.com/explorer/${account}`}
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

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Login: </Typography>
                                                <Typography variant="s6">{strDateTime}</Typography>
                                            </Stack>
                                        </React.Fragment>
                                    }
                                    />
                            </ListItemButton>
                            <Divider />
                        </Stack>
                    )
                    })
                }
            </List>
            { total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }
        </Stack>
    );
}
