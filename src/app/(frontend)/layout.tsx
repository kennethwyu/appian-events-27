import { VisualEditing } from 'next-sanity/visual-editing'
import { Funnel_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { preconnect } from 'react-dom'
import { dev, ROUTES } from '@/lib/env'
import { SanityLive } from '@/sanity/lib/live'
import Announcement, { DynamicAnnouncement } from '@/ui/announcement'
import DraftModeBanner from '@/ui/draft-mode-banner'
import Footer, { DynamicFooter } from '@/ui/footer'
import Header, { DynamicHeader } from '@/ui/header'
import '@/app.css'

// Figma `font/family`. Variable font — 450/550 weights resolve exactly.
const funnelSans = Funnel_Sans({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-funnel-sans',
})

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	preconnect('https://cdn.sanity.io')

	const { isEnabled: isDraftMode } = await draftMode()
	const showDrafts = isDraftMode || dev

	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			className={funnelSans.variable}
		>
			<NuqsAdapter>
				<body className="bg-background text-foreground font-sans antialiased">
					<a href="#main-content" className="skip-link">
						Skip to main content
					</a>
					<a href={`/${ROUTES.a11y}`} className="skip-link">
						Accessibility statement
					</a>

					{showDrafts ? (
						<Suspense>
							<DynamicAnnouncement />
						</Suspense>
					) : (
						<Announcement perspective="published" stega={false} />
					)}

					{showDrafts ? (
						<Suspense fallback={<div className="header-fallback" />}>
							<DynamicHeader />
						</Suspense>
					) : (
						<Header perspective="published" stega={false} />
					)}

					<main id="main-content" tabIndex={-1}>
						{children}
					</main>

					{showDrafts ? (
						<Suspense fallback={<div className="footer-fallback" />}>
							<DynamicFooter />
						</Suspense>
					) : (
						<Footer perspective="published" stega={false} />
					)}

					<SanityLive includeDrafts={showDrafts} />

					{isDraftMode && (
						<>
							<VisualEditing />
							<DraftModeBanner />
						</>
					)}
				</body>
			</NuqsAdapter>
		</html>
	)
}
