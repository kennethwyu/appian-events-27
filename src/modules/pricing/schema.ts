import { defineArrayMember, defineField } from 'sanity'
import { PiTag } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'pricing',
	title: 'Pricing & testimonials',
	type: 'object',
	icon: PiTag,
	groups: [
		{ name: 'content', default: true },
		{ name: 'pricing' },
		{ name: 'testimonials' },
	],
	fieldsets: [{ name: 'price', options: { columns: 2 } }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder: 'e.g. Join us for Appian World 2027',
			group: 'content',
		}),
		defineField({
			name: 'badge',
			type: 'string',
			placeholder: 'e.g. EARLY BIRD',
			group: 'pricing',
		}),
		defineField({
			name: 'price',
			title: 'Current price',
			type: 'string',
			placeholder: 'e.g. $1,795',
			fieldset: 'price',
			group: 'pricing',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'fullPrice',
			title: 'Price after cutoff',
			type: 'string',
			placeholder: 'e.g. $2,195',
			fieldset: 'price',
			group: 'pricing',
		}),
		defineField({
			name: 'cutoff',
			title: 'Early-bird cutoff',
			type: 'date',
			description:
				'After this date the full price is shown on its own and the note is hidden. Leave empty to always show the current price.',
			options: { dateFormat: 'YYYY-MM-DD' },
			group: 'pricing',
		}),
		defineField({
			name: 'cutoffNote',
			type: 'string',
			placeholder: 'e.g. Limited through 31 October',
			description: 'Shown only while the cutoff is in the future.',
			group: 'pricing',
		}),
		defineField({
			name: 'includes',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'pricing',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'pricing',
		}),
		defineField({
			name: 'note',
			title: 'Secondary card',
			type: 'object',
			description: 'The card below the price (e.g. the government waiver).',
			fields: [
				defineField({
					name: 'body',
					type: 'array',
					of: [
						{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] },
					],
				}),
				defineField({ name: 'footnote', type: 'string' }),
			],
			group: 'pricing',
		}),
		defineField({
			name: 'testimonials',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'testimonial',
					type: 'object',
					fields: [
						defineField({
							name: 'quote',
							type: 'text',
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
						defineField({ name: 'role', type: 'string' }),
						defineField({ name: 'organization', type: 'string' }),
					],
					preview: {
						select: { title: 'quote', role: 'role', org: 'organization' },
						prepare: ({ title, role, org }) => ({
							title,
							subtitle: [role, org].filter(Boolean).join(' · '),
						}),
					},
				}),
			],
			description: 'The layout is designed for three.',
			group: 'testimonials',
		}),
	],
	preview: {
		select: { title: 'intro', price: 'price', testimonials: 'testimonials' },
		prepare: ({ title, price, testimonials }) => ({
			title: title || 'Pricing & testimonials',
			subtitle: [price, testimonials && count(testimonials, 'testimonial')]
				.filter(Boolean)
				.join(' · '),
		}),
	},
})
