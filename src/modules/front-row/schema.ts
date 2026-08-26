import { defineArrayMember, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { PiFilmSlate } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'front-row',
	title: 'Front-row band',
	type: 'object',
	icon: PiFilmSlate,
	groups: [{ name: 'content', default: true }, { name: 'media' }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder:
				'e.g. Appian World is your front-row seat to the future of AI-powered automation',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'descriptors',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'descriptor',
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({ name: 'body', type: 'text', rows: 3 }),
					],
					preview: { select: { title: 'title', subtitle: 'body' } },
				}),
			],
			validation: (Rule) => Rule.max(4),
			description: 'Up to four. The desktop layout is designed for four.',
			group: 'content',
		}),
		defineField({
			name: 'image',
			title: 'Background image',
			type: 'image',
			icon: ImageIcon,
			description: 'Full-bleed behind the band. A dark scrim sits over it.',
			options: { hotspot: true, metadata: ['lqip'] },
			fields: [defineField({ name: 'alt', type: 'string' })],
			group: 'media',
		}),
		defineField({
			name: 'youtubeId',
			title: 'YouTube video ID',
			type: 'string',
			description:
				'Just the ID, not the URL — the v= value from youtube.com/watch?v=…. Leave empty to hide the play link.',
			placeholder: 'e.g. 2o1wbTwArSo',
			group: 'media',
		}),
		defineField({
			name: 'videoLabel',
			type: 'string',
			placeholder: 'e.g. Watch 2026 recap',
			initialValue: 'Watch the recap',
			group: 'media',
		}),
	],
	preview: {
		select: {
			title: 'intro',
			descriptors: 'descriptors',
			media: 'image',
		},
		prepare: ({ title, descriptors, media }) => ({
			title,
			subtitle: descriptors
				? count(descriptors, 'descriptor')
				: 'Front-row band',
			media,
		}),
	},
})
