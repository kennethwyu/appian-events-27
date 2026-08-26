/**
 * Seeds the front-row band on page/index, positioned after the hero.
 * Usage: node scripts/seed-front-row.mjs <dir-with-front-row.jpg>
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
if (!dir) throw new Error('Pass the directory holding front-row.jpg')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

const file = join(dir, 'front-row.jpg')
const filename = basename(file)
let assetId = await client.fetch(
	`*[_type == 'sanity.imageAsset' && originalFilename == $filename][0]._id`,
	{ filename },
)
if (!assetId) {
	const asset = await client.assets.upload('image', createReadStream(file), {
		filename,
	})
	assetId = asset._id
}
console.log(`✓ ${filename} → ${assetId}`)

const frontRow = {
	_key: 'front-row',
	_type: 'front-row',
	intro:
		'Appian World is your front-row seat to the future of AI-powered automation',
	youtubeId: '2o1wbTwArSo',
	videoLabel: 'Watch 2026 recap',
	image: {
		_type: 'image',
		alt: 'The Appian World keynote hall, stage and audience',
		asset: { _type: 'reference', _ref: assetId },
	},
	descriptors: [
		{
			_key: 'd1',
			_type: 'descriptor',
			title: 'The roadmap becomes real.',
			body: 'Get hands-on experience with the newest Appian capabilities and see what’s next.',
		},
		{
			_key: 'd2',
			_type: 'descriptor',
			title: 'AI hype meets results.',
			body: 'Hear from top AI practitioners who’ve solved the same challenges you face.',
		},
		{
			_key: 'd3',
			_type: 'descriptor',
			title: 'Connections that last.',
			body: 'Build your network with Appian experts and fellow architects, developers, and business leaders.',
		},
		{
			_key: 'd4',
			_type: 'descriptor',
			title: 'Expert advice.',
			body: 'Work directly with Appian experts in hands-on labs and 1:1 advisory sessions.',
		},
	],
}

// Desktop order: hero, front-row, agenda, …
const page = await client.getDocument('page-index')
const rest = (page?.modules ?? []).filter((m) => m._type !== 'front-row')
const heroIndex = rest.findIndex((m) => m._type === 'hero')
const modules =
	heroIndex === -1
		? [frontRow, ...rest]
		: [...rest.slice(0, heroIndex + 1), frontRow, ...rest.slice(heroIndex + 1)]

await client.patch('page-index').set({ modules }).commit()
console.log('✓ front-row seeded after the hero')
