import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Module } from '@/modules'
import type { LogoWall } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Wall, { type WallLogo } from './wall'

export default function ({
	intro,
	body,
	ctas,
	logos,
	columns,
	rows,
	container,
	logoType,
	monochrome,
	sideArt,
	...props
}: LogoWall) {
	if (!logos?.length) return null

	const cols = Number(stegaClean(columns)) === 4 ? 4 : 6
	const rowCount = Number(stegaClean(rows) ?? 3)
	const narrow = stegaClean(container) === 'narrow'
	const art = stegaClean(sideArt) === true

	return (
		<Module
			className={cn('relative', art && 'isolate overflow-x-clip')}
			{...props}
		>
			{/* The spread is 1601 wide against a 1280 artboard, so centred at natural
			 * size the motifs land where they are drawn, bleeding in from either edge.
			 * Taller than the section on purpose, carrying on behind the prefooter.
			 * Desktop only — the mobile artboards omit it, and `hidden` keeps the
			 * 31KB background unfetched there. */}
			{art && (
				<div
					aria-hidden
					className="pointer-events-none absolute top-[179px] left-1/2 -z-10 hidden h-[863px] w-[1601px] -translate-x-1/2 bg-[url('/decor/nodes-spread.svg')] bg-no-repeat lg:block"
				/>
			)}

			<div className="section pt-inter-xlrg pb-0">
				{/* The past-sponsors wall is a 736 centred column in the artboard;
				 * the visionaries wall spans the full grid. */}
				<div className={cn(narrow && 'mx-auto max-w-[736px]')}>
					<Wall
						logos={logos as unknown as WallLogo[]}
						columns={cols}
						perPage={Number.isFinite(rowCount) ? cols * rowCount : cols * 3}
						logoType={
							(stegaClean(logoType) as 'default' | 'light' | 'dark') ??
							'default'
						}
						monochrome={stegaClean(monochrome) !== false}
					>
						{/* The full-width wall caps the heading at the artboard 544; the narrow one
						 * spans its 736 column, which needs flex-1 or it wraps early. A CTA sits
						 * 32 below the heading where a body sits 16. */}
						<div
							className={cn(
								'flex flex-col',
								body ? 'gap-intra-lrge' : 'gap-intra-xxlg',
								narrow ? 'flex-1' : 'max-w-[544px]',
							)}
						>
							{intro && <h2 className="text-h-medm text-balance">{intro}</h2>}
							{body && (
								<p className="text-p-medm text-heading-on-dark-subtle text-pretty">
									{body}
								</p>
							)}
							{!!ctas?.length && <CTAList ctas={ctas} />}
						</div>
					</Wall>
				</div>
			</div>
		</Module>
	)
}
