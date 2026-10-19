import { expect, test } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { Elysia } from 'elysia'

test('generated state examples retain counter mutations across requests (run bun run build first)', async () => {
	const reference = await readFile(
		new URL('../src/content/docs/reference/classes/Elysia.mdx', import.meta.url),
		'utf8'
	)
	const state = reference.split('### state()\n')[1]?.split('\n### ')[0] ?? ''
	const examples = [...state.matchAll(/```typescript\n([\s\S]*?)\n```/g)]
	expect(examples.length).toBeGreaterThan(0)
	for (const [, code] of examples) {
		const app: Elysia = new Function('Elysia', `return ${code}`)(Elysia)
		const responses: string[] = []
		for (let request = 0; request < 2; request++) {
			const response = await app.handle(new Request('http://localhost/'))
			responses.push(await response.text())
		}
		expect(responses).toEqual(['1', '2'])
	}
})
