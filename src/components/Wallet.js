import axios from 'axios';
import NextLink from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    alpha,
    Avatar,
    Badge,
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
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ImportExportIcon from '@mui/icons-material/ImportExport';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import userLock from '@iconify/icons-fa-solid/user-lock';

// Utils
import { getHashIcon } from 'src/utils/parse';

// Components
import LoginDialog from './LoginDialog';

export default function Wallet() {
    // https://github.com/mui/material-ui/issues/10000
    const BASE_URL = 'https://api.xrpnft.com/api';
    const anchorRef = useRef(null);
    const { accountProfile, setAccountProfile, acceptNfts, setAcceptNfts, orphanedOffers, setOrphanedOffers, setLoading, sync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const accountLogo = accountProfile?.logo;
    const accountUuid = accountProfile?.xuuid;
    const isAdmin = accountProfile?.admin;

    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    let logoImageUrl = null;
    if (accountProfile) {
        logoImageUrl = accountLogo?`https://s1.xrpnft.com/profile/${accountLogo}`:getHashIcon(accountLogin);
    }

    useEffect(() => {
        function getOffersCount() {
            if (!accountLogin || !accountToken) {
                return;
            }

            const body = {
                account: accountLogin
            };

            axios.post(`${BASE_URL}/info/header`, body, {headers: {'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setAcceptNfts(ret.acceptNfts);
                        setOrphanedOffers(ret.orphanedOffers);

                        // setOrphanedOffers(1);
                    }
                }).catch(err => {
                    console.log("Error on getting header info!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getOffersCount();

        // const timer = setInterval(() => getOffersCount(), 5000);
        // return () => {
        //     clearInterval(timer);
        // }
    }, [accountLogin, accountToken, sync]);

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
                    const ret = res?.data;
                    if (ret?.profile) {
                        const profile = ret.profile;
                        setOpen(true);
                        setOpenLogin(false);
                        setAccountProfile(profile);
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

    const onCancelLoginXumm = async (xuuid) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/account/cancellogin/${xuuid}`);
            if (res.status === 200) {
                setAccountProfile(null);
                setUuid(null);
            }
        } catch(err) {
        }
        setAccountProfile(null);
        setUuid(null);
        setAcceptNfts(0);

        setLoading(false);
    };

    const onLogoutXumm = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/account/logout/${accountLogin}/${accountUuid}`, {headers: {'x-access-token': accountToken}});
            if (res.status === 200) {
                setAccountProfile(null);
                setUuid(null);
            }
        } catch(err) {
        }
        setAccountProfile(null);
        setUuid(null);
        setAcceptNfts(0);

        setLoading(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = () => {
        setOpen(false);
        onConnectXumm();
    };

    const handleLogout = () => {
        setOpen(false);
        onLogoutXumm();
    }

    const handleLoginClose = () => {
        setOpenLogin(false);
        onCancelLoginXumm(uuid);
    };

    return (
        <>
            {/* <ChooseAccountDialog /> */}

            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                // onMouseOver={handleOpen}
            >
                <Badge color="primary" badgeContent={acceptNfts + orphanedOffers}>
                    {logoImageUrl?(
                        <Avatar
                            variant={accountLogo?"":"square"}
                            alt="user" src={logoImageUrl}
                            sx={{ width: 32, height: 32 }}
                        />
                    ):(
                        <Icon icon={userLock}/>
                    )}
                </Badge>
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
                {accountLogin ? (
                        <>
                            {acceptNfts > 0 &&
                                <MenuItem
                                    key="account_accept_nft_offer"
                                    sx={{ typography: 'body2', py: 2, px: 2.5, mt: 1 }}
                                >
                                    <NextLink href={`/account/${accountLogin}/accept`} passHref>
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <Badge color="primary" badgeContent={acceptNfts}>
                                                <AssignmentReturnedIcon sx={{ width: 24, height: 24 }}/>
                                            </Badge>
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Accept NFTs</Typography>
                                        </Stack>
                                    </NextLink>
                                </MenuItem>
                            }
                            {orphanedOffers > 0 &&
                                <MenuItem
                                    key="account_orphaned_offers"
                                    sx={{ typography: 'body2', py: 2, px: 2.5, mt: 1 }}
                                >
                                    <NextLink href={`/account/${accountLogin}/orphaned`} passHref>
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <Badge color="primary" badgeContent={orphanedOffers}>
                                                <DeleteSweepIcon sx={{ width: 24, height: 24 }}/>
                                            </Badge>
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Orphaned Offers</Typography>
                                        </Stack>
                                    </NextLink>
                                </MenuItem>
                            }
                            <MenuItem
                                key="account_profile"
                                sx={{ typography: 'body2', py: 2, px: 2.5 }}
                            >
                                <NextLink href={`/account/${accountLogin}`} passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <AccountBoxIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Profile</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            {isAdmin > 0 &&
                                <MenuItem
                                    key="import_collection"
                                    sx={{ typography: 'body2', py: 2, px: 2.5 }}
                                >
                                    <NextLink href="/collection/import" passHref>
                                        <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                            <ImportExportIcon />
                                            <Typography variant='s3' style={{marginLeft: '10px'}}>Import Collection</Typography>
                                        </Stack>
                                    </NextLink>
                                </MenuItem>
                            }
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
                                <NextLink href={`/bulks`} passHref>
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
                                <NextLink href={`/setting`} passHref>
                                    <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                        <SettingsIcon />
                                        <Typography variant='s3' style={{marginLeft: '10px'}}>Settings</Typography>
                                    </Stack>
                                </NextLink>
                            </MenuItem>
                            <Divider />
                            <Stack spacing={1} alignItems='center' sx={{pt: 1, pb: 2}}>
                                {logoImageUrl?(
                                    <Avatar
                                        variant={accountLogo?"":"square"}
                                        alt="user" src={logoImageUrl}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ):(
                                    <Avatar alt="xumm" src="/static/xumm.jpg" sx={{ mr:1, width: 32, height: 32 }}/>
                                )}
                                <Link
                                    color="inherit"
                                    target="_blank"
                                    href={`https://bithomp.com/explorer/${accountLogin}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    <Typography align="center" style={{ wordWrap: "break-word" }} variant="body2" sx={{ width: 180, color: 'text.secondary' }} >
                                        {accountLogin}
                                    </Typography>
                                </Link>

                                {/* <CopyToClipboard text={accountLogin} onCopy={()=>{}}>
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
                                    <CopyToClipboard text={accountLogin} onCopy={()=>{}}>
                                        <Button variant="outlined" size="small">
                                            Copy
                                        </Button>
                                    </CopyToClipboard>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        <MenuItem
                            key="xumm"
                            onClick={handleLogin}
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
        </>
    );
}
