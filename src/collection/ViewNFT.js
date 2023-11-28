import React, { useRef, useState, useContext } from 'react';
import {
  Box,
  IconButton,
  Link,
  useTheme,
  useMediaQuery,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';
import infoFilled from '@iconify/icons-ep/info-filled';

import { formatMonthYear } from 'src/utils/formatTime';
import { fVolume, fNumber } from 'src/utils/formatNumber';

import { AppContext } from 'src/AppContext';
import ExploreNFT from 'src/explore';
import SeeMoreTypography from 'src/components/SeeMoreTypography';

import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';

import styled from '@mui/system/styled';

const IconCover = styled('div')(({ theme }) => ({
  width: '102px',
  height: '102px',
  marginTop: '-56px',
  marginBottom: '16px',
  [theme.breakpoints.up('sm')]: {
    width: '132px',
    height: '132px',
    marginTop: '-86px',
  },
  [theme.breakpoints.up('md')]: {
    width: '192px',
    height: '192px',
    marginTop: '-156px',
  },
  border: '6px solid ' + theme.colors.alpha.black[50],
  borderRadius: '10px',
  boxShadow: 'rgb(0 0 0 / 8%) 0px 5px 10px',
  backgroundColor: theme.colors.alpha.white[70],
  position: 'relative',
  overflow: 'hidden',
}));

const IconWrapper = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'inline-block',
  position: 'relative',
  width: '90px',
  height: '90px',
  [theme.breakpoints.up('sm')]: {
    width: '120px',
    height: '120px',
  },
  [theme.breakpoints.up('md')]: {
    width: '180px',
    height: '180px',
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.1,
    },
    '& .MuiIconEditButton-root': {
      opacity: 1,
    },
  },
}));

const IconImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  boxSizing: 'border-box',
  padding: '0px',
  border: 'none',
  margin: 'auto',
  display: 'block',
  width: '0px',
  height: '0px',
  minWidth: '100%',
  maxWidth: '100%',
  minHeight: '100%',
  maxHeight: '100%',
  objectFit: 'cover',
  borderRadius: '0px',
}));

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

const CardOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  inset: 0,
}));

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

export default function ViewNFT({ collection }) {
  const anchorRef = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { accountProfile, openSnackbar } = useContext(AppContext);
  const accountLogin = accountProfile?.account;
  const accountToken = accountProfile?.token;

  const [openShare, setOpenShare] = useState(false);

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
    costs,
    extra,
    minter,
    verified,
    created,
    volume,
    totalVolume,
    floor,
  } = collection;

  const floorPrice = floor?.amount || 0;
  const volume1 = fVolume(volume || 0);
  const volume2 = fVolume(totalVolume || 0);

  const shareUrl = `https://xrpnft.com/collection/${slug}`;
  const shareTitle = name;
  const shareDesc = description || '';

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  return (
    <>
      <Popover
        open={openShare}
        onClose={handleCloseShare}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            // mt: 1.5,
            // ml: 0.5,
            // overflow: 'inherit',
            // boxShadow: (theme) => theme.customShadows.z20,
            // border: (theme) => `solid 1px ${alpha('#919EAB', 0.08)}`,
            // width: 'auto',
          },
        }}
      >
        <Stack direction="row" spacing={2} sx={{ pt: 1.5, pl: 1, pr: 1, pb: 1 }}>
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag={'#'}
            description={shareDesc}
            onClick={handleCloseShare}
          >
            <FacebookIcon size={24} round />
          </FacebookShareButton>
          <TwitterShareButton
            title={shareTitle}
            url={shareUrl}
            hashtag={'#'}
            onClick={handleCloseShare}
          >
            <TwitterIcon size={24} round />
          </TwitterShareButton>
        </Stack>
      </Popover>
      <IconCover>
        <IconWrapper>
        <IconImage
          src={`https://s1.xrpnft.com/collection/${logoImage}`}
          loading="lazy" // Add the loading="lazy" attribute here
        />
          {accountLogin === collection.account && (
            <Link href={`/collection/${slug}/edit`} underline="none">
              <CardOverlay>
                <EditIcon
                  className="MuiIconEditButton-root"
                  fontSize="large"
                  sx={{ opacity: 0, zIndex: 1 }}
                />
              </CardOverlay>
              <ImageBackdrop className="MuiImageBackdrop-root" />
            </Link>
          )}
        </IconWrapper>
      </IconCover>
      <Stack
        direction={fullScreen ? 'column' : 'row'}
        spacing={2}
        justifyContent="space-between"
        sx={{ mt: 1, mb: 1 }}
      >
        <Stack direction="row" spacing={1}>
          <Typography variant="h1">{name}</Typography>
          {verified === 'yes' && (
            <Tooltip title="Verified">
              <VerifiedIcon style={{ color: '#4589ff' }} />
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {accountLogin === collection.account && (
            <Link href={`/collection/${slug}/edit`} underline="none">
              <Tooltip title="Edit your collection">
                <IconButton size="medium" sx={{ padding: 1 }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Link>
          )}

          <Tooltip title="Add to watchlist">
            <IconButton
              size="medium"
              sx={{ padding: 1 }}
              onClick={() => {
                // Handle add to watchlist
              }}
            >
              <StarBorderIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton
              size="medium"
              sx={{ padding: 1 }}
              ref={anchorRef}
              onClick={handleOpenShare}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <IconButton
            size="medium"
            sx={{ padding: 1 }}
            onClick={() => {
              // Handle more options
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ mt: 2, mb: 3 }} spacing={1}>
        <Typography variant="s5" style={{ wordBreak: 'break-word' }}>
          By&nbsp;
          <Link
            color="inherit"
            href={`/account/${account}`}
          >
            <Typography variant="s5" color="#33C2FF">
              {accountName || `${account.slice(0, 4)}...${account.slice(-4)}`}
            </Typography>
          </Link>
          <Typography variant="s10">
            &nbsp;&nbsp;·&nbsp;Created{' '}
            <Typography variant="s3">{formatMonthYear(created)}</Typography>
          </Typography>
        </Typography>
      </Stack>

      <SeeMoreTypography variant="d3" text={description} />

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          py: 1,
          overflow: 'auto',
          width: '100%',
          '& > *': {
            scrollSnapAlign: 'center',
          },
          '::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Stack
          direction="row"
          width="100%"
          sx={{ mt: 2, mb: 3 }}
          spacing={{ xs: 3, sm: 5 }}
          alignItems="flex-end"
          justifyContent={{ xs: 'space-around', sm: 'flex-start' }}
        >
          <Stack>
            <Typography variant="d5">{items}</Typography>
            <Typography variant="s13">items</Typography>
          </Stack>
          <Stack>
            <Typography variant="d5">{extra.owners}</Typography>
            <Typography variant="s13">owners</Typography>
          </Stack>
          <Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Icon icon={rippleSolid} width="20" height="20" />
              <Typography variant="d5" noWrap>
                {volume2}
              </Typography>
              <Stack direction="row" sx={{ pb: 1.5 }}>
                <Tooltip
                  title={
                    <Stack alignItems="center">
                      <Typography variant="body2">Volume on XRPNFT</Typography>
                      <Typography variant="body2">{volume1}</Typography>
                    </Stack>
                  }
                >
                  <Icon icon={infoFilled} />
                </Tooltip>
              </Stack>
            </Stack>
            <Typography variant="s13" noWrap>
              total volume
            </Typography>
          </Stack>
          <Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Icon icon={rippleSolid} width="20" height="20" />
              <Typography variant="d5" noWrap>
                {fNumber(floorPrice)}
              </Typography>
            </Stack>
            <Typography variant="s13" noWrap>
              floor price
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <ExploreNFT collection={collection} />
    </>
  );
}
