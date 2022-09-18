// import axios from 'axios'
// import { performance } from 'perf_hooks';

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

// Components
import BulkMint from 'src/bulk/mint';
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
        background-color: rgb(32, 34, 37);
        background-position: center center;
        z-index: -1;
        filter: blur(0px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

function generateRandom(maxLimit = 10){
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);

    return rand;
}

export default function Overview({data}) {
    const bgIdx = generateRandom();
    const { darkMode } = useContext(AppContext);

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url("/static/fractal/${bgIdx}.png")`,
                    opacity: `${darkMode?0.1:0.2}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <BulkMint slug={data.slug}/>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getServerSideProps(ctx) {
    // const BASE_URL = 'https://api.xrpnft.com/api';

    const slug = ctx.params.slug;

    // let data = null;
    // try {

    //     const uuid = ctx.params.uuid;

    //     var t1 = performance.now();

    //     // https://api.xrpnft.com/api/bulk/get/9cbd9b0d508c403cbe6dde012e146a1b
    //     const res = await axios.get(`${BASE_URL}/bulk/get/${uuid}`);

    //     data = res.data;

    //     var t2 = performance.now();
    //     var dt = (t2 - t1).toFixed(2);

    //     console.log(`getStaticProps(bulk/mint) uuid: ${uuid} took: ${dt}ms`);
    // } catch (e) {
    //     console.log(e);
    // }

    let ret = {};
    // if (data && data.bulk) {
    //     const ogp = {};
    //     ogp.canonical = 'https://xrpnft.com';
    //     ogp.title = 'Bulk Mint Items';
    //     ogp.url = 'https://xrpnft.com/';
    //     ogp.imgUrl = 'https://xrpnft.com/ogp.png';
    //     ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';
    //     ret = {ogp, data};
    // }

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'Bulk Mint Items';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/ogp.png';
    ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';
    ret = {ogp, data: {slug}};

    return {
        props: ret, // will be passed to the page component as props
    }
}
