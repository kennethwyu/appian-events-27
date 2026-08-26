import { defineArrayMember, defineField } from 'sanity'
import { TfiLayoutMediaOverlay } from 'react-icons/tfi'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'hero',
	title: 'Hero',
	type: 'object',
	icon: TfiLayoutMediaOverlay,
	groups: [
		{ name: 'content', default: true },
		{ name: 'stats' },
		{ name: 'options' },
	],
	fieldsets: [{ name: 'tagline', options: { columns: 2 } }],
	fields: [
		defineField({
			name: 'urgency',
			title: 'Urgency chip',
			type: 'string',
			description: 'Pill above the headline. Leave empty to hide.',
			placeholder: 'e.g. Early bird ends 31 Jan — Save $400',
			group: 'content',
		}),
		defineField({
			name: 'headline',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			group: 'content',
		}),
		defineField({
			name: 'eventDate',
			type: 'string',
			placeholder: 'e.g. April 26–28, 2027',
			group: 'content',
		}),
		defineField({
			name: 'eventLocation',
			type: 'text',
			rows: 2,
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
		defineField({
			name: 'taglineLead',
			title: 'Lead',
			type: 'string',
			placeholder: 'e.g. Serious AI.',
			fieldset: 'tagline',
			group: 'content',
		}),
		defineField({
			name: 'taglineEmphasis',
			title: 'Emphasis',
			type: 'string',
			placeholder: 'e.g. Built on Process.',
			fieldset: 'tagline',
			group: 'content',
		}),
		defineField({
			name: 'stats',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'stat',
					type: 'object',
					fields: [
						defineField({
							name: 'value',
							type: 'string',
							placeholder: 'e.g. 1,200+',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'label',
							type: 'text',
							rows: 2,
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: { title: 'value', subtitle: 'label' },
					},
				}),
			],
			validation: (Rule) => Rule.max(3),
			description: 'Up to three. The layout is designed for exactly three.',
			group: 'stats',
		}),
		defineField({
			name: 'showVisual',
			title: 'Show isometric visual',
			type: 'boolean',
			description: 'Desktop only — hidden below lg in both artboards.',
			initialValue: true,
			group: 'options',
		}),
	],
	preview: {
		select: { title: 'headline', subtitle: 'eventDate' },
		prepare: ({ title, subtitle }) => ({
			title,
			subtitle: subtitle ? `Hero — ${subtitle}` : 'Hero',
		}),
	},
})
