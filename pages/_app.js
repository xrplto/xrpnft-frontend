import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import "./zMain.css";
import 'styles/globals.css'

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import ViewportProvider from 'utils/ViewportProvider';

function XRPNFTApp(props) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { Component, pageProps } = props;

    const ogp = pageProps.ogp || {};
    const data = pageProps.data;

    if (ogp.isVideo) {
        ogp.type = "video";
    } else {
        ogp.type = "image";
    }

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta name="google-site-verification" content="dDLV5BZHngydfQXYGuUX34wnShMPqM-f5dHS2BRVdsQ" />

                {/* 
                    <meta name="apple-mobile-web-app-title" content="Snippit"/>
                    <meta name="application-name" content="<APP NAME>"/>
                    <meta name="msapplication-TileColor" content="#ffc40d"/>
                    <meta name="theme-color" content="#ffffff"/>
                */}

                <link rel="apple-touch-icon" sizes="192x192" href="/icons/apple-icon.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-96x96.png" />

                <link rel="manifest" href="/site.webmanifest" />
                {/* <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#121619" /> */}
                <meta name="msapplication-TileColor" content="#121619" />
                <meta name="theme-color" content="#ffffff" />

                {/* <meta name="robots" content="nofollow"/> */}

                {/* <link rel="preload" as="image" href="/static/collection/NFT_Labs_Images4.png"/> */}

                <link rel="canonical" href={ogp.canonical} />

                {/* <!-- HTML Meta Tags --> */}
                <title>{ogp.title}</title>
                <meta name="description" content={ogp.desc} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={ogp.url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${ogp.title} | XRPNFT`} />
                <meta property="og:description" content={ogp.desc} />
                <meta property={`og:${ogp.type}`} content={ogp.imgUrl} />
                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="xrpnft.com" />
                <meta property="twitter:url" content={ogp.url} />
                <meta name="twitter:title" content={`${ogp.title} | XRPNFT`} />
                <meta name="twitter:description" content={ogp.desc} />
                {/* <!-- <meta name="twitter:image" content="/static/ogp.png"/> --> */}
                <meta name={`twitter:${ogp.type}`} content={ogp.imgUrl} />
                <meta name={`twitter:${ogp.type}:src`} content={ogp.imgUrl} />
                {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
            </Head>
            <ContextProvider data={data} openSnackbar={openSnackbar}>
                <ViewportProvider>
                    <ThemeProvider>
                        <SnackbarProvider maxSnack={3}>
                            <CssBaseline />
                            <Component {...pageProps} />
                            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
                        </SnackbarProvider>
                    </ThemeProvider>
                </ViewportProvider>
            </ContextProvider>
        </>
    );
}

export default XRPNFTApp;
