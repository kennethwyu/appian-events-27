import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { FeatureGrid } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Icon from './icons'

/** The mobile artboard drops the icons, CTA and glow. */
export default function ({ intro, ctas, features, ...props }: FeatureGrid) {
	return (
		<Module className="relative isolate overflow-clip" {...props}>
			{/* pb-0: the grid runs flush to the bottom, as drawn. */}
			<div className="section gap-intra-xxlg lg:pt-inter-lrge relative flex flex-col pt-8 pb-0 lg:flex-row lg:gap-32">
				{/* The SVG carries 120px of blur bleed per side, hence the -120px offsets. */}
				<div
					aria-hidden
					className="absolute bottom-[-120px] left-[calc(var(--spacing-grid-margin-desktop)-120px)] -z-10 hidden h-[641px] w-[496px] bg-[url('/decor/front-row-seat.svg')] bg-no-repeat lg:block"
				/>

				<div className="gap-intra-xxlg lg:pr-intra-smll flex flex-col items-start lg:w-64 lg:shrink-0">
					<h2 className="text-h-medm text-balance">{intro}</h2>
					<CTAList ctas={ctas} className="max-lg:hidden" />
				</div>

				{!!features?.length && (
					<ul className="gap-x-grid-gutter gap-y-intra-xxlg lg:gap-y-intra-maxi grid flex-1 lg:grid-cols-2">
						{features.map((f, i) => (
							<li
								key={f._key ?? i}
								className="gap-intra-xxlg flex flex-col items-start"
							>
								<Icon
									name={stegaClean(f.icon)}
									className="size-8 shrink-0 max-lg:hidden"
								/>
								<div className="gap-intra-medm lg:gap-intra-smll lg:pr-intra-lrge flex flex-col">
									<h3 className="text-h-xsml text-balance">{f.title}</h3>
									{f.body && (
										<p className="text-p-medm text-heading-on-dark-subtle text-pretty">
											{f.body}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</Module>
	)
}
