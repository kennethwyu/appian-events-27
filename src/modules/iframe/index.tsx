'use client'

import IframeResizer from '@iframe-resizer/react'
import { stegaClean } from 'next-sanity'
import type { Iframe } from '@/sanity/types'

/**
 * Cvent embeds. `checkOrigin={false}` because the Cvent pages are on a
 * different origin and don't post back a whitelist; iframe-resizer still needs
 * its script on the child page to auto-size, so verify each URL before launch.
 *
 * Registration is deliberately NOT embedded — Cvent's registration flow breaks
 * in an iframe, so /register is a redirect document instead.
 */
export default function ({ url, title, minHeight = 800 }: Iframe) {
	const src = stegaClean(url)
	if (!src) return null

	return (
		<IframeResizer
			license="GPLv3"
			src={src}
			title={stegaClean(title) || 'Embedded page'}
			checkOrigin={false}
			className="no-scrollbar w-full"
			style={{ minHeight: `${stegaClean(minHeight) ?? 800}px` }}
		/>
	)
}
