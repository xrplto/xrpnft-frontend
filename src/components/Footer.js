import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
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

// Utils
import { CATEGORIES } from 'src/utils/constants';
import { fIntNumber } from 'src/utils/formatNumber';

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

export default function Footer() {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { darkMode, accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    // const accountToken = accountProfile?.token;

    const [categories, setCategories] = useState(CATEGORIES);

    useEffect(() => {
        function getFooterInfo() {
            const body = {cats: CATEGORIES}
            axios.post(`${BASE_URL}/info/footer`, body)
                .then(res => {
                    const data = res?.data;
                    const categories = data?.categories;
                    if (categories) {
                        setCategories(categories);
                    }
                }).catch(err => {
                    console.log("Error on getting footer info!!!", err);
                }).then(function () {
                    // always executed
                });
        }
        getFooterInfo();

        // const timer = setInterval(() => getFooterInfo(), 5000);
        // return () => {
        //     clearInterval(timer);
        // }
    }, []);

    const img_dark = "/logo/xrpnft-logo-black.svg";
    const img_light = "/logo/xrpnft-logo-white.svg";

    const img = darkMode?img_light:img_dark;
    return (
        <FooterWrapper>
            <Container maxWidth="xxl" sx={{ mt: 8, mb: 8 }}>
                <Grid container sx={{pl:3}}>
                    <Grid item xs={12} md={5} lg={5} sx={{ mt: 3 }}>
                        <Link
                            href="/"
                            sx={{ pl: 0, pr: 0, py: 3, display: 'inline-flex' }}
                            underline="none"
                            rel="noreferrer noopener nofollow"
                        >
                            <Box component="img" src={img} sx={{ height: 48 }} />
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
                                        href="/explore"
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>All XRPL NFTs</Typography>
                                    </Link>
                                    {categories.map((cat, idx) => {
                                        const title = cat.title;
                                        const slug = cat.slug;
                                       // const count = cat.count;
                                        if (!title || title === 'NONE') return;

                                        return (
                                            <Link
                                                key={slug + "" + idx}
                                                href={`/category/${slug}`}
                                                sx={{ mt: 1.5, display: 'inline-flex' }}
                                                underline="none"
                                                // target="_blank"
                                                // rel="noreferrer noopener nofollow"
                                            >
                                           {/**      {count > 0 ?
                                                    <Typography variant='link'>{title} ({fIntNumber(count)})</Typography>
                                                    :
                                                    */}
                                                    <Typography variant='link'>{title}</Typography>
                                         
                                            </Link>
                                        )
                                    })}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} sm={6} md={3} lg={3} sx={{ mt: 3 }}>
                                <Stack>
                                    <Typography variant='h6'>My Account</Typography>
                                    <Link
                                        href={account?`/account/${account}`:''}
                                        sx={{ mt: 2, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Profile</Typography>
                                    </Link>
                                    <Link
                                        href="/status/coming-soon"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Favorites</Typography>
                                    </Link>
                                    <Link
                                        href="/rankings/watchlist"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Watchlist</Typography>
                                    </Link>
                                    <Link
                                        href="/my-collections"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>My Collections</Typography>
                                    </Link>
                                    <Link
                                        href="/setting"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
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
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Platform Status</Typography>
                                    </Link>
                                    <Link
                                        href="/partners"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Partners</Typography>
                                    </Link>
                                    <Link
                                        href="/buy-crypto"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Buy XRP</Typography>
                                    </Link>
                                    <Link
                                        href="/blog"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Blog</Typography>
                                    </Link>
                                    <Link
                                        href="/discord"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
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
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Twitter</Typography>
                                    </Link>
                                    <Link
                                        href="https://www.facebook.com/xrpnft/"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Facebook</Typography>
                                    </Link>
                                    <Link
                                        href="https://www.instagram.com/xrpnftdotcom"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Instagram</Typography>
                                    </Link>
                                    <Link
                                        href="https://xrpnft.com/discord"
                                        sx={{ mt: 1.5, display: 'inline-flex' }}
                                        underline="none"
                                        // target="_blank"
                                        // rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant='link'>Interactive Chat</Typography>
                                    </Link>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography textAlign="left" variant="subtitle1">
                            &copy; 2023 XRPNFT.com. All rights reserved
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
