import type { Get } from '@sanity/codegen'
import { stegaClean } from 'next-sanity'
import Agenda from '@/modules/agenda'
import Callout from '@/modules/callout'
import CustomHTML from '@/modules/custom-html'
import Hero from '@/modules/hero'
import HeroCover from '@/modules/hero.cover'
import HeroSplit from '@/modules/hero.split'
import ImageGallery from '@/modules/image-gallery'
import LogoList from '@/modules/logo-list'
import Pricing from '@/modules/pricing'
import Prose from '@/modules/prose'
import QuoteList from '@/modules/quote-list'
import StatList from '@/modules/stat-list'
import TabbedContent from '@/modules/tabbed-content'
import type { ModuleAttributes, PAGE_QUERY_RESULT } from '@/sanity/types'

const MODULES_MAP = {
	agenda: Agenda,
	callout: Callout,
	'custom-html': CustomHTML,
	hero: Hero,
	'hero.cover': HeroCover,
	'hero.split': HeroSplit,
	'image-gallery': ImageGallery,
	'logo-list': LogoList,
	pricing: Pricing,
	prose: Prose,
	'quote-list': QuoteList,
	'stat-list': StatList,
	'tabbed-content': TabbedContent,
} as const

export default function ({ page }: { page?: PAGE_QUERY_RESULT }) {
	const modules = page?.modules ?? []

	return (
		<>
			{modules?.map((module, i) => {
				if (!module) return null

				const Component = MODULES_MAP[
					module._type as keyof typeof MODULES_MAP
				] as React.ComponentType

				if (!Component) return null

				return <Component key={`${module._key}-${i}`} {...module} />
			})}
		</>
	)
}

export type ModuleProps = Partial<Get<PAGE_QUERY_RESULT, 'modules', 0>> & {
	attributes?: ModuleAttributes
}

export function Module({
	as: As = 'section',
	_key,
	_type,
	attributes,
	children,
	...props
}: Omit<ModuleProps, '_type' | '_key'> &
	React.HTMLAttributes<HTMLElement> & {
		as?: React.ElementType
		_type?: string
		_key?: string
	}) {
	const id = stegaClean(attributes?.uid) || `module-${_key}`
	const css = stegaClean(attributes?.scopedCss?.code)

	return (
		<As id={id} data-module={_type} hidden={attributes?.hidden} {...props}>
			{css && <style>{`@scope{${css}}`}</style>}
			{children}
		</As>
	)
}
