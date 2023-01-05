import axios from 'axios';
import { useState, useEffect } from 'react';

// Material
import {
    useTheme, useMediaQuery,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Backdrop,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
    Button,
    Paper,
    Box,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanToolIcon from '@mui/icons-material/PanTool';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

// Loader
import { PuffLoader, PulseLoader } from "react-spinners";
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { NFToken, getMinterName } from "src/utils/constants";
import { normalizeAmount } from 'src/utils/normalizers';
import { fNumber } from 'src/utils/formatNumber';

// Components
import CreateOfferDialog from './CreateOfferDialog';
import QRDialog from 'src/components/QRDialog';
import ConfirmAcceptOfferDialog from './ConfirmAcceptOfferDialog';
import TimePeriods from './TimePeriodsDropdown';
import OffersList from './OffersList';
import SelectPriceDialog from './SelectPriceDialog';

import BurnNFT from './BurnNFT';
import { useCallback } from 'react';
import { getMetadata } from 'src/utils/parse';

// const NFT_FLAGS = {
//     0x00000001: 'lsfBurnable',
//     0x00000002: 'lsfOnlyXRP',
//     0x00000004: 'lsfTrustLine',
//     0x00000008: 'lsfTransferable',
// }

function getCostFromOffers(nftOwner, offers, isSellOffer) {
    let xrpCost = null;
    let noXrpCost = null;
    for (const offer of offers) {
        const {
            amount,
            destination,
            flags,
            nft_offer_index,
            owner
        } = offer;

        let validOffer = true;

        if (destination) validOffer = false;

        if (isSellOffer && nftOwner !== owner) validOffer = false;

        if (!validOffer) continue;

        const cost = normalizeAmount(amount);

        cost.offer = offer;

        if (cost.currency === "XRP") {
            if (xrpCost) {
                if (isSellOffer) {
                    if (cost.amount < xrpCost.amount)
                        xrpCost = cost;
                } else {
                    if (cost.amount > xrpCost.amount)
                        xrpCost = cost;
                }
            } else {
                xrpCost = cost;
            }
        } else {
            if (noXrpCost) {
                // Do nothing for now.
            } else {
                noXrpCost = cost;
            }
        }
    }

    return xrpCost || noXrpCost;
}

export default function NFTActions({ nft }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const largescreen = useMediaQuery(theme => theme.breakpoints.up('md'));
    const theme = useTheme();
    const {
        uuid,
        name,
        collection,
        flag,
        type,
        account,
        minter,
        issuer,
        date,
        meta,
        URI,
        status,
        // cost,
        destination,
        NFTokenID
    } = nft;

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const isOwner = accountLogin === account;
    const isBurnable = (flag & 0x00000001) > 0;

    const [openCreateOffer, setOpenCreateOffer] = useState(false);
    const [isSellOffer, setIsSellOffer] = useState(false);

    const [burnt, setBurnt] = useState(status === NFToken.BURNT);

    const [sellOffers, setSellOffers] = useState([]);
    const [buyOffers, setBuyOffers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);

    const [acceptOffer, setAcceptOffer] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openSelectPrice, setOpenSelectPrice] = useState(false);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [qrType, setQrType] = useState("NFTokenAcceptOffer");

    const [cost, setCost] = useState(null);

    const [sync, setSync] = useState(0);


    const [metadata, setMetadata] = useState(null)

    const fetchMetadata = useCallback(async (URI) => {
        const data = await getMetadata(URI);

        setMetadata(data);
    }, [URI])

    useEffect(() => {

        if (meta) {
            setMetadata(meta)
        } else if (URI) {
            // When meta == null, but URI != null, then fetch NFT metadata from URI field.
            fetchMetadata(URI)
        } else setMetadata(null)
    }, [meta, URI])

    useEffect(() => {
        function getOffers() {
            setLoading(true);
            axios.get(`${BASE_URL}/offers/${NFTokenID}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        const offers = ret.sellOffers;
                        const nftOwner = nft.account;
                        setCost(getCostFromOffers(nftOwner, offers, true));

                        setSellOffers(getValidOffers(ret.sellOffers, true));
                        setBuyOffers(getValidOffers(ret.buyOffers, false));
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
            // console.log(counter + " " + isRunning, xummUuid);
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
        const isSell = offer.flags === 1;

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
                accept: isAcceptOrCancel ? "yes" : "no",
                sell: isSell ? "yes" : "no",
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/acceptcancel`, body, { headers: { 'x-access-token': accountToken } });

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                let newQrType = isAcceptOrCancel ? "NFTokenAcceptOffer" : "NFTokenCancelOffer";
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
        } catch (err) {
            console.error(err);
        }
        setXummUuid(null);

        setPageLoading(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm();
    };

    const getValidOffers = (offers, isSell) => {
        const newOffers = []
        for (const offer of offers) {

            if (isSell) {
                // Sell Offers
                if (isOwner) {
                    // I am the Owner of NFT
                    if (accountLogin === offer.owner) {
                        newOffers.push(offer);
                    }
                } else {
                    // I am not the Owner of NFT
                    if (accountLogin === offer.owner) {
                        newOffers.push(offer);
                    } else {
                        if (nft.account === offer.owner && (!offer.destination || accountLogin === offer.destination)) {
                            newOffers.push(offer);
                        }
                    }
                }
            } else {
                // Buy Offers
                if (isOwner) {
                    // I am the Owner of NFT
                } else {
                    // I am not the Owner of NFT
                }

                if (!offer.destination || accountLogin === offer.destination)
                    // if ((!offer.destination || accountLogin === offer.destination) && offer.)
                    newOffers.push(offer);
            }
        }

        return newOffers;
    }

    const handleCreateSellOffer = () => {
        setIsSellOffer(true);
        setOpenCreateOffer(true);
    }

    const handleCreateBuyOffer = () => {
        setIsSellOffer(false);
        setOpenCreateOffer(true);
    }

    const onHandleBurn = () => {
        setBurnt(true);
    }

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

    const handleBuyNow = async () => {
        if (sellOffers.length > 1) {
            setOpenSelectPrice(true);
        } else {
            handleAcceptOffer(cost.offer);
        }
    }

    return (
        <Stack spacing={2}>
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
                    borderColor='#F4442E'
                    barColor='#51E5FF'
                />
            </Backdrop>

            <ConfirmAcceptOfferDialog open={openConfirm} setOpen={setOpenConfirm} offer={acceptOffer} onContinue={onContinueAccept} />

            <QRDialog
                open={openScanQR}
                type={qrType}
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            <CreateOfferDialog
                open={openCreateOffer}
                setOpen={setOpenCreateOffer}
                nft={nft}
                isSellOffer={isSellOffer}
            />

            <SelectPriceDialog
                open={openSelectPrice}
                setOpen={setOpenSelectPrice}
                offers={sellOffers}
                handleAccept={handleAcceptOffer}
            />

            <Stack spacing={2} sx={{ mt: 2 }}>
                {/* <Link underline='none' color={'text.primary'}>
                    Name
                </Link> */}
                <Typography variant='h2a'>{metadata?.name || '[No Name]'}</Typography>
            </Stack>

            {metadata?.description &&
                <Typography variant="s7">{metadata.description}</Typography>
            }

            {/* Make offer start */}
            <Paper
                sx={{
                    padding: 2,
                }}
            >
                {burnt ?
                    <Typography variant="s5">This NFT is burnt.</Typography>
                    :
                    <>
                        {destination && getMinterName(account) ? (
                            <>
                                {destination === accountLogin ?
                                    <Typography variant="s5">This NFT is being transferred to you. Click <CheckCircleOutlineIcon color='success' /> to accept it.</Typography>
                                    :
                                    <Typography variant="s5">This NFT is being transferred to &nbsp;
                                        <Link
                                            color="inherit"
                                            target="_blank"
                                            href={`https://bithomp.com/explorer/${destination}`}
                                            rel="noreferrer noopener nofollow"
                                        >
                                            <Typography variant="s3" color="#33C2FF">{destination}</Typography>
                                        </Link>.
                                    </Typography>
                                }
                            </>
                        ) : (
                            isOwner ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    gap: 1
                                }}>
                                    <Button
                                        fullWidth
                                        // sx={{ minWidth: 150 }}
                                        variant='outlined'
                                        startIcon={<LocalOfferIcon />}
                                        onClick={handleCreateSellOffer}
                                        color='success'
                                        disabled={!accountLogin || burnt}
                                    >
                                        Sell
                                    </Button>
                                    <BurnNFT nft={nft} onHandleBurn={onHandleBurn} />
                                </Box>
                            ) : (
                                <Grid container>
                                    <Grid item xs={12} sm={7}>
                                        <Typography variant="s7">Current Price</Typography>
                                        <Stack alignItems="center" sx={{ mt: 1, mb: 2 }}>
                                            {loading ? (
                                                <PulseLoader color='#00AB55' size={10} />
                                            ) : (
                                                cost ? (
                                                    cost.currency === "XRP" ?
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <Typography variant='s9' pt={0.8}><Icon icon={rippleSolid} width="24" height="24" /></Typography>
                                                            <Typography variant='s9'>{fNumber(cost.amount)}</Typography>
                                                        </Stack>
                                                        :
                                                        <Typography variant='s3'>{fNumber(cost.amount)} {cost.name}</Typography>

                                                ) : (
                                                    <Typography variant='s8'>- - -</Typography>
                                                )
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <Stack
                                            direction={{ xs: 'row', sm: 'column' }}
                                            spacing={{ xs: 1, sm: 2 }}
                                        >
                                            <Button
                                                fullWidth
                                                // sx={{ minWidth: 150 }}
                                                disabled={!cost || burnt}
                                                variant='contained'
                                                // color='success'
                                                onClick={handleBuyNow}
                                            // startIcon={<LocalOfferIcon />}
                                            >
                                                Buy Now
                                            </Button>
                                            <Button
                                                fullWidth
                                                // sx={{ minWidth: 150 }}
                                                disabled={!accountLogin || burnt}
                                                variant='outlined'
                                                // color='success'
                                                onClick={handleCreateBuyOffer}
                                            // startIcon={<LocalOfferIcon />}
                                            >
                                                Make Offer
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )
                        )}
                    </>
                }

            </Paper>
            {/* /* Make offer end */}

            {isOwner &&
                <Stack>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls='panel3a-content'
                            id='panel3a-header'
                        >
                            <Stack direction='row' spacing={2}>
                                <LocalOfferIcon />
                                <Typography variant='string'>Sell Offers</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ textAlign: 'center' }}>
                            <OffersList
                                nft={nft}
                                offers={sellOffers}
                                handleAcceptOffer={handleAcceptOffer}
                                handleCancelOffer={handleCancelOffer}
                                isSell={true}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            }

            <Stack>
                {/* Buy Offers start */}
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel3a-content'
                        id='panel3a-header'
                    >
                        <Stack direction='row' spacing={2}>
                            <PanToolIcon />
                            <Typography variant='string'>Offers</Typography>
                        </Stack>
                    </AccordionSummary>
                    {/* <Divider /> */}
                    <AccordionDetails>
                        <OffersList
                            nft={nft}
                            offers={buyOffers}
                            handleAcceptOffer={handleAcceptOffer}
                            handleCancelOffer={handleCancelOffer}
                            isSell={false}
                        />
                    </AccordionDetails>
                </Accordion>
                {/* Buy Offers end */}



                {/* Price History Start */}
                {/* <Accordion defaultExpanded >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel2a-content'
                        id='panel2a-header'
                    >
                        <Stack direction='row' spacing={2}>
                            <TimelineIcon />
                            <Typography variant='string' >Price History</Typography>
                        </Stack>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <TimePeriods />
                        <Typography sx={{ margin: 3, textAlign: 'center' }}>
                            No item activity yet
                        </Typography>
                    </AccordionDetails>
                </Accordion> */}
                {/* Price History end */}
            </Stack>
        </Stack>
    )
}

