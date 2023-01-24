import axios from 'axios'
import { performance } from 'perf_hooks';

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
import Collection from 'src/collection';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        // overflow: hidden;
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

export default function Overview({data}) {
    // "collection": {
    //     "_id": "6310c27cf81fe46884ef89ba",
    //     "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "name": "collection1",
    //     "slug": "collection-1",
    //     "description": "",
    //     "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
    //     "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
    //     "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
    //     "timestamp": 1662042748016,
    //     "creator": "xrpnft.com",
    //     "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
    // }
    const {
        name,
        slug,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp
    } = data.collection;

    const bannerImgUrl = bannerImage?`https://s1.xrpnft.com/collection/${bannerImage}`:'/static/collection_banner.png';

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <BannerWrapper>
                <div style={{
                    height: 0,
                    paddingBottom: '25%',
                }}
                >
                    <BannerImage
                        alt={name}
                        src={bannerImgUrl}
                        decoding="async"
                    />
                </div>
            </BannerWrapper>

            <Container maxWidth="xxl">
                <Collection data={data}/>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getServerSideProps(ctx) {
    const BASE_URL = 'http://65.109.54.46/api';

    let data = null;
    try {

        const slug = ctx.params.slug;

        var t1 = performance.now();

        // https://api.xrpnft.com/api/collection/test1
        const res = await axios.get(`${BASE_URL}/collection/getextra/${slug}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`3. getServerSideProps(collection) slug: ${slug} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }

    if (data && data.collection) {
        /*{
            "result": "success",
            "took": "1.02",
            "slug": "collection-1",
            "collection": {
                "_id": "6310c27cf81fe46884ef89ba",
                "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
                "name": "collection1",
                "slug": "collection-1",
                "description": "",
                "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
                "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
                "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
                "timestamp": 1662042748016,
                "creator": "xrpnft.com",
                "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
            }
        } */

        const {
            name,
            featuredImage,
            logoImage,
            bannerImage,
            slug,
            uuid,
            description
        } = data.collection;

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/collection/${slug}`;
        ogp.title = `${name} - Collection`;
        ogp.url = `https://xrpnft.com/collection/${slug}`;
        ogp.imgUrl = `https://s1.xrpnft.com/collection/${bannerImage}`;
        ogp.desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;

        return {
            props: {data, ogp}, // will be passed to the page component as props
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
