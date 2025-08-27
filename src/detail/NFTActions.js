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

// Import NFTDetails components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { convertHexToString, parseNFTokenID } from 'src/utils/parse';
import NFTPreview from './NFTPreview';
import FlagsContainer from 'src/components/Flags';
import Properties from './Properties';
import CodeHighlight from 'src/components/CodeHighlight';
import { fVolume } from 'src/utils/formatNumber';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Collapse from '@mui/material/Collapse';

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
    background: '#111314',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    height: 'fit-content',
    width: '100%',
    maxWidth: '100%',
}));

// NFTDetails styled components
const DetailContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    }
}));

const DetailCard = styled(Paper)(({ theme }) => ({
    background: '#111314',
    borderRadius: theme.shape.borderRadius * 2,
    padding: 0,
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    height: 'fit-content',
    width: '100%',
    maxWidth: '480px',
}));

const Section = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    '&:not(:last-child)': {
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
    }
}));

const CompactSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 1.5),
    '&:not(:last-child)': {
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
    }
}));

const InfoGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(0.75)
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.25),
    minHeight: '28px',
    padding: theme.spacing(0.5, 0),
    '& .label': {
        fontSize: '0.8125rem',
        color: theme.palette.text.secondary,
        minWidth: '80px',
        flexShrink: 0,
        fontWeight: 500,
        paddingTop: '2px'
    },
    '& .value': {
        fontSize: '0.8125rem',
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        flex: 1,
        flexWrap: 'wrap',
        wordBreak: 'break-all',
        lineHeight: 1.5
    }
}));

const MonoLink = styled(Link)(({ theme }) => ({
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    textDecoration: 'none',
    color: theme.palette.primary.main,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.2s ease',
    '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.dark
    }
}));

const TinyButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
    transition: 'all 0.2s ease',
    '&:hover': {
        background: alpha(theme.palette.primary.main, 0.08),
    },
    '& .MuiSvgIcon-root': {
        fontSize: '1rem'
    }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5)
}));

const MetadataBox = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' 
        ? alpha(theme.palette.background.default, 0.4)
        : alpha(theme.palette.grey[100], 0.5),
    borderRadius: theme.shape.borderRadius * 0.75,
    padding: theme.spacing(1.5),
    maxHeight: '200px',
    overflowY: 'auto',
    fontSize: '0.7rem',
    '&::-webkit-scrollbar': {
        width: '6px'
    },
    '&::-webkit-scrollbar-track': {
        background: alpha(theme.palette.divider, 0.1),
        borderRadius: '3px'
    },
    '&::-webkit-scrollbar-thumb': {
        background: alpha(theme.palette.divider, 0.3),
        borderRadius: '3px',
        '&:hover': {
            background: alpha(theme.palette.divider, 0.5)
        }
    }
}));

const ToggleButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '0.7rem',
    padding: theme.spacing(0.25, 1),
    minWidth: 'auto',
    height: '20px'
}));

const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.common.white,
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
    border: `2px solid ${theme.palette.background.paper}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.15) rotate(10deg)',
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.6)}`,
    },
    '& svg': { fontSize: 14, fontWeight: 'bold' }
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
    backgroundColor: alpha(theme.palette.background.default, 0.3),
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    boxShadow: 'none',
    marginBottom: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        boxShadow: theme.shadows[1],
    },
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
        margin: theme.spacing(0, 0, 1, 0),
    },
    '& .MuiAccordionSummary-root': {
        padding: theme.spacing(1.5, 2),
        minHeight: 56,
        '&.Mui-expanded': { minHeight: 56 }
    },
    '& .MuiAccordionSummary-content': {
        margin: 0,
        '&.Mui-expanded': { margin: 0 }
    },
    '& .MuiAccordionDetails-root': {
        padding: theme.spacing(0, 2, 2, 2)
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
    gap: theme.spacing(0.75),
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.shape.borderRadius * 2,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.light, 0.04)})`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[2],
    }
}));

const CompactAvatar = styled(Avatar)(({ theme }) => ({
    width: 44,
    height: 44,
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
    boxShadow: theme.shadows[1]
}));

const OwnerSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.background.default, 0.5)})`,
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[1],
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2.5),
    borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -2,
        left: 0,
        width: '60px',
        height: '2px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    }
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    '& .amount': {
        fontSize: '1.75rem',
        fontWeight: 700,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    }
}));

// Helper function for NFTDetails
function getProperties(meta) {
    const properties = [];
    if (!meta) return [];

    // Attributes
    try {
        const attributes = meta.attributes;
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                const type = attr.type || attr.trait_type;
                const value = attr.value;
                properties.push({ type, value });
            }
        }
    } catch (e) {}

    // Other props
    const props = [
        'Rarity', 'Signature', 'Background', 'Base', 'Mouth',
        'Accessories', 'Base Effects', 'Blade Effect', 'End Scene',
        'Music', 'Blades In Video', 'Special'
    ];

    try {
        for (const prop of props) {
            if (meta[prop]) {
                properties.push({ type: prop, value: meta[prop] });
            }
        }
    } catch (e) {}

    return properties;
}

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
        MasterSequence,
        hash,
        props,
        total,
        volume,
        files,
        memo,
        taxon: apiTaxon
    } = nft;

    // NFTDetails data
    const { flag: parsedFlag, issuer: parsedIssuer, transferFee } = parseNFTokenID(NFTokenID);
    const taxon = apiTaxon;
    const strDateTime = date ? new Date(date).toLocaleString() : '';
    const properties = props || getProperties(meta);
    const hasProperties = properties && properties.length > 0;
    const formatAddress = (addr, length = 'short') => {
        if (!addr) return '';
        if (length === 'full') return addr;
        if (length === 'long') return `${addr.substring(0, 20)}...${addr.substring(addr.length - 16)}`;
        if (length === 'medium') return `${addr.substring(0, 12)}...${addr.substring(addr.length - 8)}`;
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

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
    
    // NFTDetails states
    const [showRawMetadata, setShowRawMetadata] = useState(false);
    const [showMemo, setShowMemo] = useState(false);
    
    // NFTDetails helper functions
    const isValidJSON = (input) => {
        try {
            if (typeof input === 'object') return true;
            if (typeof input === 'string') {
                JSON.parse(input);
                return true;
            }
        } catch (e) {}
        return false;
    };

    const parseMemo = (memo) => {
        if (typeof memo === 'object') return JSON.stringify(memo, null, 2);
        if (typeof memo === 'string') {
            try {
                return JSON.stringify(JSON.parse(memo), null, 2);
            } catch (e) {
                return memo;
            }
        }
        return String(memo);
    };

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
            <Grid container spacing={3} sx={{ 
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                {/* Left side - NFT Details */}
                <Grid item xs={12} md={5} lg={4.5}>
                    <DetailContainer>
                        {/* NFT Preview */}
                        <Box sx={{ 
                            mb: 2, 
                            aspectRatio: '1', 
                            overflow: 'hidden', 
                            borderRadius: 2,
                            boxShadow: theme.shadows[3],
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            background: '#0a0a0b'
                        }}>
                            <NFTPreview nft={nft} />
                        </Box>

                        <DetailCard>
                            {/* Properties */}
                            {hasProperties && (
                                <Section>
                                    <SectionTitle>Properties</SectionTitle>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Properties
                                            properties={properties}
                                            total={total}
                                            issuer={parsedIssuer}
                                            taxon={taxon}
                                            cslug={cslug}
                                        />
                                    </Box>
                                </Section>
                            )}

                            {/* Main Information */}
                            <Section>
                                <SectionTitle>Details</SectionTitle>
                                <InfoGrid>
                                    <InfoItem>
                                        <span className="label">Collection</span>
                                        <span className="value">
                                            {cslug ? (
                                                <MonoLink href={`/collection/${cslug}`}>
                                                    {collectionName}
                                                </MonoLink>
                                            ) : (
                                                collectionName
                                            )}
                                        </span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Created</span>
                                        <span className="value" style={{ fontSize: '0.75rem' }}>
                                            {strDateTime}
                                        </span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Owner</span>
                                        <span className="value">
                                            <MonoLink href={`/account/${account}`}>
                                                {account}
                                            </MonoLink>
                                            <CopyToClipboard text={account} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                <TinyButton size="small">
                                                    <ContentCopyIcon />
                                                </TinyButton>
                                            </CopyToClipboard>
                                        </span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Issuer</span>
                                        <span className="value">
                                            <MonoLink href={`/account/${parsedIssuer}`}>
                                                {parsedIssuer}
                                            </MonoLink>
                                            <CopyToClipboard text={parsedIssuer} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                <TinyButton size="small">
                                                    <ContentCopyIcon />
                                                </TinyButton>
                                            </CopyToClipboard>
                                        </span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Volume</span>
                                        <span className="value">
                                            <Icon icon="teenyicons:ripple-solid" style={{ fontSize: 14 }} />
                                            {fVolume(volume || 0)}
                                        </span>
                                    </InfoItem>

                                    {rarity_rank > 0 && (
                                        <InfoItem>
                                            <span className="label">Rarity</span>
                                            <span className="value">
                                                <Chip 
                                                    label={`#${rarity_rank}`} 
                                                    size="small" 
                                                    color="primary"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </span>
                                        </InfoItem>
                                    )}

                                    <InfoItem>
                                        <span className="label">Transfer Fee</span>
                                        <span className="value">{transferFee}%</span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Taxon</span>
                                        <span className="value">{taxon}</span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">Flags</span>
                                        <span className="value">
                                            <FlagsContainer Flags={parsedFlag} />
                                        </span>
                                    </InfoItem>

                                    <InfoItem>
                                        <span className="label">NFTokenID</span>
                                        <span className="value">
                                            <MonoLink 
                                                href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                target="_blank"
                                                rel="noreferrer noopener nofollow"
                                            >
                                                {formatAddress(NFTokenID, 'long')}
                                                <OpenInNewIcon style={{ fontSize: 10 }} />
                                            </MonoLink>
                                            <CopyToClipboard text={NFTokenID} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                <TinyButton size="small">
                                                    <ContentCopyIcon />
                                                </TinyButton>
                                            </CopyToClipboard>
                                        </span>
                                    </InfoItem>

                                    {hash && (
                                        <InfoItem>
                                            <span className="label">Mint</span>
                                            <span className="value">
                                                <MonoLink 
                                                    href={`https://bithomp.com/explorer/${hash}`}
                                                    target="_blank"
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    {formatAddress(hash, 'long')}
                                                    <OpenInNewIcon style={{ fontSize: 10 }} />
                                                </MonoLink>
                                                <CopyToClipboard text={hash} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                    <TinyButton size="small">
                                                        <ContentCopyIcon />
                                                    </TinyButton>
                                                </CopyToClipboard>
                                            </span>
                                        </InfoItem>
                                    )}
                                </InfoGrid>
                            </Section>

                            {/* Description */}
                            {meta?.description && (
                                <Section>
                                    <SectionTitle>About {collectionName}</SectionTitle>
                                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.5 }}>
                                        {meta.description}
                                    </Typography>
                                </Section>
                            )}

                            {/* Memo */}
                            {memo && (
                                <CompactSection>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <SectionTitle sx={{ mb: 0 }}>Memo</SectionTitle>
                                        <ToggleButton
                                            size="small"
                                            onClick={() => setShowMemo(!showMemo)}
                                        >
                                            {showMemo ? 'Hide' : 'Show'}
                                        </ToggleButton>
                                    </Box>
                                    <Collapse in={showMemo}>
                                        {isValidJSON(memo) ? (
                                            <MetadataBox sx={{ mt: 1 }}>
                                                <CodeHighlight json={parseMemo(memo)} />
                                            </MetadataBox>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 1 }}>
                                                {memo}
                                            </Typography>
                                        )}
                                    </Collapse>
                                </CompactSection>
                            )}

                            {/* Raw Metadata */}
                            <CompactSection>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <SectionTitle sx={{ mb: 0 }}>Raw Metadata</SectionTitle>
                                    <ToggleButton
                                        size="small"
                                        onClick={() => setShowRawMetadata(!showRawMetadata)}
                                    >
                                        {showRawMetadata ? 'Hide' : 'Show'}
                                    </ToggleButton>
                                </Box>
                                
                                <Collapse in={showRawMetadata}>
                                    {meta && (
                                        <MetadataBox sx={{ mt: 1 }}>
                                            <CodeHighlight json={meta} />
                                        </MetadataBox>
                                    )}
                                </Collapse>
                            </CompactSection>
                        </DetailCard>
                    </DetailContainer>
                </Grid>

                {/* Right side - NFT Actions */}
                <Grid item xs={12} md={7} lg={7.5}>
            <Container>
                <Stack spacing={2}>
                    {self && (
                        <HeaderSection>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={3} alignItems="center">
                                    {/* Left side - Collection and Name */}
                                    <Box>
                                        <Stack direction="row" spacing={0.75} alignItems="center">
                                            {cslug ? (
                                                <Link 
                                                    href={`/collection/${cslug}`} 
                                                    underline="none" 
                                                    sx={{ 
                                                        fontSize: '0.75rem', 
                                                        color: 'text.secondary',
                                                        fontWeight: 600,
                                                        letterSpacing: 0.5,
                                                        textTransform: 'uppercase',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            color: 'primary.main',
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    {collectionName}
                                                </Link>
                                            ) : (
                                                <Typography 
                                                    sx={{ 
                                                        color: 'text.secondary',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        letterSpacing: 0.5,
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {collectionName}
                                                </Typography>
                                            )}
                                            {cverified === 'yes' && (
                                                <Tooltip title="Verified Collection" arrow placement="top">
                                                    <VerificationBadge>
                                                        <CheckIcon />
                                                    </VerificationBadge>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                        
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 800,
                                                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                display: 'inline-block',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {nftName}
                                        </Typography>
                                    </Box>

                                    {/* Divider */}
                                    <Divider orientation="vertical" flexItem sx={{ 
                                        height: 40, 
                                        borderColor: alpha(theme.palette.divider, 0.2)
                                    }} />
                                    
                                    {/* Stats - All in one row */}
                                    <Stack direction="row" spacing={2.5} alignItems="center">
                                        {floorPrice > 0 && (
                                            <Box>
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '0.625rem',
                                                        color: alpha(theme.palette.text.secondary, 0.6),
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                        mb: 0.25
                                                    }}
                                                >
                                                    Floor
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Icon icon={rippleSolid} style={{ fontSize: 16, color: theme.palette.primary.main }} />
                                                    <Typography 
                                                        sx={{ 
                                                            fontSize: '1rem',
                                                            fontWeight: 700,
                                                            color: theme.palette.text.primary
                                                        }}
                                                    >
                                                        {fNumber(floorPrice)}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        )}
                                        
                                        {rarity_rank > 0 && (
                                            <Box>
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '0.625rem',
                                                        color: alpha(theme.palette.text.secondary, 0.6),
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                        mb: 0.25
                                                    }}
                                                >
                                                    Rank
                                                </Typography>
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '1rem',
                                                        fontWeight: 700,
                                                        color: theme.palette.warning.main
                                                    }}
                                                >
                                                    #{fIntNumber(rarity_rank)}
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {MasterSequence && (
                                            <Box>
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '0.625rem',
                                                        color: alpha(theme.palette.text.secondary, 0.6),
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                        mb: 0.25
                                                    }}
                                                >
                                                    SEQ
                                                </Typography>
                                                <Typography 
                                                    sx={{ 
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        color: theme.palette.text.secondary
                                                    }}
                                                >
                                                    #{MasterSequence}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Stack>
                                
                                {/* Share button */}
                                <Tooltip title="Share" arrow placement="left">
                                    <IconButton 
                                        onClick={handleShareClick} 
                                        ref={anchorRef}
                                        sx={{ 
                                            background: alpha(theme.palette.background.default, 0.5),
                                            '&:hover': {
                                                background: alpha(theme.palette.primary.main, 0.1),
                                                '& svg': {
                                                    color: theme.palette.primary.main
                                                }
                                            }
                                        }}
                                    >
                                        <ShareIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </HeaderSection>
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
                                {account}
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
                                Includes {(lowestSellOffer.brokerFeePercentage * 100).toFixed(3)}% broker fee • {lowestSellOffer.brokerName}
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
                                                    <Box key={index} sx={{ 
                                                        p: 2, 
                                                        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)}, ${alpha(theme.palette.background.paper, 0.8)})`,
                                                        borderRadius: 2,
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateX(4px)',
                                                            boxShadow: theme.shadows[2],
                                                        }
                                                    }}>
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
                                                <Box key={index} sx={{ 
                                                    p: 2, 
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)}, ${alpha(theme.palette.background.paper, 0.8)})`,
                                                    borderRadius: 2,
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        boxShadow: theme.shadows[2],
                                                    }
                                                }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Box>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <Icon icon={rippleSolid} fontSize={16} />
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {formatXRPAmount(amount.amount, true)}
                                                                </Typography>
                                                            </Stack>
                                                            <Typography variant="caption" color="text.secondary">
                                                                from {offer.owner}
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
                                    <Box sx={{ 
                                        py: 3, 
                                        textAlign: 'center',
                                        background: alpha(theme.palette.background.default, 0.3),
                                        borderRadius: 2,
                                        border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`
                                    }}>
                                        <LocalOfferIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            No buy offers yet
                                        </Typography>
                                        {!isOwner && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleCreateBuyOffer}
                                                startIcon={<LocalOfferIcon />}
                                            >
                                                Make an Offer
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
                </Grid>
            </Grid>

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
