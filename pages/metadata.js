import JSONPretty from 'react-json-pretty';

// Material
import {
    styled,
    Box,
    Container,
    Stack,
    Typography,
    Toolbar
} from '@mui/material';

// Components
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

const meta = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://xrpnft.com/schemas/standard.json",
    "type": "object",
    "required": [
        "schema",
        "type",
        "name",
        "description",
        "image",
    ],
    "properties": {
        "schema": {
            "type": "string",
            "format": "uri"
        },
        "nftType": {
            "type": "string",
            "pattern":'(^[a-zA-Z]+\.v[0-9]+$)'
        },
        "name": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "image": {
            "type": "string",
            "contentMediaType": "image/png",
            "format": "uri"
        },
        "animation_url": {
            "type": "string",
            "contentMediaType": "video/mp4",
            "format": "uri"
        },
        "video": {
            "type": "string",
            "contentMediaType": "video/mp4",
            "format": "uri"
        },
        "audio": {
            "type": "string",
            "contentMediaType": "audio/mpeg",
            "format": "uri"
        },
        "file": {
            "type": "string",
            "format": "uri"
        },
        "collection": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "family": {
                    "type": "string"
                }
            },
            "required": [
                "name"
            ]
        },
        "attributes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "value": {
                        "type": [
                            "string",
                            "int",
                            "float"
                        ]
                    }
                },
                "required": [
                    "name",
                    "value"
                ]
            }
        }
    }
}

export default function Overview({data}) {

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <XAppBar />

            <Container maxWidth="lg">
                <Stack spacing={1} sx={{mt: 4, mb:3}}>
                    <Typography variant="h1a">Metadata structure</Typography>
                    <Typography variant="d1"><Typography variant="s4" color="error">xrpnft.com.v0</Typography> based on XLS-24d</Typography>
                </Stack>
                <Stack>
                    <JSONPretty id="json-pretty" data={meta || ''} space="4"></JSONPretty>
                </Stack>
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
    ogp.canonical = 'https://xrpnft.com/metadata';
    ogp.title = 'XRP NFT Marketplace, Buy, Sell & Collect NFTs';
    ogp.url = 'https://xrpnft.com/metadata';
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
