// const withImages = require('next-images')
// module.exports = withImages()

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })
  
// module.exports = withBundleAnalyzer({ })

const isProd = process.env.RUN_ENV === 'production'
module.exports = {
	images: {
    	domains: ['s1.xrpnft.com'],
  	},
    poweredByHeader: false,
    assetPrefix: isProd ? 'https://xrpnft.com' : '',
}
