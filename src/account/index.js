import React from 'react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    alpha, styled,
    Box,
    Container,
    Divider,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListIcon from '@mui/icons-material/List';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CreatedList from './CreatedList';
import FavoritedList from './FavoritedList';
import ActivityList from './ActivityList';
import AcceptList from './AcceptList';
import OffersList from './OffersList';
import CollectedNFTs from './CollectedNFTs';
import { height } from '@mui/system';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Utils
import { getHashIcon } from 'src/utils/parse';

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
                    // p: { xs: 0, md: 3 },
                    // pt: { xs: 3 },
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

const tabValues = ['', 'created', 'favorited', 'activity', 'transfers', 'more'];
const tabLabels = ['Collected', 'Created', 'Favorited', 'Activity', 'Transfers', 'More'];

const tabMoreValues = ['sells', 'buys', 'orphaned'];
const tabMoreLabels = ['Sell Offers', 'Buy Offers', 'Orphaned Offers'];

const MORE_INDEX = tabValues.indexOf('more');

function getTabID(tab) {
    if (!tab) return 0;

    if (tabMoreValues.includes(tab))
        return MORE_INDEX;

    const idx = tabValues.indexOf(tab);
    if (idx < 0)
        return 0;
    return idx;
}

function getSubTabID(tab) {
    if (!tab) return 0;

    const idx = tabMoreValues.indexOf(tab);
    if (idx < 0)
        return 0;
    return idx;
}

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function Account({ profile, tab }) {
    const { accountProfile, openSnackbar, acceptNfts } = useContext(AppContext);
    const account = accountProfile?.account;
    // const accountToken = accountProfile?.token;
    // const accountUuid = accountProfile?.xuuid;

    const [moreMenu, setMoreMenu] = useState(getSubTabID(tab));

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const [tabID, setTabID] = useState(getTabID(tab));

    const {
        name,
        logo,
        banner,
        description,
        minterWallet
    } = profile;

    const logoImage = logo ? `https://s1.xrpnft.com/profile/${logo}` : getHashIcon(profile.account);

    const handleClickMore = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMore = () => {
        setAnchorEl(null);
    };

    const handleSelectMore = (event, menu) => {
        setMoreMenu(menu);
        setAnchorEl(null);

        const url = `/account/${profile.account}/${tabMoreValues[menu]}`;
        window.history.pushState({}, null, url);

        if (tabID !== MORE_INDEX) {
            setTabID(MORE_INDEX);
            gotoTabView(event);
        }
    };

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
        if (newID === MORE_INDEX) {
            return;
        }
        let url = '';
        if (newID > 0)
            url = `/account/${profile.account}/${tabValues[newID]}`;
        else
            url = `/account/${profile.account}/`;
        window.history.pushState({}, null, url);
        setTabID(newID);
        gotoTabView(event);
    };

    return (
        <Container maxWidth='xxl'>
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'center',
                    my: 2
                }}
            >
                <Avatar
                    variant={logo?"":"square"}
                    sx={{
                        width: { md: 90, xs: 50 },
                        height: { md: 90, xs: 50 },
                        backgroundColor: '#00000000'
                    }}
                >
                    <IconImage src={logoImage} />
                    {account === profile.account &&
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
                    }
                </Avatar>
                <Box>
                    <Typography variant='h3'>{name || profile.account?.toString().slice(0, 5)}</Typography>
                    <Box display='flex' alignItems={'center'}>
                        <Typography style={{ wordWrap: "break-word" }} variant="d3">
                            {profile.account.slice(0, 4) + '...' + profile.account.slice(-4)}
                        </Typography>
                        <CopyToClipboard text={profile.account} onCopy={() => { openSnackbar("Copied!", "success") }}>
                            <Tooltip title='Click to copy'>
                                <IconButton>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                        <Link
                            color="inherit"
                            target="_blank"
                            href={`https://bithomp.com/explorer/${profile.account}`}
                            rel="noreferrer noopener nofollow"
                        >
                            <IconButton>
                                <OpenInNewIcon />
                            </IconButton>
                        </Link>
                    </Box>
                </Box>

                {description &&
                    <Typography variant="d3" maxWidth='600px'>{description}</Typography>
                }
            </Box>
            <Tabs
                value={tabID}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons='auto'
                aria-label="token-tabs"
            >
                <Tab value={0} label={tabLabels[0]} {...a11yProps(0)} />
                <Tab value={1} label={tabLabels[1]} {...a11yProps(1)} />
                <Tab value={2} label={tabLabels[2]} {...a11yProps(2)} />
                <Tab value={3} label={tabLabels[3]} {...a11yProps(3)} />
                <Tab value={4} label={tabLabels[4]} {...a11yProps(4)} />
                <Tab
                    value={5}
                    label={tabLabels[5]}
                    icon={<KeyboardArrowDownIcon />}
                    iconPosition='end'
                    {...a11yProps(5)}
                    onClick={handleClickMore}
                />


                <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMore}
                >
                    <MenuItem onClick={(event) => handleSelectMore(event, 0)} sx={{ py: 1 }} disableRipple>
                        <LocalOfferIcon />
                        <Typography variant='s6'>{tabMoreLabels[0]}</Typography>
                    </MenuItem>
                    <MenuItem onClick={(event) => handleSelectMore(event, 1)} sx={{ py: 1 }} disableRipple>
                        <ListIcon />
                        <Typography variant='s6'>{tabMoreLabels[1]}</Typography>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={(event) => handleSelectMore(event, 2)} sx={{ py: 1 }} disableRipple>
                        <NearbyErrorIcon />
                        <Typography variant='s6'>{tabMoreLabels[2]}</Typography>
                    </MenuItem>
                </StyledMenu>
            </Tabs>
            <Box sx={{ my: 1 }}>
                <TabPanel value={tabID} id={0}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <CollectedNFTs account={profile.account} />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={1}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <CreatedList account={profile.account} />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={2}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <FavoritedList account={profile.account} />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={3}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <ActivityList account={profile.account} />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={4}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <AcceptList account={profile.account} />
                    </Stack>
                </TabPanel>
                <TabPanel value={tabID} id={5}>
                    <Stack sx={{ minHeight: '20vh' }}>
                        <OffersList account={profile.account} type={tabMoreValues[moreMenu]} />
                    </Stack>
                </TabPanel>
            </Box>
        </Container >
    );
}
