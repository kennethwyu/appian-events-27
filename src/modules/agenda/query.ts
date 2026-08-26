import { groq } from 'next-sanity'

// @sanity-typegen-ignore
export const AGENDA_QUERY = groq`
	_type == 'agenda' => {
		days[]{
			...,
			image{
				...,
				asset->{
					...,
					metadata
				}
			}
		}
	}
`
