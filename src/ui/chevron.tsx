export default function Chevron({
	direction = 'right',
	className,
}: {
	direction?: 'left' | 'right'
	className?: string
}) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
				stroke="currentColor"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
