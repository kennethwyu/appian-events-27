import { defineArrayMember, defineField } from 'sanity'
import { ComponentIcon } from '@sanity/icons/Component'
import { PiGridFour } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'logo-wall',
	title: 'Logo wall',
	type: 'object',
	icon: PiGridFour,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'body',
			type: 'text',
			rows: 3,
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
			name: 'logos',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					to: [{ type: 'logo' }],
					icon: ComponentIcon,
				}),
			],
			description:
				'Paginated in page-size chunks. Order here is the order shown.',
			group: 'content',
		}),
		defineField({
			name: 'columns',
			type: 'number',
			options: { list: [4, 6], layout: 'radio', direction: 'horizontal' },
			initialValue: 6,
			group: 'options',
		}),
		defineField({
			name: 'rows',
			title: 'Rows per page',
			type: 'number',
			description: 'Page size is columns x rows. Set 0 to show every logo.',
			initialValue: 3,
			validation: (Rule) => Rule.min(0).max(12),
			group: 'options',
		}),
		defineField({
			name: 'align',
			title: 'Heading alignment',
			type: 'string',
			options: { list: ['left', 'center'], layout: 'radio' },
			initialValue: 'left',
			group: 'options',
		}),
		defineField({
			name: 'logoType',
			title: 'Logo variant',
			type: 'string',
			description: 'The wall sits on a dark background, so usually "light".',
			options: { list: ['default', 'light', 'dark'], layout: 'radio' },
			initialValue: 'light',
			group: 'options',
		}),
	],
	preview: {
		select: { title: 'intro', logos: 'logos' },
		prepare: ({ title, logos }) => ({
			title: title || 'Logo wall',
			subtitle: logos ? count(logos, 'logo') : 'Logo wall',
		}),
	},
})
