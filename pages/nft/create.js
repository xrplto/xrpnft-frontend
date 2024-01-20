// Material
import { Box, Container, styled, Toolbar } from '@mui/material';

// Components
import Header from 'src/components/Header';
import Minting from 'src/minting';
import ScrollToTop from 'src/components/ScrollToTop';
import Footer from 'src/components/Footer';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
      // overflow: hidden;
      flex: 1;
`
);

export default function Overview({ data }) {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="sm">
                <Minting />
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
    ogp.canonical = 'https://xrpnft.com/nft/create';
    ogp.title = 'Create';
    ogp.url = 'https://xrpnft.com/nft/create';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc =
        "XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.";

    ret = { ogp };

    return {
        props: ret // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        // revalidate: 10, // In seconds
    };
}
