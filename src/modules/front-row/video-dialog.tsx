'use client'

import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
	defaultLayoutIcons,
	DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
import { useEffect, useRef, useState } from 'react'
import Close from '@/ui/close'
import IconButton from '@/ui/icon-button'
import Play from '@/ui/play'

/**
 * Vidstack drives the YouTube iframe API behind its own controls. That is the
 * only way to keep YouTube's logo and "Watch on YouTube" chrome off the player
 * — the `modestbranding` parameter was dropped by YouTube in August 2023.
 *
 * The player is only mounted once the dialog opens, so the YouTube embed costs
 * nothing on first paint.
 */
export default function VideoDialog({
	youtubeId,
	label,
}: {
	youtubeId: string
	label: string
}) {
	const dialog = useRef<HTMLDialogElement>(null)
	const [open, setOpen] = useState(false)

	// Unmount the player on close so playback actually stops.
	useEffect(() => {
		const el = dialog.current
		if (!el) return
		const onClose = () => setOpen(false)
		el.addEventListener('close', onClose)
		return () => el.removeEventListener('close', onClose)
	}, [])

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpen(true)
					dialog.current?.showModal()
				}}
				className="text-p-medm text-link-on-dark-brand gap-intra-xsml rounded-020 flex w-fit cursor-pointer items-center py-3 font-medium hover:underline lg:py-0"
			>
				<Play className="size-4 shrink-0" />
				{label}
			</button>

			{/* Backdrop click closes: ::backdrop is part of the dialog box, so a click
			 * out there targets the dialog; content clicks target a descendant. */}
			<dialog
				ref={dialog}
				aria-label={label}
				onClick={(e) => {
					if (e.target === e.currentTarget) dialog.current?.close()
				}}
				className="bg-page/90 p-intra-lrge open:gap-intra-smll m-auto w-full max-w-5xl backdrop:bg-black/70 open:flex open:flex-col"
			>
				{/* showModal() gives focus trapping and Esc for free, but no visible way
				 * out. The DS uses its Icon Button with icon-delete here. */}
				<IconButton
					label="Close video"
					onClick={() => dialog.current?.close()}
					className="self-end"
				>
					<Close className="size-4" />
				</IconButton>

				{open && (
					<MediaPlayer
						title={label}
						src={`youtube/${youtubeId}`}
						playsInline
						autoPlay
						// Default is 'visible' (load on intersection). The player only
						// mounts after a click, so waiting on intersection just delays it.
						load="eager"
						className="w-full"
					>
						<MediaProvider />
						<DefaultVideoLayout icons={defaultLayoutIcons} />
					</MediaPlayer>
				)}
			</dialog>
		</>
	)
}
