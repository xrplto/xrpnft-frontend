import { useState, useEffect } from 'react';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
import NftCard from '../pages/market/NftCard';
import '../App.css'
import Page from './Page';

export const NFTList = () => {

    const [images, setImages] = useState([]);
    const [offset, setOffset] = useState(0)
    const [loaded, setIsLoaded] = useState(false);
    const BASE_URL = 'https://ws.xrpnft.com/api';

    const fetchImages = () => {
        axios
            .get(`${BASE_URL}/nfts/${offset}`)
            .then(res => {
                setImages([...images, ...res.data.nfts]);
                setIsLoaded(true);
                setOffset(offset + 1)
            });
    };
    useEffect(() => {
        fetchImages();
    }, []);
    return (
        <Page title="XRPL NFT Marketplace">
            <InfiniteScroll
                dataLength={images}
                next={() => fetchImages()}
                hasMore={true}
            >
                <div className="image-grid" style={{ margin: "3vw" }}>
                    {loaded ?
                        images.map((image) => (
                            <NftCard nftoken={image} key={image.tokenID} />
                        )) : ""}
                </div>
            </InfiniteScroll>
        </Page>
    );
};
