import React from "react";
import CollectionCard from "./CollectionCard";

// Material
import {
    Grid
} from '@mui/material';

import { hotDropsData } from "./MockupData";

export default function CollectionList() {
    return (
        <Grid container spacing={0}
            style={{
                justifyContent: 'space-around',
                alignItems: 'start',
                gridGap: '20px',
                gridTemplateColumns: 'repeat(auto-fill, 300px)'
            }}
        >
            {   
                hotDropsData.map((item,index) => (
                    // <Grid item key={index + "s"}>
                        <CollectionCard key={index} name={item.name} bSrc={item.bSrc} iSrc={item.iSrc} />
                    // </Grid>
                ))
                
                // .filter(getNFTimage_info(URI)!==null)      
            }
        </Grid>
    )
};
