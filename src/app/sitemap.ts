import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'
import { sanityFetchMetadata } from '@/sanity/lib/live'

export default async function (): Promise<MetadataRoute.Sitemap> {
	const data = (await sanityFetchMetadata({
		query: groq`{
			'pages': *[
				_type == 'page'
				&& defined(metadata.slug.current)
				&& !(metadata.slug.current in ['404'])
				&& metadata.noIndex != true
			]|order(metadata.slug.current != 'index', metadata.slug.current){
				'url': $baseUrl + select(
					metadata.slug.current == 'index' => '',
					'/' + metadata.slug.current
				),
				'lastModified': _updatedAt,
				'priority': select(
					metadata.slug.current == 'index' => 1,
					0.5
				)
			}
		}`,
		params: {
			baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
		},
		perspective: 'published',
	})) as {
		pages: MetadataRoute.Sitemap
	}

	return Object.values(data).flat()
}
