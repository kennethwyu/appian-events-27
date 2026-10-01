import { defineArrayMember, defineField } from 'sanity'
import { PiSquaresFour } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'
import { ICON_OPTIONS } from './icons'

export default defineModule({
	name: 'feature-grid',
	title: 'Feature grid',
	type: 'object',
	icon: PiSquaresFour,
	groups: [{ name: 'content', default: true }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder:
				'e.g. Your front-row seat to the future of AI-powered automation',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'features',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'feature',
					type: 'object',
					fields: [
						defineField({
							name: 'icon',
							type: 'string',
							options: { list: ICON_OPTIONS },
						}),
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
			description:
				'Up to four, read left to right. Icons and CTAs are desktop-only.',
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'intro', features: 'features' },
		prepare: ({ title, features }) => ({
			title,
			subtitle: features ? count(features, 'feature') : 'Feature grid',
		}),
	},
})
