import React from "react";
import SampleCard from "./SampleCard";

// Material
import {
    styled,
    Grid
} from '@mui/material';

import { hotDropsData } from "./MockupData";

export default function CardList({ type="horizontal" }) {
    return (
        <Grid container spacing={0}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                gridGap: '20px',
                gridTemplateColumns: 'repeat(auto-fill, 300px)'
            }}
        >
            {   
                hotDropsData.map((item,index) => (
                    // <Grid item key={index + "s"}>
                        <SampleCard nftSrc={item.src} key={index} title={item.title} nftname={item.name} />
                    // </Grid>
                ))
                
                // .filter(getNFTimage_info(URI)!==null)      
            }
        </Grid>
    )
};
