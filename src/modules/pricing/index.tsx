import { PortableText, stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { Pricing } from '@/sanity/types'
import Check from '@/ui/check'
import CTAList from '@/ui/cta-list'
import { marks } from '@/ui/portable-text-marks'

export default function ({
	intro,
	badge,
	badgeAfterCutoff,
	price,
	fullPrice,
	cutoff,
	cutoffNote,
	ctaLabelAfterCutoff,
	includes,
	ctas,
	note,
	testimonials,
	...props
}: Pricing) {
	// Evaluated server-side. The page is cached for an hour (see CachedPage), so
	// the rollover lands within an hour of the cutoff rather than instantly.
	//
	// The cutoff is INCLUSIVE. A Sanity date parses as UTC midnight, so comparing
	// against it directly ends the early bird at the start of that day — a full
	// day before the "through <date>" copy promises.
	const cutoffDate = stegaClean(cutoff)
	const earlyBirdOver =
		!!cutoffDate && new Date(`${cutoffDate}T23:59:59.999Z`) < new Date()

	// `||` not `??`: an emptied string field is not a usable price.
	const shownPrice = earlyBirdOver ? fullPrice || price : price
	const struckPrice = earlyBirdOver ? null : fullPrice
	const shownBadge = earlyBirdOver ? badgeAfterCutoff : badge

	// Stop the button advertising a price that is no longer on offer.
	const shownCtas =
		earlyBirdOver && ctaLabelAfterCutoff && ctas?.length
			? ctas.map((cta, i) =>
					i === 0 && cta.link
						? { ...cta, link: { ...cta.link, label: ctaLabelAfterCutoff } }
						: cta,
				)
			: ctas

	return (
		<Module {...props}>
			<div className="section gap-intra-huge pt-inter-medm lg:pt-inter-xlrg flex flex-col pb-0">
				{intro && <h2 className="text-h-medm text-balance">{intro}</h2>}

				<div className="gap-intra-xxlg grid items-stretch lg:grid-cols-2">
					<div className="gap-intra-xxlg flex flex-col">
						<div className="text-body-on-light gap-intra-xxlg rounded-030 p-intra-xxlg flex flex-col items-start bg-white">
							{shownBadge && (
								<p className="border-border-on-light-secondary bg-surface-light-secondary text-p-xsml text-body-on-light-subtle px-intra-medm py-intra-xsml rounded-full border font-medium tracking-[0.05em]">
									{shownBadge}
								</p>
							)}

							<div className="gap-intra-medm flex flex-col">
								<div className="gap-intra-medm flex items-baseline">
									<p className="text-h-huge text-heading-on-light font-semibold">
										{shownPrice}
									</p>
									{struckPrice && (
										<p className="text-p-lrge text-body-on-light-placeholder line-through">
											{struckPrice}
										</p>
									)}
								</div>
								{cutoffNote && !earlyBirdOver && (
									<p className="text-p-xsml text-body-on-light-subtle">
										{cutoffNote}
									</p>
								)}
							</div>

							{!!includes?.length && (
								<>
									<hr className="border-border-on-light-primary w-full" />
									<ul className="gap-intra-medm pt-intra-xsml flex w-full flex-col">
										{includes.map((item, i) => (
											<li
												key={i}
												className="text-p-medm text-heading-on-light-subtle gap-intra-medm flex items-center"
											>
												<Check className="text-heading-on-light-subtle size-4 shrink-0" />
												<span className="flex-1">{item}</span>
											</li>
										))}
									</ul>
								</>
							)}

							<CTAList ctas={shownCtas} className="w-full *:w-full" />
						</div>

						{(note?.body || note?.footnote) && (
							<div className="gap-intra-medm rounded-030 p-intra-xxlg flex flex-col bg-white">
								{note.body && (
									<div className="text-p-medm text-heading-on-light [&_a]:text-link-on-light-brand [&_a]:font-medium">
										<PortableText value={note.body} components={{ marks }} />
									</div>
								)}
								{note.footnote && (
									<p className="text-p-smll text-heading-on-light-subtle">
										{note.footnote}
									</p>
								)}
							</div>
						)}
					</div>

					{!!testimonials?.length && (
						<ul className="gap-intra-xxlg flex flex-col">
							{testimonials.map((t, i) => (
								<li
									key={t._key ?? i}
									className="from-quote-card-from to-quote-card-to gap-intra-xlrg rounded-030 p-intra-xxlg flex flex-1 flex-col justify-between bg-linear-to-l"
								>
									{/* Hanging indent pulls the opening quote mark out of the
									 * text column, matching the design's -0.45em optical offset. */}
									<p className="text-p-lrge text-heading-on-dark -indent-[0.45em] text-pretty">
										{t.quote}
									</p>
									{(t.role || t.organization) && (
										<div className="text-p-smll text-heading-on-dark-subtle">
											{t.role && <p className="font-medium">{t.role}</p>}
											{t.organization && <p>{t.organization}</p>}
										</div>
									)}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</Module>
	)
}
