import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { withStyles } from '@mui/styles';
import {
    styled,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    Link,
    Stack,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import { Icon } from '@iconify/react';
import { formatMonthYearDate } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fVolume } from 'src/utils/formatNumber';
import { ColorExtractor } from 'react-color-extractor';

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: 'sticky',
        zIndex: 100,
        top: 0,
        left: 24,
    },
    body: {
        position: 'sticky',
        zIndex: 100,
        left: 24,
    },
}))(TableCell);

const TransitionTypo = styled(Typography)(
    () => `
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
        transition: width 1s ease-in-out, height 0.5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;

        &:hover,
        &.Mui-focusVisible {
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
        transition: width 1s ease-in-out, height 0.5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;

        &:hover,
        &.Mui-focusVisible {
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
        width: 0px;
        height: 0px;
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
        opacity: 0.6,
    },
}));

const TokenImage = styled(LazyLoadImage)(({ theme }) => ({
    borderRadius: '50%',
    overflow: 'hidden',
}));

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
        vol24h,
    } = item;

    const floorPrice = floor?.amount || 0;
    const volume1 = fVolume(volume || 0);
    const volume2 = fVolume(totalVolume || 0);
    const strDateTime = formatMonthYearDate(created);
    const featuredImageUrl = `https://s1.xrpnft.com/collection/${featuredImage}`;
    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;
    const [colors, setColors] = useState([]);

    const getColors = (colors) => {
        setColors((c) => [...c, ...colors]);
    };

    const handleRowClick = () => {
        document.location = `/collection/${slug}`;
    };

    const bearbull = item.bearbull;
    const priceColor = bearbull === -1 ? '#FF6C40' : bearbull === 1 ? '#54D62C' : '';

    const icons = [
        { icon: rippleSolid, width: 16, height: 16 },
        { icon: rippleSolid, width: 16, height: 16 },
    ];

    return (
        <TableRow hover onClick={handleRowClick} style={{ cursor: 'pointer' }}>
            <TableCell align="left" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 2, pb: 2 }}>
                <Typography variant="s3">{id}</Typography>
                    <Link href={`/collection/${slug}`} underline="none">
                    <IconCover style={{ width: '69px', height: '69px' }}>
  <IconWrapper>
    <IconImage src={logoImageUrl} />
  </IconWrapper>
</IconCover>

                    </Link>

                    <Link underline="none" href={`/collection/${slug}`}>
                        <Stack spacing={0.4}>
                            <Stack direction="row" spacing={0.5} sx={{ pt: 0 }}>
                                <Typography variant="s3" noWrap>
                                    {name}
                                </Typography>
                                {verified === 'yes' && (
                                    <Tooltip title="Verified">
                                        <VerifiedIcon fontSize="small" style={{ color: '#4589ff' }} />
                                    </Tooltip>
                                )}
                            </Stack>
                            {/*}
                            <Typography variant="s7" noWrap>
                                {strDateTime}
                            </Typography>
                                */}
                        </Stack>
                    </Link>
                </Stack>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 3 }}>
                <Typography variant="s3" noWrap>
                    <Icon icon={icons[0].icon} width={icons[0].width} height={icons[0].height} /> {fNumber(floorPrice)}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 3 }}>
                <Typography variant="s3" noWrap>
                    <Icon icon={icons[1].icon} width={icons[1].width} height={icons[1].height} /> {fNumber(vol24h)}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 3 }}>
                <Typography variant="s3" noWrap>
                    <Icon icon={rippleSolid} width={16} height={16} /> {volume2}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 3 }}>
                <Typography variant="s3" noWrap>
                    {fIntNumber(owners || 0)}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ pl: 0, pr: 3 }}>
                <Typography variant="s3" noWrap>
                    {fIntNumber(items)}
                </Typography>
            </TableCell>
        </TableRow>
    );
}
