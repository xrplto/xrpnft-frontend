import axios from 'axios';
import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { normalizeAmount } from 'src/utils/normalizers';

// Material
import {
    Backdrop,
    Box,
    Button,
    CardMedia,
    Skeleton,
    Container,
    Divider,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    CardWrapper,
    useTheme,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

// Loader
import { PuffLoader, PulseLoader } from 'react-spinners';
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import {
    checkExpiration,
    getUnixTimeEpochFromRippleEpoch,
    parseNFTokenID,
    getNftCoverUrl
} from 'src/utils/parse';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import QRDialog from 'src/components/QRDialog';
import FlagsContainer from 'src/components/Flags';
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import ConfirmAcceptOfferDialog from '../ConfirmAcceptOfferDialog';
import ListToolbar from '../ListToolbar';

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

export default function OffersList({ account, type, setTotalOffers }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar, sync, setSync } =
        useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const isOwner = accountLogin === account;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [offers, setOffers] = useState([]);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [qrType, setQrType] = useState('NFTokenAcceptOffer');

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const [acceptOffer, setAcceptOffer] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loadingImg, setLoadingImg] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [hideOffers, setHideOffers] = useState(0);
    
    const onImageLoaded = () => {
        setLoadingImg(false);
    }

    useEffect(() => {
        function getOffers() {
            setLoading(true);
            axios
                .get(
                    `${BASE_URL}/account/offers?account=${account}&type=${type}&page=${page}&limit=${rows}`
                )
                .then((res) => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        if (typeof setTotalOffers === 'function') {
                            setTotalOffers(ret.total);
                        }
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
                })
                .catch((err) => {
                    console.log('Error on getting offers list!!!', err);
                })
                .then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getOffers();
    }, [account, type, page, rows, hideOffers/*, sync*/]);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + ' ' + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/acceptcancel/${xummUuid}`
                );
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        setSync(sync + 1);
                        openSnackbar('Successful!', 'success');
                    } else openSnackbar('Rejected!', 'error');
                    return;
                }
            } catch (err) {}
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
                clearInterval(timer);
            }
        };
    }, [openScanQR, xummUuid, sync]);

    const doProcessOffer = async (offer, isAcceptOrCancel) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        const isSell = offer.flags === 1;

        const index = offer.index;
        const owner = offer.owner;
        const destination = offer.destination;
        const NFTokenID = offer.NFTokenID;

        if (isAcceptOrCancel) {
            // Accept mode
            if (accountLogin === owner) {
                openSnackbar(
                    'You are the owner of this offer, you can not accept it.',
                    'error'
                );
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
            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin,
                NFTokenID,
                index,
                destination,
                accept: isAcceptOrCancel ? 'yes' : 'no',
                sell: isSell ? 'yes' : 'no',
                user_token
            };

            const res = await axios.post(
                `${BASE_URL}/offers/acceptcancel`,
                body,
                { headers: { 'x-access-token': accountToken } }
            );

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                let newQrType = isAcceptOrCancel
                    ? 'NFTokenAcceptOffer'
                    : 'NFTokenCancelOffer';
                if (isSell) newQrType += ' [Sell Offer]';
                else newQrType += ' [Buy Offer]';

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

    const doCancelAll = async () => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setPageLoading(true);
        try {
            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin,
                type,
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/cancelall`, body, {
                headers: { 'x-access-token': accountToken }
            });

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setQrType('Cancel Offers');
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
            const res = await axios.delete(
                `${BASE_URL}/offers/acceptcancel/${xummUuid}`
            );
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

    const handleCancelOffer = async (offer) => {
        doProcessOffer(offer, false);
    };

    const handleAcceptOffer = async (offer) => {
        setAcceptOffer(offer);
        setOpenConfirm(true);
    };

    const onContinueAccept = async () => {
        doProcessOffer(acceptOffer, true);
    };

    const handleCancelAll = async (e) => {
        doCancelAll();
    };


    const handleHideOffer = async (offer) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        if (!isOwner) {
            openSnackbar('You are not the owner of this NFT', 'error');
            return;
        }

        setPageLoading(true);
        try {
            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin,
                index: offer.index,
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/hide`, body, {
                headers: { 'x-access-token': accountToken }
            });

            if (res.status === 200) {
                console.log(`Hide offer ${offer.index}`);
                setHideOffers(hideOffers + 1);
            }
        } catch (err) {
            console.error(err);
        }
        setPageLoading(false);
    };

    return (
        <Box sx={{ pl: 0, pr: 0, width: '100%' }}>
            <Backdrop
                sx={{
                    color: '#000',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={pageLoading}
            >
                <ProgressBar
                    height="80"
                    width="80"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass="progress-bar-wrapper"
                    borderColor="#F4442E"
                    barColor="#51E5FF"
                />
            </Backdrop>

            {type === 'orphaned' && (
                <SeeMoreTypography
                    variant="s7"
                    //   text={"When you have multiple Sell Offers on an NFT and one is accepted by another account, your NFT will transfer ownership and the remaining Sell Offers will become orphaned. Similarly, if you accept a Buy Offer from another account, your NFT will transfer ownership and any remaining Buy Offers will become orphaned. When you have multiple Buy Offers on another NFT and one is accepted, the remaining Buy Offers will also become orphaned. It's important to cancel these to conserve your XRP reserve."}
                />
            )}

            {offers && offers.length > 0 && accountLogin === account && type !== "received" && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                    <Button
                        disabled={loading}
                        variant="contained"
                        color="error"
                        onClick={handleCancelAll}
                        startIcon={<HighlightOffIcon />}
                        size="small"
                    >
                        Cancel ALL
                    </Button>
                </Stack>
            )}

            {loading ? (
                <Stack alignItems="center" sx={{ my: 4 }}>
                    <PulseLoader color="#00AB55" size={10} />
                </Stack>
            ) : offers && offers.length === 0 ? (
                <Stack alignItems="center" sx={{ my: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No Offers Available
                    </Typography>
                </Stack>
            ) : (
                <Stack spacing={2}>
                    {offers.map((offer, idx) => (
                        <OfferCard
                            key={offer.index}
                            offer={offer}
                            isOwner={isOwner}
                            accountLogin={accountLogin}
                            type={type}
                            handleAcceptOffer={handleAcceptOffer}
                            handleCancelOffer={handleCancelOffer}
                            handleHideOffer={handleHideOffer}
                            isMobile={isMobile}
                        />
                    ))}
                </Stack>
            )}

            <ConfirmAcceptOfferDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                offer={acceptOffer}
                onContinue={onContinueAccept}
            />

            <QRDialog
                open={openScanQR}
                type={qrType}
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            {total > 0 && (
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            )}
        </Box>
    );
}

function OfferCard({ offer, isOwner, accountLogin, type, handleAcceptOffer, handleCancelOffer, handleHideOffer, isMobile }) {
    const { price, isSell, NFTokenID, orphaned, meta, files, collection, slug, cslug, name, isVideo, imgUrl, expired, expire_string } = parseOfferData(offer);

    return (
        <Card elevation={3}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Link href={`/nft/${NFTokenID}`} underline="none">
                            <Stack direction="row" spacing={2} alignItems="center">
                                <CardMedia
                                    component={isVideo ? 'video' : 'img'}
                                    image={imgUrl}
                                    alt={name}
                                    sx={{ width: 64, height: 48, borderRadius: 1 }}
                                />
                                <Stack>
                                    <Link href={`/collection/${cslug}`} underline="none">
                                        <Typography variant="caption" color="text.secondary">
                                            {collection || ''}
                                        </Typography>
                                    </Link>
                                    <Typography variant="subtitle2" noWrap>
                                        {name}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" component="div">
                            {price.amount} {price.name}
                        </Typography>
                        {expire_string && (
                            <Typography variant="caption" color="text.secondary">
                                Expires: {expire_string}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Chip
                            label={isSell ? 'Sell offer' : type === 'orphaned' ? 'Orphaned offer' : 'Buy offer'}
                            color={isSell ? 'primary' : 'secondary'}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack direction="row" spacing={1} justifyContent={isMobile ? 'center' : 'flex-end'}>
                            {renderActionButtons(offer, isOwner, accountLogin, type, handleAcceptOffer, handleCancelOffer, handleHideOffer)}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function renderActionButtons(offer, isOwner, accountLogin, type, handleAcceptOffer, handleCancelOffer, handleHideOffer) {
    const { isSell, orphaned } = offer;

    if (type === "received" && accountLogin) {
        return (
            <>
                {isOwner && (
                    <>
                        <Button variant="contained" size="small" color="success" onClick={() => handleAcceptOffer(offer)}>
                            Accept
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => handleHideOffer(offer)}>
                            Hide
                        </Button>
                    </>
                )}
                {accountLogin === offer.owner && (
                    <Button variant="contained" size="small" color="error" onClick={() => handleCancelOffer(offer)}>
                        Cancel
                    </Button>
                )}
            </>
        );
    }

    if (isSell) {
        if (isOwner || accountLogin === offer.owner) {
            return (
                <Button variant={type === "buys" && orphaned !== "yes" ? "outlined" : "contained"} size="small" color="error" onClick={() => handleCancelOffer(offer)}>
                    Cancel
                </Button>
            );
        } else if (orphaned !== 'yes' && offer.destination && accountLogin === offer.destination) {
            return (
                <Button variant="contained" size="small" color="primary" onClick={() => handleAcceptOffer(offer)}>
                    Accept
                </Button>
            );
        }
    } else {
        if (isOwner && accountLogin !== offer.owner) {
            return (
                <Button variant="contained" size="small" color="primary" onClick={() => handleAcceptOffer(offer)}>
                    Accept
                </Button>
            );
        } else if (accountLogin === offer.owner) {
            return (
                <Button variant={type === "buys" && orphaned !== "yes" ? "outlined" : "contained"} size="small" color="error" onClick={() => handleCancelOffer(offer)}>
                    Cancel
                </Button>
            );
        }
    }

    return null;
}

function parseOfferData(offer) {
    const price = normalizeAmount(offer.amount);
    const isSell = offer.flags === 1;
    const {NFTokenID, orphaned, meta, files, collection, slug, cslug } = offer;

    const { flag, royalty, issuer, taxon, transferFee } =
        parseNFTokenID(NFTokenID);

    const name = offer.meta?.name || offer?.Name || 'No Name';

    const isVideo = /*meta?.video ? true : */false;

    const imgUrl = getNftCoverUrl({files}, 'small'); // , 48
    // const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta['image'].split("ipfs://")[1]}`;

    // offer.expiration = 1669585409; // Delete this line.

    const expired = checkExpiration(offer.expiration);
    const expire = offer.expiration ? (offer.expiration > 946684800 ? offer.expiration: offer.expiration + 946684800) * 1000 : '';
    const expire_string = expire ? new Date(expire).toLocaleString() : '';

    return { price, isSell, NFTokenID, orphaned, meta, files, collection, slug, cslug, name, isVideo, imgUrl, expired, expire_string };
}