import axios from 'axios';
import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';

// Material
import {
    alpha,
    useTheme,
    useMediaQuery,
    styled,
    Backdrop,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Select,
    Stack,
    Typography,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader } from 'react-spinners';

// Utils
import { XRP_TOKEN } from 'src/utils/constants';

// Components
import QueryToken from 'src/components/QueryToken';
import QRDialog from 'src/components/QRDialog';

// ----------------------------------------------------------------------
const OfferDialog = styled(Dialog)(({ theme }) => ({
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)', // Fix on Mobile
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },
    '& .MuiPaper-root': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderStyle: 'solid'
    }
}));

const OfferDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle
            sx={{
                m: 0,
                p: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
            }}
            {...other}
        >
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.primary.contrastText
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const Label = styled(Typography)({
    color: alpha('#637381', 0.99)
});

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
}));

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function CreateOfferDialog({ open, setOpen, onClose, nft, isSellOffer, onOfferCreated }) {
    // "costs": [
    //     {
    //         "md5": "0413ca7cfc258dfaf698c02fe304e607",
    //         "name": "SOLO",
    //         "issuer": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
    //         "currency": "534F4C4F00000000000000000000000000000000",
    //         "ext": "jpg",
    //         "exch": 0.29431199670355546,
    //         "cost": "100"
    //     }
    // ]
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { accountProfile, openSnackbar, sync, setSync } =
        useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [token, setToken] = useState(XRP_TOKEN);
    const [amount, setAmount] = useState('');

    const [openScanQR, setOpenScanQR] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timer = null;
        let dispatchTimer = null;
        let counter = 150;
        let isRunning = false;

        async function getDispatchResult() {
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/create/${uuid}?account=${account}`,
                    { headers: { 'x-access-token': accountToken } }
                );
                return ret.data?.data?.response?.dispatched_result;
            } catch (err) {
                console.error('Error getting dispatch result:', err);
                return null;
            }
        }

        const startInterval = () => {
            let attempts = 0;
            const MAX_ATTEMPTS = 10;

            dispatchTimer = setInterval(async () => {
                const result = await getDispatchResult();
                
                if (result === 'tesSUCCESS') {
                    if (onOfferCreated) onOfferCreated();
                    setSync(sync + 1);
                    openSnackbar('Create Offer successful!', 'success');
                    stopInterval();
                    return;
                }

                attempts++;
                if (attempts >= MAX_ATTEMPTS) {
                    openSnackbar('Create Offer rejected!', 'error');
                    stopInterval();
                }
            }, 1000);
        };

        const stopInterval = () => {
            if (dispatchTimer) clearInterval(dispatchTimer);
            if (timer) clearInterval(timer);
            setOpenScanQR(false);
            handleClose();
        };

        async function pollPayload() {
            if (isRunning || !uuid) return;
            
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/create/${uuid}?account=${account}`,
                    { headers: { 'x-access-token': accountToken } }
                );
                
                if (ret.data?.resolved_at) {
                    startInterval();
                    return;
                }
            } catch (err) {
                console.error('Error polling payload:', err);
            } finally {
                isRunning = false;
                counter--;
                
                if (counter <= 0) {
                    openSnackbar('Create Offer timeout!', 'error');
                    handleScanQRClose();
                }
            }
        }

        if (openScanQR && uuid) {
            timer = setInterval(pollPayload, 2000);
        }

        return () => stopInterval();
    }, [openScanQR, uuid, sync]);

    const onCreateOfferXumm = async () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const body = {
                account,
                issuer: token.issuer,
                currency: token.currency,
                amount,
                isSellOffer,
                NFTokenID: nft.NFTokenID,
                owner: nft.account,
                user_token: accountProfile?.user_token
            };

            console.log('Create Offer request body:', body);

            const res = await axios.post(`${BASE_URL}/offers/create`, body, {
                headers: { 'x-access-token': accountToken }
            });

            console.log('Response from /offers/create:', res.data);

            if (res.status === 200 && res.data?.data) {
                const { uuid, qrUrl, next } = res.data.data;
                setUuid(uuid);
                setQrUrl(qrUrl);
                setNextUrl(next);
                setOpenScanQR(true);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Create offer error:', err);
            openSnackbar(err.response?.data?.message || 'Network error!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onDisconnectXumm = async (uuid) => {
        setLoading(true);
        try {
            const res = await axios.delete(
                `${BASE_URL}/offers/create/${uuid}`,
                { headers: { 'x-access-token': accountToken } }
            );
            if (res.status === 200) {
                setUuid(null);
            }
        } catch (err) {}
        setLoading(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm(uuid);
    };

    const handleClose = () => {
        setOpen(false);
        setToken(XRP_TOKEN);
        setAmount('');
    };

    const handleChangeAmount = (e) => {
        const value = e.target.value;
        const newAmount = value ? value.replace(/[^0-9.]/g, '') : '';
        setAmount(newAmount);
    };

    const handleCreateOffer = () => {
        if (amount > 0) {
            onCreateOfferXumm();
        } else {
            openSnackbar('Invalid value!', 'error');
        }
    };

    return (
        <>
            <Backdrop sx={{ color: '#000', zIndex: 1303 }} open={loading}>
                <PulseLoader
                    color={(theme) => theme.palette.primary.main}
                    size={10}
                />
            </Backdrop>

            <OfferDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                hideBackdrop={true}
                disableScrollLock={false} // Change this to false
                disablePortal={false} // Change this to false
                keepMounted
                fullWidth
                maxWidth="sm"
            >
                <OfferDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    <Typography variant="h6">
                        Create {isSellOffer ? 'Sell' : 'Buy'} Offer
                    </Typography>
                </OfferDialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <Stack spacing={2}>
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Select Currency
                            </Typography>
                            <QueryToken
                                token={token}
                                setToken={setToken}
                                fullWidth // Add this prop
                            />
                        </Stack>

                        <Stack spacing={2}>
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Cost{' '}
                                <Typography component="span" color="error">
                                    *
                                </Typography>
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <TextField
                                    id="id_txt_costamount"
                                    variant="outlined"
                                    label="Amount"
                                    placeholder="Enter amount"
                                    onChange={handleChangeAmount}
                                    autoComplete="new-password"
                                    value={amount}
                                    onFocus={(event) => {
                                        event.target.select();
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main'
                                            }
                                        }
                                    }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ minWidth: 80 }}
                                >
                                    {token?.name}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                            sx={{ mt: 2 }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddCircleIcon />}
                                onClick={handleCreateOffer}
                                color="primary"
                                sx={{
                                    px: 4,
                                    py: 1,
                                    borderRadius: 2,
                                    boxShadow: (theme) =>
                                        `0px 4px 8px ${alpha(
                                            theme.palette.primary.main,
                                            0.24
                                        )}`
                                }}
                            >
                                Create Offer
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </OfferDialog>

            <QRDialog
                open={openScanQR}
                type="NFTokenCreateOffer"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}