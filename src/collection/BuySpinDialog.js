import axios from 'axios';
import { useState, useEffect } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    OutlinedInput,
    Stack,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Typography,
    TextField
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import {
    Close as CloseIcon
} from '@mui/icons-material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext'

// Redux
import { useDispatch } from "react-redux";

// Components
import QRDialogNoPush from 'src/components/QRDialogNoPush';

// Loader
import { PulseLoader } from "react-spinners";

// Utils
import { fNumber } from 'src/utils/formatNumber';
import Decimal from 'decimal.js';

// Iconify
import { Icon } from '@iconify/react';
import copyIcon from '@iconify/icons-fad/copy';

// ----------------------------------------------------------------------
const BuyDialog = styled(Dialog) (({ theme }) => ({
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)', // Fix on Mobile
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
  
const BuyDialogTitle = (props) => {
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

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function BuySpinDialog({open, setOpen, infoSPIN, minter, openSnackbar, collection, setSpins}) {
    //     "infoSPIN": {
    //         "name": "XRP",
    //         "issuer": "XRPL",
    //         "currency": "XRP",
    //         "ext": "png",
    //         "cost": "1"
    //     },
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const token = accountProfile?.token;

    const [openScanQR, setOpenScanQR] = useState(false);
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);

    const [disclaimer, setDisclaimer] = useState(false);

    const {
        issuer,
        name,
        currency,
        md5,
        ext,
        cost
    } = infoSPIN;

    // const imgUrl = `https://xrpl.to/static/tokens/${md5}.${ext}`;

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
                const ret = await axios.get(`${BASE_URL}/spin/payload/${uuid}?account=${account}`, {headers: {'x-access-token': token}});
                const res = ret.data.data.response;
                // const account = res.account;
                const resolved_at = res.resolved_at;
                const dispatched_result = res.dispatched_result;
                const newSpins = ret.data.spins;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result && dispatched_result === 'tesSUCCESS') {
                        setSpins(newSpins);
                        handleClose();
                        openSnackbar('Transaction successful!', 'success');
                    }
                    else
                        openSnackbar('Transaction rejected!', 'error');

                    return;
                }
            } catch (err) {
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Transaction timeout!', 'error');
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
        if (!account || !token) {
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
            const user_token = accountProfile?.token;
            const cid = collection.uuid;
            let amount = {};
            if (currency !== 'XRP')
                amount.issuer = issuer;
            amount.currency = currency;
            amount.value = cost * quantity;
            
            const body = { account, dest: minter, amount, quantity, cid, user_token};

            const res = await axios.post(`${BASE_URL}/spin/buyspin`, body, {headers: {'x-access-token': token}});

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
            const res = await axios.delete(`${BASE_URL}/spin/logout/${uuid}`, {headers: {'x-access-token': token}});
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

    return (
        <>
            <Backdrop
                sx={{ color: "#000", zIndex: 1303 }}
                open={loading}
            >
                <PulseLoader color={"#FF4842"} size={10} />
            </Backdrop>

            <BuyDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                sx={{zIndex: 1302}}
                hideBackdrop={true}
            >
                <BuyDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4">Buy Mint</Typography>
                </BuyDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Typography variant="p5" sx={{mt: 0}}>To power up the spinner, you need at least 1 or more Mints. This will enable you to purchase NFTs that is randomly selected from this collection.</Typography>
                        <Typography variant="p5" sx={{mt: 2}}>Mints purchased for this collection can not be used on the other collections.</Typography>
                        {name !== 'XRP' &&
                            <Typography variant="p5" sx={{mt: 2}}>If you want to buy or trade {name} tokens please &nbsp;
                                <Link
                                    underline="always"
                                    color="#33C2FF"
                                    target="_blank"
                                    href={`https://xrpl.to/trade/${md5}`}
                                    rel="noreferrer noopener nofollow"
                                >
                                    visit here
                                </Link>.
                            </Typography>
                        }
                        <Stack direction="row" spacing={2} sx={{mt: 2}} alignItems="center">
                            <Typography variant="p4">Cost</Typography>
                            <Typography variant="s5" color="#33C2FF">{cost} {name} / Mint</Typography>
                            <Link
                                underline="none"
                                color="inherit"
                                target="_blank"
                                href={`https://bithomp.com/explorer/${issuer}`}
                                rel="noreferrer noopener nofollow"
                            >
                                <IconButton edge="end" aria-label="bithomp">
                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                </IconButton>
                            </Link>
                        </Stack>
                        <Stack spacing={2}  sx={{pt: 1}}>
                            <TextField
                                id="input-with-sx2"
                                variant="standard"
                                fullWidth
                                value={quantity}
                                autoComplete='new-password'
                                onFocus={event => {
                                    event.target.select();
                                }}
                                onChange={handleChangeQuantity}
                                onKeyDown={(e) => e.stopPropagation()}
                                margin='dense'
                                inputProps={{
                                    autoComplete: 'off',
                                    style: { textAlign: 'center' },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography variant="p4">Quantity <Typography variant='s2'>*</Typography></Typography>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="s4">Mints</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{mt: 1}}>
                            <Typography variant="p4">Total {name} Required</Typography>
                            <Typography variant="s5" color="#33C2FF">{fNumber(cost*quantity)} {name}</Typography>
                        </Stack>

                        <FormControlLabel sx={{mt: 2}} control={<Checkbox checked={disclaimer} onChange={handleChangeDisclaimer}/>}
                            label={<Typography variant="s6">I understand that I will be purchasing <Typography variant="s6" color="#33C2FF">{quantity} Mints</Typography> with total <Typography variant="s6" color="#33C2FF">{fNumber(cost*quantity)} {name}</Typography>. Each Mint will mint the NFT on XRPL and transfer it to my wallet address which is <Typography variant="s6" color="#33C2FF">{account}</Typography></Typography>}
                        />

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                onClick={handleApprove}
                                color='primary'
                                disabled={!canApprove}
                                // size='medium'
                            >
                                Approve in My Wallet
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </BuyDialog>

            <QRDialogNoPush
                open={openScanQR}
                type="Payment"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}
