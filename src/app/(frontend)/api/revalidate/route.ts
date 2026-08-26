import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

/**
 * Sanity webhook target. Published pages are cached under `cacheLife: sanity`
 * (1y), so nothing re-renders on its own — this is how content edits go live.
 *
 * Redirect documents are resolved in next.config at BUILD time, so edits to
 * them need a redeploy (point a Vercel Deploy Hook at the same webhook), not a
 * revalidate. Everything else in the filter below is handled here.
 *
 * Configure in manage.sanity.io > API > Webhooks:
 *   URL     POST https://appianworld.com/api/revalidate
 *   Trigger create / update / delete
 *   Filter  _type in ['site', 'page', 'global-module', 'navigation', 'logo', 'quote']
 *   Secret  SANITY_REVALIDATE_SECRET
 *
 * The whole site is one page plus iframe shells, so a blanket revalidate of the
 * root layout is both correct and cheaper to reason about than tag plumbing.
 */
export async function POST(req: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET

	if (!secret) {
		console.error('[revalidate] SANITY_REVALIDATE_SECRET is not set')
		return Response.json({ message: 'Not configured' }, { status: 500 })
	}

	const signature = req.headers.get(SIGNATURE_HEADER_NAME)

	if (!signature) {
		return Response.json({ message: 'Missing signature' }, { status: 401 })
	}

	// Must be the raw body — re-encoding JSON changes the bytes and breaks the HMAC.
	const body = await req.text()

	if (!(await isValidSignature(body, signature, secret))) {
		return Response.json({ message: 'Invalid signature' }, { status: 401 })
	}

	revalidatePath('/', 'layout')

	let documentType: string | undefined
	try {
		documentType = JSON.parse(body)?._type
	} catch {
		// Signature already passed; a body we can't parse still justifies the purge.
	}

	return Response.json({ revalidated: true, documentType })
}
