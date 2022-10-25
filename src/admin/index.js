import React from 'react';
import { useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { useTheme } from '@mui/material/styles';
import {
    styled,
    Badge,
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
    TextField,
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
import ProfileList from './ProfileList';

import CollectedList from '../account/CollectedList';
import CreatedList from '../account/CreatedList';
import FavoritedList from '../account/FavoritedList';
import ActivityList from '../account/ActivityList';
import AcceptList from '../account/AcceptList';
import CheckNFT from './CheckNFT';
import Summary from './Summary';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 108px;
        height: 108px;
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
        width: 96px;
        height: 96px;
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
    // position: absolute;
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

const tabValues = ['collected', 'created', 'favorited', 'activity', 'accept', 'checknfts', 'summary'];
const tabLabels = ['Collected', 'Created', 'Favorited', 'Activity', 'Accept', 'Check NFTs', 'Summary'];

function getTabID(tab) {
    if (!tab) return 0;
    const idx = tabValues.indexOf(tab);
    if (idx < 0)
        return 0;
    return idx;
}

export default function Admin() {
    const { accountProfile, openSnackbar, acceptNfts } = useContext(AppContext);
    const account = accountProfile.account;
    const accountToken = accountProfile.token;
    const accountUuid = accountProfile.xuuid;

    const [tabID, setTabID] = useState(0);

    const [counterAccount, setCounterAccount] = useState(account);

    const {
        name,
        logo,
        banner,
        description,
        minterWallet
    } = accountProfile;

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
        //     url = `/account/${profile.account}/${tabValues[newID]}`;
        // else
        //     url = `/account/${profile.account}/`;
        // window.history.pushState({}, null, url);
        setTabID(newID);
        gotoTabView(event);
    };
    
    return (
        <>
            <Stack sx={{mt: 3, mb: 5}}>
                <Stack direction="row" spacing={2}>
                    <IconCover>
                        <IconWrapper>
                            <IconImage src={logoImage}/>
                            <Link href={`/setting`} underline='none'>
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
                        </IconWrapper>
                    </IconCover>

                    <Stack spacing={1}>
                        <Stack direction="row" spacing={2}>
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
                        </Stack>
                        {description && false &&
                            <Typography variant="d3" maxWidth='600px'>{description}</Typography>
                        }
                        <Tabs value={tabID} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto" aria-label="token-tabs">
                            <Tab value={0} label={tabLabels[0]} {...a11yProps(0)} />
                            <Tab value={1} label={tabLabels[1]} {...a11yProps(1)} />
                            <Tab value={2} label={tabLabels[2]} {...a11yProps(2)} />
                            <Tab value={3} label={tabLabels[3]} {...a11yProps(3)} />
                            <Tab value={4} label={tabLabels[4]} {...a11yProps(4)} />
                            <Tab value={5} label={tabLabels[5]} {...a11yProps(5)} />
                            <Tab value={6} label={tabLabels[6]} {...a11yProps(6)} />
                        </Tabs>
                    </Stack>
                </Stack>

                <Grid container rowSpacing={0} sx={{mb: 10}}>
                    <Grid container item xs={12} md={5}>
                        <ProfileList setCounterAccount={setCounterAccount} />
                    </Grid>

                    <Grid container item xs={12} md={7}>
                        <TabPanel value={tabID} id={0}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <CollectedList account={counterAccount} />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={1}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <CreatedList account={counterAccount} />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={2}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <FavoritedList account={counterAccount} />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={3}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <ActivityList account={counterAccount} />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={4}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <AcceptList account={counterAccount} />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={5}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <CheckNFT />
                            </Stack>
                        </TabPanel>
                        <TabPanel value={tabID} id={6}>
                            <Stack sx={{minHeight: '20vh'}}>
                                <Summary />
                            </Stack>
                        </TabPanel>
                    </Grid>
                </Grid>

                
            </Stack>
        </>
    );
}
