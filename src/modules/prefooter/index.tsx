import { Module } from '@/modules'
import type { Prefooter } from '@/sanity/types'
import CTAList from '@/ui/cta-list'

export default function ({ intro, body, ctas, ...props }: Prefooter) {
	return (
		<Module {...props}>
			{/* A 544-wide centred column in the artboard, not the full section. */}
			<div className="section pt-inter-medm pb-inter-medm">
				<div className="gap-intra-lrge mx-auto flex max-w-[544px] flex-col items-center text-center">
					<h2 className="text-h-medm text-balance">{intro}</h2>
					{body && (
						<p className="text-p-medm text-heading-on-dark-subtle text-pretty">
							{body}
						</p>
					)}
					<CTAList
						ctas={ctas}
						className="mt-intra-lrge justify-center max-sm:*:w-full"
					/>
				</div>
			</div>
		</Module>
	)
}
