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
	align,
	logoType,
	...props
}: LogoWall) {
	if (!logos?.length) return null

	const cols = Number(stegaClean(columns)) === 4 ? 4 : 6
	const rowCount = Number(stegaClean(rows) ?? 3)
	const centred = stegaClean(align) === 'center'

	return (
		<Module {...props}>
			<div className="section pt-inter-xlrg pb-0">
				<Wall
					logos={logos as unknown as WallLogo[]}
					columns={cols}
					perPage={Number.isFinite(rowCount) ? cols * rowCount : cols * 3}
					logoType={
						(stegaClean(logoType) as 'default' | 'light' | 'dark') ?? 'light'
					}
					centred={centred}
				>
					{/* The heading column is 544 in the artboard, so the heading wraps
					 * rather than running the full width of the section. */}
					<div
						className={cn(
							'gap-intra-lrge flex max-w-[544px] flex-col',
							centred && 'items-center text-center',
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
		</Module>
	)
}
