// Material
import {
    styled,
    useTheme,
    Box,
    Container,
    Toolbar,
    alpha
} from '@mui/material';

// Components
import Header from 'src/components/Header';
import MyCollections from 'src/collection/MyCollections';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
        background-color: ${alpha(theme.palette.background.default, 0.9)};
`
);

const StyledContainer = styled(Container)(
    ({ theme }) => `
        background-color: ${alpha(theme.palette.background.paper, 0.1)};
        border-radius: ${theme.shape.borderRadius * 2}px;
        padding: ${theme.spacing(3)};
        box-shadow: 0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)};
        border: 1px solid ${alpha(theme.palette.primary.main, 0.1)};
`
);

export default function Overview() {
    const theme = useTheme();

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <StyledContainer maxWidth="lg">
                <MyCollections />
            </StyledContainer>

            <ScrollToTop />

        </OverviewWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com';
    ogp.title = 'My Collections';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc = "XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.";

    ret = {ogp};

    return {
        props: ret, // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        // revalidate: 10, // In seconds
    }
}
