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
import Congrats from 'src/congrats';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import XAppBar from 'src/components/XAppBar';

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

            <XAppBar />

            <Container maxWidth="lg">
                <Congrats data={data} />
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getServerSideProps(ctx) {
    const BASE_URL = 'http://65.109.54.46/api';

    let data = null;
    let isImportCollection = false;
    let isEditCollection = false;
    let isBuyAssets = false;
    let isBurnNft = false;
    let isMintNft = false;
    try {

        const params = ctx.params.uuid;

        let type = params[0];
        const uuid = params[1];

        isImportCollection = type === 'importcollection';
        isEditCollection = type === 'editcollection';
        isBuyAssets = type === 'buyassets';
        isBurnNft = type === 'burnnft';
        isMintNft = type === 'assets';
        if (type !== 'collection' && type !== 'assets' && type !== 'buyassets' && type !== 'burnnft' && type !=='editcollection' && type !=='importcollection') {
            return {
                redirect: {
                    permanent: false,
                    destination: '/404'
                }
            }
        }

        if (isImportCollection) type = 'collection';
        if (isEditCollection) type = 'collection';
        if (isBuyAssets) type = 'assets';
        if (isBurnNft) type = 'assets';

        var t1 = performance.now();

        // https://api.xrpnft.com/api/assets/4a23c44e703944909b29b53f5e94a44b
        const res = await axios.get(`${BASE_URL}/${type}/${uuid}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`2. getServerSideProps uuid: ${uuid} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }

    if (data && data.nft) {

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
            NFTokenID,
            URI
        } = data.nft;

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/nft/${NFTokenID}`;
        ogp.title = `${name} - XRP NFT Marketplace, Buy, Sell & Collect NFTs`;
        ogp.url = `https://xrpnft.com/nft/${NFTokenID}`;
        ogp.imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
        ogp.desc = meta.description?meta.description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;
        ogp.isVideo = meta.video?true:false;

        data.isBuyAssets = isBuyAssets;
        data.isBurnNft = isBurnNft;
        data.isMintNft = isMintNft;

        return {
            props: {data, ogp}, // will be passed to the page component as props
        }
    } else if (data && data.collection) {
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

        data.isEditCollection = isEditCollection;
        data.isImportCollection = isImportCollection;
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