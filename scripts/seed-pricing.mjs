/**
 * Seeds the pricing + testimonials module on page/index from the Figma copy.
 * Usage: node scripts/seed-pricing.mjs
 */
import { createClient } from '@sanity/client'
import env from '@next/env'

env.loadEnvConfig(process.cwd(), true, {
	info: () => null,
	error: console.error,
})

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

const pricing = {
	_key: 'pricing',
	_type: 'pricing',
	intro: 'Join us for Appian World 2027',
	badge: 'EARLY BIRD',
	badgeAfterCutoff: '',
	ctaLabelAfterCutoff: 'Reserve Your Ticket',
	price: '$1,795',
	fullPrice: '$2,195',
	cutoff: '2026-10-31',
	cutoffNote: 'Limited through 31 October',
	includes: [
		'Full access to keynotes and all session tracks',
		'Hands-on workshops and training labs',
		'1:1 meetings with Appian product experts',
		'All networking events and receptions',
	],
	ctas: [
		{
			_key: 'cta-pricing',
			_type: 'cta',
			theme: 'action',
			link: {
				_type: 'link',
				label: 'Reserve Early Bird Pricing',
				type: 'external',
				external: '/register',
			},
		},
	],
	note: {
		_type: 'object',
		body: [
			{
				_key: 'n1',
				_type: 'block',
				style: 'normal',
				markDefs: [
					{
						_key: 'lnk',
						_type: 'link',
						type: 'external',
						external: '/register',
					},
				],
				children: [
					{
						_key: 'c1',
						_type: 'span',
						text: 'Registration is waived for attendees with a valid government email domain. Discount applied at checkout. ',
						marks: [],
					},
					{
						_key: 'c2',
						_type: 'span',
						text: 'Reserve your ticket',
						marks: ['lnk'],
					},
				],
			},
		],
		footnote: 'Does not extend to Appian partner organizations.',
	},
	testimonials: [
		{
			_key: 't1',
			_type: 'testimonial',
			quote:
				'“The only conference where the people on stage had actually shipped the thing they were describing.”',
			role: 'Director of Operations',
			organization: 'Regional Health System',
		},
		{
			_key: 't2',
			_type: 'testimonial',
			quote:
				'“I came for the AI sessions and left with a Data Fabric plan my architects had already agreed to.”',
			role: 'Head of Digital',
			organization: 'Global Manufacturer',
		},
		{
			_key: 't3',
			_type: 'testimonial',
			quote:
				'“Immediately actionable. We rebuilt a claims process the week we got back and cut three days out of it.”',
			role: 'Director of Operations',
			organization: 'Asset Management',
		},
	],
}

const page = await client.getDocument('page-index')
const modules = (page?.modules ?? []).filter((m) => m._type !== 'pricing')
await client
	.patch('page-index')
	.set({ modules: [...modules, pricing] })
	.commit()

console.log('✓ pricing seeded on page-index')
