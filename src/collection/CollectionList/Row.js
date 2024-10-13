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
    useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

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

    // Reintroduce this line to define logoImageUrl
    const logoImageUrl = `https://s1.xrpnft.com/collection/${logoImage}`;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleRowClick = () => {
        document.location = `/collection/${slug}`;
    };

    const formatPrice = (price) => {
        const value = currency === 'USD' ? convertToUsd(price) : price;
        return `${currency === 'USD' ? '$' : '✕'} ${fNumber(value)}`;
    };

    return (
        <TableRow
            hover
            key={uuid}
            onClick={handleRowClick}
            style={{ cursor: 'pointer' }}
        >
            <TableCell align="left" sx={{ py: 1.5, px: 2, border: 'none' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ py: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        sx={{
                            color: theme.palette.text.secondary,
                            minWidth: isMobile ? '24px' : '32px',
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
                                    variant={isMobile ? 'subtitle2' : 'subtitle1'}
                                    noWrap
                                    sx={{
                                        maxWidth: isMobile ? '100px' : '150px',
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
                    {formatPrice(floorPrice)}
                </Typography>
            </TableCell>

            <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                <Typography
                    variant={isMobile ? 'body2' : 'body1'}
                    noWrap
                    sx={{ fontWeight: 600, color: theme.palette.success.main }}
                >
                    {formatPrice(volumeToDisplay)}
                </Typography>
            </TableCell>

            {!isMobile && (
                <>
                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body1"
                            noWrap
                            sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
                        >
                            {fIntNumber(owners || 0)}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" sx={{ py: 1.5, px: 2, border: 'none' }}>
                        <Typography
                            variant="body1"
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
