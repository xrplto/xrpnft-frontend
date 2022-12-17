import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";

// Material
import {
    useTheme,
    Backdrop,
    Box,
    Button,
    CardMedia,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { fIntNumber } from 'src/utils/formatNumber';
import { NFToken } from 'src/utils/constants';
import { parseNFTokenID } from 'src/utils/parse';

// Loader
import { PulseLoader, ClockLoader } from "react-spinners";
import { RotatingSquare, Vortex } from 'react-loader-spinner';

// Components
import QRDialog from 'src/components/QRDialog';
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

/**
 * Converts hex to its string equivalent. Useful to read the Domain field and some Memos.
 *
 * @param hex - The hex to convert to a string.
 * @param encoding - The encoding to use. Defaults to 'utf8' (UTF-8). 'ascii' is also allowed.
 * @returns The converted string.
 * @category Utilities
 */
 function convertHexToString(hex, encoding = 'utf8') {
    let ret = '';
    try {
        ret = Buffer.from(hex, 'hex').toString(encoding);
    } catch (err) {
    }
    return ret;
}

export default function AcceptList({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, setAcceptNfts, sync, setSync } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [nfts, setNfts] = useState([]);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        function getNfts() {
            setLoading(true);
            axios.get(`${BASE_URL}/account/offered?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setNfts(ret.nfts);
                    }
                }).catch(err => {
                    console.log("Error on getting nft offers list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getNfts();
    }, [account, page, rows, sync]);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/offers/acceptcancel/${xummUuid}`);
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        // handleClose();
                        setPage(0);
                        setSync(sync + 1); // Load NFTs again
                        openSnackbar('Accepting NFT successful!', 'success');
                    }
                    else
                        openSnackbar('Accepting NFT failed!', 'error');
                    return;
                }
            } catch (err) {
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Timeout!', 'error');
                handleScanQRClose();
            }
        }
        if (openScanQR) {
            timer = setInterval(getPayload, 2000);
        }
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        };
    }, [openScanQR, xummUuid, sync]);

    const onAcceptNFT = async (nft) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        if (accountLogin !== account) {
            openSnackbar('You are not the owner of this account', 'error');
            return;
        }
        setLoading2(true);
        try {
            const {
                uuid,
                NFTokenID,
                SellOfferID
            } = nft;

            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin, 
                uuid,
                NFTokenID,
                index: SellOfferID,
                accept: "yes",
                sell: "yes",
                user_token
            };

            const res = await axios.post(`${BASE_URL}/offers/acceptcancel`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setXummUuid(newUuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setOpenScanQR(true);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading2(false);
    };

    const onDisconnectXumm = async () => {
        setLoading2(true);
        try {
            const res = await axios.delete(`${BASE_URL}/offers/acceptcancel/${xummUuid}`);
            // if (res.status === 200) {
            //     setXummUuid(null);
            // }
        } catch(err) {
            console.error(err);
        }
        setXummUuid(null);

        setLoading2(false);
    };

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm();
    };

    const handleApprove = (nft) => {
        onAcceptNFT(nft);
    }

    return (
        <>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                nfts && nfts.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 5}}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
            )
            }
            <Backdrop
                sx={{ color: "#000", zIndex: 1303 }}
                open={loading2}
            >
                <PulseLoader color={"#FF4842"} size={10} />
            </Backdrop>
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
                        nfts && nfts.map((row) => {
                            const {
                                uuid,
                                name,
                                collection,
                                account,
                                date,
                                meta,
                                URI,
                                time,
                                NFTokenID,
                                SellOfferID,
                                mintHash,
                                status
                            } = row;

                            const {
                                flag,
                                royalty,
                                issuer,
                                taxon,
                                transferFee
                            } = parseNFTokenID(NFTokenID);
                        
                            const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
                            const isVideo = meta.video;

                            let strDateTime = formatDateTime(time);

                            return (
                                <TableRow
                                    // hover
                                    key={uuid}
                                    sx={{
                                        [`& .${tableCellClasses.root}`]: {
                                            // color: (error ? '#B72136' : '#B72136')
                                        }
                                    }}
                                >
                                    {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                    <TableCell align="left">
                                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                            {isVideo?
                                                <CardMedia
                                                    component="video"
                                                    image={imgUrl}
                                                    title='title'
                                                    controls
                                                    style={{
                                                        width: 128,
                                                        height: 128,
                                                        filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                    }}
                                                />
                                                :
                                                <ModalImage
                                                    className='nftpreview1'
                                                    small={imgUrl}
                                                    large={imgUrl}
                                                    alt={name}
                                                    hideDownload
                                                    hideZoom
                                                    style={{
                                                        width: 128,
                                                        height: 128,
                                                        filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                    }}
                                                />
                                            }
                                            
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="h3" color="#33C2FF">{name}</Typography>
                                                    {SellOfferID ? (
                                                        <Button variant="contained" color="primary" size="small" onClick={()=>handleApprove(row)}>
                                                            Approve
                                                        </Button>
                                                    ):(
                                                        <Stack>
                                                            <Typography variant="s5">Pending ...</Typography>
                                                            <Typography variant="s7">Code: {status}</Typography>
                                                        </Stack>
                                                    )
                                                    }
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Collection: </Typography>
                                                    <Typography variant="s6">{collection}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Offered On: </Typography>
                                                    <Typography variant="s6">{strDateTime}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="s7">Flags: </Typography>
                                                    <FlagsContainer Flags={flag}/>
                                                    {/* <Typography variant="s6">{strDateTime}</Typography> */}
                                                    <Typography variant='s7'>Taxon </Typography>
                                                    <Typography variant='s6'>{taxon}</Typography>
                                                    <Typography variant="s7">Transfer Fee</Typography>
                                                    <Typography variant="s6">{transferFee} %</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">NFTokenID: </Typography>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="s6">{NFTokenID}</Typography>
                                                    </Link>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">URI: </Typography>
                                                    <Typography variant="s6">{convertHexToString(URI)}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
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
            <QRDialog
                open={openScanQR}
                type="NFTokenAcceptOffer"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}
