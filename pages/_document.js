import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="theme-color" content="#000000" />
                    <link rel="preconnect" href="https://api.xrpnft.com" />
                    <link rel="preconnect" href="https://s1.xrpnft.com" />
                    <link rel="dns-prefetch" href="https://api.xrpnft.com" />
                    <link rel="dns-prefetch" href="https://s1.xrpnft.com" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
