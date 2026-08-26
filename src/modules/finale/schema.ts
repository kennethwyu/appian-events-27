import { defineArrayMember, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { PiConfetti } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

const image = (name: string) =>
	defineField({
		name,
		type: 'image',
		icon: ImageIcon,
		options: { hotspot: true, metadata: ['lqip'] },
		fields: [defineField({ name: 'alt', type: 'string' })],
	})

export default defineModule({
	name: 'finale',
	title: 'Finale',
	type: 'object',
	icon: PiConfetti,
	groups: [{ name: 'content', default: true }, { name: 'gallery' }],
	fields: [
		defineField({
			name: 'badge',
			type: 'string',
			placeholder: 'e.g. Closing Conference Party',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder: 'e.g. The grand finale you won’t want to miss',
			group: 'content',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'feature',
			type: 'object',
			description: 'The large image, with its caption laid over the bottom.',
			fields: [
				image('image'),
				defineField({ name: 'title', type: 'string' }),
				defineField({ name: 'body', type: 'text', rows: 3 }),
			],
			group: 'content',
		}),
		defineField({
			name: 'gallery',
			type: 'array',
			of: [
				defineArrayMember({
					...image('galleryImage'),
					name: 'galleryImage',
				}),
			],
			description:
				'Exactly four, in mosaic order: tall left, small top-right, small below it, then the wide one underneath.',
			validation: (Rule) => Rule.max(4),
			group: 'gallery',
		}),
	],
	preview: {
		select: {
			title: 'intro',
			gallery: 'gallery',
			media: 'feature.image',
		},
		prepare: ({ title, gallery, media }) => ({
			title,
			subtitle: gallery ? count(gallery, 'gallery image') : 'Finale',
			media,
		}),
	},
})
