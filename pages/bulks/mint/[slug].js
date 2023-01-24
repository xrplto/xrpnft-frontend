// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import BulkMint from 'src/bulks/mint';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

export default function Overview({data}) {

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

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

    //     // https://api.xrpnft.com/api/bulks/get/9cbd9b0d508c403cbe6dde012e146a1b
    //     const res = await axios.get(`${BASE_URL}/bulks/get/${uuid}`);

    //     data = res.data;

    //     var t2 = performance.now();
    //     var dt = (t2 - t1).toFixed(2);

    //     console.log(`getStaticProps(bulks/mint) uuid: ${uuid} took: ${dt}ms`);
    // } catch (e) {
    //     console.log(e);
    // }

    let ret = {};
    // if (data && data.bulk) {
    //     const ogp = {};
    //     ogp.canonical = 'https://xrpnft.com';
    //     ogp.title = 'Bulk Mint Items';
    //     ogp.url = 'https://xrpnft.com/';
    //     ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    //     ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';
    //     ret = {ogp, data};
    // }

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'Bulk Mint Items';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';
    ret = {ogp, data: {slug}};

    return {
        props: ret, // will be passed to the page component as props
    }
}
