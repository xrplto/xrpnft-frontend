import axios from 'axios';
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
    Modal,
    Box,
    Stack,
    Typography,
    Tooltip
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { styled, useTheme } from '@mui/material/styles';

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

// New styled components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  width: 380,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

export default function Wallet() {
    const theme = useTheme();
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
            if (!accountLogin) {
                return;
            }

            const body = {
                account: accountLogin
            };

            axios.post(`${BASE_URL}/account/notification`, body)
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
        // Instead of logging out here, redirect to the account page
        window.location.href = `/account/${accountLogin}`;
    };

    const handleLoginClose = () => {
        setOpenLogin(false);
        onCancelLoginXumm(uuid);
    };

    return (
        <>
            {accountLogin ? (
                <Tooltip title="Account">
                    <IconButton
                        ref={anchorRef}
                        onClick={() => { window.location.href = `/account/${accountLogin}`; }}
                        sx={{
                            padding: 0.5,
                            border: `2px solid ${theme.palette.primary.main}`,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        <Badge color="primary" badgeContent={acceptNfts + orphanedOffers}>
                            <Avatar
                                variant={accountLogo ? "circular" : "rounded"}
                                alt="user"
                                src={logoImageUrl || getHashIcon(accountLogin)}
                                sx={{ width: 32, height: 32 }}
                            />
                        </Badge>
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    startIcon={<Icon icon="mdi:wallet" />}
                    sx={{
                        py: 0.5,  // Reduce vertical padding
                        px: 2,    // Adjust horizontal padding as needed
                    }}
                >
                    Connect
                </Button>
            )}

            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="wallet-modal-title"
                aria-describedby="wallet-modal-description"
            >
                <StyledBox>
                    {!accountLogin && (
                        <>
                            <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ mb: 3 }}>
                                Connect Wallet
                            </Typography>
                            <StyledMenuItem
                                key="xumm"
                                onClick={handleLogin}
                            >
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <Avatar alt="xumm" src="/static/xumm.jpg" sx={{ width: 40, height: 40 }} />
                                    <Typography variant='body1'>Connect with Xaman</Typography>
                                </Stack>
                            </StyledMenuItem>
                        </>
                    )}
                </StyledBox>
            </StyledModal>

            <LoginDialog
                open={openLogin}
                handleClose={handleLoginClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}