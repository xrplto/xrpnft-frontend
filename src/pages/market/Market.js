//import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';
// components
import Page from '../../components/Page';
//import NftCartWidget from './NftCartWidget';
//
//import NFTS from '../../_mocks_/nfts';
import axios from 'axios'
// Context
import Context from '../../Context'
import {
    Grid
} from '@mui/material';

import NftCard from './NftCard';
import TokenListToolbar from './TokenListToolbar';
// ----------------------------------------------------------------------

export default function NFTMarketplace() {
    const { setLoading } = useContext(Context);
    // const [openFilter, setOpenFilter] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('trline');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10); //10
    const [labelRowsPerPage/*, setLabelRowsPerPage*/] = useState('Rows');
    const [ offset, setOffset ] = useState(0);
    const [nfts, setNfts] = useState([]);
    // const formik = useFormik({
    //     initialValues: {
    //         gender: '',
    //         category: '',
    //         colors: '',
    //         priceRange: '',
    //         rating: ''
    //     },
    //     onSubmit: () => {
    //         setOpenFilter(false);
    //     }
    // });

    // const { resetForm, handleSubmit } = formik;

    const BASE_URL = 'https://ws.xrpnft.com/api';
    //const BASE_URL = 'http://localhost/api';

    useEffect(() => {
        function loadNfts(offset) {
            console.log("Loading nfts!!!");
            setLoading(true);
            axios.get(`${BASE_URL}/nfts/${offset}`)
            .then(res => {
                try {
                    if (res.status === 200 && res.data) {
                        let nftList = [];
                        for (var i in res.data.nfts) {
                            let nft = res.data.nfts[i];
                            nftList.push(nft);
                        }
                        setNfts(nftList);
                        console.log('nft List:', nftList)
                    }
                } catch (error) {
                    console.log(error);
                }
            }).catch(err => {
                console.log("err->>", err);
            }).then(function () {
                // always executed
                setLoading(false);
            });
        }

        loadNfts(offset);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        //getExchangeRate();

        const timer = setInterval(() => {}, 5000);

        return () => {
            clearInterval(timer);
        }
    }, [offset, setLoading]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleCloudRefresh = (event) => {
        //loadNfts(offset);
    };

    return (
        <Page title="XRPL NFT Marketplace">
            <TokenListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                count={nfts.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={labelRowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onCloudRefresh={handleCloudRefresh}
            />
            <Grid container spacing={6} sx={{ p: 5 }}>
                {nfts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((nftoken) => (
                    <Grid key={nftoken.tokenID} item xs={12} sm={6} md={2.4}>
                        <NftCard nftoken={nftoken} />
                    </Grid>
                ))}
            </Grid>
            {/* <NftCartWidget /> */}
        </Page>
    );
}
