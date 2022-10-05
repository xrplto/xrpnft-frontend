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
    Tab,
    Tabs,
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

function TabPanel(props) {
    const { children, value, id, ...other } = props;
 
    return (
        <div
            role="tabpanel"
            hidden={value !== id}
            id={`simple-tabpanel-${id}`}
            aria-labelledby={`simple-tab-${id}`}
            {...other}
        >
            {value === id && (
                <Box sx={{
                    p: { xs: 0, md: 3 },
                    pt: { xs: 3 },
                }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const tabLabels = ['Collected', 'Created', 'Favorited', 'Activity'];

export default function Account({profile}) {
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const accountUuid = accountProfile?.uuid;

    const [tabID, setTabID] = useState(0);

    const {
        name,
        logo,
        banner,
        description
    } = profile;

    const logoImage = logo?`https://s1.xrpnft.com/profile/${logo}`:'/static/account_logo.png';

    const gotoTabView = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-tab-anchor',
        );
    
        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const handleChangeTab = (event, newID) => {
        // let url = '';
        // if (newID > 0)
        //     url = `/token/${token.urlSlug}/${tabValues[newID]}`;
        // else
        //     url = `/token/${token.urlSlug}/`;
        // window.history.pushState({}, null, url);
        setTabID(newID);
        gotoTabView(event);
    };
    
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

                <Stack sx={{mt: 3}}>

                </Stack>

                <Tabs value={tabID} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto" aria-label="token-tabs">
                    <Tab value={0} label={tabLabels[0]} {...a11yProps(0)} />
                    <Tab value={1} label={tabLabels[1]} {...a11yProps(1)} />
                    <Tab value={2} label={tabLabels[2]} {...a11yProps(2)} />
                    <Tab value={3} label={tabLabels[3]} {...a11yProps(3)} />
                </Tabs>
                <TabPanel value={tabID} id={0}>
                    <Stack sx={{mt:5, minHeight: '20vh'}}/>
                    {/* <CollectList token={token} /> */}
                </TabPanel>
                <TabPanel value={tabID} id={1}>
                    <Stack sx={{mt:5, minHeight: '20vh'}}/>
                    {/* <CreatedList token={token}/> */}
                </TabPanel>
                <TabPanel value={tabID} id={2}>
                    <Stack sx={{mt:5, minHeight: '20vh'}}/>
                    {/* <FavoredList token={token} /> */}
                </TabPanel>
                <TabPanel value={tabID} id={3}>
                    <Stack sx={{mt:5, minHeight: '20vh'}}/>
                    {/* <History token={token} /> */}
                </TabPanel>
            </Stack>
        </>
    );
}
