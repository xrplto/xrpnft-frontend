import React, { useEffect, useState } from "react";
import { ColorExtractor } from 'react-color-extractor';

// Material
import {
  Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Iconify
import { Icon } from '@iconify/react';

// Components
import Card from "./Card";

export default function SampleCard({ nftname, title, price, nftSrc, likeCount, gradient, onClick }) {
    const [isLike, setIsLike] = useState(false);
    const [colors, setColors] = useState([]);

    const like = () => setIsLike(!isLike);

    const getColors = colors => {
        setColors(c => [...c, ...colors]);
        // console.log(colors);
    }

    return (
        <Card
            blurColor={colors[0]}
            child={
                <>
                    <ColorExtractor getColors={getColors}>
                        <img className="nft-image" src={nftSrc} />
                    </ColorExtractor>
                    <div className="wrapper">
                        <div className="info-container">
                            <p className="owner">{title} </p>
                            <p className="name">{nftname}</p>
                        </div>
                        <div className="price-container">
                            <p className="price-label">Price</p>
                            <p className="price">
                                {" "}
                                <Icon icon="teenyicons:ripple-solid" /> 455
                            </p>
                        </div>
                    </div>
                    <div className="buttons">
                        {/* <button className="buy-now">Buy Now</button> */}
                        <Button color='success' variant="outlined" onClick={onClick} size="small">Buy Now</Button>
                        <div className="like-container">
                            <FavoriteIcon />
                        </div>
                    </div>
                </>
            }
        >
        </Card>
    );
};
