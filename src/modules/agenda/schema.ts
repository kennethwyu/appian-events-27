import { defineArrayMember, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { PiCalendarDots } from 'react-icons/pi'
import { count } from '@/lib/utils'
import defineModule from '@/sanity/schemaTypes/fragments/define-module'

export default defineModule({
	name: 'agenda',
	title: 'Agenda',
	type: 'object',
	icon: PiCalendarDots,
	groups: [{ name: 'content', default: true }],
	fields: [
		defineField({
			name: 'intro',
			title: 'Heading',
			type: 'string',
			placeholder: 'e.g. Agenda at a glance',
			group: 'content',
		}),
		defineField({
			name: 'days',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'day',
					type: 'object',
					fields: [
						defineField({
							name: 'chip',
							title: 'Day label',
							type: 'string',
							placeholder: 'e.g. DAY 1',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'date',
							type: 'string',
							placeholder: 'e.g. Monday, April 26',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'image',
							type: 'image',
							icon: ImageIcon,
							description: 'Cropped to 4:3.',
							options: { hotspot: true, metadata: ['lqip'] },
							fields: [defineField({ name: 'alt', type: 'string' })],
						}),
						defineField({
							name: 'topics',
							type: 'array',
							of: [
								defineArrayMember({
									name: 'topic',
									type: 'object',
									fields: [
										defineField({
											name: 'title',
											type: 'string',
											validation: (Rule) => Rule.required(),
										}),
										defineField({
											name: 'highlight',
											type: 'boolean',
											description:
												'Marks the topic with a star and bolder text.',
											initialValue: false,
										}),
									],
									preview: {
										select: { title: 'title', highlight: 'highlight' },
										prepare: ({ title, highlight }) => ({
											title,
											subtitle: highlight ? 'Highlighted' : undefined,
										}),
									},
								}),
							],
						}),
					],
					preview: {
						select: {
							title: 'date',
							chip: 'chip',
							topics: 'topics',
							media: 'image',
						},
						prepare: ({ title, chip, topics, media }) => ({
							title,
							subtitle: [chip, topics && count(topics, 'topic')]
								.filter(Boolean)
								.join(' · '),
							media,
						}),
					},
				}),
			],
			description: 'The desktop layout is a 3-up grid; mobile swipes.',
			group: 'content',
		}),
	],
	preview: {
		select: { title: 'intro', days: 'days' },
		prepare: ({ title, days }) => ({
			title: title || 'Agenda',
			subtitle: days ? count(days, 'day') : 'Agenda',
		}),
	},
})
