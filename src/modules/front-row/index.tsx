import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { FrontRow } from '@/sanity/types'
import Img from '@/ui/img'
import VideoDialog from './video-dialog'

export default function ({
	intro,
	descriptors,
	image,
	youtubeId,
	videoLabel,
	...props
}: FrontRow) {
	const videoId = stegaClean(youtubeId)

	return (
		<Module className="relative isolate overflow-clip" {...props}>
			{image?.asset && (
				<Img
					image={image}
					width={2560}
					alt={image.alt ?? ''}
					className="absolute inset-0 -z-20 size-full object-cover"
				/>
			)}

			{/* Scrim so the copy stays legible over the photo. Bottom 240px only,
			 * matching the design's gradient shape. */}
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 -z-10 h-60 bg-linear-to-t from-[#020731] from-10% to-transparent"
			/>

			{/* Content is bottom-anchored; the photo fills the space above it. */}
			<div className="section gap-intra-xxlg pb-intra-xxlg relative flex flex-col justify-end pt-[40vw] lg:h-[689px] lg:pt-0">
				<div className="gap-intra-xlrg flex flex-col">
					{videoId && (
						<VideoDialog
							youtubeId={videoId}
							label={stegaClean(videoLabel) || 'Watch the recap'}
						/>
					)}
					<h2 className="text-h-medm text-balance">{intro}</h2>
				</div>

				{!!descriptors?.length && (
					<>
						<hr className="border-overlay-light-40" />
						<ul className="gap-intra-xxlg grid lg:grid-cols-4">
							{descriptors.map((d, i) => (
								<li key={d._key ?? i} className="gap-intra-medm flex flex-col">
									<p className="text-h-xsml text-balance">{d.title}</p>
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
