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
import { PuffLoader, PulseLoader } from "react-spinners";
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Utils
import { getUnixTimeEpochFromRippleEpoch } from 'src/utils/parse';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CountdownTimer from './CountDownTimer';
import QRDialog from 'src/components/QRDialog';
import ConfirmAcceptOfferDialog from './ConfirmAcceptOfferDialog';

// cannot accept buy offer if you are not the owner of token.
// cannot accept sell offer if seller is not the owner of token.
// cannot accept sell offer if recepient account is not you.
// cannot accept offer if the expiration time and the closing time of the parent ledger has passed.
// cannot accept an offer made by you.

export default function OffersList({ nft, isSell }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const isOwner = accountLogin === nft.account;

    const [offers, setOffers] = useState([]);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [qrType, setQrType] = useState("NFTokenAcceptOffer");

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const [acceptOffer, setAcceptOffer] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);

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
    }, [sync]);

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

    const doProcessOffer = async (offer, isAcceptOrCancel) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        const index = offer.nft_offer_index;
        const owner = offer.owner;
        const destination = offer.destination;

        if (isAcceptOrCancel) {
            // Accept mode
            if (accountLogin === owner) {
                openSnackbar('You are the owner of this offer, you can not accept it.', 'error');
                return;
            }
        } else {
            // Cancel mode
            if (accountLogin !== owner) {
                openSnackbar('You are not the owner of this offer', 'error');
                return;
            }
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
                accept: isAcceptOrCancel?"yes":"no",
                sell: isSell?"yes":"no",
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/acceptcancel`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                let newQrType = isAcceptOrCancel?"NFTokenAcceptOffer":"NFTokenCancelOffer";
                if (isSell)
                    newQrType += " [Sell Offer]";
                else
                    newQrType += " [Buy Offer]";

                setQrType(newQrType);
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
        /*
        {
            "amount": {
                "currency": "534F4C4F00000000000000000000000000000000",
                "issuer": "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
                "value": "10"
            },
            "flags": 1,
            "nft_offer_index": "2212BFA0AAF995E9F9E9B6553DC97A1C37FB97334BBE8C5856CF7C7B1016D20E",
            "owner": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n"
        },
        {
            "amount": "10000000",
            "flags": 1,
            "nft_offer_index": "DF13A4FE5F44FF804015ED5C827F753BB7A1379651D88473CB50454EB0B89F17",
            "owner": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n"
        }
        */
        
        doProcessOffer(offer, false);
    }

    const handleAcceptOffer = async (offer) => {
        setAcceptOffer(offer);
        setOpenConfirm(true);
    }

    const onContinueAccept = async () => {
        doProcessOffer(acceptOffer, true);
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

            <ConfirmAcceptOfferDialog open={openConfirm} setOpen={setOpenConfirm} offer={acceptOffer} onContinue={onContinueAccept} />

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
                        const price = normalizeAmount(offer.amount);
                        return (
                            <Stack key={offer.nft_offer_index} sx={{mt: 2}}>
                                <Stack direction="row" spacing={1} alignItems="center">

                                    <Stack>
                                        {/* Sell Offer List - Not Owner */}
                                        {isSell && !isOwner &&
                                            <>
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
                                                    <>
                                                        {nft.account === offer.owner ?
                                                            <>
                                                                {offer.destination && accountLogin !== offer.destination ?
                                                                    <>
                                                                        <Tooltip title="This is not transferred to you, you can not accept.">
                                                                            <IconButton aria-label='close'>
                                                                                <CheckCircleOutlineIcon fontSize='large' color='disabled' />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                    :
                                                                    <Tooltip title="Accept Offer">
                                                                        <IconButton
                                                                            aria-label='close'
                                                                            onClick={() => handleAcceptOffer(offer)}
                                                                        >
                                                                            <CheckCircleOutlineIcon fontSize='large' color='success' />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            </>
                                                            :
                                                            <Tooltip title="This is not offered from the NFT owner.">
                                                                <IconButton aria-label='close'>
                                                                    <CheckCircleOutlineIcon fontSize='large' color='disabled' />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                    </>
                                                }
                                            </>
                                        }

                                        {/* Sell Offer List - Owner */}
                                        {isSell && isOwner &&
                                            <>
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
                                            </>
                                        }

                                        {/* Buy Offer List - Owner */}
                                        {!isSell && isOwner &&
                                            <>
                                                {accountLogin !== offer.owner ?
                                                    <Tooltip title="Accept Offer">
                                                        <IconButton
                                                            aria-label='close'
                                                            onClick={() => handleAcceptOffer(offer)}
                                                        >
                                                            <CheckCircleOutlineIcon fontSize='large' color='success' />
                                                        </IconButton>
                                                    </Tooltip>
                                                    :
                                                    <Tooltip title="Cancel Offer">
                                                        <IconButton
                                                            aria-label='close'
                                                            onClick={() => handleCancelOffer(offer)}
                                                        >
                                                            <HighlightOffIcon fontSize='large' color='error' />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            </>
                                        }

                                        {/* Buy Offer List - Not Owner */}
                                        {!isSell && !isOwner &&
                                            <>
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
                                            </>
                                        }
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant='s6' color='#33C2FF' noWrap>{price.amount} {price.name}</Typography>
                                            <Link
                                                // color="inherit"
                                                target="_blank"
                                                href={`https://bithomp.com/explorer/${offer.owner}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant='s6' style={{ wordWrap: "break-word" }}>{offer.owner}</Typography>
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
