import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			// Longest match wins, so /api/og stays open for link-preview crawlers.
			allow: ['/', '/api/og'],
			disallow: ['/admin', '/api/'],
		},
		sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
	}
}
