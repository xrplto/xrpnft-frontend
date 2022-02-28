//import { useFormik } from 'formik';
import { useState } from 'react';
// components
import Page from '../components/Page';
import { TokenList/*, TokenCartWidget*/ } from '../components/market';

// material
import {
    Backdrop,
    Container
  } from "@mui/material";
  import { HashLoader } from "react-spinners";
//
import NFTS from '../_mocks_/nfts';

// ----------------------------------------------------------------------

export default function NFTShop() {
    const [loading, setLoading] = useState(false);
    // const [openFilter, setOpenFilter] = useState(false);

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

    return (
        <Page title="XRPL NFT Marketplace">
            <Backdrop
                sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <HashLoader color={"#00AB55"} size={50} />
            </Backdrop>
            <TokenList tokens={NFTS} />
            {/* <TokenCartWidget /> */}
        </Page>
    );
}
