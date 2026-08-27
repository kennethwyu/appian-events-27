/**
 * Uploads the "appian | World" lockup and sets it as site.logo (light variant,
 * since the chrome is dark).
 *
 * Usage: node scripts/seed-logo.mjs <dir-with-logo.svg>
 */
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@sanity/client'
import env from '@next/env'

env.loadEnvConfig(process.cwd(), true, {
	info: () => null,
	error: console.error,
})

const dir = process.argv[2]
if (!dir) throw new Error('Pass the directory holding logo.svg')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

const filename = 'appian-world-lockup-v2.svg'
let assetId = await client.fetch(
	`*[_type == 'sanity.imageAsset' && originalFilename == $filename][0]._id`,
	{ filename },
)
if (!assetId) {
	const asset = await client.assets.upload(
		'image',
		createReadStream(join(dir, 'logo.svg')),
		{ filename },
	)
	assetId = asset._id
}

await client
	.patch('site')
	.set({
		logo: {
			_type: 'logo',
			name: 'Appian World 2027',
			image: {
				_type: 'object',
				// <Logo> reads the `default` variant unless told otherwise; the chrome
				// is dark throughout, so both point at the light lockup.
				default: {
					_type: 'image',
					asset: { _type: 'reference', _ref: assetId },
				},
				light: {
					_type: 'image',
					asset: { _type: 'reference', _ref: assetId },
				},
			},
		},
	})
	.commit()

console.log(`✓ site.logo set (${assetId})`)
