/**
 * Seeds `logo` documents plus the two logo walls (visionaries, past sponsors).
 *
 * The logo assets come from the Figma comp, where they are 2026 sponsors used
 * as placeholders. Titles are generic because the artwork can't be attributed
 * from the vector paths — marketing needs to supply real names (which become
 * the alt text) and final artwork.
 *
 * Usage: node scripts/seed-logo-walls.mjs <dir-with-logo-NN.svg|png>
 */
import { createReadStream } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { createClient } from '@sanity/client'
import env from '@next/env'

env.loadEnvConfig(process.cwd(), true, {
	info: () => null,
	error: console.error,
})

const dir = process.argv[2]
if (!dir) throw new Error('Pass the directory holding logo-NN.svg / .png')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

const files = (await readdir(dir))
	.filter((f) => /^logo-\d+\.(svg|png)$/.test(f))
	.sort()

const logoIds = []
for (const file of files) {
	const filename = `wall-${basename(file)}`
	let assetId = await client.fetch(
		`*[_type == 'sanity.imageAsset' && originalFilename == $filename][0]._id`,
		{ filename },
	)
	if (!assetId) {
		const asset = await client.assets.upload(
			'image',
			createReadStream(join(dir, file)),
			{ filename },
		)
		assetId = asset._id
	}

	const n = file.match(/\d+/)[0]
	const _id = `logo-wall-${n}`
	await client.createOrReplace({
		_id,
		_type: 'logo',
		// PLACEHOLDER: real company name needed — this becomes the alt text.
		title: `Sponsor ${Number(n)}`,
		image: {
			_type: 'object',
			light: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
		},
	})
	logoIds.push(_id)
}
console.log(`✓ ${logoIds.length} logo documents`)

const refs = logoIds.map((id, i) => ({
	_key: `l${i}`,
	_type: 'reference',
	_ref: id,
}))

const visionaries = {
	_key: 'logo-wall-visionaries',
	_type: 'logo-wall',
	intro: 'Hear from visionaries leading the future of process orchestration',
	// PLACEHOLDER: lorem ipsum in the comp.
	body: 'Tellus viverra nibh nam pretium neque risus convallis lacus. Eget tortor gravida at amet nunc lorem.',
	logos: refs,
	columns: 6,
	rows: 3,
	align: 'left',
	logoType: 'light',
}

const sponsors = {
	_key: 'logo-wall-sponsors',
	_type: 'logo-wall',
	intro: 'Thank you to our past sponsors',
	ctas: [
		{
			_key: 'cta-sponsor',
			_type: 'cta',
			theme: 'action',
			link: {
				_type: 'link',
				// The comp reads "Become a 2026 sponsor" on a 2027 site.
				label: 'Become a 2027 sponsor',
				type: 'external',
				external: '/register',
			},
		},
	],
	logos: refs,
	columns: 4,
	rows: 3,
	align: 'center',
	logoType: 'light',
}

// Desktop order: hero, front-row, agenda, finale, visionaries, pricing, sponsors
const page = await client.getDocument('page-index')
const rest = (page?.modules ?? []).filter((m) => m._type !== 'logo-wall')
const pricingIndex = rest.findIndex((m) => m._type === 'pricing')
const modules =
	pricingIndex === -1
		? [...rest, visionaries, sponsors]
		: [
				...rest.slice(0, pricingIndex),
				visionaries,
				...rest.slice(pricingIndex),
				sponsors,
			]

await client.patch('page-index').set({ modules }).commit()
console.log('✓ both logo walls seeded')
console.log('  modules:', modules.map((m) => m._type).join(' -> '))
