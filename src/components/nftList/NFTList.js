import { useState, useEffect } from 'react';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { addNfts, increaseOffset } from 'app/slices/nftsSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { resetNFTs } from 'app/slices/nftsSlice'
import NftCard from './NftCard';
import '../../App.css'
import Page from '../Page';
import BigNumber from 'bignumber.js';
import { BASE_URL } from 'utils/constants';
import { Grid } from "@mui/material";
import XSnackbar from 'components/common/Snackbar';
import { useSnackbar } from 'hooks/useSnackbar';


function getFlag(nft) {
    const flags = new BigNumber(nft.tokenID.slice(0, 4), 16).toNumber();
    return flags;
}

function applySortFilter(tokens, flag) {
    return tokens.filter(nft => (getFlag(nft) & flag) === flag);
}

export const NFTList = () => {

    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const nfts = useSelector((state) => state.nfts)
    const nftTokens = nfts.nfts
    const offset = nfts.offset
    const [hasMore, setHasMore] = useState(true)
    const flags = useSelector((state) => state.filter)
    const dispatch = useDispatch()
    const [loaded, setIsLoaded] = useState(false);

    const fetchImages = () => {
        axios
            .get(`${BASE_URL}/nfts/${offset}`)
            .then(res => {
                setIsLoaded(true);
                if (res.data.nfts.length < 10) {
                    setHasMore(false)
                }
                dispatch(addNfts(res.data.nfts))
                dispatch(increaseOffset())
            });
    };

    const fetchNFTokens = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/nfts/${offset}`)
            setIsLoaded(true);
            if (res.data.nfts.length < 10) // if this is the last page, no more request to server
                setHasMore(false)
            dispatch(addNfts(res.data.nfts))
            dispatch(increaseOffset())
            openSnackbar('Fetch:' + offset, 'success')
        } catch (e) {
            // use snack bar here
            openSnackbar(e.message, 'error')
        }
    }

    useEffect(() => {
        fetchImages();
        return () => {
            dispatch(resetNFTs())
        }
    }, []);

    // useEffect(() => {
    // }, []);
    const filteredTokens = applySortFilter(nftTokens, flags.flag);
    return (
        <Page title="XRPL NFT Marketplace">
            <InfiniteScroll
                dataLength={filteredTokens.length}
                next={() => fetchNFTokens()}
                hasMore={hasMore}
            >
                <Grid container spacing={2} justifyContent='center'>
                    {
                        filteredTokens.map((nft) => (
                            <Grid item key={nft.tokenID}
                            >
                                <NftCard nftoken={nft} />
                            </Grid>
                        ))
                    }
                </Grid>
            </InfiniteScroll>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </Page>
    );
};
