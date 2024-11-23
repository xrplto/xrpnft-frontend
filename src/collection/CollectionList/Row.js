// Material
import {
    styled,
    IconButton,
    Link,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

// Utils
import { fNumber, fIntNumber, fVolume } from 'src/utils/formatNumber';

// Add this import for better typography control
import { alpha } from '@mui/material/styles';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 60px;
        height: 60px;
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
            width: 40px;
            height: 40px;
            border-radius: ${theme.shape.borderRadius}px;
        }
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 58px;
        height: 58px;
        border-radius: ${theme.shape.borderRadius * 1.5}px;

        ${theme.breakpoints.down('sm')} {
            width: 38px;
            height: 38px;
            border-radius: ${theme.shape.borderRadius}px;
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
    border-radius: ${theme.shape.borderRadius * 1.5}px;

    ${theme.breakpoints.down('sm')} {
        border-radius: ${theme.shape.borderRadius}px;
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

const VerificationBadge = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  '& svg': {
    fontSize: 12,
  },
}));

export default function Row({ id, item, isMine, currency, convertToUsd, volumeType }) {
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
        volume,
        totalVolume,
        floor,
        owners,
        totalVol24h
    } = item;

    const floorPrice = floor?.amount || 0;
    const volumeToDisplay = volumeType === '24h' ? totalVol24h : totalVolume;

    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleRowClick = () => {
        document.location = `/collection/${slug}`;
    };

    const formatPrice = (price, isVolume = false) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        const formattedValue = isVolume ? fIntNumber(value) : fNumber(value);
        return `${currency === 'USD' ? '$' : '✕'} ${formattedValue}`;
    };

    return (
        <TableRow
            hover
            key={uuid}
            onClick={handleRowClick}
            style={{ cursor: 'pointer' }}
        >
            <TableCell align="left" sx={{ py: 1.5, px: { xs: 1, sm: 2 }, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{ xs: 1, sm: 2 }}
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
                    <Link
                        href={isMine ? `/collection/${slug}/edit` : `/collection/${slug}`}
                        underline="none"
                    >
                        <IconCover>
                            <IconWrapper>
                                <IconImage src={logoImageUrl} alt={`${name} logo`} />
                            </IconWrapper>

                            {isMine ? (
                                <IconButton
                                    className="MuiIconEditButton-root"
                                    aria-label="edit"
                                    sx={{
                                        position: 'absolute',
                                        left: '0vw',
                                        top: '0vh',
                                        opacity: 0,
                                        zIndex: 1,
                                        width: { xs: '50px', sm: '70px' },
                                        height: { xs: '50px', sm: '70px' }
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            ) : (
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                            )}
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
                <TableCell align="right" sx={{ py: 1.5, px: 1, border: 'none' }}>
                    <Box>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            Floor: {formatPrice(floorPrice)}
                        </Typography>
                    </Box>
                    <Box mt={0.5}>
                        <Typography
                            variant="caption"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            Vol: {formatPrice(volumeToDisplay, true)}
                        </Typography>
                    </Box>
                </TableCell>
            ) : (
                <>
                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                        >
                            {formatPrice(floorPrice)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: theme.palette.success.main }}
                        >
                            {formatPrice(volumeToDisplay, true)}
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
