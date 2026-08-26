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
	'permanent': coalesce(permanent, false)
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
			// `useCdn: false`: redirects are baked in at build time, so reading a
			// stale edge cache here means shipping stale redirects until the next
			// deploy. Correctness beats the few ms.
			const rows: Array<{
				source: string
				destination: string | null
				permanent: boolean
			}> = await client.withConfig({ useCdn: false }).fetch(REDIRECTS_QUERY)

			// An internal redirect whose target page is unset or unpublished
			// projects to a null destination. Next drops those from the routes
			// manifest without a word, so the editor just gets a 404 and no clue
			// why — name them at build time instead.
			const incomplete = rows.filter((r) => !r.destination)
			if (incomplete.length) {
				console.warn(
					`[next.config] Ignoring ${incomplete.length} redirect(s) with no destination — check the target page is set and published: ${incomplete
						.map((r) => r.source)
						.join(', ')}`,
				)
			}

			sanityRedirects = rows.filter(
				(r): r is (typeof staticRedirects)[number] => !!r.destination,
			)
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
