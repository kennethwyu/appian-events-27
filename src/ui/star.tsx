export default function Star({
	boxed = false,
	className,
}: {
	/** Adds the rounded outline around the star (hero tagline treatment). */
	boxed?: boolean
	className?: string
}) {
	return (
		<svg
			viewBox="0 0 20 20"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			{boxed && (
				<rect
					x="0.5"
					y="0.5"
					width="19"
					height="19"
					rx="3.5"
					stroke="currentColor"
					strokeOpacity="0.4"
				/>
			)}
			<path
				d="M3 10C8.25011 10.9665 9.0335 11.7499 10 17C10.9665 11.7499 11.7499 10.9665 17 10C11.7499 9.0335 10.9665 8.25011 10 3C9.0335 8.25011 8.25011 9.0335 3 10Z"
				fill="currentColor"
			/>
		</svg>
	)
}
