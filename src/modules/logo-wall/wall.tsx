'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Logo } from '@/sanity/types'
import Chevron from '@/ui/chevron'
import IconButton from '@/ui/icon-button'
import Img from '@/ui/img'

/** The subset of `logo` the wall query projects. */
export type WallLogo = Pick<Logo, '_id' | 'title' | 'image'>

/** Mobile page size, per the artboards (6 rows x 2 cols at 360). */
const MOBILE_PER_PAGE = 12

/**
 * Owns the page state; the heading arrives as `children` so its CTAs stay
 * server-rendered under the desktop pager on the heading row.
 *
 * The breakpoints partition the same logos differently, so a logo's page index
 * depends on the viewport. A JS media query would bake one partition into the
 * server render and flash the other on hydration, so every logo carries both
 * indices and hides against whichever applies at that width — independent page
 * state per breakpoint, both correct in SSR.
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
	/** Desktop page size. 0 shows everything and hides both pagers. */
	perPage: number
	logoType: 'default' | 'light' | 'dark'
	/** Render logos as white silhouettes (the wall sits on a dark ground). */
	monochrome: boolean
	children: React.ReactNode
}) {
	const pageCount = (size: number) =>
		size ? Math.ceil(logos.length / size) : 1

	const desktopPages = pageCount(perPage)
	const mobilePages = pageCount(perPage && MOBILE_PER_PAGE)

	const [desktopPage, setDesktopPage] = useState(0)
	const [mobilePage, setMobilePage] = useState(0)
	const desktopIndex = Math.min(desktopPage, desktopPages - 1)
	const mobileIndex = Math.min(mobilePage, mobilePages - 1)

	const entries = useMemo(
		() =>
			logos.map((logo, i) => ({
				logo,
				desktop: perPage ? Math.floor(i / perPage) : 0,
				mobile: perPage ? Math.floor(i / MOBILE_PER_PAGE) : 0,
			})),
		[logos, perPage],
	)

	return (
		<div className="gap-intra-huge flex flex-col">
			<div className="gap-intra-xxlg flex flex-col lg:flex-row lg:items-end lg:justify-between">
				{children}

				{desktopPages > 1 && (
					<div className="gap-intra-xlrg hidden shrink-0 items-center lg:flex">
						<Pager
							index={desktopIndex}
							count={desktopPages}
							onChange={setDesktopPage}
						/>
					</div>
				)}
			</div>

			{/* aria-live so a page change is announced with the new contents. */}
			<ul
				aria-live="polite"
				className={cn(
					'gap-intra-xxlg grid grid-cols-2 sm:grid-cols-3',
					columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-6',
				)}
			>
				{entries.map(({ logo, desktop, mobile }) => {
					const image =
						logo.image?.[logoType] ?? logo.image?.default ?? logo.image?.light

					return (
						<li
							key={logo._id}
							className={cn(
								'border-overlay-light-20 rounded-030 flex aspect-[160/120] items-center justify-center overflow-clip border',
								desktopPages > 1 && desktop !== desktopIndex && 'lg:hidden',
								mobilePages > 1 && mobile !== mobileIndex && 'max-lg:hidden',
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

			{/* Mobile: a full-width bar under the grid, buttons at the extremes. */}
			{mobilePages > 1 && (
				<div className="flex items-center justify-between lg:hidden">
					<Pager
						index={mobileIndex}
						count={mobilePages}
						onChange={setMobilePage}
						fill
					/>
				</div>
			)}
		</div>
	)
}

function Pager({
	index,
	count,
	onChange,
	fill,
}: {
	index: number
	count: number
	onChange: (page: number) => void
	/** Centre the count in the space between the buttons rather than hugging it. */
	fill?: boolean
}) {
	return (
		<>
			<IconButton
				label="Previous logos"
				disabled={index === 0}
				onClick={() => onChange(index - 1)}
			>
				<Chevron direction="left" className="size-4" />
			</IconButton>

			<p
				className={cn(
					'text-p-medm text-body-on-dark-subtle tabular-nums',
					fill && 'flex-1 text-center',
				)}
			>
				<span className="sr-only">Page </span>
				{index + 1} / {count}
			</p>

			<IconButton
				label="More logos"
				disabled={index === count - 1}
				onClick={() => onChange(index + 1)}
			>
				<Chevron className="size-4" />
			</IconButton>
		</>
	)
}
