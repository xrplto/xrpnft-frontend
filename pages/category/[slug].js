// Material
import {
    Box,
    Container,
    Grid,
    styled,
    Toolbar
} from '@mui/material';

// Utils
import { CATEGORIES } from 'src/utils/constants';

// Components
import CategoryCollections from 'src/collection/CategoryCollections';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        overflow: hidden;
        flex: 1;
`
);

const BannerWrapper = styled('div')(
    ({ theme }) => `
    position: relative;
    max-height: 320px;
    overflow: hidden;
`
);

const BannerImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
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
        ogp.title = 'XRPNFT, the largest XRPL NFT marketplace';
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
