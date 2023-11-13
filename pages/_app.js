import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import "./zMain.css";

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';

// Head component for managing document head
function CustomHead({ ogp }) {
    const faviconSizes = ["16x16", "32x32", "96x96"];
    const ogType = ogp.isVideo ? "video" : "image";
    return (
        <Head>
            {/* Common meta tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="google-site-verification" content="dDLV5BZHngydfQXYGuUX34wnShMPqM-f5dHS2BRVdsQ" />

            {/* Favicon links */}
            {faviconSizes.map(size => (
                <link key={size} rel="icon" type="image/png" sizes={size} href={`/favicon-${size}.png`} />
            ))}
            <link rel="apple-touch-icon" sizes="192x192" href="/icons/apple-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />

            <meta name="msapplication-TileColor" content="#121619" />
            <meta name="theme-color" content="#ffffff"/>

            <link rel="canonical" href={ogp.canonical}/>

            {/* SEO Meta Tags */}
            <title>{ogp.title} | XRPNFT</title>
            <meta name="description" content={ogp.desc}/>

            {/* Open Graph / Facebook Meta Tags */}
            <meta property="og:url" content={ogp.url}/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content={`${ogp.title} | XRPNFT`}/>
            <meta property="og:description" content={ogp.desc}/>
            <meta property={`og:${ogType}`} content={ogp.imgUrl}/>

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta property="twitter:domain" content="xrpnft.com"/>
            <meta property="twitter:url" content={ogp.url}/>
            <meta name="twitter:title" content={`${ogp.title} | XRPNFT`}/>
            <meta name="twitter:description" content={ogp.desc}/>
            <meta name={`twitter:${ogType}`} content={ogp.imgUrl}/>
            <meta name={`twitter:${ogType}:src`} content={ogp.imgUrl}/>
        </Head>
    );
}

function XRPNFTApp({ Component, pageProps }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();
    const ogp = pageProps.ogp || {};
    const data = pageProps.data;

    return (
        <>
            <CustomHead ogp={ogp} />
            <ContextProvider data={data} openSnackbar={openSnackbar}>
                <ThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <CssBaseline />
                        <Component {...pageProps} />
                        <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
                    </SnackbarProvider>
                </ThemeProvider>
            </ContextProvider>
        </>
    );
}

export default XRPNFTApp;
