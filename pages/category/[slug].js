// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Utils
import { CATEGORIES } from 'src/utils/constants';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import CategoryCollections from 'src/collection/CategoryCollections';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
        flex: 1;
`
);

export default function Overview({category}) {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="lg">
                <CategoryCollections category={category} />
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

function getCategory(slug) {
    if (!slug) return null;
    for (const cat of CATEGORIES) {
        if (cat.slug === slug)
            return cat.title;
    }
    return null;
}

export async function getServerSideProps(ctx) {
    const slug = ctx.params?.slug;
    const category = getCategory(slug);

    if (category) {
        const ogp = {};
        ogp.canonical = 'https://xrpnft.com';
        ogp.title = 'XRP NFT Marketplace, Buy, Sell & Collect NFTs';
        ogp.url = 'https://xrpnft.com/';
        ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
        ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

        return {
            props: {category, ogp}, // will be passed to the page component as props
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/404'
            }
        }
    }
}
