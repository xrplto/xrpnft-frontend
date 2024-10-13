import { useState, useEffect } from 'react';
import React, { Suspense } from 'react';
import {
    LazyLoadImage,
    LazyLoadComponent
} from 'react-lazy-load-image-component';
import { ColorExtractor } from 'react-color-extractor';

// Iconify
import { Icon } from '@iconify/react';
import arrowsExchange from '@iconify/icons-gg/arrows-exchange';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    IconButton,
    Link,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Components

// Utils
import { formatDateTime, formatMonthYearDate } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fPercent, fVolume } from 'src/utils/formatNumber';

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
        width: 50px; // Reduced from 60px
        height: 50px; // Reduced from 60px
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
            width: 35px; // Reduced from 40px
            height: 35px; // Reduced from 40px
            border-radius: ${theme.shape.borderRadius}px;
        }
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 48px; // Reduced from 58px
        height: 48px; // Reduced from 58px
        border-radius: 10px; // Slightly reduced from 12px

        ${theme.breakpoints.down('sm')} {
            width: 33px; // Reduced from 38px
            height: 33px; // Reduced from 38px
            border-radius: 7px; // Slightly reduced from 8px
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

function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    const token1 = prevProps.token;
    const token2 = nextProps.token;
    const equal = JSON.stringify(token1) === JSON.stringify(token2);
    return equal;
}

function getPriceColor(token) {
    const bearbull = token.bearbull;
    let color = '';
    if (bearbull === -1) color = '#FF6C40';
    else if (bearbull === 1) color = '#54D62C';
    return color;
}

export default function Row({ id, item, volumeType }) {
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
    let volume1 = fVolume(volume || 0);
    let volume2 = fVolume(totalVolume || 0);

    // Remove the following line
    // const strDateTime = formatMonthYearDate(created);

    const featuredImageUrl = `https://s1.xrpnft.com/collection/${featuredImage}`;
    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;

    const [colors, setColors] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const handleRowClick = () => {
        // history.push(`/collection/${slug}`);
        // onclick="document.location = 'links.html';"
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
            <TableCell align="left" sx={{ py: 1.5, px: isMobile ? 1 : 2, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={isMobile ? 1 : 2}
                    sx={{ py: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        sx={{
                            color: theme.palette.text.secondary,
                            minWidth: isMobile ? '20px' : '32px',
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
                                    variant={isMobile ? 'caption' : 'subtitle1'}
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
                                        <VerifiedIcon
                                            fontSize={isMobile ? 'small' : 'medium'}
                                            style={{ color: theme.palette.primary.main }}
                                        />
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>

            <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                <Typography
                    variant={isMobile ? 'body2' : 'body1'}
                    noWrap
                    sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                    ✕ {fNumber(floorPrice)}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                <Typography
                    variant={isMobile ? 'body2' : 'body1'}
                    noWrap
                    sx={{ fontWeight: 600, color: theme.palette.success.main }}
                >
                    ✕ {fNumber(displayVolume)}
                </Typography>
            </TableCell>

            <TableCell
                align="right"
                sx={{
                    py: 1.5,
                    px: 2,
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' }
                }}
            >
                <Typography
                    variant="body1"
                    noWrap
                    sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                >
                    {fIntNumber(owners || 0)}
                </Typography>
            </TableCell>

            <TableCell
                align="right"
                sx={{
                    py: 1.5,
                    px: 2,
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' }
                }}
            >
                <Typography
                    variant="body1"
                    noWrap
                    sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                >
                    {fIntNumber(items)}
                </Typography>
            </TableCell>
        </TableRow>
    );
}