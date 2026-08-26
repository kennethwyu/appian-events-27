/**
 * Seeds the two documents SanityPress requires: the `site` singleton and a
 * `page` with slug `index`. Without them the frontend renders blank and
 * `next build` fails, since Cache Components requires generateStaticParams
 * to return at least one result.
 *
 * Idempotent — uses createIfNotExists.
 *
 * Usage: node scripts/seed.mjs
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

const docs = [
	{
		_id: 'site',
		_type: 'site',
		title: 'Appian World 2027',
		copyright: '© Appian Corporation. All rights reserved.',
	},
	{
		_id: 'page-index',
		_type: 'page',
		title: 'Home',
		metadata: {
			_type: 'metadata',
			title: 'Appian World 2027',
			description: 'Appian World 2027 — April 26–28, 2027.',
			slug: { _type: 'slug', current: 'index' },
		},
	},
]

const tx = docs.reduce(
	(t, doc) => t.createIfNotExists(doc),
	client.transaction(),
)
await tx.commit()

for (const { _id, _type } of docs) console.log(`✓ ${_type} ${_id}`)
