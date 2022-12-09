import axios from 'axios';
import React from "react";
import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    Grid
} from '@mui/material';

// Utils
import { CollectionListType } from 'src/utils/constants';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CollectionCard from "./CollectionCard";

export default function CollectionList({type, category}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [collections, setCollections] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const isMine = type === CollectionListType.MINE;

    const loadCollections=(offset) => {
        if (isMine && (!account || !accountToken)) {
            openSnackbar('Please login', 'error');
            return;
        }

        const body = {type, page: offset, limit: 20};

        if (type === CollectionListType.ALL) {
        } else if (type === CollectionListType.MINE) {
            body.account = account;
        } else if (type === CollectionListType.CATEGORY) {
            body.category = category;
        }
        
        axios.post(`${BASE_URL}/collection/getlist`, body, {headers: {'x-access-token': accountToken}})
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
                            <CollectionCard key={index} item={item} isMine={isMine} />
                        // </Grid>
                    ))
                    
                    // .filter(getNFTimage_info(URI)!==null)      
                }
            </Grid>
        </InfiniteScroll>
    )
};
