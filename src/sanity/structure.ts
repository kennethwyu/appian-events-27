import { structureTool } from 'sanity/structure'
import { DocumentIcon } from '@sanity/icons/Document'
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { EmptyIcon } from '@sanity/icons/Empty'
import { apiVersion } from './env'
import { singleton } from './lib/builders'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
//
// Global modules and Directories are omitted: none exist, and no page slug is
// nested. page-directories.ts is kept for Europe/Gov; global-module is also
// filtered out of the create menu in sanity.config.ts.
export default structureTool({
	structure: (S) =>
		S.list()
			.title('Structure')
			.items([
				S.divider().title('Global'),
				singleton(S, 'site').title('Site').icon(EarthGlobeIcon),

				S.divider().title('Pages'),
				S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),

				S.divider().title('Navigation'),
				S.documentTypeListItem('navigation'),
				S.documentTypeListItem('redirect').title('Redirects'),

				S.divider().title('References'),
				S.documentTypeListItem('logo').title('Logos'),
				S.documentTypeListItem('quote').title('Quotes'),

				S.divider().title('Drafts'),
				S.listItem()
					.title('Drafts')
					.icon(EmptyIcon)
					.child(
						S.documentList()
							.title('Drafts')
							.apiVersion(apiVersion)
							.filter(
								'_originalId in path("drafts.**") && !(_type match "sanity.*")',
							),
					),
			]),
})
