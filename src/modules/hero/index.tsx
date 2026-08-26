import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { Hero } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Star from '@/ui/star'

export default function ({
	urgency,
	headline,
	description,
	eventDate,
	eventLocation,
	ctas,
	taglineLead,
	taglineEmphasis,
	stats,
	showVisual = true,
	...props
}: Hero) {
	const hasTagline = !!(taglineLead || taglineEmphasis)
	const hasEventInfo = !!(eventDate || eventLocation || ctas?.length)

	return (
		<Module
			className="hero-gradient text-heading-on-dark relative overflow-clip"
			{...props}
		>
			{/* Figma places the visual flush to the 1280 frame's right edge, outside
			 * the grid margin, vertically centred. Absolute positioning resolves
			 * against the section's padding box, which is exactly that edge. */}
			<div className="section relative flex flex-col py-12 lg:h-[1000px] lg:py-30">
				{stegaClean(showVisual) !== false && (
					// Purely decorative and desktop-only, so it's a background image on a
					// `hidden lg:block` element rather than an <img>: browsers never fetch
					// a background on a display:none element, which keeps the 21KB off
					// mobile. An <img> would still be requested there, and `loading="lazy"`
					// only defers it heuristically.
					<div
						aria-hidden
						className="pointer-events-none absolute top-1/2 right-0 hidden h-[841px] w-[624px] -translate-y-1/2 bg-[url('/hero/visual.svg')] bg-contain bg-no-repeat select-none lg:block"
					/>
				)}

				<div className="relative flex max-w-[544px] flex-col gap-10 lg:gap-16">
					{urgency && (
						<p className="border-overlay-light-40 text-p-xsml px-intra-medm py-intra-xsml w-fit rounded-full border bg-white/10 tracking-[0.05em]">
							{urgency}
						</p>
					)}

					<div className="gap-intra-xlrg flex flex-col">
						<h1 className="text-display lg:text-display-lg text-balance">
							{headline}
						</h1>
						{description && (
							<p className="text-p-lrge text-heading-on-dark-subtle text-pretty">
								{description}
							</p>
						)}
					</div>

					{hasEventInfo && (
						<div className="border-overlay-light-40 gap-intra-xxlg pl-intra-xxlg flex flex-col border-l">
							{(eventDate || eventLocation) && (
								<div className="gap-intra-xsml flex flex-col">
									{eventDate && (
										<p className="text-p-lrge font-medium">{eventDate}</p>
									)}
									{eventLocation && (
										<p className="text-p-medm text-heading-on-dark-subtle whitespace-pre-line">
											{eventLocation}
										</p>
									)}
								</div>
							)}
							<CTAList ctas={ctas} className="max-sm:*:w-full" />
						</div>
					)}
				</div>

				{(hasTagline || !!stats?.length) && (
					<div className="gap-intra-xxlg lg:mt-inter-xlrg relative mt-10 flex max-w-[544px] flex-col">
						{hasTagline && (
							<p className="text-p-lrge text-heading-on-dark-subtle gap-intra-smll flex items-start">
								<Star boxed className="mt-1.5 size-5 shrink-0" />
								<span>
									{taglineLead}{' '}
									<strong className="text-heading-on-dark font-medium">
										{taglineEmphasis}
									</strong>
								</span>
							</p>
						)}

						{!!stats?.length && (
							<dl className="gap-x-intra-lrge gap-y-intra-xxlg lg:gap-x-intra-xxlg grid grid-cols-[max-content_1fr] lg:grid-cols-3">
								{stats.map((stat, i) => (
									<div
										key={stat._key ?? i}
										/* contents on mobile so every row shares the same two columns
										 * and the labels line up regardless of value width */
										className="lg:gap-intra-smll contents lg:flex lg:flex-col lg:items-start"
									>
										<dt className="text-h-lrge">{stat.value}</dt>
										<dd className="text-p-medm text-heading-on-dark-subtle whitespace-pre-line">
											{stat.label}
										</dd>
									</div>
								))}
							</dl>
						)}
					</div>
				)}
			</div>
		</Module>
	)
}
