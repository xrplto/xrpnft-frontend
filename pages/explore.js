import axios from 'axios'
import { performance } from 'perf_hooks';

// Material
import {
    Box,
    Container,
    Grid,
    styled,
    Toolbar
} from '@mui/material';

// Components
import ExploreNFT from 'src/explore';
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
        background-repeat: repeat-y;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.9;
        z-index: -1;
        filter: blur(0px);
`
);

function generateRandom(maxLimit = 10){
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);

    return rand;
}

export default function Overview({data}) {
    const bgIdx = generateRandom();
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            {/* <BackgroundWrapper
                style={{
                    backgroundImage: `url("/static/fractal/${bgIdx}.png")`
                }}
            /> */}

            <Header />

            <Container maxWidth="lg">
                <ExploreNFT data={data}/>
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
    const BASE_URL = 'http://95.217.113.244:3000/api';
    // https://api.xrpnft.com/api/nfts?page=0&limit=30&flag=1&status=1&self=false
    let data = null;
    try {
        var t1 = performance.now();

        const res = await axios.get(`${BASE_URL}/nfts?page=0&limit=30&flag=1&status=3&self=false`);

        data = res.data;

        const time = Date.now();
        // for (var token of data.tokens) {
        //     token.bearbull = token.pro24h < 0 ? -1:1;
        //     token.time = time;
        // }

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`1. getStaticProps took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }
    let ret = {};
    if (data) {
        const ogp = {};
        ogp.canonical = 'https://xrpnft.com';
        ogp.title = 'XRPNFT, the largest XRPL NFT marketplace';
        ogp.url = 'https://xrpnft.com/';
        ogp.imgUrl = 'https://xrpnft.com/ogp.png';
        ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

        ret = {data, ogp};
    }

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}
