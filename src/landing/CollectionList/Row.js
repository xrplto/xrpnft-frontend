import { useState, useEffect } from 'react';
import React, { Suspense } from "react";
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Components

// Utils
import { formatDateTime, formatMonthYearDate } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fPercent, fVolume } from 'src/utils/formatNumber';

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: "sticky",
        zIndex: 100,
        top: 0,
        left: 24
    },
    body: {
        position: "sticky",
        zIndex: 100,
        left: 24
    }
})) (TableCell);

const TransitionTypo = styled(Typography)(
    () => `
        -webkit-transition: background-color 300ms linear, color 1s linear;
        -moz-transition: background-color 300ms linear, color 1s linear;
        -o-transition: background-color 300ms linear, color 1s linear;
        -ms-transition: background-color 300ms linear, color 1s linear;
        transition: background-color 300ms linear, color 1s linear;
    `
);

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: black;
    inset: 0;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.5s;
    // border-radius: 20px;
    &:hover {
        opacity: 0.3;
    }
`
);

const CardWrapper = styled('div')(
    ({ theme }) => `
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 20px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 10px;
        text-align: center;
        object-fit: cover;
        cursor: pointer;
        overflow: hidden;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
        }
  `
);

const IconCover = styled('div')(
    ({ theme }) => `
        width: 72px;
        height: 72px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

        border: 1px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
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
    transition: theme.transitions.create('opacity'),
}));

const AdminImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden',
    '&:hover': {
        cursor: 'pointer',
        opacity: 0.6
    },
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
    if (bearbull === -1)
        color = '#FF6C40';
    else if (bearbull === 1)
        color = '#54D62C';
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
        vol24h
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

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
    }

    const handleRowClick = () => {
        // history.push(`/collection/${slug}`);
        // onclick="document.location = 'links.html';"
        document.location = `/collection/${slug}`;
    }

    return (
        <TableRow
            hover
            // key={uuid}
            onClick={handleRowClick}
            style={{cursor: 'pointer'}}
        >
            <TableCell align="left" sx={{p:0}}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{pt: 2, pb: 2}}>
                    <Typography variant="s3">{id}</Typography>
                    <Link href={`/collection/${slug}`} underline='none'>
                        <IconCover>
                            <IconWrapper>
                                <IconImage src={logoImageUrl}/>
                            </IconWrapper>
                        </IconCover>
                    </Link>

                    <Link
                        underline="none"
                        href={`/collection/${slug}`}
                    >
                        <Stack spacing={0.4}>
                            <Stack direction="row" spacing={0.5} sx={{pt: 0}}>
                                <Typography variant="s3" noWrap>{name}</Typography>
                                {verified === 'yes' &&
                                    <Tooltip title='Verified'>
                                        <VerifiedIcon fontSize="small" style={{color: "#4589ff"}} />
                                    </Tooltip>
                                }
                            </Stack>
                            <Typography variant="s7" noWrap>{strDateTime}</Typography>
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>
{/*
            <TableCell align="right" sx={{pl:0, pr:0}}>
                <Typography variant="s3" noWrap><Icon icon={rippleSolid} width={16} height={16} /> {fNumber(floorPrice)}</Typography>
            </TableCell>
                            */}
            <TableCell align="right" sx={{pl:0, pr:0}}>
                <Typography variant="s3" noWrap><Icon icon={rippleSolid} width={16} height={16} /> {fNumber(vol24h)}</Typography>
            </TableCell>
{/*
            <TableCell align="right" sx={{pl:0, pr:0}}>
                <Typography variant="s3" noWrap><Icon icon={rippleSolid} width={16} height={16} /> {volume1}</Typography>
            </TableCell> 

            <TableCell align="right" sx={{pl:0, pr:0}}>
                <Typography variant="s3" noWrap><Icon icon={rippleSolid} width={16} height={16} /> {volume2}</Typography>
            </TableCell>

            <TableCell align="right" sx={{pl:0,pr:0}}>
                <Typography variant="s3" noWrap>{fIntNumber(owners || 0)}</Typography>
            </TableCell>

            <TableCell align="right" sx={{pl:0,pr:0}}>
                <Typography variant="s3" noWrap>{fIntNumber(items)}</Typography>
            </TableCell> */}
        </TableRow>
    );
};
