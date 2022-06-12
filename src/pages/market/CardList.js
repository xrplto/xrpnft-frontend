import React from "react";
import NFTCard from "./Samplecard";
import "./styles/CardList.css";
import { useNavigate } from "react-router-dom";

const CardList = ({ list,type="horizontal" }) => {
  let navigate = useNavigate();

  return (
    <div id="card-list" style={{flexDirection:type=="horizontal" ? "row" : "column"}}>
      {list.map((item,index) => (
        <NFTCard nftSrc={item.src} key={index} username={item.name} onClick={()=>navigate('/detail',{state:{item:item}})}/>
      ))}
    </div>
  );
};

export default CardList;
