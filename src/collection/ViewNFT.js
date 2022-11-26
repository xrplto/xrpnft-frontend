import React from 'react';
import { useState } from 'react';
import Decimal from 'decimal.js';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled, useMediaQuery,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils
import { formatMonthYear } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fPercent } from 'src/utils/formatNumber';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import ExploreNFT from 'src/explore';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 102px;
        height: 102px;
        margin-top: -56px;
        margin-bottom: 16px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 132px;
            height: 132px;
            margin-top: -86px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 192px;
            height: 192px;
            margin-top: -156px;
        }
        border: 6px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 90px;
        height: 90px;
        @media (min-width: ${theme.breakpoints.values.sm}px) {
            width: 120px;
            height: 120px;
        }
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 180px;
            height: 180px;
        }
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

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
`
);

export default function ViewNFT({collection}) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    // "collection": {
    //     "_id": "6310c27cf81fe46884ef89ba",
    //     "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "name": "collection1",
    //     "slug": "collection-1",
    //     "description": "",
    //     "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
    //     "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
    //     "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
    //     "timestamp": 1662042748016,
    //     "creator": "xrpnft.com",
    //     "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
    // }
    const {
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
        timestamp,
        costs,
        extra,
        minter,
        verified,
        created,
        volume,
        floor
    } = collection;

    const [countOwner, setCountOwner] = useState(0);

    const floorPrice = floor?.amount || 0;
    // let totalVolume = volume || 0;

    // if (totalVolume > 1) {
    //     totalVolume = new Decimal(totalVolume).toDP(0, Decimal.ROUND_DOWN).toNumber();
    // }

    const totalVolume = 0;

    return (
        <>
            <IconCover>
                <IconWrapper>
                    <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`}/>
                    {accountLogin === collection.account &&
                        <Link href={`/collection/${slug}/edit`} underline='none'>
                            <CardOverlay>
                                <EditIcon
                                    className="MuiIconEditButton-root"
                                    // color='primary'
                                    fontSize="large"
                                    sx={{ opacity: 0, zIndex: 1 }}
                                />
                            </CardOverlay>
                            <ImageBackdrop className="MuiImageBackdrop-root" />
                        </Link>
                    }
                </IconWrapper>
            </IconCover>
            <Stack direction={fullScreen ? "column":"row"} spacing={2} justifyContent="space-between" sx={{mt: 1, mb:1}}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h1a">{name}</Typography>
                    {verified === 'yes' &&
                        <Tooltip title='Verified'>
                            <VerifiedIcon color="success" />
                        </Tooltip>
                    }
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                    {accountLogin === collection.account &&
                        <Link href={`/collection/${slug}/edit`} underline='none'>
                            <Tooltip title="Edit your collection">
                                <IconButton size='medium' sx={{ padding: 1 }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    }

                    <Tooltip title="Add to watchlist">
                        <IconButton size='medium' sx={{ padding: 1 }}
                            onClick={() => {
                            }}
                        >
                            <StarBorderIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Share">
                        <IconButton size='medium' sx={{ padding: 1 }}
                            onClick={() => {
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>

                    <IconButton size='medium' sx={{ padding: 1 }}
                        onClick={() => {
                        }}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack direction="row" sx={{mt: 2, mb:3}} spacing={1}>
                <Typography variant="s5">By</Typography>
                <Link
                    color="inherit"
                    target="_blank"
                    href={`/account/${account}`}
                    rel="noreferrer noopener nofollow"
                >
                    <Typography variant="s5" color="#33C2FF">{accountName || account}</Typography>
                </Link>
                <Typography variant="s10">&nbsp;&nbsp;·&nbsp;Created <Typography variant="s3">{formatMonthYear(created)}</Typography></Typography>
            </Stack>

            {description &&
                <Typography variant="d3">{description}</Typography>
            }

            <Stack direction="row" sx={{mt: 2, mb:3}} spacing={5}>
                <Stack>
                    <Typography variant='d2'>{items}</Typography>
                    <Typography variant='s4'>items</Typography>
                </Stack>
                <Stack>
                    <Typography variant='d2'>{extra.owners}</Typography>
                    <Typography variant='s4'>owners</Typography>
                </Stack>
                <Stack>
                    <Stack direction="row" spacing={0.5} alignItems='center'>
                        <Icon icon={rippleSolid} />
                        <Typography variant="d2" noWrap>{fNumber(totalVolume)}</Typography>
                    </Stack>
                    <Typography variant='s4'>total volume</Typography>
                </Stack>
                <Stack>
                    <Stack direction="row" spacing={0.5} alignItems='center'>
                        <Icon icon={rippleSolid} />
                        <Typography variant="d2" noWrap>{fNumber(floorPrice)}</Typography>
                    </Stack>
                    <Typography variant='s4'>floor price</Typography>
                </Stack>
            </Stack>

            <ExploreNFT collection={collection} />

            {/* <Button component={Link} href="/collection/create" variant="contained" color="primary">
                Create a collection
            </Button> */}
            {/* <Stack sx={{mt:5, minHeight: '50vh'}}>
            </Stack> */}
        </>
    );
}
