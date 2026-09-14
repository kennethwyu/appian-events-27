import { structureTool } from 'sanity/structure'
import { DocumentIcon } from '@sanity/icons/Document'
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { EmptyIcon } from '@sanity/icons/Empty'
import { apiVersion } from './env'
import { singleton } from './lib/builders'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
//
// Global modules and page Directories are omitted: this site is one page plus
// iframe shells, so there are no global modules and no nested slugs for
// Directories to group. `lib/page-directories.ts` is kept for the Europe and
// Gov builds. Global modules are also filtered out of the create menu in
// sanity.config.ts, so the type can't be made without a home to find it in.
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
