import axios from 'axios'
import { performance } from 'perf_hooks';

// Material
import {
    Box,
    Container,
    styled,
    Toolbar
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Account from 'src/account';
import ScrollToTop from 'src/components/ScrollToTop';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

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
    const { darkMode } = useContext(AppContext);

    const {
        name,
        description,
        logo,
        banner,
        timestamp
    } = data.profile;

    let default_banner = darkMode?'/static/account_banner_black.png':'/static/account_banner_white.png';

    const bannerImage = banner?`https://s1.xrpnft.com/profile/${banner}`:default_banner;

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
                        alt=''
                        src={bannerImage}
                        decoding="async"
                    />
                </div>
            </BannerWrapper>

            <Container maxWidth="xl">
                <Account profile={data.profile} tab={data.tab} />
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getServerSideProps(ctx) {
    const BASE_URL = 'http://65.109.54.46/api';

    let data = {};
    const params = ctx.params.acct;
    const acct = params[0];
    const tab = params[1];

    try {
        var t1 = performance.now();

        // https://api.xrpnft.com/api/account/profile/rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n
        const res = await axios.get(`${BASE_URL}/account/profile/${acct}`);

        data = res.data;

        var t2 = performance.now();
        var dt = (t2 - t1).toFixed(2);

        console.log(`3. getServerSideProps(profile) account: ${acct} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }

    if (data && data.profile) {
        /*{
            "result": "success",
            "took": "7.45",
            "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
            "profile": {
                "_id": "633c43f5436e94e30e6f21ae",
                "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
                "timestamp": 1664894197862
            }
        } */
        
        const {
            account,
            name,
            logo,
            banner,
            description
        } = data.profile;

        const imgUrl = banner?`https://s1.xrpnft.com/profile/${banner}`:'https://xrpnft.com/static/ogp.png';

        let ogp = {};
        ogp.canonical = `https://xrpnft.com/account/${account}`;
        ogp.title = name || account;
        ogp.url = `https://xrpnft.com/account/${account}`;
        ogp.imgUrl = imgUrl;
        ogp.desc = description?description:`A next generation NFT marketplace on the XRP ledger. Create, buy, sell, and auctions NFTs on the XRP blockchain without any barriers.`;

        if (tab)
            data.tab = tab;

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
