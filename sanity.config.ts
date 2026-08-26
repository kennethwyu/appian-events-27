'use client'

/**
 * This configuration is used for the Sanity Studio mounted under `src/app/(studio)/<segment>/[[...tool]]/page.tsx`.
 * Keep `basePath` in sync with `ROUTES.studio` in `src/lib/env.ts` and the App Router folder name.
 */
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { defineConfig } from 'sanity'
import { codeInput } from '@sanity/code-input'
import {
	dashboardTool,
	projectInfoWidget,
	projectUsersWidget,
} from '@sanity/dashboard'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { ROUTES } from './src/lib/env'
import PortableTextEditorPlugins from './src/sanity/components/portable-text-plugins'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import icon from './src/sanity/icon'
import presentation from './src/sanity/presentation'
import { schema } from './src/sanity/schemaTypes'
import structure from './src/sanity/structure'

export default defineConfig({
	title: 'Appian World 2027',
	basePath: `/${ROUTES.studio}`,
	projectId,
	dataset,
	icon,
	// Add and edit the content schema in the './sanity/schemaTypes' folder
	schema,
	plugins: [
		structure,
		presentation,
		dashboardTool({
			name: 'info',
			title: 'Info',
			widgets: [projectInfoWidget(), projectUsersWidget()],
		}),
		// Vision is for querying with GROQ from inside the Studio
		// https://www.sanity.io/docs/the-vision-plugin
		visionTool({ defaultApiVersion: apiVersion }),
		codeInput(),
		media(),
	],
	form: {
		components: {
			portableText: {
				plugins: PortableTextEditorPlugins,
			},
		},
	},
})
