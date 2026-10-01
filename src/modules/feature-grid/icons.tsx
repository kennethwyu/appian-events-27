/** Keys are stored in Sanity documents, so don't rename them. */
const PATHS = {
	'clipboard-check':
		'M12 19.5 15 21.5 21 13.5M21.45 5H25a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.55M19 8h-6a2.5 2.5 0 0 1 0-5h6a2.5 2.5 0 0 1 0 5Z',
	'ai-browser-spark':
		'M12 7H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V17M3 13h12m6.38-7.29 1.02-2.48a.38.38 0 0 1 .7 0l1.02 2.48a4.5 4.5 0 0 0 2.17 2.17l2.48 1.02a.38.38 0 0 1 0 .7l-2.48 1.02a4.5 4.5 0 0 0-2.17 2.17l-1.02 2.48a.38.38 0 0 1-.7 0l-1.02-2.48a4.5 4.5 0 0 0-2.17-2.17l-2.48-1.02a.38.38 0 0 1 0-.7l2.48-1.02a4.5 4.5 0 0 0 2.17-2.17Z',
	users:
		'M29.33 28v-2.67a5.34 5.34 0 0 0-4-5.16M20.67 4.39a5.34 5.34 0 0 1 0 9.89M22.67 28c0-2.49 0-3.73-.41-4.71a5.33 5.33 0 0 0-2.89-2.89C18.39 20 17.15 20 14.67 20h-4c-2.49 0-3.73 0-4.71.41a5.33 5.33 0 0 0-2.89 2.89c-.4.98-.4 2.22-.4 4.7M18 9.33a5.33 5.33 0 1 1-10.67 0 5.33 5.33 0 0 1 10.67 0Z',
	'account-setting':
		'M11.31 21.12A8.6 8.6 0 0 1 16 19.77c1.74 0 3.36.5 4.69 1.35m-8.21-7.81a3.52 3.23 0 1 0 7.04 0 3.52 3.23 0 1 0-7.04 0Zm.38-9.93-1.01 2.39-3.47 1.81-2.77-.39a2.2 2.2 0 0 0-2.35 1.06l-.94 1.5a1.95 1.95 0 0 0 .19 2.44l1.76 2v3.62l-1.71 2a1.95 1.95 0 0 0-.19 2.43l.94 1.51a2.2 2.2 0 0 0 2.35 1.06l2.77-.39 3.42 1.81 1.01 2.39A2.36 2.36 0 0 0 15.04 30h1.97a2.36 2.36 0 0 0 2.18-1.38l1.01-2.39 3.42-1.81 2.77.39a2.2 2.2 0 0 0 2.35-1.06l.94-1.51a1.95 1.95 0 0 0-.19-2.43l-1.76-2v-3.62l1.71-2a1.95 1.95 0 0 0 .19-2.44l-.94-1.5a2.2 2.2 0 0 0-2.35-1.06l-2.77.39-3.42-1.81-1.01-2.39A2.36 2.36 0 0 0 16.96 2h-1.92a2.36 2.36 0 0 0-2.18 1.38Z',
} as const

export type IconName = keyof typeof PATHS

export const ICON_OPTIONS = [
	{ title: 'Clipboard check', value: 'clipboard-check' },
	{ title: 'AI browser spark', value: 'ai-browser-spark' },
	{ title: 'Users', value: 'users' },
	{ title: 'Account setting', value: 'account-setting' },
] satisfies { title: string; value: IconName }[]

export default function Icon({
	name,
	className,
}: {
	name?: string | null
	className?: string
}) {
	const d = name && PATHS[name as IconName]
	if (!d) return null

	return (
		<svg
			viewBox="0 0 32 32"
			fill="none"
			aria-hidden
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d={d}
				stroke="currentColor"
				strokeWidth="2.66"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
