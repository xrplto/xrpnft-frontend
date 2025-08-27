// Combined src/explore module

import axios from 'axios';
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
    Box,
    Button,
    Tab,
    Typography,
    Container,
    Stack,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    FormGroup,
    CardMedia,
    Chip,
    Link,
    Skeleton,
    Card,
    CardContent,
    FormControl,
    Radio,
    RadioGroup,
    Tooltip,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    MenuItem,
    Pagination,
    Select,
    Toolbar,
    Paper
} from "@mui/material";
import {
    TabContext,
    TabList,
    TabPanel
} from "@mui/lab";

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import FilterListIcon from '@mui/icons-material/FilterList';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DiamondIcon from '@mui/icons-material/Diamond';

// External libraries
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import debounce from 'lodash.debounce';
import { isEqual } from 'lodash';
import { Lightbox } from 'react-modal-image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatDistanceToNow } from 'date-fns';
import { ClipLoader, PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';

// Iconify
import { Icon } from '@iconify/react';
import infoFilled from '@iconify/icons-ep/info-filled';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils and context
import { AppContext } from 'src/AppContext';
import { fIntNumber, fNumber } from 'src/utils/formatNumber';
import { normalizeCurrencyCodeXummImpl, normalizeAmount } from 'src/utils/normalizers';
import { getNftCoverUrl } from 'src/utils/parse';
import { tableCellClasses } from '@mui/material/TableCell';

// ========== Styled Components ==========
const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    marginTop: theme.spacing(3),
    
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
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
}));

const CardWrapper2 = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    background: '#111314',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    overflow: 'hidden',
    border: `1px solid ${alpha('#ffffff', 0.08)}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
        borderColor: alpha(theme.palette.primary.main, 0.4),
    }
}));

const GlassContent2 = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '60px',
    padding: theme.spacing(1),
    gap: theme.spacing(0.25),
    flex: '0 0 auto',
    background: '#111314',
    color: '#ffffff'
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    paddingTop: '100%',
    overflow: 'hidden',
    flex: '1 1 auto'
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)'
    }
}));

const SequenceOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 600,
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const GlassyBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent'
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.3)
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main
        }
    },
    '& .MuiInputBase-input': {
        color: theme.palette.text.primary
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: theme.palette.primary.main
    }
}));

const RootStyle = styled('span')(({ theme, ownerState }) => {
  const { color, variant } = ownerState;

  const styleFilled = (color) => ({
    color: theme.palette[color].contrastText,
    backgroundColor: theme.palette[color].main
  });

  const styleOutlined = (color) => ({
    color: theme.palette[color].main,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette[color].main}`
  });

  const styleGhost = (color) => ({
    color: theme.palette[color].dark,
    backgroundColor: alpha(theme.palette[color].main, 0.16)
  });

  return {
    height: 22,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 8,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,

    ...(color !== 'default'
      ? {
          ...(variant === 'filled' && { ...styleFilled(color) }),
          ...(variant === 'outlined' && { ...styleOutlined(color) }),
          ...(variant === 'ghost' && { ...styleGhost(color) })
        }
      : {
          ...(variant === 'outlined' && {
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.grey[500_32]}`
          }),
          ...(variant === 'ghost' && {
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.grey[500_16]
          })
        })
  };
});

const ToolbarRoot = styled(Toolbar)(({ theme }) => ({
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '& .MuiSelect-select': {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1)
    }
}));

// ========== Helper Functions ==========
const sortNFTs = (nfts, sortOption) => {
    switch (sortOption) {
        case 'pricexrpasc':
            return nfts.sort((a, b) => {
                const aAmount =
                    a.cost && a.cost.currency === 'XRP'
                        ? Number(a.cost.amount)
                        : Infinity;
                const bAmount =
                    b.cost && b.cost.currency === 'XRP'
                        ? Number(b.cost.amount)
                        : Infinity;
                return aAmount - bAmount;
            });
        case 'pricexrpdesc':
            return nfts.sort((a, b) => {
                const aAmount =
                    a.cost && a.cost.currency === 'XRP'
                        ? Number(a.cost.amount)
                        : -Infinity;
                const bAmount =
                    b.cost && b.cost.currency === 'XRP'
                        ? Number(b.cost.amount)
                        : -Infinity;
                return bAmount - aAmount;
            });
        case 'pricenoxrp':
            return nfts.sort((a, b) => {
                const aIsXRP = a.cost && a.cost.currency === 'XRP';
                const bIsXRP = b.cost && b.cost.currency === 'XRP';
                if (aIsXRP === bIsXRP) return 0;
                return aIsXRP ? 1 : -1;
            });
        default:
            return nfts;
    }
};

const getAttributeValue = (attributes, traitType) => {
    const attr = attributes?.find(a => a.trait_type === traitType);
    return attr?.value || null;
};

const getResponsiveTableStyles = (theme) => ({
    [theme.breakpoints.down('sm')]: {
        '& thead': {
            display: 'none',
        },
        '& tbody tr': {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(2),
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& td': {
                width: '100% !important',
                padding: theme.spacing(0.5),
                border: 'none',
                '&:before': {
                    content: 'attr(data-label)',
                    fontWeight: 600,
                    marginRight: theme.spacing(1),
                    color: theme.palette.text.secondary,
                }
            }
        }
    }
});

// ========== Components ==========

// Label Component
export function Label({ color = 'default', variant = 'ghost', children, ...other }) {
    return (
        <RootStyle ownerState={{ color, variant }} {...other}>
            {children}
        </RootStyle>
    );
}

Label.propTypes = {
    children: PropTypes.node,
    color: PropTypes.oneOf([
        'default',
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error'
    ]),
    variant: PropTypes.oneOf(['filled', 'outlined', 'ghost'])
};

// AttributeFilter Component
export function AttributeFilter({ attrs, setFilterAttrs }) {
    const [attrFilter, setAttrFilter] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const tempAttrs = attrs.map(attr => ({
            trait_type: attr.title,
            value: []
        }))
        setAttrFilter(tempAttrs)
    }, [attrs])

    const handleAttrChange = (title, key) => {
        setAttrFilter(prevAttrs => {
            const updatedAttrs = prevAttrs.map(attr => {
                if (attr.trait_type === title) {
                    const values = attr.value.includes(key)
                        ? attr.value.filter(v => v !== key)
                        : [...attr.value, key]
                    return { ...attr, value: values }
                }
                return attr
            })
            setFilterAttrs(updatedAttrs)
            return updatedAttrs
        })
    }

    const handleClearAll = (title) => {
        setAttrFilter(prevAttrs => {
            const updatedAttrs = prevAttrs.map(attr => 
                attr.trait_type === title ? { ...attr, value: [] } : attr
            )
            setFilterAttrs(updatedAttrs)
            return updatedAttrs
        })
    }

    const filteredAttrs = attrs.map(attr => ({
        ...attr,
        items: Object.fromEntries(
            Object.entries(attr.items).filter(([key]) => 
                key.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }))

    return (
        <Stack sx={{ mt: 0, pr: 0 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search attributes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon color="action" />,
                }}
                sx={{ mb: 2 }}
            />
            {filteredAttrs.map((attr, idx) => {
                const title = attr.title;
                const items = attr.items;
                const count = Object.keys(items).length;

                return (
                    <Accordion
                        key={title}
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            '&:before': {
                                display: 'none',
                            },
                            '&.Mui-expanded': {
                                margin: 0,
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: 'background.paper',
                                '&.Mui-expanded': {
                                    minHeight: 48,
                                },
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                <Typography variant='subtitle1'>{title}</Typography>
                                <Typography variant='caption' color="text.secondary">{count}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <FormGroup sx={{ flexDirection: 'column' }}>
                                {Object.entries(items).map(([key, data]) => {
                                    const isChecked = attrFilter.find(elem => elem.trait_type === title)?.value?.includes(key) === true;
                                    return (
                                        <Stack key={title + key} direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                            <FormControlLabel
                                                label={
                                                    <Typography variant="body2">{key}</Typography>
                                                }
                                                control={
                                                    <Checkbox
                                                        checked={isChecked ?? false}
                                                        onChange={() => handleAttrChange(title, key)}
                                                        size="small"
                                                    />
                                                }
                                                sx={{ '& .MuiFormControlLabel-label': { flex: 1 } }}
                                            />
                                            <Typography variant='caption' color="text.secondary">{fIntNumber(data.count)}</Typography>
                                        </Stack>
                                    )
                                })}
                            </FormGroup>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleClearAll(title)}
                                sx={{ mt: 1 }}
                            >
                                Clear All
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Stack>
    );
}

// CollectionCard Component
export function CollectionCard({ collectionData, type, account, handleRemove }) {
    const theme = useTheme();
    const { accountProfile } = useContext(AppContext);
    const isAdmin = accountProfile?.admin;
    const [loadingImg, setLoadingImg] = useState(true);

    const collection = collectionData.collection;
    const name = collection.name || 'No Name';
    const imgUrl = `https://s1.xrpnft.com/collection/${collection.logoImage}`;
    const collectionType = type.charAt(0).toUpperCase() + type.slice(1);

    const onImageLoaded = () => {
        setLoadingImg(false);
    };

    const handleRemoveCollection = (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }
        handleRemove(collection.id);
    };

    return (
        <Link href={`/account/${account}/collection${collectionType}/${collection.id}`} underline='none' sx={{ position: 'relative' }}>
            <CardWrapper
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 280,
                    aspectRatio: '9 / 14',
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 1,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        background: 'inherit',
                        borderRadius: 'inherit',
                        zIndex: -1,
                        filter: 'blur(8px)',
                    },
                }}
            >
                {isAdmin &&
                    <CloseIcon
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 1500
                        }}
                        onClick={(e) => handleRemoveCollection(e)}
                    />
                }
                <CardMedia
                    component={loadingImg ? 'div' : 'img'}
                    image={imgUrl}
                    loading={loadingImg.toString()}
                    alt={name}
                    sx={{
                        width: '100%',
                        flexGrow: 1,
                        objectFit: 'cover',
                        borderTopLeftRadius: theme.shape.borderRadius * 2,
                        borderTopRightRadius: theme.shape.borderRadius * 2,
                    }}
                />
                {loadingImg && (
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            flexGrow: 1,
                            borderTopLeftRadius: theme.shape.borderRadius * 2,
                            borderTopRightRadius: theme.shape.borderRadius * 2,
                        }}
                    />
                )}
                <img src={imgUrl} style={{ display: 'none' }} onLoad={onImageLoaded} />
                <GlassContent sx={{ padding: '12px', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100px' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            fontSize: '0.8rem',
                        }}
                    >
                        {name}
                    </Typography>
                    
                    <Stack spacing={0.5} mt="auto">
                        <Stack direction="row" alignItems='center' justifyContent='space-between'>
                            <Typography variant='body2' color="text.secondary" fontSize="0.75rem">
                                {collectionData.nftCount} item{collectionData.nftCount !== 1 && 's'}
                            </Typography>
                            {collection.rarity_rank > 0 && (
                                <Chip
                                    variant="outlined"
                                    size="small"
                                    icon={<LeaderboardOutlinedIcon sx={{width: '10px'}} />}
                                    label={fIntNumber(collection.rarity_rank)}
                                    sx={{
                                        height: '18px',
                                        '& .MuiChip-label': {
                                            px: 0.5,
                                            fontSize: '0.6rem',
                                            fontWeight: 600,
                                        }
                                    }}
                                />
                            )}
                        </Stack>
                        <Typography variant='body2' color="text.secondary" fontSize="0.75rem">
                            {collectionData.nftsForSale} listed
                        </Typography>
                    </Stack>
                </GlassContent>
            </CardWrapper>
        </Link>
    );
}

// ExploreBanner Component
export function ExploreBanner({ collection }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLightMode = theme.palette.mode === 'light';

    const title = useMemo(() => {
        return collection?.name || 'Explore NFTs';
    }, [collection]);

    const subTitle = useMemo(() => {
        if (collection?.description) {
            return collection.description;
        }
        return 'Discover unique digital assets on the XRP Ledger. Experience real-time NFT events including minting, trading, and transfers as they happen.';
    }, [collection]);

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 4 },
                py: { xs: 6, sm: 8 },
                background: `linear-gradient(135deg, ${
                    theme.palette.primary.main
                }, ${alpha(theme.palette.primary.main, 0.8)})`,
                color: isLightMode
                    ? 'black'
                    : theme.palette.primary.contrastText,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(
                        theme.palette.primary.contrastText
                    )}' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px',
                    zIndex: 1
                }
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 4 }, maxWidth: '1200px', mr: 'auto' }}>
                <Typography
                    variant={isMobile ? 'h3' : 'h1'}
                    sx={{
                        my: 2,
                        fontWeight: 800,
                        textShadow: isLightMode
                            ? 'none'
                            : '2px 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '-0.5px',
                        color: isLightMode
                            ? 'black'
                            : theme.palette.primary.contrastText
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant={'h6'}
                    sx={{
                        opacity: 0.9,
                        maxWidth: '800px',
                        lineHeight: 1.6,
                        fontWeight: 300,
                        letterSpacing: '0.5px',
                        textShadow: isLightMode
                            ? 'none'
                            : '1px 1px 2px rgba(0,0,0,0.1)',
                        color: isLightMode
                            ? 'black'
                            : theme.palette.primary.contrastText
                    }}
                >
                    {subTitle}
                </Typography>
            </Box>
        </Box>
    );
}

// FilterDetail Component
export function FilterDetail({
    collection,
    filter,
    setFilter,
    subFilter,
    setSubFilter,
    setFilterAttrs,
    setPage
}) {
    const theme = useTheme();
    const attrs = collection?.attrs || [];

    // Status filter options
    const statusFilters = [
        { value: 4, label: 'On Sale', count: collection?.extra?.onSaleCount },
        { value: 8, label: 'Unlisted', count: collection?.extra?.notOnSaleCount },
        { value: 32, label: 'Transfers (Free)', count: null }
    ];

    // Sort options
    const sortOptions = [
        { value: 'time:desc', label: 'Latest Activity' },
        { value: 'time:asc', label: 'Oldest Activity' },
        { value: 'volume:desc', label: 'Volume (High to Low)' },
        { value: 'volume:asc', label: 'Volume (Low to High)' },
        { value: 'MasterSequence:desc', label: 'Newest Minted' },
        { value: 'MasterSequence:asc', label: 'Oldest Minted' },
        { value: 'rarity_rank:asc', label: 'Rarity (Most Rare)' },
        { value: 'rarity_rank:desc', label: 'Rarity (Least Rare)' },
        { value: 'cost:asc', label: 'Price (Low to High)' },
        { value: 'cost:desc', label: 'Price (High to Low)' },
        { value: 'cost_all:asc', label: 'Price All (Low to High)' },
        { value: 'cost_all:desc', label: 'Price All (High to Low)' },
        { value: 'transfers', label: 'Transfers (Free)' },
        // Legacy subFilter options
        { value: 'pricenoxrp', label: 'Non-XRP Only' },
        { value: 'pricexrpasc', label: 'XRP Price Ascending' },
        { value: 'pricexrpdesc', label: 'XRP Price Descending' },
        { value: 'mintedLatest', label: 'Minted Latest' },
        { value: 'mintedEarliest', label: 'Minted Earliest' }
    ];

    const handleStatusToggle = (value) => {
        setFilter(prev => prev ^ value);
        setPage(0);
    };

    const handleSortChange = (value) => {
        setSubFilter(value);
        setPage(0);
    };

    return (
        <Stack spacing={2}>
            {/* Sort Options */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Sort By
                </Typography>
                <RadioGroup value={subFilter} onChange={(e) => handleSortChange(e.target.value)}>
                    {sortOptions.map(option => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={<Typography variant="body2">{option.label}</Typography>}
                        />
                    ))}
                </RadioGroup>
            </Paper>

            {/* Attributes */}
            {attrs.length > 0 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Attributes
                    </Typography>
                    <AttributeFilter setFilterAttrs={setFilterAttrs} attrs={attrs} />
                </Paper>
            )}
        </Stack>
    );
}

// NFTCard Component
export function NFTCard({ nft, handleRemove }) {
    const theme = useTheme();
    const { accountProfile } = useContext(AppContext);
    const isAdmin = accountProfile?.admin;
    const [colors, setColors] = useState([]);
    const [loadingImg, setLoadingImg] = useState(true);

    const {
        uuid,
        account,
        cost,
        costb,
        meta,
        dfile,
        NFTokenID,
        destination,
        rarity,
        rarity_rank,
        updateEvent,
        MasterSequence
    } = nft;

    const isSold = false;
    const imgUrl = getNftCoverUrl(nft, 'big');
    const isVideo = false;
    const rawName = nft.meta?.name || meta?.Name || 'No Name';
    
    // Simplify name if it matches pattern "CollectionName #Number" or "CollectionName Number"
    const simplifyName = (fullName) => {
        // Match patterns like "Wonkazz 200", "Fuzzybear #2222", "Collection Name #123"
        const patterns = [
            /^.*\s+#(\d+)$/,  // Matches "Name #123"
            /^.*\s+(\d+)$/,   // Matches "Name 123"
        ];
        
        for (const pattern of patterns) {
            const match = fullName.match(pattern);
            if (match) {
                return `#${match[1]}`;
            }
        }
        return fullName;
    };
    
    const name = simplifyName(rawName);

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const onImageLoaded = () => {
        setLoadingImg(false);
    };

    const handleRemoveNft = (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }
        handleRemove(NFTokenID);
    };

    function renderPrice() {
        if (!cost)
            return (
                <Typography
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 600 }}
                >
                    Unlisted
                </Typography>
            );

        return cost.currency === 'XRP' ? (
            <Stack direction="row" spacing={0.25} alignItems="center">
                <Icon
                    icon={rippleSolid}
                    width="18"
                    height="18"
                    color={theme.palette.primary.main}
                />
                <Typography
                    variant="body2"
                    fontWeight="700"
                    fontSize={{ xs: '0.9rem', sm: '1rem' }}
                    color="text.primary"
                >
                    {fNumber(cost.amount)}
                </Typography>
            </Stack>
        ) : (
            <Typography
                variant="body1"
                fontWeight="600"
                fontSize="0.9375rem"
                color="text.primary"
            >
                {fNumber(cost.amount)}{' '}
                {normalizeCurrencyCodeXummImpl(cost.currency)}
            </Typography>
        );
    }

    function renderOffer() {
        if (!costb) return <Box flexGrow={1} />;

        return (
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize="0.75rem"
                    noWrap
                >
                    Offer:
                </Typography>
                {costb.currency === 'XRP' ? (
                    <>
                        <Icon
                            icon={rippleSolid}
                            color={theme.palette.success.main}
                            width="14"
                            height="14"
                        />
                        <Typography
                            variant="caption"
                            color="success.main"
                            fontWeight="600"
                            fontSize="0.75rem"
                            noWrap
                        >
                            {fNumber(costb.amount)}
                        </Typography>
                    </>
                ) : (
                    <Typography
                        variant="caption"
                        color="success.main"
                        fontWeight="600"
                        fontSize="0.75rem"
                        noWrap
                    >
                        {fNumber(costb.amount)}{' '}
                        {normalizeCurrencyCodeXummImpl(costb.currency)}
                    </Typography>
                )}
            </Stack>
        );
    }

    function renderRarityRank() {
        if (rarity_rank <= 0) return null;

        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.25,
                    borderRadius: '4px',
                    backgroundColor: alpha(theme.palette.warning.main, 0.08),
                    color: theme.palette.warning.dark,
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}
            >
                <LeaderboardOutlinedIcon sx={{ fontSize: 14 }} />
                #{fIntNumber(rarity_rank)}
            </Box>
        );
    }

    function renderEvent() {
        if (!updateEvent) return <Box flexGrow={1} />;

        return (
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    textAlign: 'right',
                    maxWidth: '50%'
                }}
                noWrap
            >
                Updated: {updateEvent}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                '&:hover': {
                    zIndex: 1
                },
            }}
        >
            <Link href={`/nft/${NFTokenID}`} underline="none" sx={{ display: 'flex', height: '100%', width: '100%' }}>
                <CardWrapper2 sx={{ width: '100%' }}>
                    {isAdmin && (
                        <CloseIcon
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                zIndex: 1500,
                                color: theme.palette.primary.main
                            }}
                            onClick={(e) => handleRemoveNft(e)}
                        />
                    )}
                    {isSold && (
                        <Label
                            variant="filled"
                            color={(isSold && 'error') || 'info'}
                            sx={{
                                zIndex: 9,
                                top: 24,
                                right: 24,
                                position: 'absolute',
                                textTransform: 'uppercase'
                            }}
                        >
                            SOLD
                        </Label>
                    )}
                    <ImageContainer>
                        <StyledCardMedia
                            component={
                                loadingImg ? 'div' : isVideo ? 'video' : 'img'
                            }
                            image={imgUrl}
                            loading={loadingImg.toString()}
                            alt={'NFT' + uuid}
                        />
                        {loadingImg && (
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    )
                                }}
                            />
                        )}
                        {!loadingImg && MasterSequence && (
                            <SequenceOverlay>
                                #{MasterSequence}
                            </SequenceOverlay>
                        )}
                    </ImageContainer>
                    <img
                        src={imgUrl}
                        style={{ display: 'none' }}
                        onLoad={onImageLoaded}
                    />
                    {isVideo && (
                        <video
                            src={imgUrl}
                            style={{ display: 'none' }}
                            onCanPlay={onImageLoaded}
                        />
                    )}
                    <GlassContent2>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ width: '100%' }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    color: theme.palette.text.primary,
                                    maxWidth: '60%'
                                }}
                            >
                                {name}
                            </Typography>
                            {rarity_rank > 0 && (
                                <Stack direction="row" spacing={0.25} alignItems="center">
                                    <DiamondIcon 
                                        sx={{ 
                                            fontSize: { xs: 10, sm: 12 },
                                            color: theme.palette.warning.main
                                        }} 
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                            fontWeight: 600,
                                            color: theme.palette.warning.dark
                                        }}
                                    >
                                        {fIntNumber(rarity_rank)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                        
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ width: '100%' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {renderPrice()}
                                {costb && (
                                    <Typography
                                        sx={{
                                            fontSize: '0.6rem',
                                            color: 'success.main',
                                            fontWeight: 500
                                        }}
                                    >
                                        O:{fNumber(costb.amount)}
                                    </Typography>
                                )}
                            </Box>
                            {updateEvent && (
                                <Typography
                                    sx={{
                                        fontSize: '0.6rem',
                                        color: 'text.secondary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '40%'
                                    }}
                                >
                                    {updateEvent}
                                </Typography>
                            )}
                        </Stack>
                    </GlassContent2>
                </CardWrapper2>
            </Link>
        </Box>
    );
}

// NFTs Component
export function NFTs({ collection, urlParams = {} }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const theme = useTheme();
    const { setDeletingNfts } = useContext(AppContext);
    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState(0);
    const [subFilter, setSubFilter] = useState('cost:asc');
    const [filterAttrs, setFilterAttrs] = useState([]);
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Initialize filterAttrs from URL params
    useEffect(() => {
        console.log('[NFTs] URL params effect - current filterAttrs:', filterAttrs);
        console.log('[NFTs] URL params received:', {
            urlParams,
            filterAttrs: urlParams.filterAttrs,
            hasFilterAttrs: !!urlParams.filterAttrs,
            timestamp: new Date().toISOString()
        });
        if (urlParams.filterAttrs) {
            setFilterAttrs(urlParams.filterAttrs);
            console.log('[NFTs] Setting filterAttrs from URL params:', urlParams.filterAttrs);
        }
    }, [urlParams.filterAttrs]);

    const fetchNfts = useCallback(async () => {
        if (loading) return;
        
        console.log('[NFTs] fetchNfts called:', {
            pathname: window.location.pathname,
            urlParamsLength: Object.keys(urlParams).length,
            urlParams,
            loading,
            filterAttrs,
            timestamp: new Date().toISOString()
        });
        
        setLoading(true);
        const limit = 32;
        
        // Build query parameters
        const params = new URLSearchParams({
            page: page,
            limit: limit
        });
        
        // Add collection-specific parameters or URL parameters
        // Prioritize URL parameters over collection parameters
        const issuer = urlParams.issuer || collection?.account;
        const taxon = urlParams.taxon || collection?.taxon;
        
        if (issuer) params.append('issuer', issuer);
        if (taxon && taxon !== '') params.append('taxon', taxon);
        
        
        // Add optional parameters
        if (search) params.append('search', search);
        // Don't send filter parameter
        
        // Handle sorting
        if (subFilter && subFilter !== '') {
            if (subFilter === 'transfers') {
                // Special case for transfers - set filter=32
                params.set('filter', '32');
            } else if (subFilter.includes(':')) {
                // New format: sort:order
                const [sort, order] = subFilter.split(':');
                params.append('sort', sort);
                params.append('order', order);
            } else {
                // Legacy format: subFilter
                params.append('subFilter', subFilter);
            }
        }
        
        // Add attribute filters if any
        // Check both filterAttrs state and urlParams.filterAttrs to handle race conditions
        const attrsToUse = filterAttrs.length > 0 ? filterAttrs : (urlParams.filterAttrs || []);
        console.log('[NFTs] Checking attributes:', {
            filterAttrsState: filterAttrs,
            urlParamsFilterAttrs: urlParams.filterAttrs,
            attrsToUse,
            timestamp: new Date().toISOString()
        });
        
        if (attrsToUse && attrsToUse.length > 0) {
            const validAttrs = attrsToUse.filter(attr => attr.value && attr.value.length > 0);
            console.log('[NFTs] Processing filterAttrs:', {
                attrsToUse,
                validAttrs,
                validAttrsLength: validAttrs.length,
                timestamp: new Date().toISOString()
            });
            if (validAttrs.length > 0) {
                params.append('filterAttrs', JSON.stringify(validAttrs));
            }
        }
        
        const apiUrl = `${BASE_URL}/nfts?${params.toString()}`;
        
        console.log('[NFTs] API Request:', {
            url: apiUrl,
            params: Object.fromEntries(params),
            page,
            hasFilterAttrs: attrsToUse && attrsToUse.length > 0,
            filterAttrs: attrsToUse,
            timestamp: new Date().toISOString()
        });
        
        axios
            .get(apiUrl)
            .then((res) => {
                if (res.data.result === 'success') {
                    let newNfts = res.data.nfts.map((nft) => ({
                        ...nft,
                        cost: nft.cost && Number(nft.cost.amount) === 0 ? null : nft.cost
                    }));
                    
                    // Log the traits of the first few NFTs for debugging
                    console.log('[NFTs] API Response:', {
                        success: true,
                        nftsCount: newNfts.length,
                        firstNftAttributes: newNfts[0]?.meta?.attributes,
                        availableAttributes: res.data.availableAttributes,
                        timestamp: new Date().toISOString()
                    });
                    
                    const length = newNfts.length;
                    setHasMore(length === limit);
                    
                    // Replace NFTs when on page 0, append when scrolling
                    if (page === 0) {
                        setNfts(newNfts);
                        setDeletingNfts(newNfts);
                    } else {
                        setNfts(prevNfts => [...prevNfts, ...newNfts]);
                        setDeletingNfts(prevNfts => [...prevNfts, ...newNfts]);
                    }
                    
                    // Store available attributes if provided
                    if (res.data.availableAttributes && collection) {
                        collection.attrs = res.data.availableAttributes;
                    }
                }
            })
            .catch((err) => {
                console.error('[NFTs] API Error:', {
                    error: err.message,
                    status: err.response?.status,
                    data: err.response?.data,
                    timestamp: new Date().toISOString()
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, subFilter, filterAttrs, collection?.account, collection?.taxon, search, setDeletingNfts, urlParams]);

    // Effect for subFilter changes - reset to page 0
    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        console.log('[NFTs] SubFilter changed, resetting page');
        setPage(0);
        setNfts([]);
        setDeletingNfts([]);
        setHasMore(true);
    }, [subFilter, setDeletingNfts, isInitialMount]);

    // Effect for fetching data
    useEffect(() => {
        fetchNfts();
    }, [fetchNfts]);

    // Effect to refetch when URL params change on explore page or collection page with filters
    useEffect(() => {
        const pathname = window.location.pathname;
        const isExplore = pathname === '/explore' || pathname.includes('/explore');
        const isCollectionWithFilters = pathname.includes('/collection/') && urlParams.filterAttrs;
        
        console.log('[NFTs] URL params change effect:', {
            pathname,
            isExplore,
            isCollectionWithFilters,
            hasCollection: !!collection,
            urlParamsLength: Object.keys(urlParams).length,
            urlParams,
            timestamp: new Date().toISOString()
        });
        
        // Reset when URL params change
        if ((isExplore || isCollectionWithFilters) && !collection) {
            console.log('[NFTs] Resetting NFTs due to URL param change');
            setPage(0);
            setNfts([]);
            setHasMore(true);
        }
    }, [urlParams, collection]);

    const handleChangeSearch = debounce((e) => {
        setSearch(e.target.value);
    }, 300);

    const handleShowFilter = () => {
        setShowFilter((prevShow) => !prevShow);
    };

    const handleRemove = (NFTokenID) => {
        setLoading(true);
        axios
            .delete(`${BASE_URL}/nfts`, {
                data: {
                    issuer: collection?.account,
                    taxon: collection?.taxon,
                    idsToDelete: NFTokenID
                }
            })
            .then((res) => {
                location.reload();
            })
            .catch((err) => {
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSortChange = (newSubFilter) => {
        let subFilterValue = '';
        switch (newSubFilter) {
            case 'Listed (non-XRP)':
                subFilterValue = 'pricenoxrp';
                break;
            case 'XRP Price: Low to High':
                subFilterValue = 'pricexrpasc';
                break;
            case 'XRP Price: High to Low':
                subFilterValue = 'pricexrpdesc';
                break;
            case 'Latest Activity':
                subFilterValue = 'latestActivity';
                break;
            default:
                subFilterValue = newSubFilter;
        }
        
        // Just update subFilter - let useEffect handle the reset
        setSubFilter(subFilterValue);
    };

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, hasMore]);

    return (
        <Box sx={{ width: '100%' }}>
            <GlassyBox sx={{ mb: 2, p: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton
                    aria-label="filter"
                    onClick={handleShowFilter}
                    sx={{
                        color: 'primary.main',
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                    }}
                >
                    <FilterListIcon fontSize="large" />
                </IconButton>
                <SearchTextField
                    id="textFilter"
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name or attribute"
                    margin="dense"
                    onChange={handleChangeSearch}
                    autoComplete="new-password"
                    inputProps={{ autoComplete: 'off' }}
                    onFocus={(event) => event.target.select()}
                    sx={{ pl: 2, pr: 0, pt: 0, pb: 0, mt: 0 }}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0.7 }}>
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">
                                {loading && <ClipLoader color={theme.palette.primary.main} size={15} />}
                            </InputAdornment>
                        )
                    }}
                />
            </GlassyBox>
            <Grid container spacing={2} justifyContent="space-between" mt={1}>
                {showFilter && (
                    <Grid item xs={12} md={3} lg={2.5} xl={2} pt={0.5}>
                        <GlassyBox sx={{ p: 2, position: 'sticky', top: 80 }}>
                            <FilterDetail
                                collection={collection}
                                filter={filter}
                                setFilter={setFilter}
                                subFilter={subFilter}
                                setSubFilter={handleSortChange}
                                setFilterAttrs={setFilterAttrs}
                                setPage={setPage}
                            />
                        </GlassyBox>
                    </Grid>
                )}
                <Grid item xs={12} md={showFilter ? 9 : 12} lg={showFilter ? 9.5 : 12} xl={showFilter ? 10 : 12}
                    sx={{
                        '& ::-webkit-scrollbar': {
                            width: '2px',
                            height: '2px',
                        },
                        '& ::-webkit-scrollbar-track': {
                            background: 'transparent',
                            borderRadius: '10px',
                        },
                        '& ::-webkit-scrollbar-thumb': {
                            background: theme => alpha(theme.palette.primary.main, 0.2),
                            borderRadius: '10px',
                            '&:hover': {
                                background: theme => alpha(theme.palette.primary.main, 0.3),
                            }
                        },
                        '& ::-webkit-scrollbar-corner': {
                            background: 'transparent',
                        },
                        // Firefox
                        scrollbarWidth: 'thin',
                        scrollbarColor: theme => `${alpha(theme.palette.primary.main, 0.2)} transparent`,
                    }}>
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <ClipLoader color={theme.palette.primary.main} size={30} />
                            </Box>
                        }
                        scrollThreshold={0.9}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'space-between',
                            px: { xs: 0.75, sm: 1, md: 1.25 },
                            '&::after': {
                                content: '""',
                                flex: 'auto'
                            }
                        }}>
                            {nfts.map((nft, index) => (
                                <Box 
                                    key={nft.NFTokenID || index} 
                                    sx={{ 
                                        width: {
                                            xs: 'calc((100% - 8px) / 2)',      // 2 per row on mobile
                                            sm: 'calc((100% - 36px) / 4)',     // 4 per row on small  
                                            md: 'calc((100% - 64px) / 5)',     // 5 per row on medium
                                            lg: 'calc((100% - 96px) / 7)',     // 7 per row on large
                                            xl: 'calc((100% - 240px) / 13)'    // 13 per row on extra large
                                        },
                                        mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2.5 },
                                        display: 'flex'
                                    }}
                                >
                                    <NFTCard
                                        nft={nft}
                                        handleRemove={handleRemove}
                                        imageComponent={
                                            <LazyLoadImage
                                                src={nft.imageUrl}
                                                alt={nft.name}
                                                effect="blur"
                                                wrapperProps={{
                                                    style: {
                                                        display: 'block',
                                                        height: '100%',
                                                        width: '100%',
                                                        borderRadius: theme.shape.borderRadius,
                                                        overflow: 'hidden'
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                </Box>
                            ))}
                        </Box>
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </Box>
    );
}

// ListToolbar Component
export function ListToolbar({ count, rows, setRows, page, setPage }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const num = count / rows;
    let page_count = Math.floor(num)
    if (num % 1 !== 0) page_count++;

    const start = page * rows + 1;
    let end = start + rows - 1;
    if (end > count) end = count;

    const handleChangeRows = (event) => {
        setRows(parseInt(event.target.value, 10));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
        gotoTop(event);
    };

    const gotoTop = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-tab-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2, px: 2 }}>
            <Grid item xs={12} md={4} order={{ xs: 3, md: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {start} - {end} out of {count}
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
                <Stack alignItems='center'>
                    <Pagination 
                        page={page + 1} 
                        onChange={handleChangePage} 
                        count={page_count}
                        size={isMobile ? "small" : "medium"}
                    />
                </Stack>
            </Grid>

            <Grid item xs={12} md={4} order={{ xs: 2, md: 3 }}>
                <Stack direction='row' alignItems='center' justifyContent="flex-end">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Show Rows:
                    </Typography>
                    <CustomSelect
                        value={rows}
                        onChange={handleChangeRows}
                        size="small"
                    >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </CustomSelect>
                </Stack>
            </Grid>
        </Grid>
    );
}

// CollectionActivity Component
export function CollectionActivity({ collection, hideInExplore = false }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { openSnackbar } = useContext(AppContext);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [hists, setHists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [lightBoxImgUrl, setLightBoxImgUrl] = useState('');

    const closeLightbox = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!collection) return;

        function getActivities() {
            setLoading(true);
            const historyParams = new URLSearchParams({
                page: page,
                limit: rows
            });
            if (collection?.account) historyParams.append('issuer', collection.account);
            if (collection?.taxon) historyParams.append('taxon', collection.taxon);
            
            axios.get(`${BASE_URL}/collectionhistory/?${historyParams.toString()}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setHists(ret.hists);
                    }
                })
                .catch(err => {
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        getActivities();
    }, [collection?.account, collection?.taxon, page, rows]);

    const getChipStyle = (color) => {
        let backgroundColor;
        let textColor;

        switch (color) {
            case 'primary':
                backgroundColor = alpha(theme.palette.primary.main, 0.1);
                textColor = theme.palette.primary.main;
                break;
            case 'success':
                backgroundColor = alpha(theme.palette.success.main, 0.1);
                textColor = theme.palette.success.main;
                break;
            case 'error':
                backgroundColor = alpha(theme.palette.error.main, 0.1);
                textColor = theme.palette.error.main;
                break;
            default:
                backgroundColor = alpha(theme.palette.grey[500], 0.1);
                textColor = theme.palette.grey[700];
        }

        return {
            backgroundColor,
            color: textColor,
            fontWeight: 500,
            '& .MuiChip-label': {
                padding: '0 8px'
            }
        };
    };

    const getActivityConfig = (type) => {
        switch (type) {
            case 'BUY_MINT':
                return { label: 'Buy Mint', color: 'primary' };
            case 'MINTED':
                return { label: 'Mint', color: 'success' };
            case 'BURN':
                return { label: 'Burn', color: 'error' };
            case 'CREATE_SELL_OFFER':
                return { label: 'Sell Offer', color: 'primary' };
            case 'CREATE_BUY_OFFER':
                return { label: 'Buy Offer', color: 'primary' };
            case 'CANCEL_SELL_OFFER':
                return { label: 'Cancel Sell', color: 'error' };
            case 'CANCEL_BUY_OFFER':
                return { label: 'Cancel Buy', color: 'error' };
            case 'TRANSFER':
                return { label: 'Transfer', color: 'primary' };
            case 'SALE':
                return { label: 'Sale', color: 'success' };
            default:
                return { label: `Unknown: ${type}`, color: 'primary' };
        }
    };

    if (hideInExplore || !collection) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', mb: 6 }}>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color="#1890FF" size={10} />
                </Stack>
            ) : (
                hists &&
                hists.length === 0 && (
                    <Stack alignItems="center" sx={{ mt: 5 }}>
                        <Typography variant="s7">No Activities</Typography>
                    </Stack>
                )
            )}
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
                <Table
                    stickyHeader
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: '0px solid',
                            borderColor: theme.palette.divider
                        },
                        width: '100%',
                        ...getResponsiveTableStyles(theme)
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell width="15%">Activity</TableCell>
                            <TableCell width="30%">Details</TableCell>
                            <TableCell width="15%">Price</TableCell>
                            <TableCell width="25%">Account</TableCell>
                            <TableCell width="15%">Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hists &&
                            hists.map((row, idx) => {
                                const {
                                    type,
                                    uuid,
                                    NFTokenID,
                                    account,
                                    cid,
                                    name,
                                    meta,
                                    dfile,
                                    files,
                                    cost,
                                    quantity,
                                    time
                                } = row;

                                const isVideo = meta?.video ? true : false;
                                const imgUrl = getNftCoverUrl(
                                    { files },
                                    'small'
                                );
                                const strDateTime = formatDistanceToNow(
                                    new Date(time),
                                    { addSuffix: true }
                                );
                                const amount = normalizeAmount(row.amount);
                                const activityConfig = getActivityConfig(type);

                                return (
                                    <TableRow
                                        key={time + '' + idx}
                                        sx={{
                                            [`& .${tableCellClasses.root}`]: {}
                                        }}
                                    >
                                        <TableCell
                                            align="left"
                                            sx={{ pt: 1, pb: 1 }}
                                            data-label="Activity"
                                        >
                                            <Chip
                                                label={activityConfig.label}
                                                size="small"
                                                sx={getChipStyle(activityConfig.color)}
                                            />
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            sx={{ pt: 1, pb: 1 }}
                                            data-label="Details"
                                        >
                                            {type === 'BUY_MINT' ? (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                >
                                                    <Avatar
                                                        alt="C"
                                                        src={`https://s1.xrpl.to/token/${cost?.md5}`}
                                                    />

                                                    <Stack>
                                                        <Stack
                                                            direction="row"
                                                            spacing={0.8}
                                                            alignItems="center"
                                                        >
                                                            <Typography variant="s7">
                                                                Price:{' '}
                                                            </Typography>
                                                            <Typography variant="s11">
                                                                {cost?.amount}{' '}
                                                                {cost?.name}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                        >
                                                            <Typography variant="s7">
                                                                Quantity:{' '}
                                                            </Typography>
                                                            <Typography variant="s11">
                                                                {quantity}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            ) : (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Link
                                                            component="button"
                                                            underline="none"
                                                            onClick={() => {
                                                                if (!isVideo) {
                                                                    setLightBoxImgUrl(
                                                                        imgUrl
                                                                    );
                                                                    setOpen(
                                                                        true
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: 'relative',
                                                                    width: 48,
                                                                    height: 48,
                                                                    borderRadius: 1,
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                <CardMedia
                                                                    component={isVideo ? 'video' : 'img'}
                                                                    image={imgUrl}
                                                                    alt={name}
                                                                    autoPlay={isVideo}
                                                                    loop={isVideo}
                                                                    muted
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Link>
                                                        <Stack spacing={0.5}>
                                                            <Link
                                                                href={`/nft/${NFTokenID}`}
                                                                sx={{
                                                                    color: 'text.primary',
                                                                    textDecoration: 'none',
                                                                    '&:hover': {
                                                                        textDecoration: 'underline'
                                                                    }
                                                                }}
                                                            >
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {name}
                                                                </Typography>
                                                            </Link>
                                                            {meta?.attributes && (
                                                                <Stack direction="row" spacing={0.5}>
                                                                    {getAttributeValue(meta.attributes, 'Background') && (
                                                                        <Chip
                                                                            label={getAttributeValue(meta.attributes, 'Background')}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.65rem',
                                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                color: 'text.secondary'
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {getAttributeValue(meta.attributes, 'Fur') && (
                                                                        <Chip
                                                                            label={getAttributeValue(meta.attributes, 'Fur')}
                                                                            size="small"
                                                                            sx={{
                                                                                height: 20,
                                                                                fontSize: '0.65rem',
                                                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                                                color: 'text.secondary'
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                    {meta?.collection?.name && (
                                                        <Chip
                                                            label={meta.collection.name}
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                color: 'text.secondary'
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            )}
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            sx={{ pt: 0.5, pb: 0.5 }}
                                            data-label="Price"
                                        >
                                            {type === 'SALE' ? (
                                                <Typography
                                                    variant="s11"
                                                    noWrap
                                                >
                                                    {cost.amount}{' '}
                                                    {normalizeCurrencyCodeXummImpl(
                                                        cost.currency
                                                    )}
                                                </Typography>
                                            ) : (
                                                <>
                                                    {type ===
                                                        'CREATE_SELL_OFFER' ||
                                                    type ===
                                                        'CREATE_BUY_OFFER' ||
                                                    type ===
                                                        'CANCEL_SELL_OFFER' ||
                                                    type ===
                                                        'CANCEL_BUY_OFFER' ? (
                                                        <Typography
                                                            variant="s11"
                                                            noWrap
                                                        >
                                                            {amount.amount}{' '}
                                                            {normalizeCurrencyCodeXummImpl(
                                                                amount.currency
                                                            )}
                                                        </Typography>
                                                    ) : (
                                                        <Typography
                                                            variant="s11"
                                                            noWrap
                                                        >
                                                            - - -
                                                        </Typography>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            sx={{ pt: 1, pb: 1 }}
                                            data-label="Account"
                                        >
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={0.2}
                                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            >
                                                <Link
                                                    href={`/account/${account}`}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }}
                                                >
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 24, 
                                                            height: 24, 
                                                            mr: 1,
                                                            fontSize: '0.75rem',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: 'primary.main'
                                                        }}
                                                    >
                                                        {account.substring(0, 2)}
                                                    </Avatar>
                                                    <Typography variant='body2' noWrap>
                                                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                                                    </Typography>
                                                </Link>
                                                <CopyToClipboard text={account} onCopy={()=>openSnackbar('Address copied to clipboard', 'success')}>
                                                    <Tooltip title='Copy address'>
                                                        <IconButton size="small" sx={{ ml: 0.5 }}>
                                                            <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </CopyToClipboard>
                                            </Stack>
                                        </TableCell>

                                        <TableCell
                                            align="left"
                                            sx={{ pt: 1, pb: 1 }}
                                            data-label="Time"
                                        >
                                            <Typography variant="s7" noWrap>
                                                {strDateTime}
                                            </Typography>
                                        </TableCell>
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

            {open && (
                <Lightbox
                    small={lightBoxImgUrl}
                    large={lightBoxImgUrl}
                    hideDownload
                    hideZoom
                    onClose={closeLightbox}
                />
            )}
        </Box>
    );
}

// Main ExploreNFT Component (default export)
export default function ExploreNFT({ collection, topMargin = 4, showBanner = true, urlParams = {} }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { deletingNfts, accountProfile } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isAdmin = accountProfile?.admin;
    const [value, setValue] = useState('tab-nfts');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRemoveAll = () => {
        if (deletingNfts.length === 0 || !isAdmin) return;
        const nftNames = deletingNfts
            ?.map(
                (nft) =>
                    `"${nft.meta?.name}"` ||
                    `"${nft.meta?.Name}"` ||
                    `"No Name"`
            )
            ?.join(', ');
        const idsToDelete = deletingNfts?.map((nft) => nft._id);
        if (!confirm(`You're about to delete the following NFTs ${nftNames}?`))
            return;
        axios
            .delete(`${BASE_URL}/nfts`, {
                data: {
                    issuer: collection?.account,
                    taxon: collection?.taxon,
                    idsToDelete
                }
            })
            .then((res) => {
                location.reload();
            })
            .catch((err) => {
            });
    };

    const isExplore = window.location.pathname.includes('/explore');

    return (
        <>
            {showBanner && (
                <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
                    <ExploreBanner collection={collection} />
                </Box>
            )}
            <Box sx={{ mt: topMargin, width: '100%' }}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider', 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'stretch' : 'center',
                            mb: 2
                        }}>
                            <TabList 
                                onChange={handleChange} 
                                aria-label="explore tabs"
                                variant={isMobile ? "fullWidth" : "standard"}
                            >
                                <Tab label="NFTs" value="tab-nfts" />
                                {!isExplore && <Tab label="Activities" value="tab-activities" />}
                            </TabList>
                            
                            {isAdmin && (
                                <Button
                                    variant='contained'
                                    color='error'
                                    sx={{ 
                                        mt: isMobile ? 2 : 0,
                                        py: 1,
                                        px: 2,
                                        minWidth: 120
                                    }}
                                    onClick={handleRemoveAll}
                                    disabled={deletingNfts.length === 0}
                                >
                                    Delete All
                                </Button>
                            )}
                        </Box>
                        <TabPanel value="tab-nfts" sx={{p: 0}}>
                            <NFTs collection={collection} urlParams={urlParams} />
                        </TabPanel>
                        {!isExplore && (
                            <TabPanel value="tab-activities" sx={{p: 0}}>
                                <CollectionActivity collection={collection} hideInExplore={isExplore} />
                            </TabPanel>
                        )}
                    </TabContext>
                </Box>
            </Box>
        </>
    );
}