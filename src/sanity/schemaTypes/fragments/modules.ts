import { defineField } from 'sanity'

export default ({ of = [] }: { of?: Array<{ type: string }> } = {}) =>
	defineField({
		name: 'modules',
		type: 'array',
		of: [
			{ type: 'callout' },
			{ type: 'custom-html' },
			{ type: 'hero.cover' },
			{ type: 'hero.split' },
			{ type: 'image-gallery' },
			{ type: 'logo-list' },
			{ type: 'prose' },
			{ type: 'quote-list' },
			{ type: 'stat-list' },
			{ type: 'tabbed-content' },
			...of,
		],
		options: {
			insertMenu: {
				filter: true,
				views: [
					{
						name: 'grid',
						previewImageUrl: (module) => `/module-thumbnails/${module}.webp`,
					},
					{ name: 'list' },
				],
				groups: [
					{
						name: 'content',
						of: [
							'callout',
							'hero.cover',
							'hero.split',
							'image-gallery',
							'logo-list',
							'prose',
							'quote-list',
							'stat-list',
							'tabbed-content',
						],
					},
					{
						name: 'utility',
						of: ['custom-html'],
					},
				],
			},
		},
	})
