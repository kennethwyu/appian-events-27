import { defineField, defineType } from 'sanity'
import { ErrorScreenIcon } from '@sanity/icons/ErrorScreen'
import { HomeIcon } from '@sanity/icons/Home'
import { SearchIcon } from '@sanity/icons/Search'
import { VscEyeClosed } from 'react-icons/vsc'
import modules from '../fragments/modules'

export default defineType({
	name: 'page',
	title: 'Page',
	type: 'document',
	groups: [{ name: 'content', default: true }, { name: 'metadata' }],
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			...modules(),
			group: 'content',
		}),
		defineField({
			name: 'metadata',
			type: 'metadata',
			group: 'metadata',
		}),
	],
	preview: {
		select: {
			title: 'title',
			slug: 'metadata.slug.current',
			noIndex: 'metadata.noIndex',
		},
		prepare: ({ title, slug, noIndex }) => ({
			title,
			subtitle: `/${slug === 'index' ? '' : slug}`,
			media:
				(slug === 'index' && HomeIcon) ||
				(slug === '404' && ErrorScreenIcon) ||
				(slug === 'search' && SearchIcon) ||
				(noIndex && VscEyeClosed),
		}),
	},
	orderings: [
		{
			name: 'title',
			title: 'Title',
			by: [{ field: 'title', direction: 'asc' }],
		},
	],
})
