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
import TokenDetail from 'src/detail';
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
                    opacity: `${darkMode?0.8:0.7}`
                }}
            />

            <Header />

            <Container maxWidth="lg">
                <TokenDetail token={data.token}/>
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

        // https://api.xrpnft.com/api/token/4a23c44e703944909b29b53f5e94a44b
        const res = await axios.get(`${BASE_URL}/token/${uuid}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`2. getServerSideProps uuid: ${uuid} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }
    let ret = {};
    if (data && data.token) {
        /*{
            "res": "success",
            "took": "1.09",
            "token": {
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
        
        const token = data.token;
        const {
            name,
            image,
            uuid,
            description,
            collection
        } = token;

        /*const ogp = {};
        ogp.canonical = 'https://xrpnft.com';
        ogp.title = 'XRPNFT, the largest XRPL NFT marketplace';
        ogp.url = 'https://xrpnft.com/';
        ogp.imgUrl = 'https://xrpnft.com/ogp.png';
        ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

        ret = {data, ogp};*/

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/token/${uuid}`;
        ogp.title = `${name} - XRPNFT, the largest XRPL NFT marketplace`;
        ogp.url = `https://xrpnft.com/token/${uuid}`;
        ogp.imgUrl = `https://gateway.xrpnft.com/ipfs/${image}`;
        ogp.desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;

        ret = {data, ogp};
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
