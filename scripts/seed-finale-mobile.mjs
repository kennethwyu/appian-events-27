/**
 * Attaches the designer's 4:3 mobile crops to the finale's feature and gallery
 * images. Each becomes a `mobile` variant on the existing image, so the mosaic
 * keeps its desktop crops and <picture> picks per breakpoint.
 *
 * Usage: node scripts/seed-finale-mobile.mjs <dir-with-figure-conference-party-*-mobile.jpg>
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
if (!dir) throw new Error('Pass the directory holding the mobile crops')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

// Matched to the existing slots by subject, via each image's alt text.
const crops = [
	{ slot: 'feature', file: 'figure-conference-party-uss-midway-mobile.jpg' },
	{ slot: 0, file: 'figure-conference-party-singer-mobile.jpg' },
	{ slot: 1, file: 'figure-conference-party-sax-player-mobile.jpg' },
	{ slot: 2, file: 'figure-conference-party-mixologist-mobile.jpg' },
	{ slot: 3, file: 'figure-conference-party-live-band-mobile.jpg' },
]

async function upload(file) {
	const filename = basename(file)
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

const page = await client.getDocument('page-index')
const finaleKey = page.modules.find((m) => m._type === 'finale')?._key
if (!finaleKey) throw new Error('No finale module on page-index')

const patch = client.patch('page-index')

for (const { slot, file } of crops) {
	const assetId = await upload(join(dir, file))
	const mobile = {
		_type: 'image',
		asset: { _type: 'reference', _ref: assetId },
	}
	const path =
		slot === 'feature'
			? `modules[_key=="${finaleKey}"].feature.image.mobile`
			: `modules[_key=="${finaleKey}"].gallery[${slot}].mobile`
	patch.set({ [path]: mobile })
	console.log(
		`✓ ${file} → ${slot === 'feature' ? 'feature' : `gallery[${slot}]`}`,
	)
}

await patch.commit()
console.log('✓ mobile crops attached')
