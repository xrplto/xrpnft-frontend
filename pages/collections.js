// Material
import { styled, Box } from '@mui/material';

// Components
import AllCollections from 'src/collection/AllCollections';
import ScrollToTop from 'src/components/ScrollToTop';
import Layout from 'src/components/Layout';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
`
);

export default function CollectionsPage() {
    return (
        <Layout>
            <OverviewWrapper>
                <AllCollections />
                <ScrollToTop />
            </OverviewWrapper>
        </Layout>
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
