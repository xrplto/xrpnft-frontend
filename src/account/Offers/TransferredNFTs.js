import axios from 'axios';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    useTheme,
    useMediaQuery,
    Backdrop,
    Box,
    Grid,
    Stack,
    Typography
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { ClipLoader, PulseLoader } from 'react-spinners';

// Components
import NFTCardAccept from '../NFTCardAccept';
import QRDialog from 'src/components/QRDialog';

export default function TransferredNFTs({ account, setTotalOffers }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar, sync, setSync } =
        useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [nfts, setNfts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [xummUuid, setXummUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);

    // useEffect(() => {
    //     function getNfts() {
    //         setLoading(true);
    //         axios.get(`${BASE_URL}/account/offered?account=${account}&page=${page}&limit=${rows}`)
    //             .then(res => {
    //                 let ret = res.status === 200 ? res.data : undefined;
    //                 if (ret) {
    //                     setTotal(ret.total);
    //                     setNfts(ret.nfts);
    //                 }
    //             }).catch(err => {
    //                 console.log("Error on getting nft!", err);
    //             }).then(function () {
    //                 // always executed
    //                 setLoading(false);
    //             });
    //     }
    //     getNfts();
    // }, [account, page, rows, sync]);

    const fetchNfts = () => {
        setLoading(true);

        const limit = 20;

        // const body = { page, limit, flag, cid: collection?.uuid, search, filter, subFilter };

        const body = { account, page, limit };

        axios
            .post(`${BASE_URL}/account/transferred`, body)
            .then((res) => {
                const newNfts = res.data.nfts;
                const length = newNfts.length;
                const total = res.data.total;
                if (length < 20) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                if (length > 0) {
                    setNfts([...nfts, ...newNfts]);
                    setTotalOffers(total);
                }
            })
            .catch((err) => {
                console.log('Error on getting nfts!', err);
            })
            .then(function () {
                // always executed
                setLoading(false);
            });
    };

    useEffect(() => {
        setNfts([]);
        setPage(0);
        setHasMore(true);
        setSync(sync + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    useEffect(() => {
        fetchNfts();
    }, [sync]);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + ' ' + isRunning, xummUuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/acceptcancel/${xummUuid}`
                );
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    //if (dispatched_result === 'tesSUCCESS') {  // webxtor: TODO: check if really right solution, for ex. in accept offer also no  dispatched_result
                        // handleClose();
                        setNfts([]);
                        setPage(0);
                        setHasMore(true);
                        setSync(sync + 1); // Load NFTs again
                        openSnackbar('Accepting NFT successful!', 'success');
                    //} else openSnackbar('Accepting NFT failed!', 'error');
                    return;
                }
            } catch (err) {}
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
                clearInterval(timer);
            }
        };
    }, [openScanQR, xummUuid, sync]);

    const onAcceptNFT = async (nft) => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        if (accountLogin !== account) {
            openSnackbar('You are not the owner', 'error');
            return;
        }
        setLoading2(true);
        try {
            const { uuid, NFTokenID, index } = nft;

            const user_token = accountProfile.user_token;

            const body = {
                account: accountLogin,
                uuid,
                NFTokenID,
                index,
                accept: 'yes',
                sell: 'yes',
                user_token
            };

            const res = await axios.post(
                `${BASE_URL}/offers/acceptcancel`,
                body,
                { headers: { 'x-access-token': accountToken } }
            );

            if (res.status === 200) {
                const newUuid = res.data.data.uuid;
                console.log(newUuid);
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
            const res = await axios.delete(
                `${BASE_URL}/offers/acceptcancel/${xummUuid}`
            );
            // if (res.status === 200) {
            //     setXummUuid(null);
            // }
        } catch (err) {
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
    };

    return (
        <>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color="#00AB55" size={10} />
                </Stack>
            ) : (
                nfts &&
                nfts.length === 0 && (
                    <Stack alignItems="center" sx={{ mt: 5 }}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
                )
            )}

            <QRDialog
                open={openScanQR}
                type="NFTokenAcceptOffer"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
            <Backdrop sx={{ color: '#000', zIndex: 1303 }} open={loading2}>
                <PulseLoader color={'#FF4842'} size={10} />
            </Backdrop>
            <Grid container spacing={1} justifyContent="space-between" mt={1}>
                <Grid item xs={100}>
                    <InfiniteScroll
                        dataLength={nfts.length}
                        next={() => {
                            setPage(page + 1);
                            setSync(sync + 1);
                        }}
                        hasMore={hasMore}
                        scrollThreshold={0.6}
                    >
                        {nfts.map((nft, index) => (
                            <NFTCardAccept
                                nft={nft}
                                handleApprove={handleApprove}
                                profileAccount={account}
                                key={index}
                            />
                        // <Grid container spacing={1}>
                                // <Grid
                                //     item
                                //     xs={6}
                                //     sm={3}
                                //     md={2.4}
                                //     lg={2}
                                //     xl={1.2}
                                //     key={nft.uuid}
                                // >
                                // </Grid>
                                // </Grid>
                                ))}
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </>
    );
}
