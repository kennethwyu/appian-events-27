import { Module } from '@/modules'
import type { Agenda } from '@/sanity/types'
import Img from '@/ui/img'
import Star from '@/ui/star'

export default function ({ intro, days, ...props }: Agenda) {
	if (!days?.length) return null

	return (
		<Module {...props}>
			{/* Figma runs the day grid flush to the section's bottom edge; the next
			 * section supplies its own top padding. */}
			<div className="section gap-intra-huge pt-inter-medm lg:pt-inter-xlrg flex flex-col pb-0">
				{intro && <h2 className="text-h-medm text-balance">{intro}</h2>}

				{/* Mobile is a snap track (per the 360 artboard); desktop is a 3-up grid.
				 * Negative margin lets the track bleed to the viewport edge while the
				 * first card still lines up with the grid margin. */}
				<ul className="no-scrollbar -mx-grid-margin-mobile gap-intra-lrge px-grid-margin-mobile lg:gap-intra-xxlg flex snap-x snap-mandatory overflow-x-auto lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
					{days.map((day, i) => (
						<li
							key={day._key ?? i}
							className="gap-intra-medm flex w-[calc(100%-2.5rem)] max-w-[352px] shrink-0 snap-start flex-col lg:w-auto lg:max-w-none"
						>
							{day.image?.asset && (
								<Img
									image={day.image}
									width={704}
									alt={day.image.alt ?? ''}
									className="rounded-030 aspect-4/3 w-full object-cover"
								/>
							)}

							<div className="gap-intra-lrge pt-intra-lrge flex flex-col items-start">
								{day.chip && (
									<p className="border-overlay-light-40 bg-overlay-light-20 text-p-xsml text-body-on-dark-subtle px-intra-medm py-intra-xsml rounded-full border font-medium tracking-[0.05em]">
										{day.chip}
									</p>
								)}
								{day.date && (
									<p className="text-h-smll font-normal">{day.date}</p>
								)}
							</div>

							{!!day.topics?.length && (
								<ul className="border-border-on-dark-secondary text-p-medm gap-intra-medm py-intra-smll pl-intra-xlrg flex flex-1 flex-col border-l">
									{day.topics.map((topic, j) => (
										<li
											key={topic._key ?? j}
											className="gap-intra-smll flex items-start"
										>
											{topic.highlight && (
												<Star className="text-sync-cyan mt-1.5 size-3 shrink-0" />
											)}
											<span className={topic.highlight ? 'font-medium' : ''}>
												{topic.title}
											</span>
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			</div>
		</Module>
	)
}
