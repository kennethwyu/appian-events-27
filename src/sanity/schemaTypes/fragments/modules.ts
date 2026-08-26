import { defineField } from 'sanity'

export default ({ of = [] }: { of?: Array<{ type: string }> } = {}) =>
	defineField({
		name: 'modules',
		type: 'array',
		of: [
			{ type: 'agenda' },
			{ type: 'callout' },
			{ type: 'custom-html' },
			{ type: 'finale' },
			{ type: 'front-row' },
			{ type: 'hero' },
			{ type: 'hero.cover' },
			{ type: 'hero.split' },
			{ type: 'image-gallery' },
			{ type: 'logo-list' },
			{ type: 'pricing' },
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
							'agenda',
							'callout',
							'finale',
							'front-row',
							'hero',
							'hero.cover',
							'hero.split',
							'image-gallery',
							'logo-list',
							'pricing',
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
