import { groq } from 'next-sanity'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'

/**
 * /register is an outbound redirect to Cvent, not an iframe shell — Cvent's
 * registration flow does not work embedded. Keeping the vanity path means CTAs
 * stay on-domain for analytics and the destination is editable in Sanity.
 *
 * Uncached (route handlers are dynamic by default under cacheComponents) — a
 * stale redirect target would send people to the wrong registration page.
 */
const REGISTRATION_URL_QUERY = groq`*[_type == 'site'][0].registrationUrl`

export async function GET() {
	let url: string | null = null

	try {
		url = await client.fetch<string | null>(REGISTRATION_URL_QUERY)
	} catch (error) {
		console.error(
			'[register] Could not read registrationUrl from Sanity',
			error,
		)
	}

	// No destination configured yet — send people somewhere useful rather than 500.
	redirect(url || '/')
}
