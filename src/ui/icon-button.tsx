import { cn } from '@/lib/utils'

/**
 * The DS's `Button / Icon Button` — a 40 square with a 1px overlay border and
 * radius-020. One component in the design system, so one here: the logo-wall
 * pagers and the video modal's dismiss both use it.
 *
 * Disabled keeps the not-allowed cursor but drops the hover fill, per QA.
 */
export default function IconButton({
	label,
	disabled = false,
	onClick,
	className,
	children,
}: {
	label: string
	disabled?: boolean
	onClick: () => void
	className?: string
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				'border-overlay-light-20 rounded-020 text-heading-on-dark enabled:hover:bg-overlay-light-20 flex size-10 shrink-0 cursor-pointer items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40',
				className,
			)}
		>
			{children}
		</button>
	)
}
