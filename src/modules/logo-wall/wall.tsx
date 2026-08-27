'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Logo } from '@/sanity/types'
import Chevron from '@/ui/chevron'
import Img from '@/ui/img'

/** The subset of `logo` the wall query projects. */
export type WallLogo = Pick<Logo, '_id' | 'title' | 'image'>

/**
 * Owns the page state. The heading block arrives as `children` so its CTAs stay
 * server-rendered, while the pager can still sit on the heading's row — which is
 * where the design puts it, bottom-aligned to the right.
 *
 * Pagination is desktop-only, per the mobile artboards: every logo is in the DOM
 * and off-page ones are hidden with `lg:hidden`, rather than gating on a JS
 * media query. That keeps SSR correct at both breakpoints (no hydration flash)
 * and means mobile shows the full set with nothing unreachable. The hidden
 * images aren't downloaded either — <Img> leaves `loading` unset, so next/image
 * lazy-loads and a display:none image is never fetched.
 */
export default function Wall({
	logos,
	columns,
	perPage,
	logoType,
	monochrome,
	children,
}: {
	logos: WallLogo[]
	columns: number
	/** 0 shows everything and hides the pager. */
	perPage: number
	logoType: 'default' | 'light' | 'dark'
	/** Render logos as white silhouettes (the wall sits on a dark ground). */
	monochrome: boolean
	children: React.ReactNode
}) {
	const pages = useMemo(() => {
		if (!perPage) return [logos]
		return Array.from({ length: Math.ceil(logos.length / perPage) }, (_, i) =>
			logos.slice(i * perPage, (i + 1) * perPage),
		)
	}, [logos, perPage])

	const [page, setPage] = useState(0)
	const index = Math.min(page, pages.length - 1)
	const paged = pages.length > 1

	const entries = useMemo(
		() =>
			pages.flatMap((entry, pageIndex) =>
				entry.map((logo) => ({ logo, pageIndex })),
			),
		[pages],
	)

	return (
		<div className="gap-intra-huge flex flex-col">
			<div className="gap-intra-xxlg flex flex-col lg:flex-row lg:items-end lg:justify-between">
				{children}

				{paged && (
					<div className="gap-intra-xlrg hidden shrink-0 items-center lg:flex">
						<PagerButton
							label="Previous logos"
							disabled={index === 0}
							onClick={() => setPage(index - 1)}
						>
							<Chevron direction="left" className="size-4" />
						</PagerButton>

						<p className="text-p-medm text-body-on-dark-subtle tabular-nums">
							<span className="sr-only">Page </span>
							{index + 1} / {pages.length}
						</p>

						<PagerButton
							label="More logos"
							disabled={index === pages.length - 1}
							onClick={() => setPage(index + 1)}
						>
							<Chevron className="size-4" />
						</PagerButton>
					</div>
				)}
			</div>

			{/* aria-live so a desktop page change is announced with the new contents. */}
			<ul
				aria-live="polite"
				className={cn(
					'gap-intra-xxlg grid grid-cols-2 sm:grid-cols-3',
					columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-6',
				)}
			>
				{entries.map(({ logo, pageIndex }) => {
					const image =
						logo.image?.[logoType] ?? logo.image?.default ?? logo.image?.light

					return (
						<li
							key={logo._id}
							className={cn(
								'border-overlay-light-20 rounded-030 flex aspect-[160/120] items-center justify-center overflow-clip border',
								paged && pageIndex !== index && 'lg:hidden',
							)}
						>
							{image?.asset && (
								<Img
									image={image}
									width={200}
									alt={logo.title ?? ''}
									className={cn(
										'max-h-[30px] w-auto max-w-[100px] object-contain',
										// brightness-0 crushes the artwork to a black silhouette
										// (alpha survives), then invert makes it pure white.
										// Unlike grayscale+invert the result doesn't depend on
										// the source's luminance, so a mixed set stays uniform.
										monochrome && 'brightness-0 invert',
									)}
								/>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

function PagerButton({
	label,
	disabled,
	onClick,
	children,
}: {
	label: string
	disabled: boolean
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			className="border-overlay-light-20 rounded-020 text-heading-on-dark hover:bg-overlay-light-20 flex size-10 cursor-pointer items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
		>
			{children}
		</button>
	)
}
