import { cn } from '@/lib/utils'

/**
 * The DS's `Button / Icon Button`, shared by the logo-wall pagers and the
 * video modal's dismiss. Disabled keeps the cursor but drops the hover fill.
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
