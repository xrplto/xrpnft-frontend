import axios from 'axios'
import { performance } from 'perf_hooks';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { getImgUrl } from 'src/utils/parse';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import Landing from 'src/landing';
// const DynamicLanding = dynamic(() => import('src/landing'));
import ScrollToTop from 'src/components/ScrollToTop';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

export default function Overview({data}) {
    const { darkMode } = useContext(AppContext);
    // const bgFile = getRandomBG();
    const collections = data.landings;

    let collection = {};
    let nft = {};

    if (collections && collections.length > 0) {
        collection = collections[0];
        nft = collection.nft;
    }

    const {
        NFTokenID,
        meta,
        dfile
    } = nft || {};

    let imgUrl = getImgUrl(NFTokenID, meta, dfile, 300);

    if (!imgUrl || meta?.video) {
        imgUrl = `https://s1.xrpnft.com/collection/${collection?.logoImage}`;
    }

    return (
        <OverviewWrapper>
            <Head>
                {/* Basic meta tags */}
                <title>XRPNFT - Your Premier XRP NFT Platform</title>
                <meta name="description" content="Discover, buy, and sell unique NFTs on the XRP Ledger. XRPNFT is your gateway to digital collectibles on XRP." />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="XRPNFT - Your Premier XRP NFT Platform" />
                <meta property="og:description" content="Discover, buy, and sell unique NFTs on the XRP Ledger" />
                <meta property="og:image" content="https://xrpnft.com/logo/xrpnft-logo-black.svg" />
                <meta property="og:url" content="https://xrpnft.com" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="XRPNFT - Your Premier XRP NFT Platform" />
                <meta name="twitter:description" content="Discover, buy, and sell unique NFTs on the XRP Ledger" />
                <meta name="twitter:image" content="https://xrpnft.com/logo/xrpnft-logo-black.svg" />
                
                {/* Additional SEO meta tags */}
                <meta name="keywords" content="XRP, NFT, XRPL, digital collectibles, blockchain, cryptocurrency" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://xrpnft.com" />
            </Head>

            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    opacity: `${darkMode?0.2:0.3}`
                }}
            />

            <Header />

            <Container maxWidth="xl"> 
                <Landing collections={collections} />
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

    let data = null;
    try {
        var t1 = performance.now();

        const res = await axios.get(`${BASE_URL}/collection/landing`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        // console.log(`2. getStaticProps collections: ${data.collections.length} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }

    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'XRP NFT Marketplace - Buy, Sell & Collect NFTs | XRPNFT';
    ogp.url = 'https://xrpnft.com';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = 'Effortlessly buy, sell, mint, & enjoy NFTs on the XRP Ledger without barriers.';

    ret = {data, ogp};

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 seconds
        revalidate: 30, // In seconds
    }
}
