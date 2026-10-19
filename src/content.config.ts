import { defineCollection, z } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { glob } from 'astro/loaders'

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	blog: defineCollection({
		loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string(),
				date: z.coerce.date(),
				cover: image(),
				alt: z.string(),
				author: z.literal('saltyaom'),
				shadow: z.boolean().default(false),
				kind: z
					.enum(['release', 'guide', 'benchmark', 'announcement'])
					.default('release')
			})
	})
}
