import React from "react";
import SampleCard from "./SampleCard";

import {
    styled
} from '@mui/material';

const CardListWrapper = styled('div')(
    ({ theme }) => `
        display:flex;
        flex-wrap: wrap;
        align-items:center;
        justify-content: center;
        width: 80vw;
        margin-bottom: 100px;
`
);

export default function CardList({ list, type="horizontal" }) {
    return (
        <CardListWrapper style={{flexDirection:type=="horizontal" ? "row" : "column"}}>
            {list.map((item,index) => (
                <SampleCard nftSrc={item.src} key={index} title={item.title} nftname={item.name} />
            ))}
        </CardListWrapper>
    );
};
