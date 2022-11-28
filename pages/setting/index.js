// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Components
import EditProfile from 'src/account/setting';
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

            <Container maxWidth="sm">
                <EditProfile />
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
    const BASE_URL = 'http://65.109.54.46/api';

    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'XRP NFT Marketplace, Buy, Sell & Collect NFTs';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = 'A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.';

    ret = {ogp};

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}

// export async function getServerSideProps(ctx) {
//     const BASE_URL = 'http://65.109.54.46/api';

//     let data = null;
//     try {

//         const acct = ctx.params.acct;

//         var t1 = performance.now();

//         // https://api.xrpnft.com/api/account/profile/rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n
//         const res = await axios.get(`${BASE_URL}/account/profile/${acct}`);

//         data = res.data;

//         var t2 = performance.now();
//         var dt = (t2 - t1).toFixed(2);

//         console.log(`3. getServerSideProps(profile) account: ${acct} took: ${dt}ms`);
//     } catch (e) {
//         console.log(e);
//     }

//     if (data && data.profile) {
//         /*{
//             "result": "success",
//             "took": "7.45",
//             "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
//             "profile": {
//                 "_id": "633c43f5436e94e30e6f21ae",
//                 "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
//                 "timestamp": 1664894197862
//             }
//         } */
        
//         const {
//             account,
//             name,
//             logo,
//             banner,
//             description
//         } = data.profile;

//         const imgUrl = banner?`https://s1.xrpnft.com/profile/${banner}`:'https://xrpnft.com/static/ogp.png';

//         let ogp = {};
//         ogp.canonical = `https://xrpnft.com/account/${account}`;
//         ogp.title = name || account;
//         ogp.url = `https://xrpnft.com/account/${account}`;
//         ogp.imgUrl = imgUrl;
//         ogp.desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;

//         return {
//             props: {data, ogp}, // will be passed to the page component as props
//         }
//     } else {
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: '/404'
//             }
//         }
//     }
// }
