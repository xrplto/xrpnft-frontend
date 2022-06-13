import React, { useEffect, useState } from "react";
import "./styles/NFTCard.css";
 
import { ColorExtractor } from 'react-color-extractor'
import Card from "./base/Card";
import Button from "./base/Button";
import { Colors } from "./base/Colors";
import { Icon } from '@iconify/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useARStatus } from "../../hooks/isARStatus";



const NFTCard = ({ nftname, title, price, nftSrc, likeCount, gradient, onClick }) => {
  const [isLike, setIsLike] = useState(false);
  const [colors, setColors] = useState([]);

  const isARSupport = useARStatus(nftSrc);

  useEffect(() => {
    console.log(isARSupport);
  }, [])

  const like = () => setIsLike(!isLike);

  const getColors = colors => {
    setColors(c => [...c, ...colors]);
    console.log(colors);
  }





  return (
    <Card
      blurColor={colors[0]}

      child={<>
        {isARSupport ? <model-viewer ar-scale="auto" ar ar-modes="webxr scene-viewer quick-look" id="reveal" loading="eager" camera-controls auto-rotate src={nftSrc} > </model-viewer> : <><ColorExtractor getColors={getColors}>
          <img className="nft-image" src={nftSrc} />
        </ColorExtractor></>}
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
          <Button color={Colors.buttons.primary} textContent="Buy Now" onClick={onClick} />
          <div className="like-container">
            
          <FavoriteIcon />
          </div>
        </div>
      </>}>

    </Card>
  );
};

export default NFTCard;

