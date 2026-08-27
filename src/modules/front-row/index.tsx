import { stegaClean } from 'next-sanity'
import { Module } from '@/modules'
import type { FrontRow } from '@/sanity/types'
import Img from '@/ui/img'
import VideoDialog from './video-dialog'
import youtubeId from './youtube-id'

export default function ({
	intro,
	descriptors,
	image,
	youtubeId: youtubeIdInput,
	videoLabel,
	...props
}: FrontRow) {
	const videoId = youtubeId(youtubeIdInput)

	return (
		<Module className="bg-band-base relative isolate overflow-clip" {...props}>
			{image?.asset && (
				<Img
					image={image}
					width={2560}
					alt={image.alt ?? ''}
					className="absolute inset-0 -z-20 size-full object-cover"
				/>
			)}

			{/* Two scrims, as in the design. The tall one darkens the photo broadly so
			 * the play link and heading stay legible wherever they land; the short one
			 * does the heavy lifting behind the columns. Without the tall one the link
			 * sits on bare photo. */}
			<div
				aria-hidden
				className="from-band-base absolute inset-x-0 top-[70px] -z-10 h-[1124px] bg-linear-to-t to-transparent"
			/>
			<div
				aria-hidden
				className="from-band-scrim absolute inset-x-0 bottom-0 -z-10 h-60 bg-linear-to-t from-10% to-transparent"
			/>

			{/* min-h, not h: below ~1280 the column body text wraps to more lines, and
			 * a fixed height would push the content block up over the photo instead of
			 * letting the band grow.
			 *
			 * The top padding reserves the photo's share of the band (388px in the
			 * artboard, measured to the play link). Below ~1280 the column body text
			 * wraps to more lines, so the band grows downward and the photo keeps its
			 * height, rather than the copy climbing into the image. */}
			<div className="section gap-intra-xxlg pb-intra-xxlg relative flex flex-col pt-[40vw] lg:min-h-[689px] lg:pt-[388px]">
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
