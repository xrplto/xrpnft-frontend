import axios from 'axios';
import { useState, useEffect } from 'react';

// Material
import {
    Backdrop,
    Button,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";

// Components
import QRDialog from 'src/components/QRDialog';
import BulkList from './BulkList';

export default function Bulks() {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const minterWallet = accountProfile?.minterWallet;

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/account/setnftminter/${xummUuid}`);
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        // handleClose();
                        openSnackbar('Set NFTokenMinter successful!', 'success');
                    }
                    else
                        openSnackbar('Set NFTokenMinter failed!', 'error');
                    return;
                }
            } catch (err) {
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Timeout!', 'error');
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
    }, [openScanQR, xummUuid]);

    const onMinterSetXumm = async (minter) => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        setLoading(true);
        try {
            const user_token = accountProfile.user_token;

            const body={ account, minter, user_token };

            const res = await axios.post(`${BASE_URL}/account/setnftminter`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setXummUuid(newUuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setOpenScanQR(true);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const onDisconnectXumm = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/account/setnftminter/${xummUuid}`);
            if (res.status === 200) {
                setXummUuid(null);
            }
        } catch(err) {
        }
        setLoading(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm();
    };

    const handleNFTMinterSet = () => {
        onMinterSetXumm(minterWallet.address);
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#000", zIndex: 1303 }}
                open={loading}
            >
                <PulseLoader color={"#FF4842"} size={10} />
            </Backdrop>

            <Stack spacing={1} sx={{mt: 4, mb:2}}>
                <Typography variant="h1a">Manage Bulks</Typography>
                <Typography variant="d1">Prepare to mint bulk NFTs, get zip files from google drive, extract and pin to IPFS.</Typography>
            </Stack>

            {minterWallet &&
                <Stack spacing={1} sx={{mt: 1, mb: 2}}>
                    <Typography variant="s6">You should set the NFTokenMinter account setting of your Account to the following address and don't change your NFTokenMinter to another address other than this one.</Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Link
                            color="inherit"
                            target="_blank"
                            href={`https://xls20.bithomp.com/explorer/${minterWallet.address}`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography variant="s6">{minterWallet.address} <Typography variant="s3" color="error">({minterWallet.name})</Typography></Typography>
                        </Link>

                        {/* <Tooltip
                            title="This is the account that mints NFTs for you.
                            Click to set NFTokenMinter and don't change your NFTokenMinter to another address other than this one."
                        >
                            <IconButton size="small" onClick={()=>handleNFTMinterSet()}>
                                <ApprovalOutlinedIcon color="error" fontSize="medium" />
                            </IconButton>
                        </Tooltip> */}
                    </Stack>

                    <Stack direction="row">
                        <Button variant="contained" color="primary" size="small" onClick={()=>handleNFTMinterSet()}>
                            Set NFTokenMinter
                        </Button>
                    </Stack>
                </Stack>
            }

            <QRDialog
                open={openScanQR}
                type="NFTokenMinterSet"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            <Stack sx={{mt:2, minHeight: '50vh'}}>
                <BulkList />
            </Stack>
        </>
    );
}
