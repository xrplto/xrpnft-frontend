import { useState, useEffect } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component';
import NftCard from '../pages/market/NftCard';
import '../App.css'
import Page from './Page';
import BigNumber from 'bignumber.js';

function getFlag(nft) {
    const flags = new BigNumber(nft.tokenID.slice(0, 4), 16).toNumber();
    return flags;
}

function applySortFilter(tokens, flag) {
    return tokens.filter(nft => (getFlag(nft) & flag) === flag);
}

export const NFTList = () => {

    const [nftTokens, setNftTokens] = useState([]);
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const flags = useSelector((state) => state.filter)
    const [loaded, setIsLoaded] = useState(false);
    const BASE_URL = 'https://ws.xrpnft.com/api';

    const fetchImages = () => {
        axios
            .get(`${BASE_URL}/nfts/${offset}`)
            .then(res => {
                setNftTokens([...nftTokens, ...res.data.nfts]);
                setIsLoaded(true);
                if (res.data.nfts.length < 10)
                    setHasMore(false)
                setOffset(offset + 1)
            });
    };

    useEffect(() => {
        fetchImages();
    }, []);
    const filteredTokens = applySortFilter(nftTokens, flags.flag);
    return (
        <Page title="XRPL NFT Marketplace">
            <InfiniteScroll
                dataLength={nftTokens}
                next={() => fetchImages()}
                hasMore={hasMore}
            >
                <div className="image-grid" style={{ margin: "3vw" }}>
                    {loaded ?
                        filteredTokens.map((nftToken) => (
                            <NftCard nftoken={nftToken} key={nftToken.tokenID} />
                        )) : ""}
                </div>
            </InfiniteScroll>
        </Page>
    );
};
