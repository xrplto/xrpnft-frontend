const withImages = require('next-images');
module.exports = withImages();

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer({ })

const isProd = process.env.RUN_ENV === 'production';

module.exports = {
  images: {
    domains: ['s1.xrpnft.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  // assetPrefix: isProd ? 'https://xrpnft.com' : '',
  staticPageGenerationTimeout: 1200000
};
