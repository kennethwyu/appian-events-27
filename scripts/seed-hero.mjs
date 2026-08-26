/**
 * Seeds the hero module on page/index with the approved Figma copy.
 * Re-running replaces the hero; other modules are left alone.
 *
 * Usage: node scripts/seed-hero.mjs
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

const hero = {
	_key: 'hero',
	_type: 'hero',
	urgency: 'Early bird ends 31 Jan — Save $400',
	headline: 'Appian World 2027',
	description:
		'Three days with the AI transformation leaders who have the results to prove it.',
	eventDate: 'April 26–28, 2027',
	eventLocation: 'Gaylord Pacific Resort & Convention Center\nSan Diego, CA',
	ctas: [
		{
			_key: 'cta-register',
			_type: 'cta',
			theme: 'action',
			link: {
				_type: 'link',
				label: 'Reserve Early Bird Pricing',
				type: 'internal',
				internal: { _type: 'reference', _ref: 'page-register' },
			},
		},
	],
	taglineLead: 'Serious AI.',
	taglineEmphasis: 'Built on Process.',
	stats: [
		{
			_key: 's1',
			_type: 'stat',
			value: '1,200+',
			label: 'process and AI\nleaders',
		},
		// Figma reads "plobal organizations" — treated as a typo.
		{
			_key: 's2',
			_type: 'stat',
			value: '500+',
			label: 'global\norganizations',
		},
		{ _key: 's3', _type: 'stat', value: '50+', label: 'expert-led\nsessions' },
	],
	showVisual: true,
}

const registerPage = {
	_id: 'page-register',
	_type: 'page',
	title: 'Register',
	metadata: {
		_type: 'metadata',
		title: 'Register — Appian World 2027',
		slug: { _type: 'slug', current: 'register' },
	},
}

await client
	.transaction()
	.createIfNotExists(registerPage)
	.patch('page-index', (p) =>
		p.set({ modules: [hero] }).setIfMissing({ modules: [] }),
	)
	.commit()

console.log('✓ hero seeded on page-index')
console.log('✓ page/register created (Cvent iframe shell target)')
