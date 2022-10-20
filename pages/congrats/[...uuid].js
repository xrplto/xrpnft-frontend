import axios from 'axios'
import { performance } from 'perf_hooks';
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Box,
    Container,
    Grid,
    styled,
    Toolbar
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Congrats from 'src/congrats';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

// overflow: scroll;
// overflow: auto;
// overflow: hidden;

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        overflow: hidden;
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 100%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        z-index: -1;
        filter: blur(0px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

function generateRandom(maxLimit = 10){
    let rand = Math.random() * maxLimit;

    rand = Math.floor(rand);

    return rand;
}

export default function Overview({data}) {
    const bgIdx = generateRandom();
    const { darkMode } = useContext(AppContext);

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    backgroundImage: `url("/static/fractal/${bgIdx}.png")`,
                    opacity: `${darkMode?0.3:0.4}`
                }}
            />

            <Header />

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
    let isEditCollection = false;
    let isBuyAssets = false;
    try {

        const params = ctx.params.uuid;

        let type = params[0];
        const uuid = params[1];

        isEditCollection = type === 'editcollection';
        isBuyAssets = type === 'buyassets';
        if (type !== 'collection' && type !== 'assets' && type !== 'buyassets' && type !=='editcollection') {
            return {
                redirect: {
                    permanent: false,
                    destination: '/404'
                }
            }
        }

        if (isEditCollection) type = 'collection';
        if (isBuyAssets) type = 'assets';

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
            URI
        } = data.nft;
    
        let ogp = {};
        ogp.canonical = `https://xrpnft.com/assets/${uuid}`;
        ogp.title = `${name} - XRPNFT, the largest XRPL NFT marketplace`;
        ogp.url = `https://xrpnft.com/assets/${uuid}`;
        ogp.imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image}`;
        ogp.desc = meta.description?meta.description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;

        data.isBuyAssets = isBuyAssets;

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