//import { useFormik } from 'formik';
import { useState } from 'react';
// components
import Page from '../components/Page';
import { TokenList/*, TokenCartWidget*/ } from '../components/market';
//
import NFTS from '../_mocks_/nfts';

// ----------------------------------------------------------------------

export default function NFTShop() {
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
            <TokenList tokens={NFTS} />
            {/* <TokenCartWidget /> */}
        </Page>
    );
}
