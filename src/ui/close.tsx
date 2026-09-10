/** DS `icon-delete` — 16 grid, stroked at 1.33 with round caps. */
export default function Close({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 4l8 8M12 4l-8 8"
				stroke="currentColor"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
