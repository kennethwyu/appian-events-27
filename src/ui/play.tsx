export default function Play({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="8"
				cy="8"
				r="7.25"
				stroke="currentColor"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 5.2 10.9 8l-4.4 2.8V5.2Z"
				stroke="currentColor"
				strokeWidth="1.33"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
