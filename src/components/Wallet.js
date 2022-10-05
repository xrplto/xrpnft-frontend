import axios from 'axios';
import NextLink from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    alpha,
    Avatar,
    Button,
    Divider,
    IconButton,
    Link,
    MenuItem,
    Popover,
    Stack,
    Typography
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';

// Components
import LoginDialog from './LoginDialog';
import XLS20Dialog from './XLS20Dialog';
// import ChooseAccountDialog from './dialog/ChooseAccountDialog';

export default function Wallet() {
    // https://github.com/mui/material-ui/issues/10000
    const BASE_URL = 'https://api.xrpnft.com/api';
    const anchorRef = useRef(null);
    const { accountProfile, setAccountProfile, setLoading } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountUuid = accountProfile?.uuid;

    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openXLS20Dialog, setOpenXLS20Dialog] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    const logoImageUrl = accountProfile?.logo?`https://s1.xrpnft.com/profile/${accountProfile.logo}`:null;

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
                    const res = await axios.get(`${BASE_URL}/account/login/${uuid}`);
                    if (res && res.data && res.data.account) {
                        const ret = res.data;
                        const account = ret.account;
                        const user_token = ret.user_token;
                        const token = ret.token;
                        const admin = ret.admin;
                        const logo = ret.logo || undefined;

                        setOpen(true);
                        setOpenLogin(false);
                        setAccountProfile({account, uuid, user_token, token, admin, logo});
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
            const res = await axios.post(`${BASE_URL}/account/login`);
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
            const res = await axios.delete(`${BASE_URL}/account/logout/${uuid}`);
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
        onDisconnectXumm(accountUuid);
    }

    const handleLoginClose = () => {
        setOpenLogin(false);
        onDisconnectXumm(uuid);
    };

    return (
        <>
            {/* <ChooseAccountDialog /> */}
            
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                // onMouseOver={handleOpen}
            >
                {logoImageUrl?(
                    <Avatar alt="user" src={logoImageUrl} sx={{ width: 32, height: 32 }}/>
                ):(
                    <Icon icon={userLock}/>
                )}
            </IconButton>

            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.5,
                        overflow: 'inherit',
                        // boxShadow: (theme) => theme.customShadows.z20,
                        border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
                        width: 220,
                    }
                }}
            >
                {account ? (
                        <>
                            <MenuItem
                                key="account_profile"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href={`/account/${account}`} passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AccountBoxIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Profile</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
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
                                key="create-nft"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href="/create" passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AddPhotoAlternateIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Create a NFT</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <MenuItem
                                key="manage-bulks"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href="/bulk" passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <PhotoLibraryIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Manage Bulks</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <MenuItem
                                key="settings"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href={`/setting/${account}`} passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <SettingsIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Settings</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                {logoImageUrl?(
                                    <Avatar alt="user" src={logoImageUrl} sx={{ width: 32, height: 32 }}/>
                                ):(
                                    <Avatar alt="xumm" src="/static/xumm.jpg" sx={{ mr:1, width: 32, height: 32 }}/>
                                )}
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://xls20.bithomp.com/explorer/${account}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {account}
                                    </Typography>
                                </Link>

                                {/* <CopyToClipboard text={account} onCopy={()=>{}}>
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
                                    <CopyToClipboard text={account} onCopy={()=>{}}>
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
            </Popover>

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
