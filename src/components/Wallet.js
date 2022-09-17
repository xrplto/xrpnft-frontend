import axios from 'axios';
import NextLink from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GridOnIcon from '@mui/icons-material/GridOn';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';

// Components
import MenuPopover from './MenuPopover';
import LoginDialog from './LoginDialog';
import XLS20Dialog from './XLS20Dialog';
// import ChooseAccountDialog from './dialog/ChooseAccountDialog';

export default function Wallet() {
    // https://github.com/mui/material-ui/issues/10000
    const BASE_URL = 'https://api.xrpnft.com/api';
    const anchorRef = useRef(null);
    const { accountProfile, setAccountProfile, setLoading } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openXLS20Dialog, setOpenXLS20Dialog] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        if (openLogin) {
            timer = setInterval(async () => {
                // console.log(counter + " " + isRunning, uuid);
                if (isRunning) return;
                isRunning = true;
                try {
                    const res = await axios.get(`${BASE_URL}/xumm/payloadlogin/${uuid}`);
                    if (res && res.data && res.data.account) {

                        console.log(res.data);
                        
                        const ret = res.data;
                        const account = ret.account;
                        const user_token = ret.user_token;
                        const token = ret.token;
                        const admin = ret.admin;

                        setOpen(true);
                        setOpenLogin(false);
                        setAccountProfile({account, uuid, user_token, token, admin});
                        return;
                    }
                } catch (err) {
                }
                isRunning = false;
                counter--;
                if (counter <= 0) {
                    setOpenLogin(false);
                }
            }, 2000);
        }
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        };
    }, [openLogin, uuid, setAccountProfile]);

    const onConnectXumm = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/xumm/login`);
            if (res.status === 200) {
                const uuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setUuid(uuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setOpenLogin(true);
            }
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    };

    const onDisconnectXumm = async (uuid) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/xumm/logout/${uuid}`);
            if (res.status === 200) {
                setAccountProfile(null);
                setUuid(null);
            }
        } catch(err) {
        }
        setLoading(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleXLS20Login = () => {
        setOpen(false);
        setOpenXLS20Dialog(true);
    };

    const handleXLS20LoginClose = () => {
        setOpenXLS20Dialog(false);
    };

    const handleLogin = () => {
        setOpenXLS20Dialog(false);
        onConnectXumm();
    };

    const handleLogout = () => {
        setOpen(false);
        onDisconnectXumm(accountProfile.uuid);
    }

    const handleLoginClose = () => {
        setOpenLogin(false);
        onDisconnectXumm(uuid);
    };

    // <Alert
    //     variant="outlined"
    //     severity="success">
    //     <AlertTitle>{accountProfile.account}</AlertTitle>
    //     <br/>
    //     Login successful!
    //     <br/>
    // </Alert>

    // <Alert severity="success" color="info">
    //     Login Successful!
    // </Alert>

    // <Snackbar open={true} autoHideDuration={2000} onClose={handleClose}>
    //     <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    //         Login Successful!
    //     </Alert>
    // </Snackbar>

    return (
        <>
            {/* <ChooseAccountDialog /> */}
            
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                onMouseOver={handleOpen}
            >
                <Icon icon={userLock}/>
            </IconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{ width: 220 }}
            >

                {accountProfile && accountProfile.account ? (
                        <>
                            <MenuItem
                                key="collection"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href="/collections" passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <GridOnIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>My Collections</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <MenuItem
                                key="create-bulk"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href="/bulk" passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <PhotoLibraryIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Manage Bulks</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                <Avatar alt="xumm" src="/static/xumm.jpg" sx={{ mr:1, width: 24, height: 24 }}/>
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://xls20.bithomp.com/explorer/${accountProfile.account}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {accountProfile.account}
                                    </Typography>
                                </Link>

                                {/* <CopyToClipboard text={accountProfile.account} onCopy={()=>{}}>
                                    <Tooltip title='Click to copy your address'>
                                        <IconButton>
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </CopyToClipboard> */}
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" onClick={handleLogout} size="small">
                                        Logout
                                    </Button>
                                    <CopyToClipboard text={accountProfile.account} onCopy={()=>{}}>
                                        <Button variant="contained" size="small" color="info">
                                            Copy
                                        </Button>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <MenuItem
                            key="xumm"
                            onClick={handleXLS20Login}
                            sx={{ typography: 'body2', py: 2, px: 2.5 }}
                        >
                            <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                <Avatar alt="xumm" src="/static/xumm.jpg" sx={{ mr:1, width: 24, height: 24 }}/>
                                <Typography variant='s3' style={{marginLeft: '10px'}}>XUMM Login</Typography>
                            </Stack>
                        </MenuItem>
                )}

            {/* <Divider sx={{ my: 1 }} /> */}
            </MenuPopover>

            <LoginDialog
                open={openLogin}
                handleClose={handleLoginClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            <XLS20Dialog
                open={openXLS20Dialog}
                handleClose={handleXLS20LoginClose}
                handleLogin={handleLogin}
            />
        </>
    );
}
