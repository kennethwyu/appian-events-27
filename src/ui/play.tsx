/** DS "Play Button". The tile is currentColor; the triangle stays neutral-200. */
export default function Play({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 43 32"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="43" height="32" rx="2.67" className="fill-current" />
			<path
				d="M27.17 15.42a.67.67 0 0 1 0 1.16l-8 4.62a.67.67 0 0 1-1-.58v-9.24a.67.67 0 0 1 1-.58l8 4.62Z"
				className="fill-neutral-200"
			/>
		</svg>
	)
}
