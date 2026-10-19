import { expect, test } from 'bun:test'
import sharp from 'sharp'
import { renderOgImage } from './og-image'

test('renders page copy as a 1200x630 JPEG', async () => {
	const base = await renderOgImage(
		'At a glance',
		"Meet Elysia's routing, validation, OpenAPI, and end-to-end TypeScript support."
	)
	const changedDescription = await renderOgImage(
		'At a glance',
		'A different description for the same page title.'
	)
	const changedTitle = await renderOgImage(
		'Netlify',
		"Meet Elysia's routing, validation, OpenAPI, and end-to-end TypeScript support."
	)
	const metadata = await sharp(base).metadata()

	expect(metadata.format).toBe('jpeg')
	expect(metadata.width).toBe(1200)
	expect(metadata.height).toBe(630)
	expect(base.equals(changedDescription)).toBe(false)
	expect(base.equals(changedTitle)).toBe(false)
})

test('renders the long TypeSystem description without throwing', async () => {
	const image = await renderOgImage(
		'TypeSystem',
		"typebox/system is a subgraph of typebox/type, so a static re-export here would pin ~231 KB of the deferral back into the eager graph. The proxy also guarantees Elysia's own Settings default lands BEFORE the namespace is handed out, keeping a user's explicit TypeSystem.Settings.Set(...) last — the ordering the eager setupTypebox() used to provide"
	)

	expect((await sharp(image).metadata()).format).toBe('jpeg')
})
