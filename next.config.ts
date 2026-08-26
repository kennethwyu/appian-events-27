import type { NextConfig } from 'next'
import { groq } from 'next-sanity'
import { sanity } from 'next-sanity/live/cache-life'
import { client } from './src/sanity/lib/client'

const REDIRECTS_QUERY = groq`*[_type == 'redirect']{
	source,
	'destination': select(
		destination.type == 'internal' =>
			select(
				destination.internal->.metadata.slug.current == 'index' => '/',
				'/' + destination.internal->.metadata.slug.current
			),
		destination.external
	),
	'permanent': true
}`

const nextConfig: NextConfig = {
	reactCompiler: true,

	cacheComponents: true,
	cacheLife: { default: sanity },

	images: {
		localPatterns: [{ pathname: '/api/og' }],
		remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
	},

	async redirects() {
		const staticRedirects = [
			{ source: '/index', destination: '/', permanent: true },
		]

		// Don't fail the build when Sanity is unreachable.
		let sanityRedirects: typeof staticRedirects = []

		try {
			sanityRedirects = await client.fetch(REDIRECTS_QUERY)
		} catch (error) {
			console.warn(
				'[next.config] Could not load redirects from Sanity; continuing with static redirects only.',
				error instanceof Error ? error.message : error,
			)
		}

		return [...staticRedirects, ...sanityRedirects]
	},
}

export default nextConfig
