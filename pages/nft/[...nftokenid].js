import axios from 'axios'
import dynamic from 'next/dynamic';
import { performance } from 'perf_hooks';

// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Utils
import { getImgUrl } from 'src/utils/parse';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import TokenDetail from 'src/detail';
import ScrollToTop from 'src/components/ScrollToTop';

// const DynamicTokenDetail = dynamic(() => import('src/detail'));

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

        const params = ctx.params.nftokenid;

        const NFTokenID = params[0];

        var t1 = performance.now();

        // Self: true  https://api.xrpnft.com/api/nft/00081388A47691FB124F91B5FF0F5246AED2B5275385689F9494918200001FE8
        // Self: false https://api.xrpnft.com/api/nft/00081388C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D5048B654B00000070
        const res = await axios.get(`${BASE_URL}/nft/${NFTokenID}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`2. getServerSideProps NFTokenID: ${NFTokenID} took: ${dt}ms`);
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
            NFTokenID,
            meta,
            dfile,
            collection
        } = nft;

        const name = meta?.name || "No Name";
        const description = meta?.description;
        const cname = collection || "";

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/nft/${NFTokenID}`;
        ogp.title = cname?`${name} - ${cname}`:`${name}`;
        ogp.url = `https://xrpnft.com/nft/${NFTokenID}`;
        ogp.imgUrl = getImgUrl(NFTokenID, meta, dfile, 48);
        ogp.desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;
        ogp.isVideo = meta?.video?true:false;

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
