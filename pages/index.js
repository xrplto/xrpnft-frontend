import axios from 'axios'
import { performance } from 'perf_hooks';
import dynamic from 'next/dynamic';

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
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    opacity: `${darkMode?0.2:0.3}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
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
    ogp.title = 'XRPNFT An NFT Marketplace for Purchasing, Selling, and Collecting Non-Fungible Tokens';
    ogp.url = 'https://xrpnft.com';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = 'XRPNFT the best NFT marketplace on the XRP Ledger. Effortlessly create, purchase, sell, and bid on Non-Fungible Tokens on the XRP Ledger without limits.';

    ret = {data, ogp};

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 seconds
        revalidate: 30, // In seconds
    }
}
