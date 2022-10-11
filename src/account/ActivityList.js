import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import { withStyles } from '@mui/styles';
import {
    styled, useTheme,
    Avatar,
    Backdrop,
    Box,
    Button,
    CardMedia,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Divider
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import GridOnIcon from '@mui/icons-material/GridOn';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import ApprovalIcon from '@mui/icons-material/Approval';
import TokenIcon from '@mui/icons-material/Token';
import CollectionsIcon from '@mui/icons-material/Collections';
import CasinoIcon from '@mui/icons-material/Casino';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

const Activity = {
    LOGIN: 1,
    LOGOUT: 2,
    UPDATE_PROFILE: 3,
    
    CREATE_COLLECTION: 4,
    UPDATE_COLLECTION: 7,
  
    SET_NFT_MINTER: 8,
  
    MINT_ONE: 9,
    MINT_BULK: 10, // Lazy mint mode, 10k NFTs
  
    BUY_MINT: 12,
    BUY_RANDOM_NFT: 13,
    BUY_BULK_NFT: 14,
    BUY_NORMAL_NFT: 15,
  
    ACCEPT_SELL_OFFER: 16
}

export default function ActivityList({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    // const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    // const account = accountProfile?.account;
    // const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [acts, setActs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getActivities() {
            setLoading(true);
            axios.get(`${BASE_URL}/account/activity?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setActs(ret.acts);
                    }
                }).catch(err => {
                    console.log("Error on getting activity list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getActivities();
    }, [account, page, rows]);

    return (
        <>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                acts && acts.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 5}}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
            )
            }
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    py: 1,
                    overflow: "auto",
                    width: "100%",
                    "& > *": {
                        scrollSnapAlign: "center",
                    },
                    "::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "1px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                    {
                        // {
                        //     "_id": "632683afa45d7f463e8ef870",
                        //     "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
                        //     "name": "TestCollection-1",
                        //     "slug": "test1",
                        //     "type": "bulk",
                        //     "bulkUrl": "https://drive.google.com/file/d/1xjA-1bodiMrvSCtdTEMim5x1Cam74bXU/view",
                        //     "status": 7,
                        //     "description": "This is the description of test1 collection",
                        //     "logoImage": "1663468463243_3d1cc658af10407fabf2c5e96bde2ab4.png",
                        //     "featuredImage": "1663468463243_220f174cbce64122b203c6bccafab57c.jpg",
                        //     "bannerImage": "1663468463245_dcb8db64b5b84da49fd2839508cc0618.jpg",
                        //     "created": 1663468463251,
                        //     "modified": 1663468463251,
                        //     "uuid": "92d8b1d1ac3d48369e98463e6ec29678",
                        //     "creator": "xrpnft.com",
                        //     "infoDOWNLOAD": {
                        //         "size": "2.47 GB"
                        //     }
                        // }
                        // exchs.slice(page * rows, page * rows + rows)
                        acts && acts.map((row) => {
                            const {
                                account,
                                activity,
                                data,
                                timestamp
                            } = row;
                        
                            // const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image}`;

                            const nDate = new Date(timestamp);
                            const year = nDate.getFullYear();
                            const month = (nDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                            const day = nDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                            const hour = nDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                            const min = nDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                            const sec = nDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

                            //const strTime = (new Date(date)).toLocaleTimeString('en-US', { hour12: false });
                            //const strTime = nDate.format("YYYY-MM-DD HH:mm:ss");
                            const strDateTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
                            // const strTime = `${hour}:${min}:${sec}`;

                            let strActivity = '';
                            let componentActivity = (<></>);
                            let componentIcon = (<TaskAltIcon />);
                            switch (activity) {
                                case Activity.LOGIN:
                                    strActivity = 'Login';
                                    componentIcon = (<LoginIcon />);
                                    componentActivity = (
                                        <>
                                        </>
                                    );
                                    break;
                                case Activity.LOGOUT:
                                    strActivity = 'Logout';
                                    componentIcon = (<LogoutIcon />);
                                    componentActivity = (
                                        <>
                                        </>
                                    );
                                    break;
                                case Activity.UPDATE_PROFILE:
                                    strActivity = 'Update Profile';
                                    componentIcon = (<ManageAccountsIcon />);
                                    componentActivity = (
                                        <>
                                        </>
                                    );
                                    break;
                                case Activity.CREATE_COLLECTION:
                                    strActivity = 'Create a Collection';
                                    componentIcon = (<GridOnIcon />);
                                    // {name, type, slug, logo: data.logoImage}
                                    componentActivity = (
                                        <>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${data.logo}`}/>
                                                <Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="s7">Name: </Typography>
                                                        <Typography variant="s2">{data.name}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="s7">Type: </Typography>
                                                        <Typography variant="s2">{data.type}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.UPDATE_COLLECTION:
                                    strActivity = 'Update Collection';
                                    componentIcon = (<Grid4x4Icon />);
                                    componentActivity = (
                                        <>
                                            
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${data.logo}`}/>
                                                <Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="s7">Name: </Typography>
                                                        <Typography variant="s2">{data.name}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="s7">Type: </Typography>
                                                        <Typography variant="s2">{data.type}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.SET_NFT_MINTER:
                                    strActivity = 'Set NFT Minter';
                                    componentIcon = (<ApprovalIcon />);
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1}>
                                                <Typography variant="s7">Minter: </Typography>
                                                <Typography variant="s2">{data.NFTokenMinter}</Typography>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.MINT_ONE:
                                    strActivity = 'Create a NFT';
                                    componentIcon = (<TokenIcon />);
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://gateway.xrpnft.com/ipfs/${data.meta.image}`}/>
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Name: </Typography>
                                                            <Typography variant="s2">{data.name}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Type: </Typography>
                                                            <Typography variant="s2">{data.type}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FlagsContainer Flags={data.flag}/>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.MINT_BULK:
                                    strActivity = 'Mint Bulk NFTs';
                                    componentIcon = (<CollectionsIcon />);
                                    // {flag, minter, issuer, count: metadata.length, meta: metadata[0]}
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://gateway.xrpnft.com/ipfs/${data.meta.image}`}/>
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Minter: </Typography>
                                                            <Typography variant="s2">{data.minter}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Issuer: </Typography>
                                                            <Typography variant="s2">{data.issuer}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Total: </Typography>
                                                            <Typography variant="s2">{data.count}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FlagsContainer Flags={data.flag}/>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.BUY_MINT:
                                    strActivity = 'Buy Mint';
                                    componentIcon = (<ShoppingBagIcon />);
                                    // {cid, cname, cslug, amount, quantity}
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://xrpl.to/static/tokens/${data.token?.md5}.${data.token?.ext}`} />
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Collection: </Typography>
                                                            <Typography variant="s2">{data.cname}</Typography>
                                                        </Stack>
                                                        <Stack direction='row' spacing={0.8} alignItems="center">
                                                            <Typography variant='p4' color="#EB5757">{data.token?.cost}</Typography>
                                                            <Typography variant='s2'>{data.token?.name}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <Typography variant="s7">Quantity: </Typography>
                                                        <Typography variant="s2">{data.quantity}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.BUY_RANDOM_NFT:
                                    strActivity = 'Buy Random NFT';
                                    componentIcon = (<CasinoIcon />);
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://gateway.xrpnft.com/ipfs/${data.meta.image}`}/>
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Name: </Typography>
                                                            <Typography variant="s2">{data.name}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Type: </Typography>
                                                            <Typography variant="s2">{data.type}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FlagsContainer Flags={data.flag}/>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.BUY_BULK_NFT:
                                    strActivity = 'Buy Bulk NFT';
                                    componentIcon = (<TaskAltIcon />);
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://gateway.xrpnft.com/ipfs/${data.meta.image}`}/>
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Name: </Typography>
                                                            <Typography variant="s2">{data.name}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Type: </Typography>
                                                            <Typography variant="s2">{data.type}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FlagsContainer Flags={data.flag}/>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.BUY_NORMAL_NFT:
                                    strActivity = 'Buy a NFT';
                                    componentIcon = (<TokenIcon />);
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" spacing={1}>
                                                    <Avatar alt="C" src={`https://gateway.xrpnft.com/ipfs/${data.meta.image}`}/>
                                                    <Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Name: </Typography>
                                                            <Typography variant="s2">{data.name}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            <Typography variant="s7">Type: </Typography>
                                                            <Typography variant="s2">{data.type}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <FlagsContainer Flags={data.flag}/>
                                                </Stack>
                                            </Stack>
                                        </>
                                    );
                                    break;
                                case Activity.ACCEPT_SELL_OFFER:
                                    componentIcon = (<AssignmentReturnedIcon />);
                                    strActivity = 'Accept Sell Offer';
                                    // NFTokenID
                                    componentActivity = (
                                        <>
                                            <Stack direction="row" spacing={1}>
                                                <Typography variant="s7">NFTokenID: </Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://xls20.bithomp.com/explorer/${data.NFTokenID}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="s2">{data.NFTokenID}</Typography>
                                                </Link>
                                            </Stack>
                                        </>
                                    );
                                    break;
                            }

                            return (
                                <TableRow
                                    // hover
                                    key={timestamp}
                                    sx={{
                                        [`& .${tableCellClasses.root}`]: {
                                            // color: (error ? '#B72136' : '#B72136')
                                        }
                                    }}
                                >
                                    {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                    <TableCell align="left">
                                        {componentIcon}
                                    </TableCell>

                                    <TableCell align="left">
                                        <Stack spacing={0.5}>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                                <Typography variant="s2">{strActivity}</Typography>
                                                <Typography variant="s7">{strDateTime}</Typography>
                                            </Stack>
                                            {componentActivity}
                                            {/* <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://xls20.bithomp.com/explorer/${account}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant="s4" color="#33C2FF">{account}</Typography>
                                            </Link> */}
                                        </Stack>
                                    </TableCell>
                                    
                                    <TableCell align="left">
                                        
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </Box>
            { total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }
        </>
    );
}
