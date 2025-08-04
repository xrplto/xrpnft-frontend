// React
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    Container,
    Box,
    Paper,
    Avatar,
    Fab,
    Tooltip,
    useTheme,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    useMediaQuery,
    ToggleButtonGroup,
    ToggleButton,
    alpha,
    IconButton
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

// Components
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import { ColorExtractor } from 'react-color-extractor';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';

// Context
import { AppContext } from 'src/AppContext';

// Utils
import { getNftCoverUrl } from 'src/utils/parse';
import { formatDateTime, formatMonthYearDate } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fPercent, fVolume } from 'src/utils/formatNumber';

// Iconify
import { Icon } from '@iconify/react';
import arrowsExchange from '@iconify/icons-gg/arrows-exchange';

// Styled Components
const AutoStack = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: flex-start;
        }
    `
);

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const HeroButton = styled(Button)(
    ({ theme }) => `
        padding: 11px 24px;
        font-weight: 600;
        font-size: 1rem;
        text-transform: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        height: 46px;
        box-sizing: border-box;
        line-height: 1.2;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        &.MuiButton-contained {
            background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            color: ${theme.palette.common.white};
            border: 1px solid transparent;
            padding: 12px 24px;

            &:hover {
                background: linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark});
            }
        }

        &.MuiButton-outlined {
            border: 1px solid ${theme.palette.primary.main};
            color: ${theme.palette.primary.main};

            &:hover {
                background: rgba(${theme.palette.primary.main}, 0.05);
            }
        }
    `
);

const AnimatedText = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    minWidth: '200px',
    fontWeight: 'bold',
    color: theme.palette.primary.main
}));

const CustomImage = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
}));

const CustomCarousel = styled(Carousel)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    margin: '0 auto',
    '& .slide': {
        background: 'transparent !important',
        boxShadow: 'none !important'
    }
}));

const CollectionCard = styled(Paper)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 16px ${theme.palette.primary.main}20`
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(to bottom, ${theme.palette.background.default}00 70%, ${theme.palette.background.default}B3 100%)`,
        pointerEvents: 'none'
    },
    width: '100%',
    height: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper
}));

const CollectionInfo = styled(Stack)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(1),
    zIndex: 1
}));

const GradientText = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
}));

const VerificationBadge = styled('div')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '& svg': {
        fontSize: 12,
    },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 0.5),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1.5, 2),
        },
    },
}));

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: 'sticky',
        zIndex: 100,
        top: 0,
        left: 24,
        backgroundColor: theme.palette.background.paper
    },
    body: {
        position: 'sticky',
        zIndex: 100,
        left: 24,
        backgroundColor: theme.palette.background.paper
    }
}))(TableCell);

const TransitionTypo = styled(Typography)(
    ({ theme }) => `
        transition: background-color 300ms linear, color 1s linear;
        color: ${theme.palette.text.primary};
    `
);

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: ${theme.palette.primary.main};
    inset: 0;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.5s;
    &:hover {
        opacity: 0.3;
    }
`
);

const CardWrapper = styled('div')(
    ({ theme }) => `
        box-shadow: 0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)};
        border-radius: ${theme.shape.borderRadius * 2}px;
        backdrop-filter: blur(50px);
        background: ${alpha(theme.palette.background.paper, 0.9)};
        padding: ${theme.spacing(1)};
        text-align: center;
        object-fit: cover;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        &:hover {
            box-shadow: 0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.2)};
            background: ${alpha(theme.palette.background.paper, 0.95)};
        }
  `
);

const IconCover = styled('div')(
    ({ theme }) => `
        width: 50px;
        height: 50px;
        box-shadow: ${theme.shadows[4]};
        border: 1px solid ${theme.palette.divider};
        background-color: ${theme.palette.background.neutral};
        position: relative;
        overflow: hidden;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
        border-radius: ${theme.shape.borderRadius * 1.5}px;
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
        }

        ${theme.breakpoints.down('sm')} {
            width: 35px;
            height: 35px;
            border-radius: ${theme.shape.borderRadius}px;
        }
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 10px;

        ${theme.breakpoints.down('sm')} {
            width: 33px;
            height: 33px;
            border-radius: 7px;
        }
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;

    ${theme.breakpoints.down('sm')} {
        border-radius: 8px;
    }
  `
);

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    transition: theme.transitions.create('opacity')
}));

const AdminImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden',
    '&:hover': {
        cursor: 'pointer',
        opacity: 0.6
    }
}));

const TokenImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden'
}));

// Table Head Component
const TABLE_HEAD = (isMobile, volumeType, currency) => {
    if (isMobile) {
        return [
            {
                id: 'name',
                label: 'Collection',
                align: 'left',
                width: '60%',
                order: false
            },
            {
                id: 'floorAndVolume',
                label: 'Floor / Volume',
                align: 'right',
                width: '40%',
                order: false
            }
        ];
    }
    return [
        {
            id: 'name',
            label: 'Collection',
            align: 'left',
            width: '40%',
            order: false
        },
        {
            id: 'floor.amount',
            label: `Floor (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: volumeType === '24h' ? 'totalVol24h' : 'totalVolume',
            label: `${volumeType === '24h' ? '24h Vol' : 'Total Vol'} (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'owners',
            label: 'Owners',
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'items',
            label: 'Supply',
            align: 'right',
            width: '15%',
            order: true
        }
    ];
};

function ListHead({ order, orderBy, onRequestSort, volumeType, currency }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <StyledTableHead>
            <TableRow>
                {TABLE_HEAD(isMobile, volumeType, currency).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={headCell.order ? createSortHandler(headCell.id) : undefined}
                        >
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                fontWeight="600"
                                noWrap
                            >
                                {headCell.label}
                            </Typography>
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </StyledTableHead>
    );
}

ListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    onRequestSort: PropTypes.func.isRequired,
    volumeType: PropTypes.oneOf(['24h', 'all']).isRequired,
    currency: PropTypes.string.isRequired
};

// Row Component
function Row({ id, item, volumeType, currency, convertToUsd }) {
    const {
        uuid,
        account,
        accountName,
        name,
        slug,
        items,
        type,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        costs,
        extra,
        minter,
        verified,
        created,
        volume,
        totalVolume,
        floor,
        owners,
        totalVol24h
    } = item;

    const floorPrice = floor?.amount || 0;
    
    const formatFloorPrice = (price) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        return `${fNumber(value)} ${currency}`;
    };

    const formatVolume = (volume) => {
        const value = currency === 'USD' ? convertToUsd(volume) : volume;
        return `${fIntNumber(value)} ${currency}`;
    };

    const featuredImageUrl = `https://s1.xrpnft.com/collection/${featuredImage}`;
    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;

    const [colors, setColors] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const handleRowClick = () => {
        document.location = `/collection/${slug}`;
    };

    const displayVolume = volumeType === '24h' ? totalVol24h : totalVolume;

    return (
        <TableRow
            hover
            key={uuid}
            onClick={handleRowClick}
            style={{ cursor: 'pointer' }}
        >
            <TableCell align="left" sx={{ py: 1.5, px: { xs: 0.5, sm: 2 }, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ py: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        sx={{
                            color: theme.palette.text.secondary,
                            minWidth: isMobile ? '16px' : '24px',
                            fontWeight: 600
                        }}
                    >
                        {id}
                    </Typography>
                    <Link href={`/collection/${slug}`} underline="none">
                        <IconCover>
                            <IconWrapper>
                                <IconImage
                                    src={logoImageUrl}
                                    alt={`${name} logo`}
                                />
                            </IconWrapper>
                            <ImageBackdrop className="MuiImageBackdrop-root" />
                        </IconCover>
                    </Link>

                    <Link underline="none" href={`/collection/${slug}`}>
                        <Stack spacing={0.5}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography
                                    variant={isMobile ? 'body2' : 'subtitle2'}
                                    noWrap
                                    sx={{
                                        maxWidth: isMobile ? '80px' : '150px',
                                        textOverflow: 'ellipsis',
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {name}
                                </Typography>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerificationBadge>
                                            <CheckIcon />
                                        </VerificationBadge>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>

            {isMobile ? (
                <TableCell align="right" sx={{ py: 1.5, px: 0.5, border: 'none' }}>
                    <Stack spacing={0.5}>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            Floor: {formatFloorPrice(floorPrice)}
                        </Typography>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            Vol: {formatVolume(displayVolume)}
                        </Typography>
                    </Stack>
                </TableCell>
            ) : (
                <>
                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            {formatFloorPrice(floorPrice)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            {formatVolume(displayVolume)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                        >
                            {fIntNumber(owners || 0)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                        >
                            {fIntNumber(items)}
                        </Typography>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}

// CollectionList Component
function CollectionList({ collections }) {
    const [visibleRows, setVisibleRows] = useState(10);
    const [allVisible, setAllVisible] = useState(false);
    const [volumeType, setVolumeType] = useState('24h');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('totalVol24h');
    const [currency, setCurrency] = useState('XRP');
    const [xrpToUsdRate, setXrpToUsdRate] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchXRPRate = async () => {
            try {
                const response = await fetch('https://api.xrpl.to/api/tokens?start=0&limit=0&sortBy=vol24hxrp&sortType=desc&filter=');
                const data = await response.json();
                if (data.exch && data.exch.USD) {
                    setXrpToUsdRate(data.exch.USD);
                }
            } catch (error) {
                console.error('Error fetching XRP rate:', error);
                setXrpToUsdRate(0.64);
            }
        };

        fetchXRPRate();
        
        const intervalId = setInterval(fetchXRPRate, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleViewMore = () => {
        if (visibleRows + 10 >= collections.length) {
            setVisibleRows(collections.length);
            setAllVisible(true);
        } else {
            setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
        }
    };

    const handleViewAll = () => {
        window.location.href = '/collections';
    };

    const handleVolumeTypeChange = (event, newVolumeType) => {
        if (newVolumeType !== null) {
            setVolumeType(newVolumeType);
            setOrderBy(newVolumeType === '24h' ? 'totalVol24h' : 'totalVolume');
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleCurrencyChange = (event, newCurrency) => {
        if (newCurrency !== null) {
            setCurrency(newCurrency);
        }
    };

    const convertToUsd = (xrpValue) => {
        return Math.floor(xrpValue / xrpToUsdRate);
    };

    const sortedCollections = React.useMemo(() => {
        const comparator = (a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        };

        return [...collections].sort((a, b) => {
            const orderValue = order === 'desc' ? 1 : -1;
            return orderValue * comparator(a, b);
        });
    }, [collections, order, orderBy]);

    return (
        <TableContainer
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '100%', md: '95%', lg: '90%' },
                margin: '0 auto',
                borderRadius: { xs: 0, sm: theme.shape.borderRadius * 0.1 },
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                background: alpha(theme.palette.background.paper, 0.15),
                border: { xs: 'none', sm: `1px solid ${alpha(theme.palette.primary.main, 0.18)}` },
                boxShadow: { xs: 'none', sm: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}` },
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: { xs: 'none', sm: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}` },
                    background: alpha(theme.palette.background.paper, 0.2),
                    outline: { xs: 'none', sm: `2px solid ${alpha(theme.palette.primary.main, 0.5)}` },
                    outlineOffset: '2px'
                },
                padding: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pr: { xs: 0.5, sm: 2 },
                    pl: { xs: 0.5, sm: 2 },
                    pt: 1,
                    pb: 1
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={volumeType}
                        exclusive
                        onChange={handleVolumeTypeChange}
                        size="small"
                    >
                        <ToggleButton value="24h">24h</ToggleButton>
                        <ToggleButton value="all">All</ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        value={currency}
                        exclusive
                        onChange={handleCurrencyChange}
                        size="small"
                    >
                        <ToggleButton value="XRP">XRP</ToggleButton>
                        <ToggleButton value="USD">USD</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Link href="/collections" underline="none">
                    <Typography
                        variant="button"
                        color="primary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        See All <span style={{ marginLeft: '4px' }}>&gt;</span>
                    </Typography>
                </Link>
            </Box>
            <Table
                size="small"
                sx={{
                    '& td, & th': {
                        py: 1,
                        px: { xs: 0.5, sm: 0.75, md: 1, lg: 2 }
                    }
                }}
            >
                <ListHead
                    volumeType={volumeType}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    currency={currency}
                />
                <TableBody>
                    {sortedCollections
                        .slice(0, visibleRows)
                        .map((collection, index) => (
                            <Row
                                key={collection.uuid}
                                id={index + 1}
                                item={collection}
                                volumeType={volumeType}
                                currency={currency}
                                convertToUsd={convertToUsd}
                            />
                        ))}
                </TableBody>
            </Table>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 0.5
                }}
            >
                {allVisible ? (
                    <Button
                        onClick={handleViewAll}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }}
                    >
                        View All Collections
                    </Button>
                ) : visibleRows < collections.length ? (
                    <Button
                        onClick={handleViewMore}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }}
                    >
                        View More
                    </Button>
                ) : null}
            </Box>
        </TableContainer>
    );
}

// Main Landing Component
export default function Landing({ collections }) {
    const theme = useTheme();
    const { darkMode } = useContext(AppContext);

    const [animatedText, setAnimatedText] = useState('with No Barriers');
    const phrases = ['with No Barriers', 'on Layer 1', 'with No Brokers'];

    useEffect(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setAnimatedText(phrases[currentIndex]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const fadeAnimationHandler = (props, state) => {
        const transitionTime = props.transitionTime + 'ms';
        const transitionTimingFunction = 'ease-in-out';

        let slideStyle = {
            position: 'absolute',
            display: 'block',
            zIndex: -2,
            minHeight: '100%',
            opacity: 0,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            transitionTimingFunction: transitionTimingFunction,
            msTransitionTimingFunction: transitionTimingFunction,
            MozTransitionTimingFunction: transitionTimingFunction,
            WebkitTransitionTimingFunction: transitionTimingFunction,
            OTransitionTimingFunction: transitionTimingFunction
        };

        if (!state.swiping) {
            slideStyle = {
                ...slideStyle,
                WebkitTransitionDuration: transitionTime,
                MozTransitionDuration: transitionTime,
                OTransitionDuration: transitionTime,
                transitionDuration: transitionTime,
                msTransitionDuration: transitionTime
            };
        }

        return {
            slideStyle,
            selectedStyle: {
                ...slideStyle,
                opacity: 1,
                zIndex: 2,
                position: 'relative'
            },
            prevStyle: { ...slideStyle }
        };
    };

    return (
        <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2, md: 3 } }}>
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
                <Grid
                    container
                    spacing={0}
                    sx={{
                        mt: { xs: 0, sm: 0, md: 1 },
                        mb: { xs: 2, md: 6 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={1}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    />
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            pl: { xs: 0, md: 4 }
                        }}
                    >
                        <AutoStack
                            spacing={3}
                            sx={{
                                maxWidth: { xs: '100%', sm: '100%', md: '90%' },
                                px: { xs: 0.5, sm: 0 }
                            }}
                        >
                            <GradientTypography
                                variant="h1"
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: '2rem',
                                        sm: '2.5rem',
                                        md: '3rem',
                                        lg: '3.5rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' },
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                XRP NFT Marketplace
                            </GradientTypography>

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{
                                    fontSize: {
                                        xs: '1.25rem',
                                        sm: '1.5rem',
                                        md: '1.75rem'
                                    },
                                    textAlign: { xs: 'center', md: 'left' }
                                }}
                            >
                                Trade XRP NFTs{' '}
                                <AnimatedText component="span">
                                    {animatedText}
                                </AnimatedText>
                            </Typography>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mt: 4, width: '100%' }}
                            >
                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/collections`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="contained" fullWidth>
                                        Explore Collections
                                    </HeroButton>
                                </Link>

                                <Link
                                    underline="none"
                                    color="inherit"
                                    href={`/create`}
                                    rel="noreferrer noopener nofollow"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <HeroButton variant="outlined" fullWidth>
                                        Create NFT
                                    </HeroButton>
                                </Link>
                            </Stack>

                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: {
                                        xs: 'center',
                                        md: 'flex-start'
                                    }
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    Supported Marketplaces: xrp.cafe, bidds, Art
                                    Dept, XPMarket, Opul
                                </Typography>
                            </Box>
                        </AutoStack>
                    </Grid>
                    <Grid item xs={12} md={5} lg={5}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: { xs: '100%', sm: '500px' },
                                aspectRatio: '1 / 1',
                                mx: 'auto',
                                px: { xs: 1, sm: 0 }
                            }}
                        >
                            <CustomCarousel
                                interval={4000}
                                transitionTime={2000}
                                showArrows={false}
                                showStatus={false}
                                showIndicators={false}
                                infiniteLoop={true}
                                showThumbs={false}
                                useKeyboardArrows={true}
                                autoPlay={true}
                                stopOnHover={false}
                                swipeable={false}
                                animationHandler={fadeAnimationHandler}
                                emulateTouch={true}
                            >
                                {collections.slice(0, 1).map((item, idx) => {
                                    const {
                                        uuid,
                                        name,
                                        slug,
                                        logoImage,
                                        verified,
                                        nft
                                    } = item;

                                    let imgUrl = getNftCoverUrl(nft ? nft : {});

                                    if (!imgUrl || nft?.meta?.video) {
                                        imgUrl = `https://s1.xrpnft.com/collection/${logoImage}`;
                                    }

                                    return (
                                        <CollectionCard key={idx} elevation={0}>
                                            <Link
                                                underline="none"
                                                color="inherit"
                                                href={`/collection/${slug}`}
                                                sx={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            >
                                                <CustomImage
                                                    src={imgUrl}
                                                    alt={name}
                                                />
                                                <CollectionInfo
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        padding: 2
                                                    }}
                                                >
                                                    <GradientText
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: theme.palette.text.primary,
                                                            fontWeight: 600,
                                                            textShadow: `0 1px 2px ${theme.palette.primary.main}80`,
                                                            textAlign: 'center',
                                                            flexGrow: 1,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontSize: '1.5rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        {name}
                                                        {verified === 'yes' && (
                                                            <Tooltip title="Verified">
                                                                <VerificationBadge>
                                                                    <CheckIcon />
                                                                </VerificationBadge>
                                                            </Tooltip>
                                                        )}
                                                    </GradientText>
                                                </CollectionInfo>
                                            </Link>
                                        </CollectionCard>
                                    );
                                })}
                            </CustomCarousel>
                        </Box>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: { xs: 3, md: 8 },
                        mb: { xs: 3, md: 8 },
                        px: { xs: 0.5, sm: 2 },
                        width: '100%',
                        maxWidth: {
                            xs: '100%',
                            sm: '100%',
                            md: '95%',
                            lg: '90%'
                        },
                        margin: '0 auto'
                    }}
                >
                    <CollectionList collections={collections} />
                </Box>

                <Box sx={{ height: { xs: 24, md: 48 } }} />
            </Box>
        </Container>
    );
}