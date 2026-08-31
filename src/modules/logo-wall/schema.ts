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
			description:
				'Desktop page size is columns x rows; mobile always pages in 12s (6 rows x 2 columns), per the artboard. Set 0 to disable paging at both widths.',
			initialValue: 3,
			validation: (Rule) => Rule.min(0).max(12),
			group: 'options',
		}),
		defineField({
			name: 'container',
			title: 'Content width',
			type: 'string',
			description:
				'Full spans the grid (visionaries wall); narrow is a 736 centred column (past sponsors).',
			options: {
				list: [
					{ title: 'Full', value: 'full' },
					{ title: 'Narrow (736)', value: 'narrow' },
				],
				layout: 'radio',
			},
			initialValue: 'full',
			group: 'options',
		}),
		defineField({
			name: 'monochrome',
			title: 'Render logos white',
			type: 'boolean',
			description:
				'Flattens each logo to a white silhouette so one set of files works on the dark ground. Turn off only if a wall needs full-colour artwork.',
			initialValue: true,
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
