/**
 * Seeds the agenda module on page/index with the approved Figma copy and the
 * three day photos. Uploads images only if an asset with the same filename
 * isn't already present, so re-running is cheap.
 *
 * Usage: node scripts/seed-agenda.mjs <dir-with-day1.jpg,day2.jpg,day3.jpg>
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
if (!dir)
	throw new Error('Pass the directory holding day1.jpg / day2.jpg / day3.jpg')

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-17',
	token: process.env.SANITY_API_READ_TOKEN,
	useCdn: false,
})

async function upload(file) {
	const filename = `designer-${basename(file)}`
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

const days = [
	{
		_key: 'day1',
		chip: 'DAY 1',
		date: 'Monday, April 26',
		file: 'day1.jpg',
		alt: 'Attendees working together on laptops at Appian World',
		topics: [
			'DevCon',
			'Partner Summit',
			'Partner Sales Academy',
			'Welcome Reception',
		],
	},
	{
		_key: 'day2',
		chip: 'DAY 2',
		date: 'Tuesday, April 27',
		file: 'day2.jpg',
		alt: 'A speaker presenting from the Appian keynote stage',
		topics: [
			'5K Run',
			'Keynotes: CEO & Product Vision',
			'Breakout Sessions',
			'Innovation Showcase & Networking',
			'Appian Expert Meetings',
			'Exhibit Hall Happy Hour',
		],
	},
	{
		_key: 'day3',
		chip: 'DAY 3',
		date: 'Wednesday, April 28',
		file: 'day3.jpg',
		alt: 'Two attendees talking in the Appian World exhibit hall',
		topics: [
			'Yoga',
			'Keynote: Guest Speaker',
			'Breakout Sessions',
			'Innovation Showcase & Networking',
			'Appian Expert Meetings',
			{ title: 'Closing Conference Party', highlight: true },
		],
	},
]

const resolved = []
for (const day of days) {
	const assetId = await upload(join(dir, day.file))
	console.log(`✓ ${day.file} → ${assetId}`)
	resolved.push({
		_key: day._key,
		_type: 'day',
		chip: day.chip,
		date: day.date,
		image: {
			_type: 'image',
			alt: day.alt,
			asset: { _type: 'reference', _ref: assetId },
		},
		topics: day.topics.map((t, i) => ({
			_key: `${day._key}-t${i}`,
			_type: 'topic',
			title: typeof t === 'string' ? t : t.title,
			...(typeof t === 'object' && t.highlight && { highlight: true }),
		})),
	})
}

const agenda = {
	_key: 'agenda',
	_type: 'agenda',
	intro: 'Agenda at a glance',
	days: resolved,
}

// Desktop order: hero, front-row, agenda, … Insert rather than append, so
// re-running once later modules exist doesn't shunt it to the end of the page.
const page = await client.getDocument('page-index')
const rest = (page?.modules ?? []).filter((m) => m._type !== 'agenda')
const after = rest.findIndex((m) => m._type === 'front-row')
const modules =
	after === -1
		? [...rest, agenda]
		: [...rest.slice(0, after + 1), agenda, ...rest.slice(after + 1)]

await client.patch('page-index').set({ modules }).commit()

console.log('✓ agenda seeded on page-index')
