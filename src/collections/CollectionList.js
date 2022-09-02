import axios from 'axios';
import React from "react";
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Grid
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CollectionCard from "./CollectionCard";

import { hotDropsData } from "./MockupData";

export default function CollectionList() {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const loadCollections=() => {
            // https://api.xrpnft.com/api/account/collections?account=rKVd5WtB8ugrxaTDTbJv6pVH7WunmyryLq
            const account = accountProfile.account;
            axios.get(`${BASE_URL}/account/collections?account=${account}`)
            .then(res => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        setCollections(ret.collections);
                    }
                } catch (error) {
                    console.log(error);
                }
            }).catch(err => {
                console.log("err->>", err);
            }).then(function () {
                // Always executed
            });
        };
        loadCollections();
    }, []);

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
                collections.map((item,index) => (
                    // <Grid item key={index + "s"}>
                        <CollectionCard key={index} item={item} />
                    // </Grid>
                ))
                
                // .filter(getNFTimage_info(URI)!==null)      
            }
        </Grid>
    )
};
