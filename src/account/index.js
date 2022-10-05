import React from 'react';
import { useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fNumber } from 'src/utils/formatNumber';

// Components

const CardWrapper = styled('div')(
    ({ theme }) => `
        width: 300px;
        height: 340px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 540px;
        }
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 30px;
        backdrop-filter: blur(50px);
        background: rgb(2, 0, 36);
        padding: 10px;
        text-align: center;
        object-fit: cover;
        transition: width 1s ease-in-out, height .5s ease-in-out !important;
        -webkit-tap-highlight-color: transparent;
  `
);

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

const SlotBox = styled('div') (
    ({ theme }) => `
        // padding-top: 40px;
        width: 280px;
        height: 200px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 480px;
            height: 400px;
        }
        // margin-bottom: 20px;
        // margin-top: 20px;
        // border-style: solid;
        justify-content: center;
        overflow: hidden;
        // line-height: 4;
        border-radius: 20px;
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

export default function Account({data}) {
    const [view, setView] = useState(data?.collection?.type);

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const accountUuid = accountProfile?.uuid;

    const profile = data.profile;

    const {
        name,
        logo,
        banner,
        description
    } = profile;

    const logoImage = logo?`https://s1.xrpnft.com/account/${logo}`:'/static/account_logo.png';
    
    return (
        <>
            <Stack alignItems="center" sx={{mb: 5}}>
                <IconCover>
                    <IconWrapper>
                        <IconImage src={logoImage}/>
                        {account === profile.account &&
                            <Link href={`/setting/${account}`} underline='none'>
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
                {name &&
                    <Typography variant="h1a">{name}</Typography>
                }
                <Stack direction="row" alignItems="center">
                    <Link
                        color="inherit"
                        target="_blank"
                        href={`https://xls20.bithomp.com/explorer/${account}`}
                        rel="noreferrer noopener nofollow"
                    >
                        <Typography align="center" style={{ wordWrap: "break-word" }} variant="d3">
                            {account}
                        </Typography>
                    </Link>
                    <CopyToClipboard text={account} onCopy={()=>{openSnackbar("Copied!", "success")}}>
                        <Tooltip title='Click to copy'>
                            <IconButton>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </CopyToClipboard>
                </Stack>
                {description &&
                    <Typography variant="d3" maxWidth='600px'>{description}</Typography>
                }
                {/* <Link
                    component="button"
                    underline="always"
                    variant="body2"
                    color="#33C2FF"
                    onClick={() => {
                        setView('');
                    }}
                >
                    <Typography sx={{ml:0}}>View Collection Items</Typography>
                </Link> */}
            </Stack>
        </>
    );
}
