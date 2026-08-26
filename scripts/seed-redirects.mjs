/**
 * Seeds the /register vanity redirect to Cvent.
 *
 * Cvent registration does not work inside an iframe, so registration is an
 * outbound redirect while the other Cvent pages are embedded. Temporary (307)
 * on purpose — a permanent redirect to a third-party URL is cached by browsers
 * forever and cannot be corrected from the CMS.
 *
 * Redirects are resolved in next.config at BUILD time, so changing one needs a
 * redeploy (a Vercel deploy hook on the Sanity webhook automates that).
 *
 * Usage: node scripts/seed-redirects.mjs
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

await client.createOrReplace({
	_id: 'redirect-register',
	_type: 'redirect',
	source: '/register',
	destination: {
		_type: 'link',
		type: 'external',
		// Placeholder — Cvent event not built yet.
		external: 'https://web.cvent.com/event/appian-world-2027/registration',
	},
	permanent: false,
})

// registrationUrl moved back to the redirect document.
await client.patch('site').unset(['registrationUrl']).commit()

console.log('✓ redirect /register → Cvent (307)')
