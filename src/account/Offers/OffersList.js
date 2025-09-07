import axios from 'axios';
import { useState, useEffect, memo, useCallback } from 'react';
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
    Chip,
    Dialog,
    styled,
    alpha
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

// CSS Spinner with keyframes
if (typeof document !== 'undefined' && !document.querySelector('#offers-spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'offers-spinner-keyframes';
    style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
}
const Spinner = () => <div style={{width: 20, height: 20, border: '3px solid #f3f3f3', borderTop: '3px solid #00AB55', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />;

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
import SeeMoreTypography from 'src/components/SeeMoreTypography';
import ConfirmAcceptOfferDialog from '../ConfirmAcceptOfferDialog';
import ListToolbar from '../ListToolbar';

// Styled Components
const ModernOfferCard = styled(Box)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.15),
    backdropFilter: 'blur(20px)',
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    padding: theme.spacing(1.5),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
        background: alpha(theme.palette.background.paper, 0.2)
    }
}));

// Inline FlagsContainer component
const FlagsContainer = ({ Flags }) => {
    if (!Flags && Flags !== 0) return null;
    
    const flagList = [];
    const flagNumber = typeof Flags === 'string' ? parseInt(Flags, 10) : Flags;
    
    // Check each flag bit
    if ((flagNumber & 0x00000001) !== 0) flagList.push('Burnable');
    if ((flagNumber & 0x00000002) !== 0) flagList.push('OnlyXRP');
    if ((flagNumber & 0x00000004) !== 0) flagList.push('TrustLine');
    if ((flagNumber & 0x00000008) !== 0) flagList.push('Transferable');
    
    if (flagList.length === 0) return null;
    
    return (
        <Stack direction="row" spacing={0.5}>
            {flagList.map((flag) => (
                <Chip
                    key={flag}
                    label={flag}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ))}
        </Stack>
    );
};

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

const OffersList = memo(function OffersList({ account, type, setTotalOffers }) {
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
    };

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
                        } else {
                            console.warn('setTotalOffers is not a function');
                        }
                        setOffers(ret.offers);

                        // Add console.log for debugging
                        console.log('Offers data:', {
                            total: ret.total,
                            offers: ret.offers,
                            account,
                            type,
                            page,
                            rows
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error on getting offers list!!!', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        getOffers();
    }, [account, type, page, rows, hideOffers]);

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
                <Spinner />
            </Backdrop>

            {type === 'orphaned' && (
                <SeeMoreTypography
                    variant="s7"
                    //   text={"When you have multiple Sell Offers on an NFT and one is accepted by another account, your NFT will transfer ownership and the remaining Sell Offers will become orphaned. Similarly, if you accept a Buy Offer from another account, your NFT will transfer ownership and any remaining Buy Offers will become orphaned. When you have multiple Buy Offers on another NFT and one is accepted, the remaining Buy Offers will also become orphaned. It's important to cancel these to conserve your XRP reserve."}
                />
            )}

            {offers &&
                offers.length > 0 &&
                accountLogin === account &&
                type !== 'received' && (
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{ mb: 2 }}
                    >
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
                    <Spinner />
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
});

const OfferCard = memo(function OfferCard({
    offer,
    isOwner,
    accountLogin,
    type,
    handleAcceptOffer,
    handleCancelOffer,
    handleHideOffer,
    isMobile
}) {
    const theme = useTheme();
    const [openImageDialog, setOpenImageDialog] = useState(false);

    const {
        price,
        isSell,
        NFTokenID,
        orphaned,
        meta,
        files,
        collection,
        slug,
        cslug,
        name,
        isVideo,
        imgUrl,
        expired,
        expire_string,
        owner
    } = parseOfferData(offer);

    const handleImageClick = (e) => {
        e.preventDefault();
        setOpenImageDialog(true);
    };

    return (
        <>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2, 
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.05),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                width: '100%',
                '&:hover': { background: alpha(theme.palette.background.paper, 0.1) }
            }}>
                {/* Left side - NFT info */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                    <Link href={`/nft/${NFTokenID}`}>
                        <img src={imgUrl} alt={name} style={{ width: 48, height: 48, borderRadius: 8 }} />
                    </Link>
                    <Stack spacing={0.5} sx={{ minWidth: 200 }}>
                        <Link href={`/nft/${NFTokenID}`} underline="none">
                            <Typography variant="body1" fontWeight={600}>{name}</Typography>
                        </Link>
                        <Typography variant="caption" color="text.secondary">{collection}</Typography>
                    </Stack>
                </Stack>

                {/* Center - Price and additional info */}
                <Stack direction="row" spacing={3} alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Price</Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            {price.amount} {price.name}
                        </Typography>
                    </Stack>
                    
                    {expire_string && (
                        <Stack spacing={0.5} alignItems="center">
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Expires</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {expire_string}
                            </Typography>
                        </Stack>
                    )}
                    
                    {offer.nftMatches?.[0]?.rarity_rank && (
                        <Stack spacing={0.5} alignItems="center">
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Rarity</Typography>
                            <Typography variant="caption" fontWeight={600}>
                                #{offer.nftMatches[0].rarity_rank} / {offer.nftMatches[0].total}
                            </Typography>
                        </Stack>
                    )}
                    
                    <Stack spacing={0.5} alignItems="center">
                        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">From</Typography>
                        <Typography variant="caption" fontWeight={600}>
                            {offer.account?.slice(0, 8)}...
                        </Typography>
                    </Stack>
                    
                    {offer.origin && (
                        <Stack spacing={0.5} alignItems="center">
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Origin</Typography>
                            <Typography variant="caption">{offer.origin}</Typography>
                        </Stack>
                    )}
                    
                    <Chip 
                        label={isSell ? 'Sell' : 'Buy'} 
                        color={isSell ? 'success' : 'secondary'} 
                        size="small" 
                    />
                </Stack>

                {/* Right side - Action buttons with proper spacing */}
                <Box sx={{ ml: 3 }}>
                    {renderActionButtons(offer, isOwner, accountLogin, type, handleAcceptOffer, handleCancelOffer, handleHideOffer)}
                </Box>
            </Box>

            <Dialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <CardMedia
                    component={isVideo ? 'video' : 'img'}
                    image={imgUrl}
                    alt={name}
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '80vh',
                        objectFit: 'contain'
                    }}
                    controls={isVideo}
                />
            </Dialog>
        </>
    );
});

function renderActionButtons(
    offer,
    isOwner,
    accountLogin,
    type,
    handleAcceptOffer,
    handleCancelOffer,
    handleHideOffer
) {
    const { isSell, orphaned, offerAccount, destination, expired } = offer;
    const buttons = [];

    if (expired) {
        buttons.push(
            <Button
                key="remove"
                variant="contained"
                size="small"
                color="error"
                onClick={() => handleCancelOffer(offer)}
            >
                Remove
            </Button>
        );
        return <Stack direction="row" spacing={1}>{buttons}</Stack>;
    }

    if (type === 'received' && accountLogin) {
        return (
            <Stack direction="row" spacing={1}>
                {isOwner && (
                    <>
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleAcceptOffer(offer)}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleHideOffer(offer)}
                        >
                            Hide
                        </Button>
                    </>
                )}
                {accountLogin === offerAccount && (
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleCancelOffer(offer)}
                    >
                        Cancel
                    </Button>
                )}
            </Stack>
        );
    }

    if (isSell) {
        if (isOwner || accountLogin === offerAccount) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant={
                            type === 'buys' && orphaned !== 'yes'
                                ? 'outlined'
                                : 'contained'
                        }
                        size="small"
                        color="error"
                        onClick={() => handleCancelOffer(offer)}
                    >
                        Cancel
                    </Button>
                </Stack>
            );
        } else if (
            orphaned !== 'yes' &&
            destination &&
            accountLogin === destination
        ) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleCancelOffer(offer)}
                    >
                        Cancel
                    </Button>
                </Stack>
            );
        }
    } else {
        if (isOwner && accountLogin !== offerAccount) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleCancelOffer(offer)}
                    >
                        Cancel
                    </Button>
                </Stack>
            );
        } else if (accountLogin === offerAccount) {
            return (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant={
                            type === 'buys' && orphaned !== 'yes'
                                ? 'outlined'
                                : 'contained'
                        }
                        size="small"
                        color="error"
                        onClick={() => handleCancelOffer(offer)}
                    >
                        Cancel
                    </Button>
                </Stack>
            );
        }
    }

    return null;
}

export default OffersList;

function parseOfferData(offer) {
    const price = normalizeAmount(offer.amount);
    const isSell = offer.flags === 1;
    const {
        NFTokenID,
        orphaned,
        meta,
        files,
        cslug,
        owner,
        account,
        destination,
        expiration,
        index
    } = offer;

    const { flag, royalty, issuer, taxon, transferFee } =
        parseNFTokenID(NFTokenID);

    const name = meta?.name || offer?.Name || 'No Name';
    const collection =
        offer.collecion || offer.collection || meta?.collection?.name || '';

    const isVideo = false; // Update this if you have a way to determine if it's a video

    const imgUrl = getNftCoverUrl({ files }, 'small');

    const expired = checkExpiration(expiration);
    const expire = expiration
        ? (expiration > 946684800 ? expiration : expiration + 946684800) * 1000
        : '';
    const expire_string = expire ? new Date(expire).toLocaleString() : '';

    return {
        price,
        isSell,
        NFTokenID,
        orphaned,
        meta,
        files,
        collection,
        cslug,
        name,
        isVideo,
        imgUrl,
        expired,
        expire_string,
        owner,
        offerAccount: account,
        destination,
        index
    };
}
