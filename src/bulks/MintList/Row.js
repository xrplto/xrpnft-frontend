import {CopyToClipboard} from 'react-copy-to-clipboard';
// Material
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PaymentsIcon from '@mui/icons-material/Payments';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { formatMonthYearDate, formatDateTime } from 'src/utils/formatTime';
import { fNumber, fIntNumber, fVolume } from 'src/utils/formatNumber';
import { getHashIcon } from 'src/utils/parse';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Components

function truncateAccount(str) {
    if (!str) return '';
    return str.slice(0, 9) + '...' + str.slice(-9);
};

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

export default function Row({ id, item }) {
    const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);

    const {
        uuid,
        profile,
        account,
        cid,
        cslug,
        cname,
        amount,
        quantity,
        purchased,
        cost,
        minter,
        dest,
        status,
        time,
    } = item;

    const {
        name,
        logo,
        banner,
        description,
    } = profile;

    const logoImage = logo ? `https://s1.xrpnft.com/profile/${logo}` : getHashIcon(account);

    const strDate = formatMonthYearDate(time);
    const strTime = formatDateTime(time);

    return (
        <TableRow
            hover
            key={uuid}
            style={{cursor: 'pointer'}}
        >
            <TableCell align="left">
                {id}
            </TableCell>

            <TableCell align="left">
                <Stack direction="row" spacing={0.2} alignItems="center">
                    <Avatar
                        variant={logo?"":"square"}
                        sx={{
                            // width: 32,
                            // height: 32,
                            mr: 1,
                            backgroundColor: '#00000000'
                        }}
                    >
                        <IconImage src={logoImage} />
                    </Avatar>

                    <Stack>
                        <Typography variant="s6">{name}</Typography>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="s8">{truncateAccount(account)}</Typography>
                            <Link
                                underline="none"
                                color="inherit"
                                target="_blank"
                                href={`https://bithomp.com/explorer/${account}`}
                                rel="noreferrer noopener nofollow"
                            >
                                <Tooltip title="Check on Bithomp">
                                    <IconButton edge="end" aria-label="bithomp" size="small">
                                        <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <CopyToClipboard text={account} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                <Tooltip title='Copy Account'>
                                    <IconButton size="small">
                                        <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                    </IconButton>
                                </Tooltip>
                            </CopyToClipboard>
                        </Stack>
                    </Stack>
                </Stack>
            </TableCell>

            <TableCell align="left">
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mr={3}>
                        <Stack direction='row' spacing={0.8} alignItems="center">
                            <Avatar alt="C" src={`https://s1.xrpl.to/token/${cost.md5}`} />
                            <Typography variant='p4'>{cost.amount}</Typography>
                            <Typography variant='s7'>{cost.name}</Typography>
                        </Stack>
                        
                    </Stack>
                </Stack>
            </TableCell>

            <TableCell align="left">
                <Typography variant='p4' color="#EB5757">{fIntNumber(quantity)}</Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant='p4' color="#33C2FF">{fIntNumber(purchased)}</Typography>
            </TableCell>

            <TableCell align="left">
            <Typography variant='s8'>{strDate}</Typography>
            </TableCell>
        </TableRow>
    );
};
