import { LazyLoadImage } from 'react-lazy-load-image-component';

// Material
import {
    alpha,
    Box,
    Container,
    Grid,
    Link,
    Stack,
    styled,
    Typography
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// const FooterWrapper = styled(Container)(
//     ({ theme }) => `
//         margin-top: ${theme.spacing(4)};
// `
// );

const FooterWrapper = styled(Box)(
    ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: auto;
    margin-bottom: ${theme.spacing(0)};
    // position: relative;
    // bottom: 0;
`
);

function Footer() {
    const { darkMode } = useContext(AppContext);

    const img_dark = "/logo/logo-dark.svg";
    const img_light = "/logo/logo-light.svg";
    
    const img = darkMode?img_light:img_dark;
    return (
        <FooterWrapper>
            <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
                <Grid container sx={{ml:5}}>
                    <Grid item xs={12} md={5} lg={5} sx={{ mt: 3 }}>
                        <Link
                            href="/"
                            sx={{ pl: 0, pr: 0, py: 3, display: 'inline-flex' }}
                            underline="none"
                            rel="noreferrer noopener nofollow"
                        >
                            <Box component="img" src={img} sx={{ height: 72 }} />
                            {/* <LazyLoadImage
                                src={img}
                                height={64}
                            /> */}
                        </Link>
                    </Grid>
                    
                    <Grid item xs={12} md={7} lg={7} sx={{ mt: 3 }}>
                        <Grid container>
                            <Grid item xs={6} sm={6} md={3} lg={3} sx={{ mt: 3 }}>
                                <Stack>
                                    <Typography variant='h6'>Marketplace</Typography>
                                    <Link
                                        href="/assets"
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>All NFTs</Typography>
                                    </Link>
                                    <Link
                                        href="/category/art"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Art</Typography>
                                    </Link>
                                    <Link
                                        href="/category/collectables"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Collectables</Typography>
                                    </Link>
                                    <Link
                                        href="/category/domain-names"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Domain Name</Typography>
                                    </Link>
                                    <Link
                                        href="/category/music"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Music</Typography>
                                    </Link>
                                    <Link
                                        href="/category/photography"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Photography</Typography>
                                    </Link>
                                    <Link
                                        href="/category/sports"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Sports</Typography>
                                    </Link>
                                    <Link
                                        href="/category/trading-cards"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Trading Cards</Typography>
                                    </Link>
                                    <Link
                                        href="/category/utility"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Utility</Typography>
                                    </Link>
                                    <Link
                                        href="/category/virtual-worlds"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Virtual Worlds</Typography>
                                    </Link>
                                    <Link
                                        href="/category/phygital"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Phygital</Typography>
                                    </Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3} lg={3} sx={{ mt: 3 }}>
                                <Stack>
                                    <Typography variant='h6'>My Account</Typography>
                                    <Link
                                        href="/account"
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Profile</Typography>
                                    </Link>
                                    <Link
                                        href="/status/coming-soon"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Favorites</Typography>
                                    </Link>
                                    <Link
                                        href="/rankings/watchlist"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Watchlist</Typography>
                                    </Link>
                                    <Link
                                        href="/collections"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>My Collections</Typography>
                                    </Link>
                                    <Link
                                        href="/account/settings"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Settings</Typography>
                                    </Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3} lg={3} sx={{ mt: 3 }}>
                                <Stack>
                                    <Typography variant='h6'>Resources</Typography>
                                    <Link
                                        href="/platform-status"
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Platform Status</Typography>
                                    </Link>
                                    <Link
                                        href="/partners"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Partners</Typography>
                                    </Link>
                                    <Link
                                        href="/buy-crypto"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Buy XRP</Typography>
                                    </Link>
                                    <Link
                                        href="/blog"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Blog</Typography>
                                    </Link>
                                    <Link
                                        href="/discord"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Help Center</Typography>
                                    </Link>
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3} lg={3} sx={{ mt: 3 }}>
                                <Stack>
                                    <Typography variant='h6'>Social</Typography>
                                    <Link
                                        href="https://twitter.com/XRPNFTdotcom/"
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Twitter</Typography>
                                    </Link>
                                    <Link
                                        href="https://www.facebook.com/xrpnft/"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Facebook</Typography>
                                    </Link>
                                    <Link
                                        href="https://www.instagram.com/xrpnftdotcom"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Instagram</Typography>
                                    </Link>
                                    <Link
                                        href="https://xrpnft.com/discord"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        target="_blank"
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Interactive Chat</Typography>
                                    </Link>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography textAlign="left" variant="subtitle1">
                            &copy; 2022 XRPNFT.com. All rights reserved
                            {/* <Link
                                href="https://nftlabs.to"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                sx={{ml:1}}
                            >
                                NFT Labs
                            </Link> */}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </FooterWrapper>
    );
}

export default Footer;
