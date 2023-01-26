import axios from 'axios';
import React from "react";
import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    Box,
    Table,
    TableBody
} from '@mui/material';

// Utils
import { CollectionListType } from 'src/utils/constants';

// Components
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList() {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const loadCollections = () => {
            const body = {
                filter: '',
                type: CollectionListType.LANDING,
                page: 0,
                limit: 10,
                order: 'desc',
                orderBy: 'vol24h',
                choice: 'all'
            };

            axios.post(`${BASE_URL}/collection/getlistbyorder`, body)
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
        <>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    py: 1,
                    overflow: "auto",
                    width: "100%",
                    "& > *": {
                        scrollSnapAlign: "center",
                    },
                    "::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Table>
                    <ListHead />
                    <TableBody>
                        {
                            collections.map((row, idx) =>
                                <Row
                                    // key={row.id}
                                    key={idx}
                                    id={idx + 1}
                                    item={row}
                                />
                            )
                        }
                    </TableBody>
                </Table>
            </Box>
        </>
    )
};
