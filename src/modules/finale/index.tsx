import { Module } from '@/modules'
import type { Finale } from '@/sanity/types'
import Img from '@/ui/img'

export default function ({ badge, intro, feature, gallery, ...props }: Finale) {
	const [tall, smallTop, smallBottom, wide] = gallery ?? []

	return (
		<Module {...props}>
			<div className="section gap-intra-xxxl pt-inter-medm relative flex flex-col pb-0">
				<div className="gap-intra-xlrg flex flex-col">
					{badge && (
						<p className="border-overlay-light-40 bg-overlay-light-20 text-p-xsml text-body-on-dark-subtle px-intra-medm py-intra-xsml w-fit rounded-full border font-medium tracking-[0.05em]">
							{badge}
						</p>
					)}
					<h2 className="text-h-medm text-balance">{intro}</h2>
				</div>

				{/* 736 + 32 + 352 = 1120. Aspect ratios rather than fixed heights, so
				 * the mosaic's right column stays exactly as tall as the feature
				 * (264 + 32 + 264 = 560) at any width. */}
				<div className="gap-intra-xxlg grid lg:grid-cols-[736fr_352fr]">
					{/* The caption is laid over the image at lg, as designed. Below that
					 * the image is only ~237px tall while the caption needs ~240px, so
					 * overlaying spills the text out of frame — it drops into normal
					 * flow underneath instead. */}
					{feature?.image?.asset && (
						<figure className="gap-intra-lrge flex flex-col lg:relative lg:isolate lg:block">
							<Img
								image={feature.image}
								width={1472}
								alt={feature.image.alt ?? ''}
								className="rounded-030 aspect-[736/560] w-full object-cover"
							/>
							<div
								aria-hidden
								className="from-band-base/40 rounded-030 absolute inset-0 hidden bg-linear-to-t from-20% to-transparent to-40% lg:block"
							/>
							{(feature.title || feature.body) && (
								<figcaption className="gap-intra-smll lg:p-intra-xxlg flex flex-col lg:absolute lg:inset-x-0 lg:bottom-0">
									{feature.title && (
										<h3 className="text-h-smll max-w-[608px] text-balance">
											{feature.title}
										</h3>
									)}
									{feature.body && (
										<p className="text-p-medm text-heading-on-dark-subtle max-w-[544px] text-pretty">
											{feature.body}
										</p>
									)}
								</figcaption>
							)}
						</figure>
					)}

					{/* The 360 artboard makes the four gallery images one swipe track of
					 * equal 312x234 cards, where desktop is the mosaic (tall, two
					 * stacked smalls, wide beneath). Rather than duplicate the markup
					 * per breakpoint — which would risk fetching both sets — the two
					 * mosaic wrappers go `display: contents` below lg, so their children
					 * flatten into direct children of the track and the DOM stays
					 * single-source. Each image then carries the mobile aspect with the
					 * desktop one behind an lg: variant. */}
					{/* The track gap is 16 between the mobile cards, 32 between the
					 * mosaic's rows at lg. */}
					{!!gallery?.length && (
						<div className="no-scrollbar -mx-grid-margin-mobile gap-intra-lrge px-grid-margin-mobile scroll-px-grid-margin-mobile lg:gap-intra-xxlg flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
							<div className="lg:gap-intra-xxlg contents lg:grid lg:grid-cols-2">
								{tall?.asset && (
									<Img
										image={tall}
										width={640}
										alt={tall.alt ?? ''}
										className="rounded-030 aspect-4/3 w-full shrink-0 snap-start object-cover lg:aspect-[160/264] lg:size-full"
									/>
								)}
								<div className="lg:gap-intra-xxlg contents lg:flex lg:flex-col">
									{[smallTop, smallBottom].map(
										(img, i) =>
											img?.asset && (
												<Img
													key={img._key ?? i}
													image={img}
													width={640}
													alt={img.alt ?? ''}
													className="rounded-030 aspect-4/3 w-full shrink-0 snap-start object-cover lg:aspect-[160/116]"
												/>
											),
									)}
								</div>
							</div>
							{wide?.asset && (
								<Img
									image={wide}
									width={704}
									alt={wide.alt ?? ''}
									className="rounded-030 aspect-4/3 w-full shrink-0 snap-start object-cover"
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</Module>
	)
}
