import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Preconnect to Google Fonts for performance improvement */}
                    <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    
                    {/* Combined Google Fonts link for optimized loading */}
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400&display=swap"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
