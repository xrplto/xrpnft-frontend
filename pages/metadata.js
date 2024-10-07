import JSONPretty from 'react-json-pretty';

// Material
import {
    styled,
    useTheme,
    Box,
    Container,
    Stack,
    Typography,
    Toolbar,
    alpha
} from '@mui/material';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
        background-color: ${alpha(theme.palette.background.default, 0.9)};
`
);

const StyledJSONPretty = styled(JSONPretty)(
    ({ theme }) => `
        background-color: ${alpha(theme.palette.background.paper, 0.1)} !important;
        padding: ${theme.spacing(2)} !important;
        border-radius: ${theme.shape.borderRadius}px !important;
        border: 1px solid ${alpha(theme.palette.primary.main, 0.1)} !important;
        
        .json-pretty {
            line-height: 1.3;
            color: ${theme.palette.text.primary};
            background: transparent;
        }
        
        .json-key {
            color: ${theme.palette.primary.main};
        }
        
        .json-value {
            color: ${theme.palette.secondary.main};
        }
        
        .json-string {
            color: ${theme.palette.success.main};
        }
        
        .json-boolean {
            color: ${theme.palette.warning.main};
        }
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
    const theme = useTheme();

    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="lg">
                <Stack spacing={1} sx={{mt: 4, mb:3}}>
                    <Typography variant="h1a" color="primary.main">Metadata structure</Typography>
                    <Typography variant="d1">
                        <Typography variant="s4" color="error.main">xrpnft.com.v0</Typography> based on XLS-24d
                    </Typography>
                </Stack>
                <Box sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    borderRadius: theme.shape.borderRadius,
                    p: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                    <StyledJSONPretty id="json-pretty" data={meta || ''} space="4" />
                </Box>
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
    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com/metadata';
    ogp.title = 'XRP NFT Marketplace, Buy, Sell & Collect NFTs';
    ogp.url = 'https://xrpnft.com/metadata';
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
