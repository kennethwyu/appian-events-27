/**
 * Seeds the site singleton's header nav, footer blurb and bottom links so the
 * chrome renders with real content.
 *
 * Usage: node scripts/seed-site.mjs
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

const link = (_key, label, href) => ({
	_key,
	_type: 'link',
	label,
	type: 'external',
	external: href,
})

const para = (_key, spans) => ({
	_key,
	_type: 'block',
	style: 'normal',
	markDefs: [],
	children: spans,
})

const span = (_key, text, marks = []) => ({ _key, _type: 'span', text, marks })

await client.createOrReplace({
	_id: 'navigation-header',
	_type: 'navigation',
	title: 'Header',
	items: [
		link('n1', 'Home', '/'),
		link('n2', 'Agenda', '/agenda'),
		link('n3', 'Awards', '/awards'),
		link('n4', 'Travel', '/travel'),
		link('n5', 'FAQ', '/faq'),
	],
})

await client.createOrReplace({
	_id: 'navigation-bottom',
	_type: 'navigation',
	title: 'Footer bottom',
	items: [link('b1', 'Privacy Policy →', 'https://appian.com/legal/privacy')],
})

await client.createOrReplace({
	_id: 'navigation-footer',
	_type: 'navigation',
	title: 'Footer',
	// site.footer is a reference, so the blurb lives on the navigation document.
	blurb: [
		para('f1', [span('f1s', 'Appian provides process automation technology.')]),
		para('f2', [
			span(
				'f2s',
				'We automate complex processes in large enterprises and governments. Our platform is known for its unique reliability and scale. We2019ve been automating processes for 25 years and understand enterprise operations like no one else.',
			),
		]),
		para('f3', [
			span('f3a', 'For more information, visit '),
			span('f3b', 'appian.com', ['strong']),
			span('f3c', '.'),
		]),
	],
	items: [],
})

await client
	.patch('site')
	.set({
		title: 'Appian World 2027',
		header: { _type: 'reference', _ref: 'navigation-header' },
		bottom: { _type: 'reference', _ref: 'navigation-bottom' },
		footer: { _type: 'reference', _ref: 'navigation-footer' },
		ctas: [
			{
				_key: 'cta-header',
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
	})
	.commit()

console.log(
	'✓ site header nav, footer blurb, bottom links and header CTA seeded',
)
