//import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';
// components
import Page from '../../components/Page';
import NftList from './NftList';
//import NftCartWidget from './NftCartWidget';
//
import NFTS from '../../_mocks_/nfts';
import axios from 'axios'
// Context
import Context from '../../Context'
import {
    Card
} from '@mui/material';
// ----------------------------------------------------------------------

export default function NFTMarketplace() {
    const { setLoading } = useContext(Context);
    // const [openFilter, setOpenFilter] = useState(false);
    const [ offset, setOffset ] = useState(-1);
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
                        console.log(nftList);
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

    return (
        <Page title="XRPL NFT Marketplace">
            <NftList nfts={nfts} />
            {/* <NftCartWidget /> */}
        </Page>
    );
}
