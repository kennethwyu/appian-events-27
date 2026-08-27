import { defineField } from 'sanity'
import { PiBrowsers } from 'react-icons/pi'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'iframe',
	title: 'Embed (iframe)',
	type: 'object',
	icon: PiBrowsers,
	groups: [{ name: 'content', default: true }],
	fields: [
		defineField({
			name: 'url',
			title: 'URL',
			type: 'url',
			description:
				'A Cvent page. Registration cannot be embedded — use a redirect document for that.',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Accessible title',
			type: 'string',
			description:
				'Describes the embedded page to screen readers, e.g. "Appian World 2027 agenda".',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'minHeight',
			title: 'Minimum height (px)',
			type: 'number',
			description:
				'iframe-resizer sizes the frame to its content. Raise this if the embedded page lazy-loads and gets cut off.',
			initialValue: 800,
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'url' },
	},
})
