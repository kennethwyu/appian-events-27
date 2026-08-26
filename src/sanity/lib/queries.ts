import { groq } from 'next-sanity'
import { IMAGE_GALLERY_QUERY } from '@/modules/image-gallery/query'
import { LOGO_LIST_QUERY } from '@/modules/logo-list/query'
import { PROSE_QUERY } from '@/modules/prose/query'
import { QUOTE_LIST_QUERY } from '@/modules/quote-list/query'
import { TABBED_CONTENT_QUERY } from '@/modules/tabbed-content/query'
import type { SITE_QUERY_RESULT } from '@/sanity/types'
import { LINK_QUERY } from './fragments'
import { sanityFetch, type DynamicFetchOptions } from './live'

/* fragments */

export { LINK_QUERY }

// @sanity-typegen-ignore
const NAVIGATION_QUERY = groq`
	...,
	items[]{
		${LINK_QUERY},
		defined(link) => { link{ ${LINK_QUERY} } },
		defined(links[]) => { links[]{ ${LINK_QUERY} } },
		_type == 'megamenu' => {
			defined(link) => { link{ ${LINK_QUERY} } },
			items[]{
				...,
				_type == 'link' => { ${LINK_QUERY} },
				_type == 'link.list' => {
					defined(link) => { link{ ${LINK_QUERY} } },
					links[]{ ${LINK_QUERY} }
				},
				_type == 'link.card' => {
					defined(link) => { link{ ${LINK_QUERY} } },
					image{
						...,
						asset->{
							...,
							metadata
						}
					}
				}
			}
		}
	}
`

// @sanity-typegen-ignore
const SIDEBAR_QUERY = groq`
	...,
	modules[]{
		...,
		_type == 'callout' => {
			ctas[]{
				...,
				link{ ${LINK_QUERY} }
			}
		}
	}
`

const SITE_QUERY = groq`*[_type == 'site'][0]{
	...,
	announcement->{
		...,
		ctas[]{
			...,
			link{ ${LINK_QUERY} }
		}
	},
	header->{ ${NAVIGATION_QUERY} },
	ctas[]{
		...,
		link{ ${LINK_QUERY} }
	},
	footer->{ ${NAVIGATION_QUERY} },
	bottom->{ ${NAVIGATION_QUERY} },
	social->{ ${NAVIGATION_QUERY} },
}`

export const GLOBAL_MODULE_EXCLUDE_QUERY = groq`
	select(
		defined(excludePaths) => count(excludePaths[string::startsWith($slug, @)]) == 0,
		true
	)
`

export const GLOBAL_MODULE_PATH_QUERY = groq`
	string::startsWith($slug, path)
	&& ${GLOBAL_MODULE_EXCLUDE_QUERY}
`

// @sanity-typegen-ignore
export const MODULES_QUERY = groq`
	...,
	ctas[]{
		...,
		link{ ${LINK_QUERY} }
	},
	sidebar{ ${SIDEBAR_QUERY} },
	${IMAGE_GALLERY_QUERY},
	${LOGO_LIST_QUERY},
	${PROSE_QUERY},
	${QUOTE_LIST_QUERY},
	${TABBED_CONTENT_QUERY},
`

/* queries */

export async function getSite({ perspective, stega }: DynamicFetchOptions) {
	'use cache'
	const { data } = await sanityFetch({ query: SITE_QUERY, perspective, stega })
	return data as SITE_QUERY_RESULT
}
