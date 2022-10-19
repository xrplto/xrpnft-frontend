import axios from 'axios';
import React, { useEffect, useState, createRef } from "react";

// Material
import {
    Backdrop,
    Button,
    Grid,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Loader
import { PuffLoader } from "react-spinners";
import { ProgressBar, Discuss } from 'react-loader-spinner';

// Utils
import { getNFTokenInfo, convertHexToString, getNFTfromURI } from 'src/utils/parse';
import { NFToken } from "src/utils/constants";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import NFTPreview from './NFTPreview';
import NFTDetails from './NftDetails';

export default function BuyBulkNFT({nft}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, setAcceptNfts, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [bought, setBought] = useState(false);
    const [loading, setLoading] = useState(false);

    const [mints, setMints] = useState(0);
    const [xrpBalance, setXrpBalance] = useState(0);

    const {
        uuid,
        name,
        cid,
        collection,
        flag,
        status,
        destination,
        account,
        minter,
        issuer,
        date,
        meta,
        URI,
        royalty,
        taxon
    } = nft;

    const isSold = bought || (minter !== account) || status != NFToken.MINTED || destination;

    useEffect(() => {
        function getMints() {
            if (!accountLogin || !accountToken) {
                openSnackbar('Please login', 'error');
                setMints(0);
                setXrpBalance(0);
                return;
            }

            // https://api.xrpnft.com/api/spin/count?account=rhhh
            axios.get(`${BASE_URL}/spin/count?account=${accountLogin}&cid=${cid}`, {headers: {'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        // console.log(`Mints: ${ret.mints}`);
                        setMints(ret.mints);
                        setXrpBalance(ret.xrpBalance);
                        setPendingNfts(ret.pendingNfts);
                    }
                }).catch(err => {
                    console.log("Error on getting mint count!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getMints();
    }, [accountLogin, accountToken]);

    const buyBulkNFT = () => {
        if (loading) return;

        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        // setNft(null);

        const body = { account: accountLogin, collectionName: collection, cid, uuid };

        // https://api.xrpnft.com/api/spin/buynft
        axios.post(`${BASE_URL}/spin/buynft`, body, {headers: {'x-access-token': accountToken}})
            .then(res => {
                let ret = res.status === 200 ? res.data : undefined;
                if (ret) {
                    const status = ret.status;
                    const mints = ret.mints;
                    const offerCount = ret.offerCount;
                    if (status) {
                        openSnackbar('Buy NFT successful!', 'success');
                        window.location.href = `/congrats/buyassets/${uuid}`;
                    }
                    
                    setBought(true);
                    setAcceptNfts(ret.offerCount);
                }
            }).catch(err => {
                console.log("Error on choosing NFT!!!", err);
            }).then(function () {
                // always executed
                setLoading(false);
            });
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Stack>
                    <Discuss
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="#fff"
                        backgroundColor="#F4442E"
                    />

                    <ProgressBar
                        height="80"
                        width="80"
                        ariaLabel="progress-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass="progress-bar-wrapper"
                        borderColor = '#F4442E'
                        barColor = '#51E5FF'
                    />
                </Stack>
            </Backdrop>
        
            <Grid container spacing={2} justifyContent='center' mt={2}>
                <Grid item xs={12} md={6}>
                    <NFTPreview image={meta.image} title={name} favorites={0} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        <Paper sx={{
                            padding: 2,
                        }}>
                            <Stack spacing={2}>
                                <Typography variant="p5">You currently have <Typography variant="s5" color="#33C2FF">{mints} Mints</Typography> available and <Typography variant="s5" color="#33C2FF">{xrpBalance} XRP</Typography> tokens in your wallet.</Typography>
                                <Button
                                    sx={{ borderRadius: 10 }}
                                    disabled={!accountLogin || isSold}
                                    variant='contained'
                                    onClick={() => buyBulkNFT()}
                                    startIcon={<LocalOfferIcon />}
                                >
                                    Buy Now
                                </Button>
                            </Stack>
                        </Paper>
                        <NFTDetails nft={nft} />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
  
  }
