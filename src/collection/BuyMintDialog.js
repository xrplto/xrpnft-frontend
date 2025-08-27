import axios from 'axios';
import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';
import { keyframes } from '@mui/system';

// Material
import {
    alpha, useTheme, useMediaQuery,
    styled,
    Avatar,
    Backdrop,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
    TextField,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext'

// Components
import QRDialog from 'src/components/QRDialog';

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { fNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.2); }
  70% { box-shadow: 0 0 0 10px rgba(24, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
`;

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.12)',
        background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1c1e 0%, #2d2f31 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    },
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '&:disabled': {
        background: theme.palette.action.disabledBackground,
    }
}));

const StyledQuantityField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
        '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            animation: `${glowAnimation} 2s infinite`,
        }
    }
}));

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderRadius: 8,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    minWidth: 180
}));

const BuyDialogTitle = styled((props) => {
    const { children, onClose, ...other } = props;
    const theme = useTheme();

    return (
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }} {...other}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <LocalAtmIcon color="primary" />
                {children}
            </Stack>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
})(({ theme }) => ({
    padding: theme.spacing(2),
}));

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function BuyMintDialog({open, setOpen, type, cid, costs, setMints, setXrpBalance}) {
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

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [openScanQR, setOpenScanQR] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);

    const [disclaimer, setDisclaimer] = useState(false);

    const [cost, setCost] = useState(costs[0]);
    // {
    //     "md5": "xrp",
    //     "name": "XRP",
    //     "issuer": "XRPL",
    //     "currency": "XRP",
    //     "ext": "png",
    //     "exch": "1",
    //     "cost": "1"
    // },

    // const imgUrl = `https://s1.xrpl.to/token/${md5}`;

    let canApprove = false;
    const amt = GetNum(quantity);
    if (amt > 0 && disclaimer)
        canApprove = true;

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, uuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/spin/buymint/${uuid}?account=${account}&cid=${cid}`, {headers: {'x-access-token': accountToken}});
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        const newMints = ret.data.mints;
                        const newXrpBalance = ret.data.xrpBalance;

                        setMints(newMints);
                        setXrpBalance(newXrpBalance);
                        handleClose();
                        openSnackbar('Buy Mints successful!', 'success');
                    }
                    else
                        openSnackbar('Buy Mints rejected!', 'error');

                    return;
                }
            } catch (err) {
                console.log(err);
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Buy Mints timeout!', 'error');
                handleScanQRClose();
            }
        }
        if (openScanQR) {
            timer = setInterval(getPayload, 2000);
        }
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        };
    }, [openScanQR, uuid]);

    const onPaymentXumm = async () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        /*{
            "TransactionType" : "Payment",
            "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Amount" : {
               "currency" : "USD",
               "value" : "1",
               "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
            },
            "Fee": "12",
            "Flags": 2147483648,
            "Sequence": 2,
        }*/

        setLoading(true);
        try {
            const user_token = accountProfile?.user_token;

            const body = { account, md5: cost.md5, quantity, cid, user_token};

            const res = await axios.post(`${BASE_URL}/spin/buymint`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const uuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setUuid(uuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setOpenScanQR(true);
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Network error!', 'error');
        }
        setLoading(false);
    };

    const onDisconnectXumm = async (uuid) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/spin/buymint/${uuid}`, {headers: {'x-access-token': accountToken}});
            if (res.status === 200) {
                setUuid(null);
            }
        } catch(err) {
        }
        setLoading(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm(uuid);
    };

    const handleClose = () => {
        setOpen(false);

        setCost(costs[0]);
        setQuantity(0);
        setDisclaimer(false);
    }

    const handleChangeQuantity = (e) => {
        const value = e.target.value;
        try {
            const amt = value?Number(value.replace(/[^0-9]/g, "")):0;
            setQuantity(amt)
        } catch (e) {}
    }

    const isNumber = (num) => {
        return /^[0-9.,]*$/.test(num.toString());
    }

    const handleApprove = (e) => {
        if (quantity > 0) {
            onPaymentXumm();
            // openSnackbar('Comming soon!', 'success');
        } else {
            openSnackbar('Invalid value!', 'error');
        }
    }

    const handleChangeDisclaimer = (e) => {
        setDisclaimer(e.target.checked);
    };

    const handleChangeCost = (e) => {
        const value = e.target.value;

        let newCost = null;
        for (var t of costs) {
            if (t.md5 === value) {
                newCost = t;
                break;
            }
        }
        if (newCost)
            setCost(newCost);
    };

    return (
        <>
            <Backdrop
                sx={{ color: "#000", zIndex: 1303 }}
                open={loading}
            >
                <PulseLoader color={theme.palette.primary.main} size={10} />
            </Backdrop>

            <StyledDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                hideBackdrop={true}
                disableScrollLock
                disablePortal
                keepMounted
            >
                <BuyDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4" color="primary.main">Buy Mint</Typography>
                </BuyDialogTitle>

                <DialogContent sx={{ px: 3, pb: 4 }}>
                    <Stack spacing={4}>
                        {/* Info Section */}
                        <Box sx={{ 
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                            borderRadius: 2,
                            p: 2
                        }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                To power up the spinner, you need at least 1 or more Mints. This will enable you to purchase NFTs {type === "random" ? "randomly" : "sequentially"} selected from this collection.
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    mt: 2,
                                    color: 'text.secondary',
                                    fontStyle: 'italic'
                                }}
                            >
                                Note: Mints purchased for this collection cannot be used on other collections.
                            </Typography>
                        </Box>

                        {/* Cost Selector */}
                        <Stack spacing={1}>
                            <Typography variant="subtitle1" fontWeight={600}>Select Payment Method</Typography>
                            <CustomSelect
                                value={cost.md5}
                                onChange={handleChangeCost}
                            >
                                {costs.map((cost) => (
                                    <MenuItem key={cost.md5} value={cost.md5}>
                                        <Stack direction='row' alignItems="center" spacing={2}>
                                            <Avatar 
                                                alt={cost.name} 
                                                src={`https://s1.xrpl.to/token/${cost.md5}`} 
                                                sx={{ 
                                                    width: 32, 
                                                    height: 32,
                                                    border: '2px solid',
                                                    borderColor: 'primary.main'
                                                }} 
                                            />
                                            <Box>
                                                <Typography variant='subtitle2'>{cost.name}</Typography>
                                                <Typography variant='caption' color="text.secondary">
                                                    {cost.amount} per mint
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </CustomSelect>
                        </Stack>

                        {/* Quantity Input */}
                        <Stack spacing={1}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Quantity <Box component="span" color="error.main">*</Box>
                            </Typography>
                            <StyledQuantityField
                                value={quantity}
                                onChange={handleChangeQuantity}
                                type="number"
                                size="small"
                                inputProps={{
                                    min: 0,
                                    style: { textAlign: 'center' }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Total Required: <Box component="span" color="primary.main" fontWeight={600}>
                                    {fNumber(cost.amount * quantity)} {cost.name}
                                </Box>
                            </Typography>
                        </Stack>

                        {/* Disclaimer */}
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={disclaimer} 
                                    onChange={handleChangeDisclaimer}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    I understand that I will be purchasing <Box component="span" color="primary.main" fontWeight={600}>{quantity} Mints</Box> with total <Box component="span" color="primary.main" fontWeight={600}>{fNumber(cost.amount * quantity)} {cost.name}</Box>. Each Mint will mint the NFT on XRPL and transfer it to my wallet address which is <Box component="span" color="primary.main" fontWeight={600}>{account}</Box>
                                </Typography>
                            }
                        />

                        {/* Action Button */}
                        <GradientButton
                            onClick={handleApprove}
                            disabled={!canApprove}
                            size="large"
                            startIcon={<AccountBalanceWalletIcon />}
                            sx={{ py: 1.5 }}
                        >
                            Approve in My Wallet
                        </GradientButton>
                    </Stack>
                </DialogContent>
            </StyledDialog>

            <QRDialog
                open={openScanQR}
                type="Payment"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}