import { cn } from '@/lib/utils'
import type { DynamicFetchOptions } from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { LinkList, Megamenu as MegamenuType } from '@/sanity/types'
import type { SanityLinkType } from '@/ui/sanity-link'
import Dropdown from './dropdown'
import Megamenu from './megamenu'
import NavItem from './nav-item'

const topLevelClassName = cn(
	'text-p-medm grid px-intra-smll leading-tight md:place-content-center md:text-center md:text-balance',
	'py-[.5ch] md:py-0',
)

export default async function ({ perspective, stega }: DynamicFetchOptions) {
	const site = await getSite({ perspective, stega })

	return (
		<nav className="gap-intra-lrge flex items-stretch [grid-area:navigation] max-md:my-4 max-md:flex-col">
			{site?.header?.items?.map((item, i) => {
				switch (item._type) {
					case 'link':
						return (
							<NavItem
								link={item as SanityLinkType}
								className={cn(topLevelClassName, 'text-current')}
								key={`${item._key}-${i}`}
							/>
						)

					case 'link.list':
						return (
							<Dropdown
								key={`${item._key}-${i}`}
								{...(item as LinkList & { _key: string })}
								summaryClassName={topLevelClassName}
							/>
						)

					case 'megamenu':
						return (
							<Megamenu
								key={`${item._key}-${i}`}
								{...(item as MegamenuType)}
								summaryClassName={topLevelClassName}
							/>
						)

					default:
						return null
				}
			})}
		</nav>
	)
}
