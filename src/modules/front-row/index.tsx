import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { FrontRow } from '@/sanity/types'
import Img from '@/ui/img'
import VideoDialog from './video-dialog'
import youtubeId from './youtube-id'

/**
 * Desktop and mobile are genuinely different compositions in the artboards, not
 * one responsive layout:
 *
 *   desktop — a full-bleed photo behind the whole band, two scrims, and the copy
 *             bottom-anchored over it with the play link above the heading.
 *   mobile  — the isometric visual in flow, a discrete 3:2 "video still" pulled
 *             up to overlap it with the play link laid over the still, then the
 *             heading and four stacked descriptors on the plain ground.
 *
 * So the media branches per breakpoint while the heading and descriptors are
 * shared. The play link has to appear in both branches (different parents), but
 * only one is ever displayed.
 */
export default function ({
	intro,
	descriptors,
	image,
	youtubeId: youtubeIdInput,
	videoLabel,
	...props
}: FrontRow) {
	const videoId = youtubeId(youtubeIdInput)
	const label = stegaClean(videoLabel) || 'Watch the recap'

	return (
		<Module className="bg-band-base relative isolate overflow-clip" {...props}>
			{/* Desktop media: full-bleed photo plus the design's two scrims. Hidden
			 * below lg — <Img> lazy-loads, so a display:none photo isn't fetched. */}
			<div className="hidden lg:block">
				{image?.asset && (
					<Img
						image={image}
						width={2560}
						alt={image.alt ?? ''}
						className="absolute inset-0 -z-20 size-full object-cover"
					/>
				)}
				<div
					aria-hidden
					className="from-band-base absolute inset-x-0 top-[70px] -z-10 h-[1124px] bg-linear-to-t to-transparent"
				/>
				<div
					aria-hidden
					className="from-band-scrim absolute inset-x-0 bottom-0 -z-10 h-60 bg-linear-to-t from-10% to-transparent"
				/>
			</div>

			{/* lg:pt reserves the photo's 388px share of the band so the copy can't
			 * climb into the image when the columns wrap at narrower desktop widths. */}
			<div className="section gap-intra-xxlg pb-intra-xxlg relative flex flex-col pt-8 lg:min-h-[689px] lg:pt-[388px]">
				{/* Mobile media, in flow. */}
				<div className="lg:hidden">
					<div
						aria-hidden
						className="aspect-[312/420] w-[312px] max-w-full bg-[url('/hero/visual-mobile.svg')] bg-contain bg-no-repeat"
					/>

					<div className="-mx-grid-margin-mobile relative -mt-[69px] aspect-3/2">
						{image?.asset && (
							<Img
								image={image}
								width={720}
								alt={image.alt ?? ''}
								className="size-full object-cover"
							/>
						)}
						{videoId && (
							<div className="left-grid-margin-mobile absolute bottom-16">
								<VideoDialog youtubeId={videoId} label={label} />
							</div>
						)}
					</div>
				</div>

				<div className="gap-intra-xlrg flex flex-col">
					{videoId && (
						<div className="hidden lg:block">
							<VideoDialog youtubeId={videoId} label={label} />
						</div>
					)}
					<h2 className="text-h-medm text-balance">{intro}</h2>
				</div>

				{!!descriptors?.length && (
					<>
						<hr className="border-overlay-light-40 hidden lg:block" />
						<ul className="gap-intra-xxlg grid lg:grid-cols-4">
							{descriptors.map((d, i) => (
								<li key={d._key ?? i} className="gap-intra-medm flex flex-col">
									<h3 className="text-h-xsml text-balance">{d.title}</h3>
									{d.body && (
										<p className="text-p-medm text-heading-on-dark-subtle text-pretty">
											{d.body}
										</p>
									)}
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</Module>
	)
}
