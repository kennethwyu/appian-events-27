import { groq } from 'next-sanity'

// @sanity-typegen-ignore
export const FRONT_ROW_QUERY = groq`
	_type == 'front-row' => {
		image{
			...,
			asset->{
				...,
				metadata
			}
		}
	}
`
