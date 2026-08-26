import { groq } from 'next-sanity'
import { LINK_QUERY } from '@/sanity/lib/fragments'

// @sanity-typegen-ignore
export const PRICING_QUERY = groq`
	_type == 'pricing' => {
		note{
			...,
			body[]{
				...,
				markDefs[]{
					...,
					_type == 'link' => { ${LINK_QUERY} }
				}
			}
		}
	}
`
