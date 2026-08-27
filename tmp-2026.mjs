import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

// read the 2026 token without printing it
const env26 = readFileSync('/Users/kenneth.yu/Projects/appian-events-26/.env.world', 'utf8')
const val = (k) => env26.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')

const client = createClient({
	projectId: val('NEXT_PUBLIC_SANITY_PROJECT_ID'),
	dataset: val('NEXT_PUBLIC_SANITY_DATASET'),
	apiVersion: '2026-06-17',
	token: val('SANITY_API_READ_TOKEN'),
	useCdn: false,
})

const logos = await client.fetch(`*[_type == 'logo']|order(name asc){
  _id, name,
  'variants': image{
    'default': default.asset->{url, originalFilename, mimeType},
    'light': light.asset->{url, originalFilename, mimeType},
    'dark': dark.asset->{url, originalFilename, mimeType}
  }
}`)

console.log('logo documents in 2026 world:', logos.length)
console.log()
for (const l of logos) {
	const has = Object.entries(l.variants ?? {}).filter(([, v]) => v).map(([k]) => k)
	console.log(`  ${(l.name ?? '(untitled)').padEnd(28)} ${has.join(',') || '(no image)'}`)
}
