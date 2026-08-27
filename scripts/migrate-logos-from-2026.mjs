/**
 * Migrates `logo` documents from the Appian World 2026 Sanity project into 2027,
 * and repoints both logo walls at the 2026 groupings.
 *
 * 2026 had three logo-list modules on its index page: 12 customer logos and a
 * 29-logo partner/sponsor list (duplicated). Those map onto the two 2027 walls —
 * and 29 logos at 12 per page is 3 pages, matching the "1 / 3" in the comp.
 *
 * Note the schema difference: 2026 labels the logo `name`, 2027 uses `title`
 * (upstream SanityPress). 2026 only ever populated `image.default`, so the walls
 * are set to logoType 'default'.
 *
 * Reads the 2026 credentials from that repo's .env.world; nothing is written
 * there. Usage: node scripts/migrate-logos-from-2026.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@sanity/client'
import env from '@next/env'

env.loadEnvConfig(process.cwd(), true, {
	info: () => null,
	error: console.error,
})

const ENV_26 = '/Users/kenneth.yu/Projects/appian-events-26/.env.world'
const env26 = readFileSync(ENV_26, 'utf8')
const from26 = (key) =>
	env26
		.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]
		?.trim()
		.replace(/^["']|["']$/g, '')

const source = createClient({
	projectId: from26('NEXT_PUBLIC_SANITY_PROJECT_ID'),
	dataset: from26('NEXT_PUBLIC_SANITY_DATASET'),
	apiVersion: '2026-06-17',
	token: from26('SANITY_API_READ_TOKEN'),
	useCdn: false,
})

const target = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

/* ---- 1. read the groupings out of 2026 ---- */

const [page] =
	await source.fetch(`*[_type == 'page' && metadata.slug.current == 'index']{
	'lists': modules[_type == 'logo-list']{
		_key,
		'names': logos[]->name
	}
}`)

const lists = (page?.lists ?? []).filter((l) => l.names?.length)
// Dedupe: 2026 carried the sponsor list twice.
const unique = []
for (const list of lists) {
	const key = list.names.join('|')
	if (!unique.some((u) => u.names.join('|') === key)) unique.push(list)
}
unique.sort((a, b) => a.names.length - b.names.length)

const [customers, sponsors] = unique
if (!customers || !sponsors)
	throw new Error(
		`Expected two distinct logo lists in 2026, found ${unique.length}`,
	)

console.log(
	`2026 groupings: ${customers.names.length} customers, ${sponsors.names.length} sponsors`,
)

/* ---- 2. copy the assets across ---- */

const needed = [...new Set([...customers.names, ...sponsors.names])]

const logos = await source.fetch(
	`*[_type == 'logo' && name in $names]{ name, 'asset': image.default.asset->{url, originalFilename, mimeType} }`,
	{ names: needed },
)

const slug = (s) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')

const idByName = new Map()

for (const logo of logos) {
	if (!logo.asset?.url) {
		console.warn(`  ! ${logo.name} has no default image — skipped`)
		continue
	}

	const _id = `logo-${slug(logo.name)}`
	const filename = logo.asset.originalFilename ?? `${slug(logo.name)}.png`

	let assetId = await target.fetch(
		`*[_type == 'sanity.imageAsset' && originalFilename == $filename][0]._id`,
		{ filename },
	)

	if (!assetId) {
		const res = await fetch(logo.asset.url)
		if (!res.ok) throw new Error(`Fetch failed for ${logo.name}: ${res.status}`)
		const uploaded = await target.assets.upload(
			'image',
			Buffer.from(await res.arrayBuffer()),
			{ filename, contentType: logo.asset.mimeType },
		)
		assetId = uploaded._id
	}

	await target.createOrReplace({
		_id,
		_type: 'logo',
		// 2026 calls this `name`; upstream's 2027 schema calls it `title`.
		title: logo.name,
		image: {
			_type: 'object',
			default: {
				_type: 'image',
				asset: { _type: 'reference', _ref: assetId },
			},
		},
	})

	idByName.set(logo.name, _id)
}

console.log(`✓ migrated ${idByName.size} logo documents`)

/* ---- 3. repoint the walls ---- */

const refs = (names) =>
	names
		.filter((n) => idByName.has(n))
		.map((n, i) => ({
			_key: `l${i}-${slug(n)}`,
			_type: 'reference',
			_ref: idByName.get(n),
		}))

const doc = await target.getDocument('page-index')
const modules = (doc?.modules ?? []).map((m) => {
	if (m._type !== 'logo-wall') return m
	const isSponsors = m._key === 'logo-wall-sponsors'
	return {
		...m,
		logos: refs(isSponsors ? sponsors.names : customers.names),
		logoType: 'default',
	}
})

await target.patch('page-index').set({ modules }).commit()

// Drop the Figma-derived placeholders.
await target.delete({ query: `*[_type == 'logo' && _id match 'logo-wall-*']` })

console.log('✓ walls repointed; placeholder logos removed')
for (const m of modules.filter((m) => m._type === 'logo-wall'))
	console.log(
		`  ${m._key}: ${m.logos.length} logos, ${m.columns}x${m.rows}/page`,
	)
