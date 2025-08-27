import axios from 'axios';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Dialog } from '@mui/material';

// Material UI Components
import {
    useTheme,
    Avatar,
    Box,
    Container,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Chip,
    Tooltip,
    useMediaQuery
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

// Icons
import {
    TaskAlt as TaskAltIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    ManageAccounts as ManageAccountsIcon,
    GridOn as GridOnIcon,
    Grid4x4 as Grid4x4Icon,
    Approval as ApprovalIcon,
    Token as TokenIcon,
    Collections as CollectionsIcon,
    Casino as CasinoIcon,
    ShoppingBag as ShoppingBagIcon,
    LocalOffer as LocalOfferIcon,
    HighlightOff as HighlightOffIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    HowToReg as HowToRegIcon,
    SportsScore as SportsScoreIcon,
    Fireplace as FireplaceIcon,
    HelpOutline as HelpOutlineIcon,
    Animation as AnimationIcon,
    Payment as PaymentIcon,
    ImportExport as ImportExportIcon
} from '@mui/icons-material';

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { normalizeAmount } from 'src/utils/normalizers';
import { formatDistanceToNow } from 'date-fns';

// Define Activity constants based on your activity codes
const Activity = {
    LOGIN: 1,
    LOGOUT: 2,
    UPDATE_PROFILE: 3,
    CREATE_COLLECTION: 4,
    UPDATE_COLLECTION: 5,
    IMPORT_COLLECTION: 6,
    MINT_BULK: 7,
    BUY_MINT: 8,
    BUY_RANDOM_NFT: 9,
    BUY_SEQUENCE_NFT: 10,
    BUY_BULK_NFT: 11,
    CREATE_SELL_OFFER: 21,
    CREATE_BUY_OFFER: 22,
    CANCEL_SELL_OFFER: 23,
    CANCEL_BUY_OFFER: 24,
    ACCEPT_BUY_OFFER: 25,
    ACCEPT_SELL_OFFER: 26,
    OWNER_ACCEPTED_YOUR_BUY_OFFER: 27,
    BUYER_ACCEPTED_YOUR_SELL_OFFER: 28,
    YOU_RECEIVED_A_NFT: 29,
    MINT_NFT: 30,
    BURN_NFT: 31,
    SET_NFT_MINTER: 32,
    REFUND_BUYER: 33,
    BROKER_ACCEPTED_YOUR_BUY_OFFER: 35,
    BROKER_ACCEPTED_YOUR_SELL_OFFER: 36
};

// Loader
import { PulseLoader } from 'react-spinners';

// Components
import ListToolbar from '../ListToolbar';

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

// Helper Components
const NFTokenIDLink = ({ NFTokenID }) => (
    <Stack spacing={0.5}>
        <NFTDetails NFTokenID={NFTokenID} isLinkable={true} />
    </Stack>
);

const CollectionInfo = ({ data }) => (
    <Stack direction="row" spacing={1} alignItems="center">
        <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${data.logo}`} />
        <Stack>
            <Stack direction="row" spacing={1}>
                <Typography variant="s7">Name: </Typography>
                <Typography variant="s8">{data.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography variant="s7">Type: </Typography>
                <Typography variant="s8">{data.type}</Typography>
            </Stack>
        </Stack>
    </Stack>
);

const NFTInfo = ({ data }) => (
    <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        sx={{ fontSize: '0.75rem' }}
    >
        <Stack direction="row" spacing={1}>
            <Avatar
                alt="NFT"
                src={`https://gateway.xrpnft.com/ipfs/${data.meta?.image}`}
                sx={{ width: 24, height: 24 }}
            />
            <Stack>
                <Typography variant="caption">{data.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {data.type}
                </Typography>
            </Stack>
        </Stack>
        {data.flag && <FlagsContainer Flags={data.flag} />}
    </Stack>
);

const CostDisplay = ({ cost }) => (
    <Chip
        label={`${Number(cost.amount).toLocaleString()} ${cost.currency}`}
        color="primary"
        size="small"
        sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 500,
            '& .MuiChip-label': {
                px: 1.5,
                py: 0.5
            }
        }}
    />
);

const HashLink = ({ hash }) => (
    <Link
        href={`https://bithomp.com/explorer/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
    >
        <Typography variant="caption">
            {hash.substring(0, 8)}...{hash.substring(hash.length - 8)}
        </Typography>
    </Link>
);

// Updated NFTDetails component
const NFTDetails = ({ NFTokenID, isLinkable = false }) => {
    const [nftInfo, setNftInfo] = useState(null);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchNFTInfo = async () => {
            try {
                const response = await axios.get(
                    `https://api.xrpnft.com/api/nft/${NFTokenID}`
                );
                if (response.data.res === 'success') {
                    setNftInfo(response.data.nft);
                }
            } catch (error) {
                console.error('Error fetching NFT info:', error);
            }
        };

        if (NFTokenID) {
            fetchNFTInfo();
        }
    }, [NFTokenID]);

    if (!nftInfo) return null;

    const getImageUrl = (nft) => {
        if (nft.files && nft.files.length > 0) {
            const imageFile = nft.files.find(
                (file) => file.parsedType === 'image'
            );
            if (imageFile) {
                if (imageFile.IPFSPath) {
                    return `https://gateway.xrpnft.com/ipfs/${imageFile.IPFSPath}`;
                } else if (imageFile.parsedUrl) {
                    return imageFile.parsedUrl.startsWith('ipfs://')
                        ? `https://gateway.xrpnft.com/ipfs/${imageFile.parsedUrl.slice(
                              7
                          )}`
                        : imageFile.parsedUrl;
                }
            }
        }
        if (nft.meta?.image) {
            return nft.meta.image.startsWith('ipfs://')
                ? `https://gateway.xrpnft.com/ipfs/${nft.meta.image.slice(7)}`
                : nft.meta.image;
        } else if (nft.thumbnail?.big) {
            return `https://s1.xrpnft.com/thumbnail/${nft.thumbnail.big}`;
        }
        return null;
    };

    const getNFTName = (nft) => {
        if (nft.name && nft.name !== 'No Name') return nft.name;
        if (nft.meta?.name) return nft.meta.name;
        if (nft.collection) return `${nft.collection} #${nft.sequence}`;
        return `NFT #${nft.sequence}`;
    };

    const imageUrl = getImageUrl(nftInfo);
    const nftName = getNFTName(nftInfo);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                py: 0.25
            }}
        >
            <Avatar
                alt={nftName}
                src={imageUrl}
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.8
                    }
                }}
                variant="rounded"
                onClick={() => setOpenImageDialog(true)}
            />
            <Dialog
                open={openImageDialog}
                onClose={() => setOpenImageDialog(false)}
                maxWidth="md"
                onClick={() => setOpenImageDialog(false)}
            >
                <Box
                    component="img"
                    src={imageUrl}
                    alt={nftName}
                    sx={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain'
                    }}
                />
            </Dialog>
            <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {isLinkable ? (
                        <Link
                            href={`/nft/${NFTokenID}`}
                            underline="hover"
                            sx={{ color: 'inherit', flexGrow: 1 }}
                        >
                            <Typography variant="caption" noWrap>
                                {nftName}
                            </Typography>
                        </Link>
                    ) : (
                        <Typography variant="caption" noWrap sx={{ flexGrow: 1 }}>
                            {nftName}
                        </Typography>
                    )}
                    {nftInfo?.rarity_rank && nftInfo?.total && (
                        <Chip
                            label={`Rank ${nftInfo.rarity_rank}/${nftInfo.total}`}
                            size="small"
                            color="primary"
                            sx={{
                                height: 20,
                                '& .MuiChip-label': {
                                    px: 1,
                                    fontSize: '0.65rem',
                                    fontWeight: 600
                                }
                            }}
                        />
                    )}
                </Stack>
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap
                    sx={{ display: 'block' }}
                >
                    {nftInfo?.collection}
                </Typography>
            </Stack>
        </Box>
    );
};

const getBrokerName = (address) => {
    switch (address) {
        case 'rpx9JThQ2y37FaGeeJP7PXDUVEXY3PHZSC':
            return 'xrp.cafe';
        case 'rDeizxSRo6JHjKnih9ivpPkyD2EgXQvhSB':
            return 'XPMarket';
        case 'rpZqTPC8GvrSvEfFsUuHkmPCg29GdQuXhC':
            return 'BIDDS';
        case 'rnPNSonfEN1TWkPH4Kwvkk3693sCT4tsZv':
            return 'Art Dept Fun';
        case 'rJcCJyJkiTXGcxU4Lt4ZvKJz8YmorZXu8r':
            return 'OpulenceX';
        default:
            return address;
    }
};

const BrokerDisplay = ({ broker, cost }) => (
    <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
            >
                Broker:
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    color: 'primary.main',
                    fontWeight: 600
                }}
            >
                {getBrokerName(broker)}
            </Typography>
        </Stack>
        {cost && <CostDisplay cost={cost} />}
    </Stack>
);

// Updated activityComponents to include cost display for ACCEPT_SELL_OFFER
const activityComponents = {
    [Activity.LOGIN]: {
        strActivity: 'Login',
        componentIcon: <LoginIcon color="info" />,
        color: 'info.main',
        renderComponentActivity: () => null
    },
    [Activity.LOGOUT]: {
        strActivity: 'Logout',
        componentIcon: <LogoutIcon color="info" />,
        color: 'info.main',
        renderComponentActivity: () => null
    },
    [Activity.UPDATE_PROFILE]: {
        strActivity: 'Update Profile',
        componentIcon: <ManageAccountsIcon color="info" />,
        color: 'info.main',
        renderComponentActivity: () => null
    },
    [Activity.CREATE_COLLECTION]: {
        strActivity: 'Create a Collection',
        componentIcon: <GridOnIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => <CollectionInfo data={data} />
    },
    [Activity.IMPORT_COLLECTION]: {
        strActivity: 'Import a Collection',
        componentIcon: <ImportExportIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                    alt="C"
                    src={`https://s1.xrpnft.com/collection/${data.logo}`}
                />
                <Link href={`/collection/${data.slug}`} underline="none">
                    <Typography variant="s8">{data.name}</Typography>
                </Link>
            </Stack>
        )
    },
    [Activity.UPDATE_COLLECTION]: {
        strActivity: 'Update Collection',
        componentIcon: <Grid4x4Icon color="info" />,
        color: 'info.main',
        renderComponentActivity: (data) => <CollectionInfo data={data} />
    },
    [Activity.MINT_BULK]: {
        strActivity: 'Mint Bulk NFTs',
        componentIcon: <CollectionsIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack direction="row" spacing={1}>
                    <Avatar
                        alt="C"
                        src={`https://gateway.xrpnft.com/ipfs/${data.meta?.image}`}
                    />
                    <Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="s7">Minter: </Typography>
                            <Typography variant="s8">{data.minter}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="s7">Issuer: </Typography>
                            <Typography variant="s8">{data.issuer}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="s7">Total: </Typography>
                            <Typography variant="s8">{data.count}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <FlagsContainer Flags={data.flag} />
            </Stack>
        )
    },
    [Activity.BUY_MINT]: {
        strActivity: 'Buy Mint',
        componentIcon: <ShoppingBagIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack direction="row" spacing={1}>
                    <Avatar
                        alt="C"
                        src={`https://s1.xrpl.to/token/${data.cost?.md5}`}
                    />
                    <Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="s7">Collection: </Typography>
                            <Typography variant="s8">{data.cname}</Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={0.8}
                            alignItems="center"
                        >
                            <Typography variant="p4" color="#EB5757">
                                {data.cost?.amount}
                            </Typography>
                            <Typography variant="s2">
                                {data.cost?.name}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="s7">Quantity: </Typography>
                    <Typography variant="s8">{data.quantity}</Typography>
                </Stack>
            </Stack>
        )
    },
    [Activity.BUY_RANDOM_NFT]: {
        strActivity: 'Buy Random NFT',
        componentIcon: <CasinoIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => <NFTInfo data={data} />
    },
    [Activity.BUY_SEQUENCE_NFT]: {
        strActivity: 'Buy Sequence NFT',
        componentIcon: <AnimationIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => <NFTInfo data={data} />
    },
    [Activity.BUY_BULK_NFT]: {
        strActivity: 'Buy Bulk NFT',
        componentIcon: <TaskAltIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => <NFTInfo data={data} />
    },
    [Activity.CREATE_SELL_OFFER]: {
        strActivity: 'Create Sell Offer',
        componentIcon: <LocalOfferIcon color="warning" />,
        color: 'warning.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && <CostDisplay cost={data.cost} />}
                {data.hash && <HashLink hash={data.hash} />}
            </Stack>
        )
    },
    [Activity.CREATE_BUY_OFFER]: {
        strActivity: 'Create Buy Offer',
        componentIcon: <LocalOfferIcon color="warning" />,
        color: 'warning.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && <CostDisplay cost={data.cost} />}
                {data.hash && <HashLink hash={data.hash} />}
            </Stack>
        )
    },
    [Activity.CANCEL_SELL_OFFER]: {
        strActivity: 'Cancel Sell Offer',
        componentIcon: <HighlightOffIcon color="error" />,
        color: 'error.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && <CostDisplay cost={data.cost} />}
                {data.hash && <HashLink hash={data.hash} />}
            </Stack>
        )
    },
    [Activity.CANCEL_BUY_OFFER]: {
        strActivity: 'Cancel Buy Offer',
        componentIcon: <HighlightOffIcon color="error" />,
        color: 'error.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && <CostDisplay cost={data.cost} />}
                {data.hash && <HashLink hash={data.hash} />}
            </Stack>
        )
    },
    [Activity.ACCEPT_BUY_OFFER]: {
        strActivity: 'Accept Buy Offer',
        componentIcon: <CheckCircleOutlineIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && <CostDisplay cost={data.cost} />}
                {data.hash && <HashLink hash={data.hash} />}
            </Stack>
        )
    },
    [Activity.ACCEPT_SELL_OFFER]: {
        strActivity: (data) =>
            data.cost && data.cost.amount === 0
                ? 'Transfer NFT'
                : 'Accept Sell Offer',
        componentIcon: <CheckCircleOutlineIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack spacing={0.5}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                {data.cost && data.cost.amount !== 0 && (
                    <CostDisplay cost={data.cost} />
                )}
                {data.hash && <HashLink hash={data.hash} />}
                {data.cost && data.cost.amount === 0 && (
                    <Typography variant="caption" color="text.secondary">
                        This is a transfer (no cost involved)
                    </Typography>
                )}
            </Stack>
        )
    },
    [Activity.OWNER_ACCEPTED_YOUR_BUY_OFFER]: {
        strActivity: 'NFT Owner accepted your Buy Offer',
        componentIcon: <HowToRegIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <NFTokenIDLink NFTokenID={data.NFTokenID} />
        )
    },
    [Activity.BUYER_ACCEPTED_YOUR_SELL_OFFER]: {
        strActivity: 'Buyer accepted your Sell Offer',
        componentIcon: <HowToRegIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <NFTokenIDLink NFTokenID={data.NFTokenID} />
        )
    },
    [Activity.YOU_RECEIVED_A_NFT]: {
        strActivity: 'You received a NFT',
        componentIcon: <SportsScoreIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) =>
            data.NFTokenID ? (
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
            ) : (
                <NFTInfo data={data} />
            )
    },
    [Activity.MINT_NFT]: {
        strActivity: 'Minted a NFT',
        componentIcon: <TokenIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <NFTokenIDLink NFTokenID={data.NFTokenID} />
        )
    },
    [Activity.BURN_NFT]: {
        strActivity: 'Burned a NFT',
        componentIcon: <FireplaceIcon color="error" />,
        color: 'error.main',
        renderComponentActivity: (data) => (
            <NFTokenIDLink NFTokenID={data.NFTokenID} />
        )
    },
    [Activity.SET_NFT_MINTER]: {
        strActivity: 'Set NFT Minter',
        componentIcon: <ApprovalIcon color="info" />,
        color: 'info.main',
        renderComponentActivity: (data) => (
            <Stack direction="row" spacing={1}>
                <Typography variant="s7">Minter: </Typography>
                <Typography variant="s8">{data.NFTokenMinter}</Typography>
            </Stack>
        )
    },
    [Activity.REFUND_BUYER]: {
        strActivity: 'Refund Mint Amount to Buyer',
        componentIcon: <PaymentIcon color="warning" />,
        color: 'warning.main',
        renderComponentActivity: (data) => {
            const amount = normalizeAmount(data.amount);
            return (
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack direction="row" spacing={1}>
                        <Avatar
                            alt="C"
                            src={`https://s1.xrpl.to/token/${data.cost?.md5}`}
                        />
                        <Stack>
                            <Stack direction="row" spacing={1}>
                                <Typography variant="s7">
                                    Collection:{' '}
                                </Typography>
                                <Typography variant="s8">
                                    {data.cname}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={0.8}
                                alignItems="center"
                            >
                                <Typography variant="s7">
                                    Cost x Quantity:{' '}
                                </Typography>
                                <Typography variant="s8">
                                    {data.cost?.amount}
                                </Typography>
                                <Typography variant="s8">
                                    {data.cost?.name}
                                </Typography>
                                <Typography variant="s8">x</Typography>
                                <Typography variant="s8">
                                    {data.quantity}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Typography variant="s7">To: </Typography>
                                <Typography variant="s8">
                                    {data.dest}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Stack direction="row" spacing={1}>
                            <Typography variant="s7">Amount: </Typography>
                            <Typography variant="s8">
                                {amount.amount}
                            </Typography>
                            <Typography variant="s8">
                                {data.cost?.name}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            );
        }
    },
    [Activity.BROKER_ACCEPTED_YOUR_BUY_OFFER]: {
        strActivity: 'Broker accepted your Buy Offer',
        componentIcon: <HowToRegIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack spacing={1}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                <BrokerDisplay broker={data.broker} cost={data.cost} />
            </Stack>
        )
    },
    [Activity.BROKER_ACCEPTED_YOUR_SELL_OFFER]: {
        strActivity: 'Broker accepted your Sell Offer',
        componentIcon: <HowToRegIcon color="success" />,
        color: 'success.main',
        renderComponentActivity: (data) => (
            <Stack spacing={1}>
                <NFTokenIDLink NFTokenID={data.NFTokenID} />
                <BrokerDisplay broker={data.broker} cost={data.cost} />
            </Stack>
        )
    },
    // Handle unknown activities
    default: {
        strActivity: (activity) => `Unknown Activity: ${activity}`,
        componentIcon: <HelpOutlineIcon color="default" />,
        color: 'text.secondary',
        renderComponentActivity: (data) => (
            <pre>{JSON.stringify(data, null, 2)}</pre>
        )
    }
};

// Change the styled TableCell name to StyledTableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5),
    '&:first-of-type': {
        paddingLeft: theme.spacing(2)
    },
    '&:last-of-type': {
        paddingRight: theme.spacing(2)
    }
}));

// Add a new ActivityIcon component for consistent icon styling
const ActivityIcon = ({ icon, color }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: (theme) => alpha(theme.palette[color].main, 0.12),
            color: (theme) => theme.palette[color].main
        }}
    >
        {icon}
    </Box>
);

export default function ActivityList({ account }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const BASE_URL = 'https://api.xrpnft.com/api';

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [acts, setActs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getActivities = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${BASE_URL}/account/activity?account=${account}&page=${page}&limit=${rows}`
                );
                if (res.status === 200) {
                    const ret = res.data;
                    setTotal(ret.total);
                    setActs(ret.acts);
                    console.log('History API response:', ret);
                }
            } catch (err) {
                console.log('Error on getting activity list!!!', err);
            } finally {
                setLoading(false);
            }
        };
        getActivities();
    }, [account, page, rows]);

    if (loading) {
        return (
            <Container maxWidth={false} sx={{ pl: 0, pr: 0 }}>
                <Stack alignItems="center">
                    <PulseLoader color="#00AB55" size={10} />
                </Stack>
            </Container>
        );
    }

    if (!loading && acts.length === 0) {
        return (
            <Container maxWidth={false} sx={{ pl: 0, pr: 0 }}>
                <Stack alignItems="center" sx={{ mt: 5 }}>
                    <Typography variant="s7">No Items</Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                pl: 0,
                pr: 0,
                overflowX: 'hidden',
                mb: 8
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    overflowX: 'hidden'
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: '1px solid',
                            borderColor: theme.palette.divider,
                            padding: isMobile ? '4px 8px' : '6px 12px', // reduced padding
                            wordBreak: 'break-word'
                        },
                        tableLayout: 'fixed',
                        width: '100%'
                    }}
                >
                    <TableBody>
                        {acts.map((row) => {
                            const { activity, data, time } = row;
                            const strDateTime = formatDateTime(time);
                            const timeAgo = formatDistanceToNow(
                                new Date(time),
                                { addSuffix: true }
                            );
                            const activityComponent =
                                activityComponents[activity] ||
                                activityComponents.default;
                            const {
                                strActivity,
                                renderComponentActivity,
                                color
                            } = activityComponent;

                            const activityTitle =
                                typeof strActivity === 'function'
                                    ? strActivity(data)
                                    : strActivity;

                            const componentActivity =
                                renderComponentActivity(data);

                            return (
                                <TableRow
                                    key={time}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor:
                                                theme.palette.action.hover
                                        }
                                    }}
                                >
                                    <StyledTableCell
                                        align="left"
                                        sx={{
                                            maxWidth: '100vw',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="flex-start"
                                        >
                                            <ActivityIcon
                                                icon={
                                                    activityComponents[activity]
                                                        .componentIcon
                                                }
                                                color={
                                                    activityComponents[
                                                        activity
                                                    ].color.split('.')[0]
                                                }
                                            />

                                            <Stack
                                                spacing={0.5}
                                                sx={{ flex: 1 }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                        sx={{
                                                            maxWidth: '70%',
                                                            color: color,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {activityTitle}
                                                    </Typography>

                                                    <Tooltip
                                                        title={strDateTime}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            noWrap
                                                            sx={{
                                                                fontSize:
                                                                    '0.75rem',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {timeAgo}
                                                        </Typography>
                                                    </Tooltip>
                                                </Stack>

                                                <Box
                                                    sx={{
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {componentActivity}
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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
        </Container>
    );
}
