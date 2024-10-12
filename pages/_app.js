import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import "./zMain.css";

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import FloatingFooter from 'src/components/FloatingFooter';

function XRPNFTApp(props) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { Component, pageProps } = props;

    const ogp = pageProps.ogp || {};
    const data = pageProps.data;

    // Ensure title and description are always set
    const title = ogp.title ? `${ogp.title} | XRPNFT` : 'XRPNFT - XRP NFT Marketplace';
    const description = ogp.desc || 'Discover and trade unique NFTs on the XRP Ledger with XRPNFT, the premier marketplace for digital collectibles.';

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta name="google-site-verification" content="dDLV5BZHngydfQXYGuUX34wnShMPqM-f5dHS2BRVdsQ" />

                <link rel="apple-touch-icon" sizes="192x192" href="/icons/apple-icon.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

                <link rel="manifest" href="/site.webmanifest" />
                <meta name="msapplication-TileColor" content="#121619" />
                <meta name="theme-color" content="#ffffff"/>

                <link rel="canonical" href={ogp.canonical || 'https://xrpnft.com'}/>

                {/* <!-- HTML Meta Tags --> */}
                <title>{title}</title>
                <meta name="description" content={description}/>

                {/* <!-- Open Graph / Facebook Meta Tags --> */}
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={ogp.url || 'https://xrpnft.com'}/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content={description}/>
                <meta property="og:image" content={ogp.imgUrl || 'https://xrpnft.com/default-og-image.jpg'}/>  
                {ogp.videoUrl && <meta property="og:video" content={ogp.videoUrl}/>}

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image"/>
                <meta property="twitter:domain" content="xrpnft.com"/>
                <meta property="twitter:url" content={ogp.url || 'https://xrpnft.com'}/>
                <meta name="twitter:title" content={title}/>
                <meta name="twitter:description" content={description}/>
                <meta name="twitter:image" content={ogp.imgUrl || 'https://xrpnft.com/default-og-image.jpg'}/>  

                {/* Additional SEO meta tags */}
                <meta name="keywords" content="XRP, NFT, marketplace, digital collectibles, blockchain, cryptocurrency"/>
                <meta name="author" content="XRPNFT"/>
                <meta name="robots" content="index, follow"/>
            </Head>
            <ContextProvider data={data} openSnackbar={openSnackbar}>
                <ThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <CssBaseline />
                        <Component {...pageProps} />
                        <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
                        <FloatingFooter />
                    </SnackbarProvider>
                </ThemeProvider>
            </ContextProvider>
        </>
    );
}

export default XRPNFTApp;
