import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
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
    Tooltip,
    Fade,
    Zoom,
    keyframes
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

// Custom animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 144, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(74, 144, 226, 0.8);
  }
  100% {
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Simple modal components
const SimpleModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SimpleBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  width: 400,
  maxWidth: '90vw',
  outline: 'none',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
}));

const SimpleButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '48px',
  padding: theme.spacing(1.5, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  color: theme.palette.text.primary,
  border: `1.5px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: theme.spacing(0.75),
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.5),
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    transform: 'translateY(-1px)',
  },
  '&:focus': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
    outline: 'none',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  '&:disabled': {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    color: theme.palette.text.disabled,
    borderColor: alpha(theme.palette.primary.main, 0.1),
    backdropFilter: 'none',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.3px',
  padding: '8px 16px',
  height: '36px',
  borderRadius: 4,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ProfileButton = styled(IconButton)(({ theme, hasNotifications }) => ({
  position: 'relative',
  padding: 0,
  width: 32,
  height: 32,
  borderRadius: 8,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -2,
    borderRadius: 10,
    padding: 2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    opacity: 1,
    animation: hasNotifications ? `${pulse} 2s infinite` : 'none',
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: '0.7rem',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(255, 82, 82, 0.5)',
    animation: `${glow} 2s ease-in-out infinite`,
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
    const [connecting, setConnecting] = useState(false);

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
        setConnecting(true);
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
        setConnecting(false);
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
                <Zoom in={true} timeout={300}>
                    <ProfileButton
                        ref={anchorRef}
                        onClick={() => { window.location.href = `/account/${accountLogin}`; }}
                        hasNotifications={acceptNfts + orphanedOffers > 0}
                    >
                        <StyledBadge 
                            badgeContent={acceptNfts + orphanedOffers}
                            invisible={acceptNfts + orphanedOffers === 0}
                        >
                            <Avatar
                                variant="rounded"
                                alt="user"
                                src={logoImageUrl || getHashIcon(accountLogin)}
                                sx={{ 
                                    width: 28, 
                                    height: 28,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    borderRadius: 1.5,
                                }}
                            />
                        </StyledBadge>
                    </ProfileButton>
                </Zoom>
            ) : (
                <PremiumButton
                    onClick={handleOpen}
                >
                    Log In
                </PremiumButton>
            )}

            {!accountLogin && (
                <SimpleModal
                    open={open}
                    onClose={handleClose}
                >
                    <SimpleBox>
                        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                            Connect Wallet
                        </Typography>
                        
                        <SimpleButton
                            onClick={handleLogin}
                            disabled={connecting}
                        >
                            {connecting ? 'Connecting...' : 'Xaman'}
                        </SimpleButton>
                    </SimpleBox>
                </SimpleModal>
            )}

            <LoginDialog
                open={openLogin}
                handleClose={handleLoginClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}