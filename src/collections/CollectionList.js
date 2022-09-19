import axios from 'axios';
import React from "react";
import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    Grid
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CollectionCard from "./CollectionCard";
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

export default function CollectionList({isAll}) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    const token = accountProfile?.token;

    const [collections, setCollections] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadCollections=(offset) => {
        if (!isAll && (!account || !token)) {
            openSnackbar('Please login', 'error');
            return;
        }
        // console.log(`loadCollections page: ${offset}`);
        // https://api.xrpnft.com/api/account/collections?account=rKVd5WtB8ugrxaTDTbJv6pVH7WunmyryLq
        
        axios.get(`${BASE_URL}/account/collections?account=${account}&all=${isAll}&page=${offset}&limit=20`, {headers: {'x-access-token': token}})
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    if (ret.collections.length < 10) {
                        setHasMore(false)
                    }
                    if (offset === 0)
                        setCollections(ret.collections);
                    else
                        setCollections([...collections, ...ret.collections]);
                    setOffset(offset + 1);
                    // setCollections(ret.collections);
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

    const reset = () => {
        setCollections([]);
        setOffset(0);
        loadCollections(0);
    }

    useEffect(() => {
        reset();
    }, [account]);

    return (
        <InfiniteScroll
            dataLength={collections.length}
            next={() => loadCollections(offset)}
            hasMore={hasMore}
            // loader={<p>loading...</p>}
        >
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
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
        </InfiniteScroll>
    )
};
