import axios from 'axios'
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Box,
    Container,
    Grid,
    styled,
    Toolbar
} from '@mui/material';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import Footer from 'src/components/Footer';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;
const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: hidden;
    flex: 1;
`
);

function Overview({data}) {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />
            <Header />
            
            <Container maxWidth="xl">
                <Grid
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12} md={12} lg={12} >
                    </Grid>
                </Grid>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export default Overview;

const BASE_URL = 'http://95.217.113.244/api';

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'XRPNFT, the largest XRPL NFT marketplace';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/ogp.png';
    ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

    ret = {ogp};

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}
