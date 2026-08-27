import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { Iframe } from '@/sanity/types'
import Resizer from './resizer'

/**
 * Cvent embeds. Registration is deliberately NOT embedded — Cvent's
 * registration flow breaks in an iframe, so /register is a redirect document.
 *
 * `title` is destructured rather than spread so it can't land on the wrapping
 * <section> as an HTML title attribute.
 */
export default function ({ url, title, minHeight, ...props }: Iframe) {
	const src = stegaClean(url)
	if (!src) return null

	const height = Number(stegaClean(minHeight))

	return (
		<Module {...props}>
			<Resizer
				src={src}
				title={stegaClean(title) || 'Embedded page'}
				minHeight={Number.isFinite(height) && height > 0 ? height : 800}
			/>
		</Module>
	)
}
