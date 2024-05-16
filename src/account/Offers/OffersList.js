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
    useTheme
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

export default function OffersList({ account, type }) {
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
                        console.log(type, ret);
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
    }, [account, type, page, rows, sync]);

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

            {offers && offers.length > 0 && accountLogin === account && (
                <Stack direction="row" justifyContent="right">
                    <Button
                        disabled={loading}
                        variant="outlined"
                        color="error"
                        onClick={handleCancelAll}
                        startIcon={<HighlightOffIcon />}
                    >
                        Cancel ALL
                    </Button>
                </Stack>
            )}

            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color="#00AB55" size={10} />
                </Stack>
            ) : (
                offers &&
                offers.length === 0 && (
                    <Stack alignItems="center" sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="s6" color="#2de370">
                            [ No Offers ]
                        </Typography>
                    </Stack>
                )
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

            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    width: '100%',
                    '& > *': {
                        scrollSnapAlign: 'center'
                    },
                    '::-webkit-scrollbar': { display: 'none' }
                }}
            >
                <Stack sx={{width: '100%'}}>
                    {offers.map((offer, idx) => {
                        const price = normalizeAmount(offer.amount);
                        const isSell = offer.flags === 1;
                        const {NFTokenID, orphaned, meta, files} = offer;

                        const { flag, royalty, issuer, taxon, transferFee } =
                            parseNFTokenID(NFTokenID);

                        const isVideo = /*meta?.video ? true : */false;

                        const imgUrl = getNftCoverUrl({files}, 'small'); // , 48
                        // const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta['image'].split("ipfs://")[1]}`;

                        // offer.expiration = 1669585409; // Delete this line.

                        const expired = checkExpiration(offer.expiration);

                        // let expired = false;
                        // if (offer.expiration) {
                        //     const now = Date.now();
                        //     const expire = (offer.expiration > 946684800 ? offer.expiration: offer.expiration + 946684800) * 1000;

                        //     if (expire < now)
                        //         expired = true;
                        // }

                        return (
                            <Box
                                sx={{ 
                                    padding: 0,
                                    marginBottom: 1 ,
                                }}
                                key={offer.index}
                            >
                                <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'} px={1}>
                                    {!isMobile && (
                                        <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt:0, pl:0, pr:0}}>
                                            <Stack direction="row" sx={{mt:0, pl:isMobile? 0: 2, pr:0}}>
                                                <CardMedia
                                                    component={
                                                        loadingImg ? () =>
                                                            <Skeleton
                                                                variant='rectangular'
                                                                // animation='wave'
                                                                sx={{
                                                                    width: 64,
                                                                    height: 48,
                                                                    borderRadius: 1
                                                                }}
                                                            /> :
                                                            isVideo ? 'video' : 'img'}
                                                    image={imgUrl}
                                                    onLoad={onImageLoaded}
                                                    alt={'NFT'}
                                                    // controls={isVideo}
                                                    autoPlay={isVideo}
                                                    loop={isVideo}
                                                    muted
                                                    style={{
                                                        width: 64,
                                                        height: 48,
                                                        borderRadius: 1
                                                    }}
                                                />
                                                { loadingImg && <img src={imgUrl}
                                                    style={{ display: 'none' }}
                                                    onLoad={onImageLoaded} />
                                                }
                                                {
                                                    isVideo &&
                                                    <video src={imgUrl}
                                                        style={{ display: 'none' }}
                                                        onCanPlay={onImageLoaded}
                                                    />
                                                }
                                                <Stack
                                                    direction="column"
                                                    spacing={0}
                                                    alignItems="left"
                                                    sx={{
                                                        ml: 2
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        alignItems="center"
                                                    >
                                                        Name
                                                    </Stack>
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        alignItems="center"
                                                    >
                                                        <Typography variant="s7">
                                                            Flags:{' '}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <Typography
                                                variant="s6"
                                            >
                                                {price.amount} {price.name}
                                            </Typography>
                                            <Typography
                                                variant="s6"
                                            >
                                                {isSell && ('Sell offer')}
                                                {!isSell && type == 'buys' && ('Buy offer')}
                                                {!isSell && type == 'orphaned' && ('Orphaned offer')}
                                            </Typography>
                                            <Stack>
                                                {/* Sell Offer List - Not Owner */}
                                                {isSell && !isOwner && (
                                                <>
                                                    {accountLogin === offer.owner ? (
                                                        <Tooltip title="Cancel Offer">
                                                            <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                        </Tooltip>
                                                    ) : (
                                                        <>
                                                            {orphaned !== 'yes' && (
                                                                <>
                                                                    {offer.destination &&
                                                                    accountLogin === offer.destination && (
                                                                        <Tooltip title="Accept Offer">
                                                                            <Button variant="outlined" size="small" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                                                                        </Tooltip>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                                )}

                                                {/* Sell Offer List - Owner */}
                                                {isSell && isOwner && (
                                                    <>
                                                        {accountLogin === offer.owner && (
                                                            <Tooltip title="Cancel Offer">
                                                                <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                )}

                                                {/* Buy Offer List - Owner */}
                                                {!isSell && isOwner && (
                                                    <>
                                                        {accountLogin !== offer.owner ? (
                                                            <Tooltip title="Accept Offer">
                                                                <Button variant="outlined" size="small" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Cancel Offer">
                                                                <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                )}

                                                {/* Buy Offer List - Not Owner */}
                                                {!isSell && !isOwner && (
                                                    <>
                                                        {accountLogin === offer.owner && (
                                                            <Tooltip title="Cancel Offer">
                                                                <Button variant={type === "buys" ? (orphaned !== "yes" ? "outlined" : "contained") : "outlined"} size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                )}
                                            </Stack>
                                        </Stack>
                                    )}
                                    {isMobile && (
                                        <Box display={'flex'} flexDirection='column' justifyContent={'space-evenly'}
                                        sx={{
                                            borderWidth: 1,
                                            borderRadius: 1,
                                            borderColor : "#32373C",
                                            backgroundColor: "#21252B",
                                            borderStyle: "solid",
                                            paddingLeft: 2,
                                            paddingRight: 2
                                        }}>
                                            <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt:1, pl:0, pr:0}}>
                                                <Stack direction="row" sx={{mt:0, pl: 0, pr:0}}>
                                                    <CardMedia
                                                        component={
                                                            loadingImg ? () =>
                                                                <Skeleton
                                                                    variant='rectangular'
                                                                    // animation='wave'
                                                                    sx={{
                                                                        width: 64,
                                                                        height: 48,
                                                                        borderRadius: 2
                                                                    }}
                                                                /> :
                                                                isVideo ? 'video' : 'img'}
                                                        image={imgUrl}
                                                        onLoad={onImageLoaded}
                                                        alt={'NFT'}
                                                        // controls={isVideo}
                                                        autoPlay={isVideo}
                                                        loop={isVideo}
                                                        muted
                                                        style={{
                                                            width: 64,
                                                            height: 48,
                                                            borderRadius: 2
                                                        }}
                                                    />
                                                    { loadingImg && <img src={imgUrl}
                                                        style={{ display: 'none' }}
                                                        onLoad={onImageLoaded} />
                                                    }
                                                    {
                                                        isVideo &&
                                                        <video src={imgUrl}
                                                            style={{ display: 'none' }}
                                                            onCanPlay={onImageLoaded}
                                                        />
                                                    }
                                                    <Stack
                                                        direction="column"
                                                        spacing={0}
                                                        alignItems="left"
                                                        sx={{
                                                            ml: 2
                                                        }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={2}
                                                            alignItems="center"
                                                        >
                                                            Name
                                                        </Stack>
                                                        <Stack
                                                            direction="row"
                                                            spacing={2}
                                                            alignItems="center"
                                                        >
                                                            <Typography variant="s7">
                                                                Flags:{' '}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" alignItems='center' justifyContent='space-between' sx={{mt:1, mb:1, pl:0, pr:0}}>
                                                <Typography
                                                    variant="s6"
                                                >
                                                    {price.amount} {price.name}
                                                </Typography>
                                                <Typography
                                                    variant="s6"
                                                >
                                                    {isSell && ('Sell offer')}
                                                    {!isSell && type == 'buys' && ('Buy offer')}
                                                    {!isSell && type == 'orphaned' && ('Orphaned offer')}
                                                </Typography>
                                                <Stack>
                                                    {/* Sell Offer List - Not Owner */}
                                                    {isSell && !isOwner && (
                                                    <>
                                                        {accountLogin === offer.owner ? (
                                                            <Tooltip title="Cancel Offer">
                                                                <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                            </Tooltip>
                                                        ) : (
                                                            <>
                                                                {orphaned !== 'yes' && (
                                                                    <>
                                                                        {offer.destination &&
                                                                        accountLogin === offer.destination && (
                                                                            <Tooltip title="Accept Offer">
                                                                                <Button variant="outlined" size="small" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                                                                            </Tooltip>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                    )}

                                                    {/* Sell Offer List - Owner */}
                                                    {isSell && isOwner && (
                                                        <>
                                                            {accountLogin === offer.owner && (
                                                                <Tooltip title="Cancel Offer">
                                                                    <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Buy Offer List - Owner */}
                                                    {!isSell && isOwner && (
                                                        <>
                                                            {accountLogin !==
                                                            offer.owner ? (
                                                                <Tooltip title="Accept Offer">
                                                                    <Button variant="outlined" size="small" onClick={() => handleAcceptOffer(offer)}>Accept</Button>
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip title="Cancel Offer">
                                                                    <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Buy Offer List - Not Owner */}
                                                    {!isSell && !isOwner && (
                                                        <>
                                                            {accountLogin === offer.owner && (
                                                                <Tooltip title="Cancel Offer">
                                                                    <Button variant="outlined" size="small" color="error" onClick={() => handleCancelOffer(offer)}>Cancel</Button>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>

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