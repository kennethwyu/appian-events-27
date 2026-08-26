import { groq } from 'next-sanity'

// @sanity-typegen-ignore
export const FINALE_QUERY = groq`
	_type == 'finale' => {
		feature{
			...,
			image{
				...,
				asset->{
					...,
					metadata
				}
			}
		},
		gallery[]{
			...,
			asset->{
				...,
				metadata
			}
		}
	}
`
