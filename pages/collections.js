// Material
import {
    styled,
    Box,
    Container,
    Toolbar
} from '@mui/material';

// Components
import MyCollections from 'src/collection/MyCollections';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

export default function Overview() {

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="lg">
                <MyCollections />
            </Container>

            <ScrollToTop />

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
    ogp.title = 'My Collections';
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
