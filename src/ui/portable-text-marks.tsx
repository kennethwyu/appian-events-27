import type { PortableTextMarkComponent } from 'next-sanity'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'

/**
 * Upstream renders `link` marks as bare text — inline links in portable text
 * silently lose their href. Share one config so every module gets them.
 */
export const marks: { link: PortableTextMarkComponent<any> } = {
	link: ({ value, children }) => (
		<SanityLink link={value as SanityLinkType}>{children}</SanityLink>
	),
}
