import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
const env26 = readFileSync('/Users/kenneth.yu/Projects/appian-events-26/.env.world', 'utf8')
const val = (k) => env26.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')
const client = createClient({
	projectId: val('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: val('NEXT_PUBLIC_SANITY_DATASET'),
	apiVersion: '2026-06-17', token: val('SANITY_API_READ_TOKEN'), useCdn: false,
})
const mods = await client.fetch(`*[_type == 'page']{
  'slug': metadata.slug.current,
  'logoLists': modules[_type == 'logo-list']{
    _key, logoType, autoScroll,
    'intro': pt::text(intro),
    'logos': logos[]->name
  }
}[count(logoLists) > 0]`)
console.log(JSON.stringify(mods, null, 1))
