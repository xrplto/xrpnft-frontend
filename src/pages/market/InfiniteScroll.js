import { useState, useEffect } from 'react';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';
import NftCard from './NftCard';
import '../../App.css'
export const Collage = () => {

    const [images, setImages] = useState([]);
    const [loaded, setIsLoaded] = useState(false);
    const BASE_URL = 'https://ws.xrpnft.com/api';

    const fetchImages = (count = 10) => {
        const apiRoot = "https://api.unsplash.com";
        const accessKey = "{input access key here}";

        axios
            .get(`${BASE_URL}/nfts/${count}`)
            .then(res => {
                console.log(res.data.nfts)
                setImages([...images, ...res.data.nfts.slice(1, 20)]);
                setIsLoaded(true);
            });
    };
    useEffect(() => {
        fetchImages();
    }, []);
    // Return JSX
    return (
        <div className="hero is-fullheight is-bold is-info">
            <div className="hero-body">
                <div className="container">
                    <div className="header content">
                        <h2 className="subtitle is-6">The XRPL</h2>
                        <h1 className="title is-1">
                            Infinite Scroll Unsplash Code Challenge
                        </h1>
                    </div>
                    <InfiniteScroll
                        dataLength={images}
                        next={() => fetchImages(5)}
                        hasMore={true}
                        loader={
                            <img
                                src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
                                alt="loading"
                            />}
                    >
                        <div className="image-grid" style={{ margin: "3vw" }}>
                            {loaded ?
                                images.map((image,i) => (
                                    // <UnsplashImage url={image.URI} key={image.tokenID} />
                                    <NftCard nftoken={image} key={image.tokenID+i}/>
                                )) : ""}
                        </div>
                    </InfiniteScroll>

                </div>
            </div>
        </div>
    );
};

// // Render the component to the DOM element with ID of root
// ReactDOM.render(<Collage />, document.getElementById("root"));
