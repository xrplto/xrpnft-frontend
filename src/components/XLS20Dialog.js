import axios from 'axios'
import { useState, useEffect, useRef } from 'react';

// Material
import {
    alpha, styled,
    Box,
    Dialog,
    Grid,
    Link,
    Stack,
    Typography,
    // DialogTitle, 
    //Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';

export default function XLS20Dialog({open, handleClose, handleLogin}) {
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        setWallet(null);
    }, [open]);

    const onCreateWallet = async () => {
        // POST https://faucet-nft.ripple.com/accounts
        setLoading(true);
        try {
            const res = await axios.post(`https://faucet-nft.ripple.com/accounts`);

            if (res.status === 200) {
                const ret = res.data;
                /*{
                    "account": {
                        "xAddress": "TVey1RQgqJ4Tn8a6NEEPnhho1txBNj1PwAySjrnSmHzye8G",
                        "secret": "sn6et6CCJQRLcKeiJJUE2RsDzovGM",
                        "classicAddress": "rPgWMNJCuum2Hkf7khU9LhR9JYx3TyLEqa",
                        "address": "rPgWMNJCuum2Hkf7khU9LhR9JYx3TyLEqa"
                    },
                    "amount": 10000,
                    "balance": 10000
                }*/
                if (ret.account) {
                    ret.account.balance = ret.balance;
                    setWallet(ret.account);
                }
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Dialog disableScrollLock onClose={handleClose} open={open} maxWidth='lg' fullWidth>
            <Stack spacing={1} alignItems="center" sx={{mt:2, p:2, pb: 0}}>
                <Typography variant="h2a">Test Configuration</Typography>
                <Typography variant='d4'>
                    If you already followed the steps below and have your own NFT-Devnet wallet,&nbsp;
                    <Link
                        component="button"
                        underline="always"
                        variant="d4"
                        color="error"
                        onClick={handleLogin}
                    >
                        Click here to login
                    </Link>
                </Typography>
            </Stack>
            <Grid container rowSpacing={2} sx={{mt: 0}}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1} sx={{mb: 3, p: 2}}>
                        <Typography variant="d3">Step 1 - Enable Xumm to connect to testnet</Typography>
                        <Typography variant="d3" sx={{pt: 1}}>1. Download and install Xumm from <Link href="https://xumm.app/">https://xumm.app</Link></Typography>
                        <Typography variant="d3">2. In the Xumm app, click the xumm logo at the bottom to scan a QR code</Typography>
                        <Typography variant="d3">3. Scan the QR code shown below</Typography>
                        <Typography variant="d3">4. Click continue when it warns about a custom node</Typography>
                        <Typography variant="d3">5. Click switch to begin using the XLS20 testnet</Typography>
                        <Stack alignItems="center" sx={{pt: 2}}>
                            <Box
                                component="img"
                                alt="QR"
                                sx={{width:240, height:240}}
                                src='/static/xls20testnet.png'
                            />
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1} sx={{mb: 3, p: 2}}>
                        <Typography variant="d3">Step 2 - Get your testnet funded wallet</Typography>
                        <Typography variant="d3" sx={{pt: 1}}>If you do not already have a testnet wallet, click the button below to generate a new one with 10,000 XRP balance.</Typography>
                        <Typography variant="d3">And you can't transfer that to your mainnet wallet </Typography>
                        
                        <Stack direction="row">
                            <LoadingButton
                                variant='contained'
                                loading={loading}
                                loadingPosition='start'
                                startIcon={<AccountBalanceWalletIcon />}
                                onClick={onCreateWallet}
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Create
                            </LoadingButton>
                        </Stack>

                        {wallet && 
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="d3">Address</Typography>
                                <Typography variant="d3" color="error">{wallet.address}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="d3">Secret</Typography>
                                <Typography variant="d3" color="error">{wallet.secret}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="d3">Balance</Typography>
                                <Typography variant="d3" color="error">{fIntNumber(wallet.balance)} XRP</Typography>
                            </Stack>
                        </Stack>
                        }
                    </Stack>
                </Grid>
            </Grid>
            
        </Dialog>
    );
}
