// Material
import { Box, Container, styled, Toolbar } from '@mui/material';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import CreateCollection from 'src/collection/create';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: ${theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 100%)`};
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%);
            animation: pulse 15s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }
`
);

export default function Overview({ data }) {
    const handleCreate = (slug) => {
        window.location.href = `/congrats/collection/${data.slug}`;
    };

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Box sx={{ 
                flex: '1 0 auto', 
                py: { xs: 3, md: 6 },
                position: 'relative',
                zIndex: 1
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ 
                        maxWidth: 900, 
                        mx: 'auto',
                        animation: 'fadeInUp 0.8s ease-out',
                        '@keyframes fadeInUp': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(30px)'
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}>
                        <CreateCollection onCreate={handleCreate} />
                    </Box>
                </Container>
            </Box>

            <ScrollToTop />

            <Footer />
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
    ogp.title = 'XRP NFT Marketplace, Buy, Sell & Collect NFTs';
    ogp.url = 'https://xrpnft.com/';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc =
        "XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.";

    ret = { ogp };

    return {
        props: ret // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        // revalidate: 10, // In seconds
    };
}
