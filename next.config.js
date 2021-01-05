const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const baseUrl = '';

module.exports = withBundleAnalyzer({
	async redirects() {
		return [
		  {
			source: '/posts/',
			destination: '/posts/gallery/',
			permanent: true,
		  },
		]
	},
	poweredByHeader: false,
	trailingSlash: true,
	basePath: baseUrl,
	env: {
		baseUrl: baseUrl,
	},
	images: {
		domains: ['images.ctfassets.net']
	}
});