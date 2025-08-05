import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon } from 'react-share';

// Material
import {
    useTheme,
    useMediaQuery,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Backdrop,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    Link,
    Paper,
    Popover,
    Stack,
    Typography,
    Tooltip,
    Chip
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanToolIcon from '@mui/icons-material/PanTool';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import ShareIcon from '@mui/icons-material/Share';
import VerifiedIcon from '@mui/icons-material/Verified';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import MessageIcon from '@mui/icons-material/Message';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';
import xIcon from '@iconify/icons-bi/x';

// Loader
import { PuffLoader, PulseLoader } from 'react-spinners';
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { NFToken, getMinterName } from 'src/utils/constants';
import { normalizeAmount } from 'src/utils/normalizers';
import { fNumber, fIntNumber } from 'src/utils/formatNumber';
import { getHashIcon } from 'src/utils/parse';

// Components
import CreateOfferDialog from './CreateOfferDialog';
import QRDialog from 'src/components/QRDialog';
import ConfirmAcceptOfferDialog from './ConfirmAcceptOfferDialog';
// import TimePeriods from './TimePeriodsDropdown';
import OffersList from './OffersList';
import SelectPriceDialog from './SelectPriceDialog';

import BurnNFT from './BurnNFT';
import TransferDialog from './TransferDialog';
import HistoryList from './HistoryList';

// Add these imports
import { alpha, styled } from '@mui/material/styles';
import Glass from '@mui/material/Paper';

// Add this import at the top of the file
import Wallet from 'src/components/Wallet';

// Add these imports at the top of the file
import { Client } from 'xrpl';
import { xrpToDrops, dropsToXrp } from 'xrpl';

// Add this import at the top of the file
import CreateOfferXRPCafe from './CreateOfferXRPCafe';

// Add these constants at the top of the file
const BROKER_ADDRESSES = {
    rnPNSonfEN1TWkPH4Kwvkk3693sCT4tsZv: { fee: 0.015, name: 'Art Dept Fun' },
    rpx9JThQ2y37FaGeeJP7PXDUVEXY3PHZSC: { fee: 0.01589, name: 'XRP Cafe' },
    rpZqTPC8GvrSvEfFsUuHkmPCg29GdQuXhC: { fee: 0.015, name: 'BIDDS' },
    rDeizxSRo6JHjKnih9ivpPkyD2EgXQvhSB: { fee: 0.015, name: 'XPMarket' },
    rJcCJyJkiTXGcxU4Lt4ZvKJz8YmorZXu8r: { fee: 0.01, name: 'OpulenceX' }
};

// Minimalist container
const Container = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2.5),
    overflow: 'hidden'
}));

const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '& svg': { fontSize: 10 }
}));

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
        const { amount, destination, flags, nft_offer_index, owner } = offer;

        let validOffer = true;

        // Remove destination check to allow offers without brokers
        // if (destination) validOffer = false;

        if (isSellOffer && nftOwner !== owner) validOffer = false;

        if (!validOffer) continue;

        const cost = normalizeAmount(amount);

        cost.offer = offer;

        if (cost.currency === 'XRP') {
            if (xrpCost) {
                if (isSellOffer) {
                    if (cost.amount < xrpCost.amount) xrpCost = cost;
                } else {
                    if (cost.amount > xrpCost.amount) xrpCost = cost;
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

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

const SimpleAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:before': { display: 'none' },
    '& .MuiAccordionSummary-root': {
        padding: theme.spacing(0),
        minHeight: 48,
        '&.Mui-expanded': { minHeight: 48 }
    },
    '& .MuiAccordionSummary-content': {
        margin: '8px 0',
        '&.Mui-expanded': { margin: '8px 0' }
    },
    '& .MuiAccordionDetails-root': {
        padding: theme.spacing(0, 0, 1, 0)
    }
}));

const CountBadge = styled('span')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    marginLeft: theme.spacing(0.5)
}));

// Update helper function to handle different decimal places based on broker
const formatXRPAmount = (
    amount,
    includeSymbol = true,
    brokerAddress = null
) => {
    // Always use 2 decimal places for both buy and sell offers
    const num = parseFloat(amount);
    const withTwoDecimals = num.toFixed(2);
    // Remove trailing zero if it exists
    const formatted = withTwoDecimals.endsWith('0')
        ? withTwoDecimals.replace(/\.?0+$/, '')
        : withTwoDecimals;
    return includeSymbol ? `${formatted} XRP` : formatted;
};

const InfoChip = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    background: alpha(theme.palette.background.default, 0.5),
    fontSize: '0.8125rem'
}));

const CompactAvatar = styled(Avatar)(({ theme }) => ({
    width: 36,
    height: 36,
    borderRadius: theme.shape.borderRadius
}));

const OwnerSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    background: alpha(theme.palette.background.default, 0.3),
    borderRadius: theme.shape.borderRadius
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2)
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
    '& .amount': {
        fontSize: '1.5rem',
        fontWeight: 600
    }
}));

export default function NFTActions({ nft }) {
    const theme = useTheme();
    const anchorRef = useRef(null);
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    // const theme = useTheme();
    // const largescreen = useMediaQuery(theme => theme.breakpoints.up('md'));

    const {
        uuid,
        name,
        collection,
        cslug,
        cverified,
        cfloor,
        citems,
        rarity_rank,
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
        NFTokenID,
        self,
        MasterSequence
    } = nft;

    const collectionName =
        collection || /*meta?.collection?.name ||*/ '[No Collection]';

    const nftName = name || /*meta?.name || meta?.Name ||*/ '[No Name]';

    const floorPrice = cfloor?.amount || 0;

    const accountLogo = getHashIcon(account);

    const shareUrl = `https://xrpnft.com/nft/${NFTokenID}`;
    const shareTitle = nftName;
    const shareDesc = meta?.description || '';

    const isOwner = accountLogin === account;
    const isBurnable = (flag & 0x00000001) > 0;

    const [openShare, setOpenShare] = useState(false);

    const [openCreateOffer, setOpenCreateOffer] = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);
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
    const [qrType, setQrType] = useState('NFTokenAcceptOffer');

    const [cost, setCost] = useState(null);

    const [sync, setSync] = useState(0);

    const [lowestSellOffer, setLowestSellOffer] = useState(null);

    const [openCreateOfferXRPCafe, setOpenCreateOfferXRPCafe] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    // Add this callback function to handle successful offer creation
    const handleOfferCreated = () => {
        // Increment sync to trigger useEffect and refresh offers
        setSync((prev) => prev + 1);
    };

    useEffect(() => {
        function getOffers() {
            setLoading(true);
            axios
                .get(`${BASE_URL}/offers/${NFTokenID}`)
                .then((res) => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        const offers = ret.sellOffers;
                        const nftOwner = nft.account;
                        setCost(getCostFromOffers(nftOwner, offers, true));

                        setSellOffers(getValidOffers(ret.sellOffers, true));
                        setBuyOffers(getValidOffers(ret.buyOffers, false));
                    }
                })
                .catch((err) => {
                    console.log('Error on getting nft offers list!!!', err);
                })
                .then(function () {
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
        var dispatchTimer = null;

        async function getDispatchResult() {
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/acceptcancel/${xummUuid}`
                );
                const res = ret.data.data.response;
                // const account = res.account;
                const dispatched_result = res.dispatched_result;

                return dispatched_result;
            } catch (err) {}
        }

        const startInterval = () => {
            let times = 0;

            dispatchTimer = setInterval(async () => {
                const dispatched_result = await getDispatchResult();

                if (dispatched_result && dispatched_result === 'tesSUCCESS') {
                    setSync(sync + 1);
                    openSnackbar('Successful!', 'success');
                    stopInterval();
                    return;
                }

                times++;

                if (times >= 15) {
                    openSnackbar('Rejected!', 'error');
                    stopInterval();
                    return;
                }
            }, 1200);
        };

        // Stop the interval
        const stopInterval = () => {
            clearInterval(dispatchTimer);
            handleScanQRClose();
        };

        async function getPayload() {
            console.log(counter + ' ' + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/acceptcancel/${xummUuid}`
                );
                const resolved_at = ret.data?.resolved_at;
                // const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    startInterval();
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

    useEffect(() => {
        async function getLowestSellOffer() {
            const client = new Client('wss://s1.ripple.com');

            try {
                await client.connect();
                console.log('Connected to XRPL');

                const request = {
                    command: 'nft_sell_offers',
                    nft_id: NFTokenID
                };

                const response = await client.request(request);
                console.log('NFT Sell Offers:', JSON.stringify(response.result, null, 2));

                // Find the lowest valid sell offer
                let lowestOffer = null;
                if (response.result.offers && response.result.offers.length > 0) {
                    lowestOffer = response.result.offers.reduce((min, offer) => {
                        const amount = BigInt(offer.amount);
                        const isValidAmount = amount > BigInt(0);
                        const isValidOwner = offer.owner === nft.account;

                        if (isValidAmount && isValidOwner && (!min.amount || amount < BigInt(min.amount))) {
                            return { amount, offer };
                        }
                        return min;
                    }, { amount: null, offer: null });
                }

                if (lowestOffer && lowestOffer.offer) {
                    const baseAmount = parseFloat(
                        parseFloat(dropsToXrp(lowestOffer.amount.toString())).toFixed(6)
                    );
                    const brokerAddress = lowestOffer.offer.destination;
                    const hasBroker = brokerAddress && BROKER_ADDRESSES[brokerAddress];
                    const brokerInfo = hasBroker ? BROKER_ADDRESSES[brokerAddress] : null;
                    const brokerFeePercentage = brokerInfo ? brokerInfo.fee : 0;

                    const brokerFee = hasBroker ? parseFloat((baseAmount * brokerFeePercentage).toFixed(6)) : 0;
                    const totalAmount = parseFloat((baseAmount + brokerFee).toFixed(6));

                    setLowestSellOffer({
                        baseAmount,
                        totalAmount: hasBroker ? totalAmount : baseAmount,
                        brokerFee,
                        brokerFeePercentage,
                        hasBroker,
                        brokerName: brokerInfo ? brokerInfo.name : null,
                        offerIndex: lowestOffer.offer.nft_offer_index,
                        seller: lowestOffer.offer.owner,
                        destination: brokerAddress,
                        offer: lowestOffer.offer
                    });
                } else {
                    setLowestSellOffer(null);
                }
            } catch (error) {
                console.error('Error fetching NFT sell offers:', error);
            } finally {
                await client.disconnect();
                console.log('Disconnected from XRPL');
            }
        }

        getLowestSellOffer();
    }, [NFTokenID, nft.account]);

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
            const { uuid, NFTokenID } = nft;

            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin,
                uuid,
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

    const getValidOffers = (offers, isSell) => {
        const newOffers = [];
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
                    // Remove the owner check to display all valid sell offers
                    if (nft.account === offer.owner) {
                        newOffers.push(offer);
                    }
                }
            } else {
                // Buy Offers
                if (nft.account === offer.owner) continue; // orphaned

                // Buy Offers - keep existing logic
                newOffers.push(offer);
            }
        }

        return newOffers;
    };

    const handleCreateSellOffer = () => {
        setIsSellOffer(true);
        setOpenCreateOffer(true);
    };

    const handleTransfer = () => {
        setOpenTransfer(true);
    };

    const handleCreateBuyOffer = () => {
        setIsSellOffer(false);
        setOpenCreateOffer(true);
    };

    const onHandleBurn = () => {
        setBurnt(true);
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
    };

    const handleAcceptOffer = async (offer) => {
        setAcceptOffer(offer);
        setOpenConfirm(true);
    };

    const onContinueAccept = async () => {
        doProcessOffer(acceptOffer, true);
    };

    const handleBuyNow = async () => {
        if (!lowestSellOffer) {
            openSnackbar('No valid sell offer available', 'error');
            return;
        }

        if (lowestSellOffer.hasBroker) {
            // Handle broker-mediated offers through XRP Cafe
            setOpenCreateOfferXRPCafe(true);
        } else {
            // Handle direct offers through normal accept offer flow
            handleAcceptOffer(lowestSellOffer.offer);
        }
    };

    const handleOpenShare = () => {
        setAnchorEl(anchorRef.current);
        setOpenShare(true);
    };

    const handleCloseShare = () => {
        setAnchorEl(null);
        setOpenShare(false);
    };

    const handleCloseCreateOffer = () => {
        setOpenCreateOffer(false);
        setIsSellOffer(false);
    };

    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };

    const handleShareClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenShare(true);
    };

    const handleShareClose = () => {
        setAnchorEl(null);
        setOpenShare(false);
    };

    return (
        <>
            <Container>
                <Stack spacing={2}>
                    {self && (
                        <HeaderSection>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                                        {cslug ? (
                                            <Link href={`/collection/${cslug}`} underline="hover" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                                                {collectionName}
                                            </Link>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontSize="0.8125rem">
                                                {collectionName}
                                            </Typography>
                                        )}
                                        {cverified === 'yes' && (
                                            <VerificationBadge>
                                                <CheckIcon />
                                            </VerificationBadge>
                                        )}
                                    </Stack>
                                    <Typography variant="h6" fontWeight={600}>
                                        {nftName}
                                    </Typography>
                                    {floorPrice > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            Floor: <Icon icon={rippleSolid} fontSize={12} style={{ verticalAlign: 'middle' }} /> {fNumber(floorPrice)}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton size="small" onClick={handleShareClick} ref={anchorRef}>
                                    <ShareIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </HeaderSection>
                    )}

                    {(rarity_rank > 0 || MasterSequence) && (
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            {rarity_rank > 0 && (
                                <InfoChip>
                                    <Typography variant="caption" color="text.secondary">Rank</Typography>
                                    <Typography variant="caption" fontWeight={600}>#{fIntNumber(rarity_rank)}</Typography>
                                </InfoChip>
                            )}
                            {MasterSequence && (
                                <InfoChip>
                                    <Icon icon={rippleSolid} fontSize={14} />
                                    <Typography variant="caption" fontWeight={600}>#{MasterSequence}</Typography>
                                </InfoChip>
                            )}
                        </Stack>
                    )}

                    <OwnerSection>
                        <CompactAvatar alt="O" src={accountLogo} />
                        <Box flex={1}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                    Owned by
                                </Typography>
                                {isOwner && (
                                    <Typography variant="caption" color="primary.main" fontWeight={500}>
                                        You
                                    </Typography>
                                )}
                            </Stack>
                            <Link href={`/account/${account}`} underline="hover" sx={{ fontSize: '0.8125rem' }}>
                                {truncate(account, 14)}
                            </Link>
                            {minter && minter === account && (
                                <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.25 }}>
                                    Creator
                                </Typography>
                            )}
                        </Box>
                    </OwnerSection>

                    {/* Price & Actions */}
                    <Box>
                        {burnt ? (
                            <Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
                                This NFT is burnt
                            </Typography>
                        ) : isOwner ? (
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="medium"
                                        onClick={handleCreateSellOffer}
                                        disabled={!accountLogin || burnt}
                                    >
                                        Sell
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="medium"
                                        onClick={handleTransfer}
                                        disabled={!accountLogin || burnt}
                                    >
                                        Transfer
                                    </Button>
                                </Stack>
                                <BurnNFT nft={nft} onHandleBurn={onHandleBurn} />
                            </Stack>
                        ) : (
                            <Stack spacing={1.5}>
                                {loading ? (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <PulseLoader color="#00AB55" size={8} />
                                    </Box>
                                ) : lowestSellOffer ? (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Current Price
                                        </Typography>
                                        <PriceDisplay>
                                            <Icon icon={rippleSolid} fontSize={20} />
                                            <Typography className="amount">
                                                {formatXRPAmount(lowestSellOffer.totalAmount, false)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">XRP</Typography>
                                        </PriceDisplay>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                        No price set
                                    </Typography>
                                )}
                                {accountLogin ? (
                                    <Stack spacing={1}>
                                        {lowestSellOffer && !burnt && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleBuyNow}
                                            >
                                                Buy Now
                                            </Button>
                                        )}
                                        <Button
                                            fullWidth
                                            disabled={burnt}
                                            variant="outlined"
                                            onClick={handleCreateBuyOffer}
                                        >
                                            Make Offer
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Wallet />
                                )}
                            </Stack>
                        )}
                    </Box>

                    {/* Broker fee details */}
                    {!isOwner && lowestSellOffer && lowestSellOffer.hasBroker && (
                        <Box sx={{ p: 1.5, background: alpha(theme.palette.warning.main, 0.08), borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Includes {(lowestSellOffer.brokerFeePercentage * 100).toFixed(1)}% broker fee • {lowestSellOffer.brokerName}
                            </Typography>
                        </Box>
                    )}

                    {/* Offers and History */}
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                        {isOwner && (
                            <SimpleAccordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="subtitle2" fontWeight={500}>
                                            Sell Offers
                                        </Typography>
                                        {sellOffers.length > 0 && (
                                            <CountBadge>({sellOffers.length})</CountBadge>
                                        )}
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {loading ? (
                                        <Box sx={{ textAlign: 'center', py: 2 }}>
                                            <PulseLoader color="#00AB55" size={8} />
                                        </Box>
                                    ) : sellOffers.length > 0 ? (
                                        <Stack spacing={1}>
                                            {sellOffers.map((offer, index) => {
                                                const amount = normalizeAmount(offer.amount);
                                                return (
                                                    <Box key={index} sx={{ p: 1.5, background: alpha(theme.palette.background.default, 0.3), borderRadius: 1 }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <Icon icon={rippleSolid} fontSize={16} />
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {formatXRPAmount(amount.amount, true)}
                                                                </Typography>
                                                            </Stack>
                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleCancelOffer(offer)}
                                                                sx={{ minWidth: 0, p: 0.5 }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Stack>
                                                        {offer.destination && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                via {BROKER_ADDRESSES[offer.destination]?.name || 'Broker'}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Box sx={{ py: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No sell offers
                                            </Typography>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={handleCreateSellOffer}
                                                sx={{ mt: 1 }}
                                            >
                                                Create Offer
                                            </Button>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </SimpleAccordion>
                        )}

                        <SimpleAccordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Buy Offers
                                    </Typography>
                                    {buyOffers.length > 0 && (
                                        <CountBadge>({buyOffers.length})</CountBadge>
                                    )}
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                {loading ? (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <PulseLoader color="#00AB55" size={8} />
                                    </Box>
                                ) : buyOffers.length > 0 ? (
                                    <Stack spacing={1}>
                                        {buyOffers.map((offer, index) => {
                                            const amount = normalizeAmount(offer.amount);
                                            return (
                                                <Box key={index} sx={{ p: 1.5, background: alpha(theme.palette.background.default, 0.3), borderRadius: 1 }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Box>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <Icon icon={rippleSolid} fontSize={16} />
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {formatXRPAmount(amount.amount, true)}
                                                                </Typography>
                                                            </Stack>
                                                            <Typography variant="caption" color="text.secondary">
                                                                from {truncate(offer.owner, 10)}
                                                            </Typography>
                                                        </Box>
                                                        {isOwner ? (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleAcceptOffer(offer)}
                                                            >
                                                                Accept
                                                            </Button>
                                                        ) : (
                                                            accountLogin === offer.owner && (
                                                                <Button
                                                                    variant="text"
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleCancelOffer(offer)}
                                                                    sx={{ minWidth: 0, p: 0.5 }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )
                                                        )}
                                                    </Stack>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                ) : (
                                    <Box sx={{ py: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No buy offers
                                        </Typography>
                                        {!isOwner && (
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={handleCreateBuyOffer}
                                                sx={{ mt: 1 }}
                                            >
                                                Make Offer
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </AccordionDetails>
                        </SimpleAccordion>

                        <SimpleAccordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                    History
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <HistoryList nft={nft} />
                            </AccordionDetails>
                        </SimpleAccordion>
                    </Stack>
                </Stack>
            </Container>

            {/* Share Popover */}
            <Popover
                open={openShare}
                anchorEl={anchorEl}
                onClose={handleShareClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { p: 1, width: 180 } }}
            >
                <Stack spacing={1}>
                    <TwitterShareButton url={shareUrl} title={shareTitle} via="xrpnft">
                        <Button fullWidth size="small" variant="text" sx={{ justifyContent: 'flex-start' }}>
                            <Icon icon="mdi:twitter" style={{ marginRight: 8 }} /> Share on X
                        </Button>
                    </TwitterShareButton>
                    <Button
                        fullWidth
                        size="small"
                        variant="text"
                        startIcon={<ContentCopyIcon fontSize="small" />}
                        onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            openSnackbar('Link copied!', 'success');
                            handleShareClose();
                        }}
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        Copy Link
                    </Button>
                </Stack>
            </Popover>

            {/* Dialogs */}
            <CreateOfferDialog
                open={openCreateOffer}
                setOpen={setOpenCreateOffer}
                onClose={handleCloseCreateOffer}
                nft={nft}
                isSellOffer={isSellOffer}
                onOfferCreated={handleOfferCreated}
            />
            <TransferDialog
                open={openTransfer}
                setOpen={setOpenTransfer}
                onClose={handleCloseTransfer}
                nft={nft}
            />
            <CreateOfferXRPCafe
                open={openCreateOfferXRPCafe}
                setOpen={setOpenCreateOfferXRPCafe}
                nft={nft}
                isSellOffer={false}
                initialAmount={lowestSellOffer ? lowestSellOffer.totalAmount : 0}
                brokerFeePercentage={lowestSellOffer ? lowestSellOffer.brokerFeePercentage : 0}
                onOfferCreated={handleOfferCreated}
            />
            <ConfirmAcceptOfferDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                offer={acceptOffer}
                onContinue={onContinueAccept}
            />
            <QRDialog
                open={openScanQR}
                xummUuid={xummUuid}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
                qrType={qrType}
                onClose={handleScanQRClose}
            />
        </>
    );
}
