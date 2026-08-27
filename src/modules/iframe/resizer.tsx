'use client'

import IframeResizer from '@iframe-resizer/react'

/**
 * Client boundary is this leaf only — importing `Module` here would pull the
 * whole module registry (and every server module) into the client bundle.
 *
 * `checkOrigin={false}` because the Cvent pages are cross-origin and don't post
 * back a whitelist; iframe-resizer still needs its script on the child page to
 * auto-size, so verify each URL before launch.
 *
 * `sandbox` keeps the embed from navigating the top-level window while leaving
 * the capabilities iframe-resizer and Cvent's own scripts need.
 */
export default function Resizer({
	src,
	title,
	minHeight,
}: {
	src: string
	title: string
	minHeight: number
}) {
	return (
		<IframeResizer
			license="GPLv3"
			src={src}
			title={title}
			checkOrigin={false}
			sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
			referrerPolicy="strict-origin-when-cross-origin"
			className="no-scrollbar w-full"
			style={{ minHeight: `${minHeight}px` }}
		/>
	)
}
