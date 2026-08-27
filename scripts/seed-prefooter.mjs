/**
 * Seeds the prefooter CTA at the end of page/index, and an /agenda page that
 * demonstrates the Cvent iframe shell.
 *
 * Usage: node scripts/seed-prefooter.mjs
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

const prefooter = {
	_key: 'prefooter',
	_type: 'prefooter',
	intro: 'Don’t miss Appian World 2027',
	body: 'Fast forward to better outcomes with thousands of global innovators.',
	ctas: [
		{
			_key: 'cta-prefooter',
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
}

const page = await client.getDocument('page-index')
const rest = (page?.modules ?? []).filter((m) => m._type !== 'prefooter')
await client
	.patch('page-index')
	.set({ modules: [...rest, prefooter] })
	.commit()
console.log('✓ prefooter appended to page-index')

// A Cvent iframe shell. The URL is a placeholder — the Cvent pages don't exist
// yet, so this proves the module, not the destination.
await client.createOrReplace({
	_id: 'page-agenda',
	_type: 'page',
	title: 'Agenda',
	metadata: {
		_type: 'metadata',
		title: 'Agenda — Appian World 2027',
		slug: { _type: 'slug', current: 'agenda' },
	},
	modules: [
		{
			_key: 'agenda-embed',
			_type: 'iframe',
			url: 'https://web.cvent.com/event/appian-world-2027/agenda',
			title: 'Appian World 2027 agenda',
			minHeight: 1200,
		},
	],
})
console.log('✓ page/agenda created with a Cvent iframe shell')
