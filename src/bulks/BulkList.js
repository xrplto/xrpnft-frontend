import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    styled,
    useTheme,
    Avatar,
    Backdrop,
    Box,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Divider,
    CircularProgress,
    Skeleton,
    Chip,
    Card,
    CardContent,
    Grid,
    Container,
    Button
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import PushPinIcon from '@mui/icons-material/PushPin';
import CollectionsIcon from '@mui/icons-material/Collections';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import CasinoIcon from '@mui/icons-material/Casino';
import AnimationIcon from '@mui/icons-material/Animation';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { alpha } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useMediaQuery from '@mui/material/useMediaQuery';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';
import { formatDateTime } from 'src/utils/formatTime';

// Loader
import { PulseLoader, ClockLoader } from 'react-spinners';
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import QRDialog from 'src/components/QRDialog';
import BulkToolbar from './BulkToolbar';

// ----------------------------------------------------------------------
const CancelTypography = styled(Typography)({
    color: '#FF6C40',
    borderRadius: '6px',
    border: '0.05em solid #FF6C40',
    lineHeight: '1',
    paddingLeft: '3px',
    paddingRight: '3px'
});

const BuyTypography = styled(Typography)({
    color: '#007B55',
    borderRadius: '6px',
    border: '0.05em solid #007B55',
    lineHeight: '1',
    paddingLeft: '3px',
    paddingRight: '3px'
});

const SellTypography = styled(Typography)({
    color: '#B72136',
    borderRadius: '6px',
    border: '0.05em solid #B72136',
    lineHeight: '1',
    paddingLeft: '3px',
    paddingRight: '3px'
});

// ----------------------------------------------------------------------

const STATUS_PENDING = 0;
const STATUS_START = 1;
const STATUS_ERROR = 2;
const STATUS_SUCCESS = 3;

// FLAG_MINT specific status
const STATUS_ERR_MINTER = 4; // Minter not set to the account
const STATUS_ERR_BALANCE = 5; // Minter balance is not enough to mint

const FLAG_GOOGLE = 0;
const FLAG_UNZIP = 1;
const FLAG_IPFS = 2;
const FLAG_MINT = 3;

function getBulkStatus(bulk, flag) {
    const status = bulk.status;
    if (flag === FLAG_GOOGLE) return status & 0x03;
    else if (flag === FLAG_UNZIP) return (status >> 2) & 0x03;
    else if (flag === FLAG_IPFS) return (status >> 4) & 0x03;
    else if (flag === FLAG_MINT) return (status >> 6) & 0x0f;
}

// Modify the StatusContainer to accept theme as a prop
function StatusContainer({ bulk, flag, theme }) {
    const status = getBulkStatus(bulk, flag);
    return (
        <>
            {status === STATUS_PENDING && (
                <Tooltip title="PENDING">
                    <PendingIcon
                        fontSize="large"
                        sx={{ color: theme.palette.text.secondary }}
                    />
                </Tooltip>
            )}
            {status === STATUS_START && (
                <Tooltip title="WORKING">
                    <CircularProgress size={24} thickness={4} />
                </Tooltip>
            )}
            {status === STATUS_ERROR && (
                <Tooltip title="ERROR">
                    <ErrorIcon color="error" fontSize="large" />
                </Tooltip>
            )}
            {status === STATUS_SUCCESS && (
                <Tooltip title="OK">
                    <CheckCircleIcon color="success" fontSize="large" />
                </Tooltip>
            )}
        </>
    );
}

// Add these styled components after the existing styled components

const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px',
    }
}));

const GlassContent = styled(CardContent)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
}));

export default function BulkList() {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [count, setCount] = useState(0);
    const [bulks, setBulks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card');

    // Add this line to check if the screen is mobile
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getBulkCollections = useCallback(() => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        axios
            .get(
                `${BASE_URL}/collection/list?account=${account}&page=${page}&limit=${rows}&type=bulk`,
                { headers: { 'x-access-token': accountToken } }
            )
            .then((res) => {
                console.log('XRPNFT API Response:', res.data); // Add this line to log the response
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    setCount(ret.count);
                    setBulks(ret.collections);
                }
            })
            .catch((err) => {
                console.log('Error on getting bulk list!!!', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [account, accountToken, page, rows, openSnackbar]);

    useEffect(() => {
        getBulkCollections();
    }, [getBulkCollections]);

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    mb: 5,
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <div>
                    <Typography variant="h3" gutterBottom>
                        Bulk Collections
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Manage and mint your bulk NFT collections
                    </Typography>
                </div>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                >
                    <ToggleButton value="card" aria-label="card view">
                        <ViewModuleIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {loading ? (
                viewMode === 'card' ? (
                    <Grid container spacing={3}>
                        {[...Array(6)].map((_, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height={200}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="80%"
                                            sx={{ mt: 2 }}
                                        />
                                        <Skeleton variant="text" width="60%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Table>
                        <TableBody>
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell width="15%">
                                        <Skeleton
                                            variant="rectangular"
                                            width={160}
                                            height={160}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                        <Skeleton variant="text" width="40%" />
                                    </TableCell>
                                    <TableCell width="15%">
                                        <Skeleton
                                            variant="circular"
                                            width={56}
                                            height={56}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            ) : viewMode === 'card' ? (
                <Grid container spacing={3}>
                    {bulks &&
                        bulks.map((row) => {
                            const {
                                uuid,
                                slug,
                                bulkUrl,
                                status,
                                logoImage,
                                name,
                                created,
                                description,
                                infoDOWNLOAD,
                                infoUNZIP,
                                infoIPFS,
                                infoMINT,
                                category,
                                type,
                                items,
                                owners,
                                taxon,
                                minterName
                            } = row;

                            const strDateTime = formatDateTime(created);

                            return (
                                <Grid item xs={12} md={6} lg={4} key={uuid}>
                                    <CardWrapper
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <GlassContent sx={{ flexGrow: 1 }}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    mb: 2
                                                }}
                                            >
                                                <Avatar
                                                    alt={name}
                                                    src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                                    variant="rounded"
                                                    sx={{
                                                        width: '100%',
                                                        height: 200,
                                                        borderRadius: '16px',
                                                        filter:
                                                            infoIPFS &&
                                                            infoIPFS.cid
                                                                ? `drop-shadow(0 4px 8px rgba(0,0,0,0.1))`
                                                                : 'grayscale(100%)'
                                                    }}
                                                />
                                                <Chip
                                                    label={category}
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: (
                                                            theme
                                                        ) =>
                                                            alpha(
                                                                theme.palette
                                                                    .primary
                                                                    .main,
                                                                0.8
                                                            )
                                                    }}
                                                />
                                            </Box>

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                mb={2}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                >
                                                    {name}
                                                </Typography>
                                                <Tooltip
                                                    title={`${
                                                        type
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        type.slice(1)
                                                    } Collection`}
                                                >
                                                    {type === 'random' ? (
                                                        <CasinoIcon color="info" />
                                                    ) : type === 'sequence' ? (
                                                        <AnimationIcon color="info" />
                                                    ) : type === 'normal' ? (
                                                        <ViewListIcon color="info" />
                                                    ) : (
                                                        <ViewModuleIcon color="info" />
                                                    )}
                                                </Tooltip>
                                            </Stack>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {description}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{ mb: 2 }}
                                            >
                                                <Box>
                                                    <StatusChip
                                                        flag={FLAG_GOOGLE}
                                                        status={getBulkStatus(
                                                            row,
                                                            FLAG_GOOGLE
                                                        )}
                                                        label="Download"
                                                    />
                                                    {infoDOWNLOAD &&
                                                        infoDOWNLOAD.size && (
                                                            <Typography
                                                                variant="caption"
                                                                display="block"
                                                                sx={{ mt: 0.5 }}
                                                            >
                                                                {
                                                                    infoDOWNLOAD.size
                                                                }
                                                            </Typography>
                                                        )}
                                                </Box>
                                                <StatusChip
                                                    flag={FLAG_UNZIP}
                                                    status={getBulkStatus(
                                                        row,
                                                        FLAG_UNZIP
                                                    )}
                                                    label="Unzip"
                                                    count={
                                                        infoUNZIP
                                                            ? infoUNZIP.count
                                                            : undefined
                                                    }
                                                />
                                                <StatusChip
                                                    flag={FLAG_IPFS}
                                                    status={getBulkStatus(
                                                        row,
                                                        FLAG_IPFS
                                                    )}
                                                    label="IPFS"
                                                    count={
                                                        infoIPFS
                                                            ? infoIPFS.count
                                                            : undefined
                                                    }
                                                />
                                                <StatusChip
                                                    flag={FLAG_MINT}
                                                    status={getBulkStatus(
                                                        row,
                                                        FLAG_MINT
                                                    )}
                                                    label="Mint"
                                                />
                                            </Stack>

                                            {infoIPFS && infoIPFS.cid && (
                                                <Stack
                                                    direction="column"
                                                    spacing={1}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="primary"
                                                    >
                                                        IPFS CID: {infoIPFS.cid}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="info.main"
                                                    >
                                                        Pinned Items:{' '}
                                                        {fIntNumber(
                                                            infoIPFS.count
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            )}

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                sx={{ mb: 1 }}
                                            >
                                                <Typography variant="body2">
                                                    Items:{' '}
                                                    {infoUNZIP
                                                        ? fIntNumber(
                                                              infoUNZIP.count
                                                          )
                                                        : 'N/A'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Owners: {owners}
                                                </Typography>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                sx={{ mb: 1 }}
                                            >
                                                <Typography variant="body2">
                                                    Taxon: {taxon}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Minter: {minterName}
                                                </Typography>
                                            </Stack>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Created: {strDateTime}
                                            </Typography>
                                        </GlassContent>

                                        {infoIPFS &&
                                            infoIPFS.cid &&
                                            status === 0x3f && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    href={`/bulks/mint/${slug}`}
                                                    startIcon={
                                                        <CollectionsIcon />
                                                    }
                                                    sx={{ mt: 'auto', borderRadius: 0, borderBottomLeftRadius: theme.shape.borderRadius * 2, borderBottomRightRadius: theme.shape.borderRadius * 2 }}
                                                >
                                                    Bulk Mint
                                                </Button>
                                            )}
                                    </CardWrapper>
                                </Grid>
                            );
                        })}
                </Grid>
            ) : (
                <Table
                    stickyHeader
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: '1px solid',
                            borderColor: theme.palette.divider
                        }
                    }}
                >
                    <TableBody>
                        {bulks &&
                            bulks.map((row) => {
                                const {
                                    uuid,
                                    slug,
                                    bulkUrl,
                                    status,
                                    logoImage,
                                    name,
                                    created,
                                    description,
                                    infoDOWNLOAD,
                                    infoUNZIP,
                                    infoIPFS,
                                    infoMINT,
                                    category,
                                    type,
                                    items,
                                    owners,
                                    taxon,
                                    minterName
                                } = row;

                                const strDateTime = formatDateTime(created);

                                return (
                                    <TableRow
                                        key={uuid}
                                        hover
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.palette.action.hover
                                            }
                                        }}
                                    >
                                        <TableCell align="left" width={isMobile ? "30%" : "15%"}>
                                            <Avatar
                                                alt={name}
                                                src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                                variant="rounded"
                                                sx={{
                                                    width: isMobile ? 80 : 160,
                                                    height: isMobile ? 80 : 160,
                                                    borderRadius: '16px',
                                                    filter:
                                                        infoIPFS && infoIPFS.cid
                                                            ? `drop-shadow(0 4px 8px rgba(0,0,0,0.1))`
                                                            : 'grayscale(100%)'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack spacing={2}>
                                                <Typography
                                                    variant={isMobile ? "h6" : "h5"}
                                                    component="div"
                                                >
                                                    {name}
                                                </Typography>
                                                {!isMobile && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {description}
                                                    </Typography>
                                                )}
                                                <Stack
                                                    direction={isMobile ? "column" : "row"}
                                                    spacing={1}
                                                >
                                                    <StatusChip
                                                        flag={FLAG_GOOGLE}
                                                        status={getBulkStatus(row, FLAG_GOOGLE)}
                                                        label="Download"
                                                    />
                                                    <StatusChip
                                                        flag={FLAG_UNZIP}
                                                        status={getBulkStatus(row, FLAG_UNZIP)}
                                                        label="Unzip"
                                                        count={infoUNZIP ? infoUNZIP.count : undefined}
                                                    />
                                                    <StatusChip
                                                        flag={FLAG_IPFS}
                                                        status={getBulkStatus(row, FLAG_IPFS)}
                                                        label="IPFS"
                                                        count={infoIPFS ? infoIPFS.count : undefined}
                                                    />
                                                    <StatusChip
                                                        flag={FLAG_MINT}
                                                        status={getBulkStatus(row, FLAG_MINT)}
                                                        label="Mint"
                                                    />
                                                </Stack>
                                                {!isMobile && infoIPFS && infoIPFS.cid && (
                                                    <Stack
                                                        direction="column"
                                                        spacing={1}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="primary"
                                                        >
                                                            IPFS CID: {infoIPFS.cid}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="info.main"
                                                        >
                                                            Pinned Items: {fIntNumber(infoIPFS.count)}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    sx={{ mb: 1 }}
                                                >
                                                    <Typography variant="body2">
                                                        Items: {infoUNZIP ? fIntNumber(infoUNZIP.count) : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Owners: {owners}
                                                    </Typography>
                                                </Stack>
                                                {!isMobile && (
                                                    <>
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            sx={{ mb: 1 }}
                                                        >
                                                            <Typography variant="body2">
                                                                Taxon: {taxon}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                Minter: {minterName}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Created: {strDateTime}
                                                        </Typography>
                                                    </>
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center" width={isMobile ? "30%" : "20%"}>
                                            {infoIPFS &&
                                            infoIPFS.cid &&
                                            status === 0x3f ? (
                                                <Stack
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        href={`/bulks/mint/${slug}`}
                                                        startIcon={
                                                            <CollectionsIcon />
                                                        }
                                                        fullWidth
                                                    >
                                                        {isMobile ? "Mint" : "Bulk Mint"}
                                                    </Button>
                                                    {!isMobile && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Ready to mint
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            ) : (
                                                <Stack
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        disabled
                                                        startIcon={
                                                            <CollectionsIcon />
                                                        }
                                                        fullWidth
                                                    >
                                                        {isMobile ? "Mint" : "Bulk Mint"}
                                                    </Button>
                                                    {!isMobile && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {status === 0x3f
                                                                ? 'IPFS pending'
                                                                : 'Processing'}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            )}

            {count > 0 && (
                <Box sx={{ mt: 4 }}>
                    <BulkToolbar
                        count={count}
                        rows={rows}
                        setRows={setRows}
                        page={page}
                        setPage={setPage}
                        onRefresh={getBulkCollections}
                    />
                </Box>
            )}
        </Container>
    );
}

// New component for status chips
function StatusChip({ flag, status, label, count }) {
    let color;
    let icon;

    switch (status) {
        case STATUS_SUCCESS:
            color = 'success';
            icon = <CheckCircleIcon />;
            break;
        case STATUS_ERROR:
            color = 'error';
            icon = <ErrorIcon />;
            break;
        case STATUS_START:
            color = 'warning';
            icon = <PendingIcon />;
            break;
        default:
            color = 'default';
            icon = <PendingIcon />;
    }

    return (
        <Chip
            label={
                count !== undefined ? `${label} (${fIntNumber(count)})` : label
            }
            color={color}
            size="small"
            icon={icon}
        />
    );
}