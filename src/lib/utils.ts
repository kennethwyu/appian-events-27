import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * The DS font-size utilities look like colour utilities, so a stock twMerge
 * groups them with `text-heading-on-dark` and drops whichever comes first.
 */
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			'font-size': [
				{
					text: [
						'display',
						'display-lg',
						'h-huge',
						'h-lrge',
						'h-medm',
						'h-smll',
						'h-xsml',
						'p-lrge',
						'p-medm',
						'p-smll',
						'p-xsml',
					],
				},
			],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function slug(
	str: string,
	{
		removeLeadingNumberAndHyphen,
	}: { removeLeadingNumberAndHyphen?: boolean } = {},
) {
	const result = str
		.toLowerCase()
		.normalize('NFD') // Decompose combined characters (é → e + ´)
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
		.replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
		.replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
		.replace(/-+/g, '-') // Collapse multiple hyphens
		.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
		.trim()

	if (removeLeadingNumberAndHyphen) return result.replace(/^\d+-/, '')

	return result
}

export function count<T = any>(
	arr: T[] | number,
	singular: string = 'item',
	plural?: string,
) {
	const n = typeof arr === 'number' ? arr : (arr?.length ?? 0)
	return `${n} ${n === 1 ? singular : plural || singular + 's'}`
}

export function debounce<T extends (...args: any[]) => void>(
	fn: T,
	delay: number = 1000, // 1 sec
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout | null = null

	return function (this: any, ...args: Parameters<T>) {
		if (timeoutId) clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn.apply(this, args), delay)
	}
}

export function getBlockText(
	block?: {
		children?: {
			text?: string
		}[]
	}[],
	lineBreakChar: string = '↵ ',
) {
	return (
		block?.reduce((a, c, i) => {
			const text = c.children?.flatMap((c) => c.text ?? '').join('') || ''
			return a + text + (i !== block.length - 1 ? lineBreakChar : '')
		}, '') || ''
	)
}

/**
 * The UTC instant at which a wall-clock date ends in a given timezone.
 *
 * A Sanity `date` is a bare `YYYY-MM-DD`, which `new Date()` parses as UTC
 * midnight. Comparing against that directly ends a "through <date>" offer at
 * the start of the day; using UTC end-of-day still ends it mid-afternoon on the
 * US west coast. This resolves the zone's real offset for that date, so DST is
 * handled without a date library.
 */
export function endOfDayInZone(date: string, timeZone: string) {
	const asUtc = new Date(`${date}T23:59:59.999Z`)

	const offset = new Intl.DateTimeFormat('en-US', {
		timeZone,
		timeZoneName: 'longOffset',
	})
		.formatToParts(asUtc)
		.find((part) => part.type === 'timeZoneName')?.value // e.g. "GMT-07:00"

	const parsed = offset?.match(/GMT([+-])(\d{2}):(\d{2})/)
	if (!parsed) return asUtc

	const [, sign, hours, minutes] = parsed
	const offsetMinutes =
		(sign === '-' ? -1 : 1) * (Number(hours) * 60 + Number(minutes))

	return new Date(asUtc.getTime() - offsetMinutes * 60_000)
}
