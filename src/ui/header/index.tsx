import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import CustomHTML from '@/modules/custom-html'
import {
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import type { Cta } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import Logo from '@/ui/logo'
import css from './header.module.css'
import MobileToggle from './mobile-toggle'
import Navigation from './navigation'
import Wrapper from './wrapper'

export async function DynamicHeader() {
	const { perspective, stega } = await getDynamicFetchOptions()
	return <CachedHeader perspective={perspective} stega={stega} />
}

export default async function Header(props: DynamicFetchOptions) {
	return <CachedHeader {...props} />
}

async function CachedHeader({ perspective, stega }: DynamicFetchOptions) {
	'use cache'
	const site = await getSite({ perspective, stega })
	const blurb = site?.header?.blurb

	return (
		<Wrapper className="layout-header bg-page max-md:header-open:shadow-xl text-heading-on-dark border-border-on-dark-primary sticky top-0 z-10 border-b transition-colors">
			<div
				className={cn(
					css.root,
					'section grid items-center gap-x-4 py-0 max-md:max-h-svh max-md:overflow-y-auto md:h-16 md:gap-x-8',
				)}
			>
				<div className="max-md:header-open:bg-page sticky top-0 z-1 flex items-center justify-between gap-4 py-4 [grid-area:top] md:py-0">
					<Logo
						className="max-w-max grow [&_img]:h-6"
						perspective={perspective}
						stega={stega}
					/>
					<MobileToggle />
				</div>

				<div
					id="mobile-menu"
					className={cn(css.menu, 'max-md:header-open:pb-4 [grid-area:menu]')}
				>
					<div>
						<Navigation perspective={perspective} stega={stega} />

						<div className="flex items-center gap-[.5em_1em] [grid-area:ctas] max-md:flex-col">
							{blurb && (
								<div className="prose">
									<PortableText
										value={blurb}
										components={{
											types: {
												'custom-html': ({ value }) => <CustomHTML {...value} />,
											},
										}}
									/>
								</div>
							)}

							{/* The artboard's header CTA is the DS small variant — p-xsml
							 * (12/16) on 16 of padding, giving 176x40 — not the p-smll
							 * (14/24) on 24 that body and hero CTAs take from action-base. */}
							<CTAList
								ctas={site?.ctas as Cta[]}
								className="[&_.action]:px-intra-lrge [&_.action]:text-p-xsml max-sm:w-full max-sm:*:w-full [&_.action]:font-medium"
							/>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>
	)
}
