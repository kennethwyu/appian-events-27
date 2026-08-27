import { groq } from 'next-sanity'
import { LINK_QUERY } from '@/sanity/lib/fragments'

// @sanity-typegen-ignore
export const LOGO_WALL_QUERY = groq`
	_type == 'logo-wall' => {
		logos[]->{
			_id,
			title,
			image
		},
		ctas[]{
			...,
			link{ ${LINK_QUERY} }
		}
	}
`
