import axios from 'axios';
import { performance } from 'perf_hooks';

// Material
import { Box, Container, styled, Toolbar } from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import Account from 'src/account';
import ScrollToTop from 'src/components/ScrollToTop';

// Import the getHashIcon function
import { getHashIcon } from 'src/utils/parse';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        display: flex;
        flex-direction: column;
        min-height: 100vh;
`
);

const MainContent = styled(Box)(
    ({ theme }) => `
        flex: 1;
        display: flex;
        flex-direction: column;
`
);

export default function Overview({ data }) {
    const { darkMode } = useContext(AppContext);

    const profile = data.profile;

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <MainContent>
                <Container maxWidth="xxl">
                    <Account
                        profile={profile}
                        tab={data.tab}
                        limit={data.limit}
                        collection={data.collection}
                        type={data.type}
                    />
                </Container>

                <ScrollToTop />
            </MainContent>

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

        // console.log(`3. getServerSideProps(profile) account: ${acct} took: ${dt}ms`);
    } catch (e) {
        console.log(e);
    }

    if (data && data.profile) {
    } else {
        data = {};
        data.profile = { account: acct };
    }

    if (tab) data.tab = tab;

    if (tab?.includes('collection')) {
        data.collection = params[2];
        data.type = tab.replace('collection', '').toLowerCase();
    }
    data.limit = process.env.ITEMS_PER_PAGE;

    const { account, name, logo, banner, description } = data.profile;

    const imgUrl = banner
        ? `https://s1.xrpnft.com/profile/${banner}`
        : 'https://xrpnft.com/static/ogp.png';

    let ogp = {};
    ogp.canonical = `https://xrpnft.com/account/${account}`;
    ogp.title = name || account;
    ogp.url = `https://xrpnft.com/account/${account}`;
    ogp.imgUrl = imgUrl;
    ogp.desc = description ? description : `XRP Ledger Wallet ${account}`;

    return {
        props: { data, ogp } // will be passed to the page component as props
    };
}
