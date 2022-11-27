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
import TokenDetail from 'src/detail';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

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
                <TokenDetail nft={data.nft} />
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

        const params = ctx.params.uuid;

        const uuid = params[0];

        var t1 = performance.now();

        // https://api.xrpnft.com/api/assets/f0f2513dd72042bfb46fde46c4a4d514
        const res = await axios.get(`${BASE_URL}/assets/${uuid}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`2. getServerSideProps uuid: ${uuid} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }
    let ret = {};
    const nft = data?.nft
    if (nft) {
        /*{
            "res": "success",
            "took": "1.09",
            "nft": {
                "_id": "630b722e2aa4d0244dcfc62b",
                "name": "FAT CATS - 1",
                "externalLink": "",
                "description": "",
                "collection": "",
                "Flags": 13,
                "Issuer": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
                "minter": "xrpnft.com",
                "image": "QmeBkwfxtCygbxCeZFRf8A1Qoh7vf1VoU4AxQCXCDwscUx",
                "URI": "516D6653394D70417754756F684B674E795146636939726D6348654566727874705533473976324842674837735A",
                "uuid": "4a23c44e703944909b29b53f5e94a44b",
                "minted": true,
                "TokenID": "000D000011BBE0160B08A0743C13E22918573B2AAC759E9E16E5DA9C00000001"
            }
        } */

        const {
            uuid,
            name,
            collection,
            flag,
            account,
            date,
            meta,
            URI
        } = nft;
    
        /*const ogp = {};
        ogp.canonical = 'https://xrpnft.com';
        ogp.title = 'XRPNFT, the largest XRPL NFT marketplace';
        ogp.url = 'https://xrpnft.com/';
        ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
        ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

        ret = {data, ogp};*/

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/assets/${uuid}`;
        ogp.title = `${name} - XRPNFT, the largest XRPL NFT marketplace`;
        ogp.url = `https://xrpnft.com/assets/${uuid}`;
        ogp.imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
        ogp.desc = meta.description?meta.description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;
        ogp.isVideo = meta.video?true:false;

        ret = {data, ogp};
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/404'
            }
        }
    }

    return {
        props: ret, // will be passed to the page component as props
    }
}

// This function gets called at build time
// export async function getStaticPaths() {
//     // Call an external API endpoint to get posts
//     const res = await fetch('https://.../posts')
//     const posts = await res.json()
  
//     // Get the paths we want to pre-render based on posts
//     const paths = posts.map((post) => ({
//       params: { id: post.id },
//     }))
  
//     // We'll pre-render only these paths at build time.
//     // { fallback: false } means other routes should 404.
//     return { paths, fallback: false }
// }
