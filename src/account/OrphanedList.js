import axios from 'axios';
import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { normalizeAmount } from 'src/utils/normalizers';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Decimal from 'decimal.js';

// Material
import {
    Avatar,
    Backdrop,
    Divider,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Loader
import { PuffLoader, PulseLoader } from "react-spinners";
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Utils
import { parseNFTokenID } from 'src/utils/parse';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import QRDialog from 'src/components/QRDialog';
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';

export default function OrphanedList({ account }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [offers, setOffers] = useState([]);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [qrType, setQrType] = useState("NFTokenAcceptOffer");

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        function getOffers() {
            setLoading(true);
            axios.get(`${BASE_URL}/account/orphaned?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setOffers(ret.offers);

                        // const newOffers = [{
                        //     "_id": "637ddcf72430cc4537c4a8f5",
                        //     "status": "created",
                        //     "amount": "500000",
                        //     "flags": 1,
                        //     "NFTokenID": "0008000051A8DF348A9C2E8EF14AD99B699E4651C5BE0C0A535753250000001A",
                        //     "owner": "r3S8px1Qx6ctoQGv8puFwahoLWGjVZksQv",
                        //     "index": "84F0D691282969DB2ECA1DF333E563CBF5C9523AF3124A8A9743489F6267F842",
                        //     "type": "NFTokenCreateOffer",
                        //     "account": "r3S8px1Qx6ctoQGv8puFwahoLWGjVZksQv",
                        //     "Account": "r3S8px1Qx6ctoQGv8puFwahoLWGjVZksQv",
                        //     "hash": "C000D46D3230B777B6984AA5C92B9AB4405CD71C4AC0C1903CBFC57B146A24CC",
                        //     "date": null,
                        //     "ledger_index": 75946713,
                        //     "orphaned": "yes"
                        // }];
                        // setTotal(1);
                        // setOffers(newOffers);
                    }
                }).catch(err => {
                    console.log("Error on getting orphaned offers list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getOffers();
    }, [account, page, rows, sync]);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/offers/acceptcancel/${xummUuid}`);
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        setSync(sync + 1);
                        openSnackbar('Successful!', 'success');
                    }
                    else
                        openSnackbar('Rejected!', 'error');
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
    }, [openScanQR, xummUuid, sync]);

    const doProcessOffer = async (offer) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        const index = offer.nft_offer_index;
        const owner = offer.owner;
        const destination = offer.destination;

        if (accountLogin !== owner) {
            openSnackbar('You are not the owner of this offer', 'error');
            return;
        }

        setPageLoading(true);
        try {
            const {
                uuid,
                NFTokenID
            } = nft;

            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin, 
                uuid,
                NFTokenID,
                index,
                destination,
                accept: "no",
                sell: "yes",
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/acceptcancel`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setQrType("NFTokenCancelOffer - Orphaned");
                setXummUuid(newUuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setOpenScanQR(true);
            }
        } catch (err) {
            console.error(err);
        }
        setPageLoading(false);
    };

    const onDisconnectXumm = async () => {
        setPageLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/offers/acceptcancel/${xummUuid}`);
            // if (res.status === 200) {
            //     setXummUuid(null);
            // }
        } catch(err) {
            console.error(err);
        }
        setXummUuid(null);

        setPageLoading(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm();
    };

    const handleCancelOffer = async (offer) => {
        // Sell Offer
        doProcessOffer(offer);
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={pageLoading}
            >
               <ProgressBar
                    height="80"
                    width="80"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass="progress-bar-wrapper"
                    borderColor = '#F4442E'
                    barColor = '#51E5FF'
                />
            </Backdrop>

            <Typography variant="s7">When you create several Sell Offers on your NFT and if one is accepted by another account, your NFT will</Typography>
            <Typography variant="s7">go to another account and the remaining Sell Offers are still owned to you and they are orphaned offers.</Typography>
            <Typography variant="s7">Or if you accept the buy offer of your NFT from another account, your NFT will go to another account, </Typography>
            <Typography variant="s7">and Sell Offers will become orphaned offers. You must cancel them to save your account XRP reserve.</Typography>

            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                offers && offers.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 2, mb: 1}}>
                        <Typography variant="s2">[ No Orphaned Offers ]</Typography>
                    </Stack>
            )
            }

            <QRDialog
                open={openScanQR}
                type={qrType}
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            <Stack>
                {
                    offers.map((offer, idx) => {
                        const NFTokenID = offer.NFTokenID;
                        const price = normalizeAmount(offer.amount);
                        const index = offer.index;

                        const ParsedID = parseNFTokenID(NFTokenID);
                        const flag = ParsedID.flag;
                        const royalty = ParsedID.royalty;
                        const issuer = ParsedID.issuer;
                        const taxon = ParsedID.taxon;

                        let transferFee = 0;
                        try {
                            if (royalty)
                                transferFee = Decimal.div(royalty, '1000').toDP(3, Decimal.ROUND_DOWN).toNumber();
                        } catch (e) {}

                        return (
                            <Stack key={index} sx={{mt: 2}}>
                                <Stack direction="row" spacing={1} alignItems="center">

                                    <Stack>
                                        {accountLogin === offer.owner ?
                                            <Tooltip title="Cancel Offer">
                                                <IconButton
                                                    aria-label='close'
                                                    onClick={() => handleCancelOffer(offer)}
                                                >
                                                    <HighlightOffIcon fontSize='large' color='error' />
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Only the owner of this offer can cancel.">
                                                <IconButton aria-label='close'>
                                                    <HighlightOffIcon fontSize='large' color='disabled' />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant='s7'>Offer Price </Typography>
                                            <Typography variant='s6' color='#33C2FF'>{price.amount} {price.name}</Typography>
                                            <Typography variant='s7'>Flag </Typography>
                                            <FlagsContainer Flags={flag}/>
                                            {/* <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${issuer}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant='s6' style={{ wordWrap: "break-word" }}>{issuer}</Typography>
                                            </Link> */}
                                            <Typography variant='s7'>Taxon </Typography>
                                            <Typography variant='s6'>{taxon}</Typography>
                                            <Typography variant="s7">Transfer Fee</Typography>
                                            <Typography variant="s6">{transferFee} %</Typography>
                                        </Stack>

                                        {offer.destination &&
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* <Typography variant='s4'>Destination</Typography> */}
                                                <TransferWithinAStationIcon />
                                                <Typography variant='s6'>{offer.destination}</Typography>
                                            </Stack>
                                        }

                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant='s7'>NFTokenID </Typography>
                                            <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant='s6' style={{ wordWrap: "break-word" }}>{NFTokenID}</Typography>
                                            </Link>
                                        </Stack>

                                        <Stack direction="row" spacing={0.2} alignItems="center">
                                            <Typography variant='s7'>Issuer&nbsp;&nbsp;&nbsp;</Typography>
                                            <Typography variant="s6">{issuer}</Typography>
                                            <Link
                                                underline="none"
                                                color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${issuer}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Tooltip title="Check on Bithomp">
                                                    <IconButton edge="end" aria-label="bithomp" size="small">
                                                        <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Link>
                                            <CopyToClipboard text={issuer} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                <Tooltip title='Click to copy'>
                                                    <IconButton size="small">
                                                        <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Divider sx={{mt:2}} />
                            </Stack>
                        )
                    })
                }
            </Stack>

            { total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }
        </>
    );
}
