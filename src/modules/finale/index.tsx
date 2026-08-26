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
										<p className="text-h-smll max-w-[608px] text-balance">
											{feature.title}
										</p>
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

					{!!gallery?.length && (
						<div className="gap-intra-xxlg flex flex-col">
							<div className="gap-intra-xxlg grid grid-cols-2">
								{tall?.asset && (
									<Img
										image={tall}
										width={320}
										alt={tall.alt ?? ''}
										className="rounded-030 aspect-[160/264] size-full object-cover"
									/>
								)}
								<div className="gap-intra-xxlg flex flex-col">
									{[smallTop, smallBottom].map(
										(img, i) =>
											img?.asset && (
												<Img
													key={img._key ?? i}
													image={img}
													width={320}
													alt={img.alt ?? ''}
													className="rounded-030 aspect-[160/116] w-full object-cover"
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
									className="rounded-030 aspect-4/3 w-full object-cover"
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</Module>
	)
}
