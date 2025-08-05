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

// Premium styled components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(10px)',
  background: 'rgba(0, 0, 0, 0.2)',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  borderRadius: 24,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  padding: theme.spacing(4),
  width: 360,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  backdropFilter: 'blur(20px)',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(18, 22, 25, 0.95) 0%, rgba(30, 35, 40, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    padding: 1,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 16,
  margin: theme.spacing(1, 0),
  padding: theme.spacing(2, 2.5),
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&:active': {
    transform: 'translateY(0)',
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
  padding: '8px 20px',
  borderRadius: 10,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

const WalletTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(0.5),
}));

const WalletSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  marginBottom: theme.spacing(3),
  fontWeight: 400,
}));

const ConnectIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
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
                    startIcon={<Icon icon="mdi:wallet" width={18} height={18} />}
                >
                    Connect
                </PremiumButton>
            )}

            {!accountLogin && (
                <StyledModal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="wallet-modal-title"
                    aria-describedby="wallet-modal-description"
                    closeAfterTransition
                >
                    <Fade in={open} timeout={400}>
                        <StyledBox>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Icon 
                                    icon="mdi:wallet-outline" 
                                    width={48} 
                                    height={48} 
                                    style={{ 
                                        color: theme.palette.primary.main,
                                        marginBottom: 16,
                                    }} 
                                />
                                <WalletTitle variant="h4" component="h2">
                                    Connect Wallet
                                </WalletTitle>
                                <WalletSubtitle>
                                    Choose your wallet
                                </WalletSubtitle>
                            </Box>
                            
                            <StyledMenuItem
                                key="xumm"
                                onClick={handleLogin}
                                disableRipple
                            >
                                <Stack direction='row' alignItems='center' sx={{ width: '100%' }}>
                                    <ConnectIcon>
                                        <Avatar 
                                            alt="xumm" 
                                            src="/static/xumm.jpg" 
                                            sx={{ width: 32, height: 32 }} 
                                        />
                                    </ConnectIcon>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography 
                                            variant='subtitle1' 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            Xaman
                                        </Typography>
                                    </Box>
                                    <Icon 
                                        icon="mdi:chevron-right" 
                                        width={24} 
                                        height={24}
                                        style={{ color: theme.palette.text.secondary }}
                                    />
                                </Stack>
                            </StyledMenuItem>
                        </StyledBox>
                    </Fade>
                </StyledModal>
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