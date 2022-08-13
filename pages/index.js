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
import Landing from 'src/landing';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

// const FabStyle = styled('div')(({ theme }) => ({
//     boxShadow: 'none',
//     backdropFilter: 'blur(2px)',
//     WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
//     //backgroundColor: alpha(theme.palette.background.default, 0.9),
//     //color: alpha("#00AB88", 0.7),
//     //backgroundColor: alpha("#00AB88", 0.7),
//     backgroundColor: alpha("#9E86FF", 0.7),
//     '&:hover': {
//         backgroundColor: alpha("#9E86FF", 0.4),
//     },
// }));


const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.3;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
        overflow: hidden;
        flex: 1;
`
);

export default function Overview({data}) {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />
            <Header />

            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="stretch"
                    spacing={3}
                    sx={{mt:2}}
                >
                    <Grid item xs={12} md={12} lg={12} >
                        <Landing />
                    </Grid>
                </Grid>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

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
