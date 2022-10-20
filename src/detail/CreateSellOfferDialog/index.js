import axios from 'axios';
import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';

// Material
import { withStyles } from '@mui/styles';
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
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext'

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { fNumber } from 'src/utils/formatNumber';
import { XRP_TOKEN } from 'src/utils/constants';

// Components
import QueryToken from './QueryToken';
import QRDialogNoPush from 'src/components/QRDialogNoPush';

// ----------------------------------------------------------------------
const OfferDialog = styled(Dialog) (({ theme }) => ({
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)', // Fix on Mobile
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
  
const OfferDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const Label = withStyles({
    root: {
        color: alpha('#637381', 0.99)
    }
})(Typography);

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
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

export default function CreateSellOfferDialog({open, setOpen, nft}) {
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

    const [token, setToken] = useState(XRP_TOKEN);
    const [amount, setAmount] = useState('');

    const [openScanQR, setOpenScanQR] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, uuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/create/selloffer/${uuid}?account=${account}`, {headers: {'x-access-token': accountToken}});
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        // const newMints = ret.data.mints;
                        handleClose();
                        openSnackbar('Create Sell Offer successful!', 'success');
                    }
                    else
                        openSnackbar('Create Sell Offer rejected!', 'error');

                    return;
                }
            } catch (err) {
                console.log(err);
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Create Sell Offer timeout!', 'error');
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

    const onCreateOfferXumm = async () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const user_token = accountProfile?.user_token;
            const uuid = nft.uuid;
            const issuer = token.issuer;
            const currency = token.currency;
            const body = { account, uuid, issuer, currency, amount, user_token};

            const res = await axios.post(`${BASE_URL}/create/selloffer`, body, {headers: {'x-access-token': accountToken}});

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
            const res = await axios.delete(`${BASE_URL}/create/selloffer/${uuid}`, {headers: {'x-access-token': accountToken}});
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
    }

    const handleChangeAmount = (e) => {
        const value = e.target.value;
        const newAmount = value?value.replace(/[^0-9.]/g, ""):'';
        setAmount(newAmount);
    }

    const handleCreateOffer = () => {
        if (amount > 0) {
            onCreateOfferXumm();
        } else {
            openSnackbar('Invalid value!', 'error');
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#000", zIndex: 1303 }}
                open={loading}
            >
                <PulseLoader color={"#FF4842"} size={10} />
            </Backdrop>

            <OfferDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                // sx={{zIndex: 1302}}
                hideBackdrop={true}
                disableScrollLock
                disablePortal
                keepMounted
            >
                <OfferDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4">Create Sell Offer</Typography>
                </OfferDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        {/* <Typography variant="p5" sx={{mt: 0}}></Typography> */}
                        {/* <Typography variant="p6" sx={{mt: 2}}></Typography> */}
                        <QueryToken
                            token={token}
                            setToken={setToken}
                        />

                        <Stack spacing={2} sx={{mt: 3}}>
                            <Typography variant='p2'>Cost <Typography variant='s2'>*</Typography></Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    id='id_txt_costamount'
                                    // autoFocus
                                    variant='outlined'
                                    placeholder=''
                                    onChange={handleChangeAmount}
                                    autoComplete='new-password'
                                    value={amount}
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    // sx={{width: 100}}
                                />
                                <Typography variant='p2'>{token?.name}</Typography>
                            </Stack>
                        </Stack>

                        {/* <Stack direction="row" spacing={2} sx={{mt: 3}}>
                            <TextField
                                id="outlined-size-name"
                                label="Name"
                                value={name}
                                size="small"
                                onChange={handleChangeName}
                            />

                            <TextField
                                id="outlined-size-value"
                                label="Value"
                                value={value}
                                size="small"
                                onChange={handleChangeValue}
                            />
                        </Stack> */}

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleIcon />}
                                size="small"
                                onClick={handleCreateOffer}
                            >
                                Create
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </OfferDialog>

            <QRDialogNoPush
                open={openScanQR}
                type="NFTokenCreateOffer"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}
