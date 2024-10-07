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
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

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
        backgroundColor: theme.palette.background.paper,
    },
    body: {
        position: 'sticky',
        zIndex: 100,
        left: 24,
        backgroundColor: theme.palette.background.paper,
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
        width: 72px;
        height: 72px;
        box-shadow: 0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)};
        border: 1px solid ${alpha(theme.palette.primary.main, 0.1)};
        border-radius: ${theme.shape.borderRadius}px;
        background-color: ${alpha(theme.palette.background.paper, 0.9)};
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        &:hover {
            box-shadow: 0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.2)};
        }

        ${theme.breakpoints.down('sm')} {
            width: 52px;
            height: 52px;
        }
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 70px;
        height: 70px;

        ${theme.breakpoints.down('sm')} {
            width: 50px;
            height: 50px;
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
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 0px;
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

export default function Row({ id, item }) {
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

    const strDateTime = formatMonthYearDate(created);

    // const featuredImageUrl = '/static/covers/6.jpg';
    // const logoImageUrl = '/static/covers/icon1.png';

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

    return (
        <TableRow 
            hover 
            onClick={handleRowClick} 
            style={{ cursor: 'pointer' }}
            sx={ {
                '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }
            }}
        >
            <TableCell align="left" sx={{ p: 0, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ pt: 1, pb: 1 }}
                >
                    <Typography
                        variant={isMobile ? 's8' : 's3'}
                        sx={{ width: isMobile ? '12px' : '16px', color: 'text.secondary' }}
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
                        </IconCover>
                    </Link>

                    <Link underline="none" href={`/collection/${slug}`}>
                        <Stack spacing={0.4}>
                            <Stack direction="row" spacing={0.5} sx={{ pt: 0 }}>
                                <Typography
                                    variant={isMobile ? 's8' : 's3'}
                                    noWrap
                                    sx={{
                                        width: isMobile ? '80px' : undefined,
                                        textOverflow: isMobile ? 'ellipsis' : 'none',
                                        color: 'text.primary',
                                    }}
                                >
                                    {name}
                                </Typography>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified Collection">
                                        <VerifiedIcon
                                            fontSize="small"
                                            color="primary"
                                        />
                                    </Tooltip>
                                )}
                            </Stack>
                            <Typography
                                variant={isMobile ? 's12' : 's7'}
                                noWrap
                                color="text.secondary"
                            >
                                Created: {strDateTime}
                            </Typography>
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 0, border: 'none' }}>
                <Tooltip title="Floor Price">
                    <Typography variant={isMobile ? 's8' : 's3'} noWrap color="primary.main">
                        <Icon
                            icon={rippleSolid}
                            width={isMobile ? 12 : 16}
                            height={isMobile ? 12 : 16}
                            color={theme.palette.primary.main}
                        />{' '}
                        {fNumber(floorPrice)}
                    </Typography>
                </Tooltip>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 0, border: 'none' }}>
                <Tooltip title="24h Volume">
                    <Typography variant={isMobile ? 's8' : 's3'} noWrap color="primary.main">
                        <Icon
                            icon={rippleSolid}
                            width={isMobile ? 12 : 16}
                            height={isMobile ? 12 : 16}
                            color={theme.palette.primary.main}
                        />{' '}
                        {fNumber(totalVol24h)}
                    </Typography>
                </Tooltip>
            </TableCell>

            <TableCell
                align="right"
                sx={{
                    pl: 0,
                    pr: 0,
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' }
                }}
            >
                <Tooltip title="Total Volume">
                    <Typography variant={isMobile ? 's8' : 's3'} noWrap color="primary.main">
                        <Icon
                            icon={rippleSolid}
                            width={isMobile ? 12 : 16}
                            height={isMobile ? 12 : 16}
                            color={theme.palette.primary.main}
                        />{' '}
                        {volume2}
                    </Typography>
                </Tooltip>
            </TableCell>

            <TableCell
                align="right"
                sx={{
                    pl: 0,
                    pr: 0,
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' }
                }}
            >
                <Tooltip title="Number of Owners">
                    <Typography variant={isMobile ? 's8' : 's3'} noWrap color="primary.main">
                        {fIntNumber(owners || 0)}
                    </Typography>
                </Tooltip>
            </TableCell>

            <TableCell
                align="right"
                sx={{
                    pl: 0,
                    pr: 0,
                    border: 'none',
                    display: { xs: 'none', sm: 'table-cell' }
                }}
            >
                <Tooltip title="Total Items">
                    <Typography variant={isMobile ? 's8' : 's3'} noWrap color="primary.main">
                        {fIntNumber(items)}
                    </Typography>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}