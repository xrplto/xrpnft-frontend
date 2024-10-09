// Material
import { styled, Box, Container, Toolbar } from '@mui/material';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import AllCollections from 'src/collection/AllCollections';
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

export default function Overview() {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

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
    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com/collections';
    ogp.title = 'NFT Collections on XRP Ledger | XRPNFT';
    ogp.url = 'https://xrpnft.com/collections';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = 'Explore and browse NFT collections on the XRP Ledger. Discover unique digital assets and collectibles on XRPNFT.';

    ret = { ogp };

    return {
        props: ret // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        // revalidate: 10, // In seconds
    };
}
