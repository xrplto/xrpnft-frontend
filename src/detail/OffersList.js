import axios from 'axios';
import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { normalizeAmount } from 'src/utils/normalizers';

// Material
import {
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

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Utils
import { getUnixTimeEpochFromRippleEpoch } from 'src/utils/parse';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CountdownTimer from './CountDownTimer';

// cannot accept buy offer if you are not the owner of token.
// cannot accept sell offer if seller is not the owner of token.
// cannot accept sell offer if recepient account is not you.
// cannot accept offer if the expiration time and the closing time of the parent ledger has passed.
// cannot accept an offer made by you.

export default function OffersList({ nft, isSell }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const isOwner = accountLogin === nft.account;

    const [offers, setOffers] = useState([]);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        function getOffers() {
            setLoading(true);
            axios.get(`${BASE_URL}/offers/${nft.NFTokenID}?sell=${isSell}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setOffers(ret.offers);
                    }
                }).catch(err => {
                    console.log("Error on getting nft offers list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getOffers();
    }, []);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/offer/accept/${xummUuid}`);
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        // const offerCount = ret.data.data.offerCount;
                        // const nftUuid = ret.data.data.nftUuid;
                        // const newNfts = [];
                        // for (var n of nfts) {
                        //     if (n.uuid !== nftUuid)
                        //         newNfts.push(n);
                        // }
                        // setNfts(newNfts);
                        openSnackbar('Accepting NFT successful!', 'success');
                    }
                    else
                        openSnackbar('Accepting NFT failed!', 'error');
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

    const doProcessOffer = async (nft, SellOfferID, isAcceptOrCancel) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        if (accountLogin !== account) {
            openSnackbar('You are not the owner of this account', 'error');
            return;
        }
        setPageLoading(true);
        try {
            const {
                uuid,
                NFTokenID
            } = nft;

            const user_token = accountProfile.user_token;

            const body={ account, uuid, NFTokenID, SellOfferID, user_token };

            const res = await axios.post(`${BASE_URL}/offer/acceptnft`, body, {headers: {'x-access-token': accountToken}});

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
        setPageLoading(false);
    };

    const onDisconnectXumm = async () => {
        setPageLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/account/acceptnft/${xummUuid}`);
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

    const handleCancelOffer = async (index) => {
        // doProcessOffer(nft, index, false);
    }

    const handleAcceptOffer = async (index) => {
        // doProcessOffer(nft, index, true);
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={pageLoading}
            >
                <FadeLoader color='lightGreen' size={50} />
                {/* <Typography>loading...</Typography> */}
            </Backdrop>

            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                offers && offers.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 1, mb: 1}}>
                        <Typography variant="s7">No Offers yet</Typography>
                    </Stack>
            )
            }

            <Stack>
                {
                    offers.map((offer, idx) => {
                        const price = normalizeAmount(offer.amount);
                        return (
                            <Stack key={offer.nft_offer_index} sx={{mt: 2}}>
                                <Stack direction="row" spacing={1} alignItems="center">

                                    <Stack>
                                        {accountLogin && ((isSell && !isOwner) || (!isSell && isOwner)) &&
                                            <Tooltip title="Accept Offer">
                                                <IconButton
                                                    aria-label='close'
                                                    onClick={() => handleAcceptOffer(offer.nft_offer_index)}
                                                >
                                                    <CheckCircleOutlineIcon fontSize='large' color='success' />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        {accountLogin && ((isSell && isOwner) || (!isSell && !isOwner)) &&
                                            <Tooltip title="Cancel Offer">
                                                <IconButton
                                                    aria-label='close'
                                                    onClick={() => handleCancelOffer(offer.nft_offer_index)}
                                                >
                                                    <HighlightOffIcon fontSize='large' color='error' />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant='s6' color='#33C2FF'>{price.amount} {price.name}</Typography>
                                            <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://xls20.bithomp.com/explorer/${offer.owner}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant='s6'>{offer.owner}</Typography>
                                            </Link>
                                        </Stack>

                                        {offer.destination &&
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* <Typography variant='s4'>Destination</Typography> */}
                                                <TransferWithinAStationIcon />
                                                <Typography variant='s6'>{offer.destination}</Typography>
                                            </Stack>
                                        }

                                        {/* {offer.expiration ?
                                            <Stack direction="row" alignItems="center">
                                                <Typography variant='s4'>Expires by {new Date(getUnixTimeEpochFromRippleEpoch(offer.expiration)).toLocaleString()}</Typography>
                                                <CountdownTimer targetDate={getUnixTimeEpochFromRippleEpoch(offer.expiration)} />
                                            </Stack>
                                            :
                                            <Stack direction="row" alignItems="center">
                                                <Typography variant='string'>No Expiration</Typography>
                                            </Stack>
                                        } */}
                                    </Stack>
                                </Stack>
                                <Divider sx={{mt:2}} />
                            </Stack>
                        )
                    })
                }
            </Stack>
        </>
    );
}
