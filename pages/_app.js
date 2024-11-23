import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from 'src/AppContext';
import './zMain.css';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import FloatingFooter from 'src/components/FloatingFooter';

function XRPNFTApp(props) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const { Component, pageProps } = props;

    const ogp = pageProps.ogp || {};
    const data = pageProps.data;

    // Simplified title and description
    const title = ogp.title
        ? `${ogp.title} `
        : 'XRPNFT - XRP NFT Marketplace';
    const description =
        ogp.desc ||
        'Buy, sell, and trade NFTs on the XRP Ledger. XRPNFT is the leading marketplace for XRP NFTs.';
    const imageUrl = ogp.imgUrl || 'https://xrpnft.com/default-og-image.jpg';
    const canonicalUrl = ogp.canonical || 'https://xrpnft.com';

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                {/* Essential Meta Tags */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />

                {/* Favicon */}
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="192x192"
                    href="/icons/apple-icon.png"
                />
                <link rel="manifest" href="/site.webmanifest" />

                {/* Optional video OG tag */}
                {ogp.videoUrl && (
                    <meta property="og:video" content={ogp.videoUrl} />
                )}
            </Head>
            <ContextProvider data={data} openSnackbar={openSnackbar}>
                <ThemeProvider>
                    <SnackbarProvider maxSnack={3}>
                        <CssBaseline />
                        <Component {...pageProps} />
                        <XSnackbar
                            isOpen={isOpen}
                            message={msg}
                            variant={variant}
                            close={closeSnackbar}
                        />
                        <FloatingFooter />
                    </SnackbarProvider>
                </ThemeProvider>
            </ContextProvider>
        </>
    );
}

export default XRPNFTApp;
