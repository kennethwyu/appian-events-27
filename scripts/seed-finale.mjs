/**
 * Seeds the finale module on page/index, positioned after the agenda.
 * Usage: node scripts/seed-finale.mjs <dir-with-feature.jpg,m1..m4.jpg>
 */
import { createReadStream } from 'node:fs'
import { basename, join } from 'node:path'
import { createClient } from '@sanity/client'
import env from '@next/env'

env.loadEnvConfig(process.cwd(), true, {
	info: () => null,
	error: console.error,
})

const dir = process.argv[2]
if (!dir) throw new Error('Pass the directory holding the finale images')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

async function upload(name) {
	const file = join(dir, name)
	const filename = `finale-${basename(file)}`
	const existing = await client.fetch(
		`*[_type == 'sanity.imageAsset' && originalFilename == $filename][0]._id`,
		{ filename },
	)
	if (existing) return existing
	const asset = await client.assets.upload('image', createReadStream(file), {
		filename,
	})
	return asset._id
}

const ref = (id, alt) => ({
	_type: 'image',
	alt,
	asset: { _type: 'reference', _ref: id },
})

const featureId = await upload('feature.jpg')
const galleryIds = await Promise.all(
	['m1.jpg', 'm2.jpg', 'm3.jpg', 'm4.jpg'].map(upload),
)
console.log('✓ uploaded 5 images')

const galleryAlts = [
	'A vocalist performing at the closing party',
	'Musicians on stage at the closing party',
	'Guests at a table during the closing party',
	'The house band performing to a full crowd',
]

const finale = {
	_key: 'finale',
	_type: 'finale',
	badge: 'Closing Conference Party',
	intro: 'The grand finale you won’t want to miss',
	feature: {
		_type: 'object',
		image: ref(
			featureId,
			'The USS Midway at sunset on the San Diego waterfront',
		),
		title: 'Appian World closes in style aboard the USS Midway',
		body: 'Enjoy a taste of San Diego with food, drinks, live entertainment, and surprises around every corner, all set against a picture-perfect sunset.',
	},
	gallery: galleryIds.map((id, i) => ({
		...ref(id, galleryAlts[i]),
		_key: `g${i + 1}`,
	})),
}

// Desktop order: hero, front-row, agenda, finale, …
const page = await client.getDocument('page-index')
const rest = (page?.modules ?? []).filter((m) => m._type !== 'finale')
const agendaIndex = rest.findIndex((m) => m._type === 'agenda')
const modules =
	agendaIndex === -1
		? [...rest, finale]
		: [
				...rest.slice(0, agendaIndex + 1),
				finale,
				...rest.slice(agendaIndex + 1),
			]

await client.patch('page-index').set({ modules }).commit()
console.log('✓ finale seeded after the agenda')
