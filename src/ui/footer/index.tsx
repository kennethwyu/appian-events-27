import { PortableText } from 'next-sanity'
import CustomHTML from '@/modules/custom-html'
import {
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from '@/sanity/lib/live'
import { getSite } from '@/sanity/lib/queries'
import Logo from '@/ui/logo'
import { marks } from '@/ui/portable-text-marks'
import SanityLink, { type SanityLinkType } from '../sanity-link'
import Navigation from './navigation'

export async function DynamicFooter() {
	const { perspective, stega } = await getDynamicFetchOptions()
	return <CachedFooter perspective={perspective} stega={stega} />
}

export default async function Footer(props: DynamicFetchOptions) {
	return <CachedFooter {...props} />
}

/**
 * The 2027 footer is just a logo, a blurb and one right-aligned link — no
 * footer nav, no social row, no separate copyright line. Those upstream slots
 * are left unused rather than rendered empty.
 */
async function CachedFooter({ perspective, stega }: DynamicFetchOptions) {
	'use cache'
	const site = await getSite({ perspective, stega })
	const blurb = site?.footer?.blurb
	const bottom = site?.bottom?.items

	return (
		<footer className="text-heading-on-dark-subtle">
			<div className="section pt-intra-xxxl pb-16">
				<div className="gap-intra-xxlg flex flex-col">
					<Logo
						className="[&_img]:h-6"
						perspective={perspective}
						stega={stega}
					/>

					{/* items-end so the link sits on the blurb's last line, as designed. */}
					<div className="gap-intra-xxlg flex flex-col md:flex-row md:items-end md:justify-between">
						{blurb && (
							<div className="gap-intra-medm text-p-medm [&_strong]:text-heading-on-dark [&_a]:text-heading-on-dark flex max-w-[544px] flex-col text-pretty [&_a]:font-medium [&_a]:hover:underline [&_strong]:font-medium">
								<PortableText
									value={blurb}
									components={{
										marks,
										types: {
											'custom-html': ({ value }) => <CustomHTML {...value} />,
										},
									}}
								/>
							</div>
						)}

						{!!bottom?.length && (
							<ul className="gap-intra-xlrg text-p-medm flex shrink-0 flex-wrap">
								{bottom.map((item, i) => (
									<li key={`${item._key}-${i}`}>
										<SanityLink
											link={item as SanityLinkType}
											className="text-heading-on-dark font-medium hover:underline"
										/>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Not in the 2027 comp, but the field exists — render it rather than
					 * let an editor's links vanish silently. */}
					{!!site?.footer?.items?.length && (
						<div className="text-p-medm border-border-on-dark-primary pt-intra-xxlg border-t">
							<Navigation perspective={perspective} stega={stega} />
						</div>
					)}
				</div>
			</div>
		</footer>
	)
}
