import { defineField } from 'sanity'
import { PiMegaphone } from 'react-icons/pi'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'prefooter',
	title: 'Prefooter CTA',
	type: 'object',
	icon: PiMegaphone,
	groups: [{ name: 'content', default: true }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder: 'e.g. Don’t miss Appian World 2027',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'body',
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
	],
	preview: {
		select: { title: 'intro', subtitle: 'body' },
	},
})
