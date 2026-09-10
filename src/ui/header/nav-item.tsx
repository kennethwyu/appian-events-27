'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'

/**
 * Client leaf so `usePathname` doesn't force the whole nav (and the site fetch
 * behind it) onto the client. The current item gets a 2px rule on the header's
 * bottom edge plus a brighter, heavier label.
 */
export default function NavItem({
	link,
	className,
}: {
	link: SanityLinkType
	className?: string
}) {
	const pathname = usePathname()

	const href =
		link.type === 'internal'
			? ((link.internal as { slug?: string } | undefined)?.slug ?? null)
			: (link.external ?? null)

	// Relative hrefs only — an off-site link is never "current".
	const current =
		!!href &&
		href.startsWith('/') &&
		(href === '/' ? pathname === '/' : pathname.startsWith(href))

	return (
		<SanityLink
			link={link}
			aria-current={current ? 'page' : undefined}
			className={cn(
				className,
				'border-b-2 transition-colors',
				current
					? 'border-border-on-light-primary text-heading-on-dark font-medium'
					: 'hover:border-overlay-light-40 border-transparent',
			)}
		/>
	)
}
