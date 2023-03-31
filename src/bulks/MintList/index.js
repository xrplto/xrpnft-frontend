import axios from 'axios';
import React from "react";
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Box,
    Table,
    TableBody,
    TableCell,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';

// Utils
import { CollectionListType } from 'src/utils/constants';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
// import SearchToolbar from './SearchToolbar';
import Row from './Row';
import ListHead from './ListHead';
import ListToolbar from './ListToolbar';


export default function CollectionList({type, category}) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    // const account = 'rhsxg4xH8FtYc3eR53XDSjTGfKQsaAGaqm';
    // const account = 'rEzbi191M5AjrucxXKZWbR5QeyfpbedBcV';
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [mints, setMints] = useState([]);

    useEffect(() => {
        function getBulkMints() {
            if (!account || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }

            // https://api.xrpnft.com/api/collection/mints?account=rhsxg4xH8FtYc3eR53XDSjTGfKQsaAGaqm&page=0&limit=10
            axios.get(`${BASE_URL}/collection/mints?account=${account}&page=${page}&limit=${rows}`, {headers: {'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setMints(ret.mints);
                    }
                }).catch(err => {
                    console.log("Error on getting bulk list!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getBulkMints();

        // const timer = setInterval(() => getBulkMints(), 8000);
        // return () => {
        //     clearInterval(timer);
        // }
    }, [account, accountToken, page, rows]);

    return (
        <>
            {total > 0 &&
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
                        "::-webkit-scrollbar": { display: "none" }
                    }}
                >
                    <Table style={{minWidth: "1000px"}}>
                        <ListHead />
                        <TableBody>
                            {
                                mints.map((row, idx) => {
                                    return (
                                        <Row
                                            key={idx}
                                            id={page * rows + idx + 1}
                                            item={row}
                                        />
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </Box>
            }
            <ListToolbar
                rows={rows}
                setRows={setRows}
                page={page}
                setPage={setPage}
                total={total}
            />
        </>
    )
};
