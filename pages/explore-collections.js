import axios from 'axios'
import { useState, useEffect, useRef } from 'react';

// Material
import {
    styled,
    Box,
    Container,
    Toolbar
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import AllCollections from 'src/collection/AllCollections';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
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

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 100%;
        position: absolute;
        background-size: cover;
        background-color: ${theme.colors.alpha.white[100]};
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(0px);
        -webkit-mask: linear-gradient(rgb(0, 0, 0), transparent);
`
);

function generateRandom(maxLimit = 10){
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);

    return rand;
}

export default function Overview() {
    const bgIdx = generateRandom();
    const { darkMode } = useContext(AppContext);

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url("/static/fractal/${bgIdx}.png")`,
                    opacity: `${darkMode?0.2:0.3}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <AllCollections />
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
    const BASE_URL = 'http://65.109.54.46/api';

    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'Explore Collections';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
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
