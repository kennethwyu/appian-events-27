import type { SchemaPluginOptions } from 'sanity'
// modules
import agenda from '@/modules/agenda/schema'
import callout from '@/modules/callout/schema'
import customHtml from '@/modules/custom-html/schema'
import finale from '@/modules/finale/schema'
import frontRow from '@/modules/front-row/schema'
import heroCover from '@/modules/hero.cover/schema'
import heroSplit from '@/modules/hero.split/schema'
import hero from '@/modules/hero/schema'
import imageGallery from '@/modules/image-gallery/schema'
import logoWall from '@/modules/logo-wall/schema'
import pricing from '@/modules/pricing/schema'
import prose from '@/modules/prose/schema'
import quoteList from '@/modules/quote-list/schema'
import statList from '@/modules/stat-list/schema'
import tabbedContent from '@/modules/tabbed-content/schema'
// documents
import globalModule from './documents/global-module'
import logo from './documents/logo'
import navigation from './documents/navigation'
import page from './documents/page'
import quote from './documents/quote'
import redirect from './documents/redirect'
import site from './documents/site'
// objects
import cta from './objects/cta'
import link from './objects/link'
import linkList from './objects/link.list'
import megamenu from './objects/megamenu'
import metadata from './objects/metadata'
import moduleAttributes from './objects/module-attributes'
import sidebar from './objects/sidebar'
import table from './objects/table'

export const schema: SchemaPluginOptions = {
	types: [
		// documents
		site,
		page,
		globalModule,
		redirect,
		// references
		logo,
		navigation,
		quote,

		// objects
		cta,
		link,
		linkList,
		megamenu,
		metadata,
		moduleAttributes,
		sidebar,
		table,

		// modules
		agenda,
		callout,
		customHtml,
		finale,
		frontRow,
		hero,
		heroCover,
		heroSplit,
		imageGallery,
		logoWall,
		pricing,
		prose,
		quoteList,
		statList,
		tabbedContent,
	],

	templates: (templates) =>
		templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
}

const singletonTypes = ['site']
