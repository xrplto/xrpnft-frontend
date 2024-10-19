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
    Typography,
    Button
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Loader
import { ClipLoader, PulseLoader } from 'react-spinners';

// Components
import NFTCardAccept from '../NFTCardAccept';
import QRDialog from 'src/components/QRDialog';
import BatchProcessingDialog from 'src/components/BatchProcessingDialog';

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

    const [acceptedNFTId, setAcceptedNFTId] = useState(null);

    const [selectedNFTs, setSelectedNFTs] = useState([]);
    const [isAcceptingAll, setIsAcceptingAll] = useState(false);
    const [currentAcceptIndex, setCurrentAcceptIndex] = useState(0);
    const [processedNFTs, setProcessedNFTs] = useState([]);
    const [allProcessedNFTs, setAllProcessedNFTs] = useState([]);

    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

    const [openBatchDialog, setOpenBatchDialog] = useState(false);

    const [currentNFT, setCurrentNFT] = useState(null);

    const fetchAllNfts = async () => {
        setLoading(true);
        console.log('Fetching all NFTs for account:', account);

        let allNfts = [];
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
            try {
                const body = { account, page: currentPage, limit: 20 };
                console.log('Request body sent to API:', body);

                const res = await axios.post(`${BASE_URL}/account/transferred`, body);
                console.log('API Response:', res.data);

                const newNfts = res.data.nfts;
                const total = res.data.total;

                allNfts = [...allNfts, ...newNfts];
                console.log(`Fetched ${newNfts.length} NFTs. Total so far: ${allNfts.length}`);

                if (newNfts.length < 20) {
                    hasMorePages = false;
                } else {
                    currentPage++;
                }

                setTotalOffers(total);
            } catch (err) {
                console.error('Error fetching NFTs:', err);
                hasMorePages = false;
            }
        }

        setNfts(allNfts);
        setHasMore(false);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllNfts();
    }, [sync]);

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/offers/acceptcancel/${xummUuid}`
                );
                const resolved_at = ret.data?.resolved_at;
                if (resolved_at) {
                    if (isAcceptingAll) {
                        setBatchProgress(prev => ({ ...prev, current: prev.current + 1 }));
                        setProcessedNFTs(prev => [...prev, acceptedNFTId]);
                        setAllProcessedNFTs(prev => [...prev, acceptedNFTId]);
                        setNfts(prevNfts => prevNfts.filter(nft => nft.NFTokenID !== acceptedNFTId));
                        setTotalOffers(prevTotal => prevTotal - 1);
                        
                        // Move to the next NFT in the batch
                        const nextIndex = currentAcceptIndex + 1;
                        if (nextIndex < selectedNFTs.length) {
                            setCurrentAcceptIndex(nextIndex);
                            const nextNFT = selectedNFTs[nextIndex];
                            setCurrentNFT(nextNFT.NFTokenID);
                            onAcceptNFT(nextNFT);
                        } else {
                            // Batch processing complete
                            setIsAcceptingAll(false);
                            setOpenBatchDialog(false);
                            setCurrentNFT(null);
                            setProcessedNFTs([]); // Reset processed NFTs for this batch
                            openSnackbar('Batch processing complete!', 'success');
                        }
                    } else {
                        setOpenScanQR(false);
                        setNfts(prevNfts => prevNfts.filter(nft => nft.NFTokenID !== acceptedNFTId));
                        setTotalOffers(prevTotal => prevTotal - 1);
                        setAllProcessedNFTs(prev => [...prev, acceptedNFTId]);
                    }
                    setAcceptedNFTId(null);
                    setSync(sync + 1); // Load NFTs again
                    openSnackbar('Accepting NFT successful!', 'success');
                    return;
                }
            } catch (err) {
                console.error('Error checking payload:', err);
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Timeout!', 'error');
                handleScanQRClose();
            }
        }
        if (openScanQR || isAcceptingAll) {
            timer = setInterval(getPayload, 2000);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [openScanQR, xummUuid, sync, acceptedNFTId, isAcceptingAll, currentAcceptIndex]);

    const handleSelectAll = () => {
        // Filter out all processed NFTs, including those from previous batches
        const unprocessedNfts = nfts.filter(nft => !allProcessedNFTs.includes(nft.NFTokenID));
        
        // Select up to 20 unprocessed NFTs
        const nftsToSelect = unprocessedNfts.slice(0, 20);
        
        if (nftsToSelect.length === 0) {
            openSnackbar('No more NFTs to process', 'info');
            return;
        }

        setSelectedNFTs(nftsToSelect);
        setIsAcceptingAll(true);
        setCurrentAcceptIndex(0);
        setBatchProgress({ current: 0, total: nftsToSelect.length });
        setOpenBatchDialog(true);
        setProcessedNFTs([]); // Reset processed NFTs for this new batch
        const firstNFT = nftsToSelect[0];
        setCurrentNFT(firstNFT.NFTokenID);
        onAcceptNFT(firstNFT);
    };

    const onAcceptNFT = async (nft) => {
        if (!accountLogin || !accountToken) {
            console.log('Accept NFT failed: User not logged in');
            openSnackbar('Please login', 'error');
            return;
        }
        if (accountLogin !== account) {
            console.log('Accept NFT failed: User is not the owner');
            openSnackbar('You are not the owner', 'error');
            return;
        }
        setLoading2(true);
        console.log('Accepting NFT:', nft);
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

            console.log('Sending accept request:', body);
            const res = await axios.post(
                `${BASE_URL}/offers/acceptcancel`,
                body,
                { headers: { 'x-access-token': accountToken } }
            );

            if (res.status === 200) {
                console.log('Accept request successful:', res.data);
                const newUuid = res.data.data.uuid;
                const qrlink = res.data.data.qrUrl;
                const nextlink = res.data.data.next;

                setXummUuid(newUuid);
                setQrUrl(qrlink);
                setNextUrl(nextlink);
                setAcceptedNFTId(NFTokenID);
                if (!isAcceptingAll) {
                    setOpenScanQR(true);
                }
            }
        } catch (err) {
            console.error('Error accepting NFT:', err);
            if (isAcceptingAll) {
                // Move to the next NFT in case of error
                const nextIndex = currentAcceptIndex + 1;
                if (nextIndex < selectedNFTs.length) {
                    setCurrentAcceptIndex(nextIndex);
                    const nextNFT = selectedNFTs[nextIndex];
                    setCurrentNFT(nextNFT.NFTokenID);
                    onAcceptNFT(nextNFT);
                } else {
                    // Batch processing complete
                    setIsAcceptingAll(false);
                    setOpenBatchDialog(false);
                    setCurrentNFT(null);
                    openSnackbar('Batch processing complete with errors!', 'warning');
                }
            }
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
            <Button
                variant="contained"
                color="primary"
                onClick={handleSelectAll}
                disabled={isAcceptingAll || nfts.length === 0}
                sx={{ mb: 2 }}
            >
                {isAcceptingAll ? `Processing ${batchProgress.current + 1} of ${batchProgress.total}` : 'Select all (limit 20)'}
            </Button>

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
                open={openScanQR && !isAcceptingAll}
                type="NFTokenAcceptOffer"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />

            <BatchProcessingDialog
                open={openBatchDialog}
                onClose={() => {
                    setOpenBatchDialog(false);
                    setIsAcceptingAll(false);
                    setCurrentAcceptIndex(0);
                    setBatchProgress({ current: 0, total: 0 });
                    setCurrentNFT(null);
                }}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
                batchProgress={batchProgress}
                currentNFT={currentNFT}
            />

            <Backdrop sx={{ color: '#000', zIndex: 1303 }} open={loading2}>
                <PulseLoader color={'#FF4842'} size={10} />
            </Backdrop>
            <Grid container spacing={1} justifyContent="space-between" mt={1}>
                <Grid item xs={100}>
                    {nfts.map((nft, index) => (
                        <NFTCardAccept
                            nft={nft}
                            handleApprove={handleApprove}
                            profileAccount={account}
                            key={index}
                            disabled={isAcceptingAll || processedNFTs.includes(nft.NFTokenID)}
                        />
                    ))}
                </Grid>
            </Grid>
        </>
    );
}
