import { stegaClean } from 'next-sanity'

const BARE_ID = /^[\w-]{11}$/

/**
 * Accepts either a bare video ID or any of the URL shapes an editor is likely
 * to paste. The field asks for an ID, but a URL is what people actually have,
 * and getting it wrong silently produced an empty player.
 */
export default function youtubeId(input?: string | null) {
	const value = stegaClean(input)?.trim()
	if (!value) return undefined
	if (BARE_ID.test(value)) return value

	try {
		const url = new URL(value)

		// youtu.be/<id>
		if (url.hostname.endsWith('youtu.be')) {
			const id = url.pathname.slice(1)
			return BARE_ID.test(id) ? id : undefined
		}

		// youtube.com/watch?v=<id>
		const v = url.searchParams.get('v')
		if (v && BARE_ID.test(v)) return v

		// youtube.com/{embed,shorts,live}/<id>
		const path = url.pathname.split('/').filter(Boolean)
		const id = path.at(-1)
		return id && BARE_ID.test(id) ? id : undefined
	} catch {
		return undefined
	}
}
