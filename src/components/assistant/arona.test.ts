import { describe, expect, test } from 'bun:test'
import { createHmac, timingSafeEqual } from 'crypto'

import {
	parseSSE,
	readSSE,
	windowHistory,
	type Exchange,
	type HistoryItem
} from './arona'
import { loadHighlighter, renderMarkdown, splitSources } from './markdown'

// Arona's Checksum (src/modules/ai/service.ts) with a test secret
const secret = 'test-secret'
const Checksum = {
	sign: (previous: string, user: string, assistant: string) =>
		createHmac('sha256', secret)
			.update(JSON.stringify([previous, user, assistant]))
			.digest('hex'),
	verify(history: HistoryItem[], anchor = '') {
		if (history.length % 2) return false

		let previous = anchor
		for (let i = 0; i < history.length; i += 2) {
			const user = history[i]
			const assistant = history[i + 1]
			if (
				user.role !== 'user' ||
				assistant.role !== 'assistant' ||
				!assistant.checksum
			)
				return false

			const expected = Buffer.from(
				Checksum.sign(previous, user.content, assistant.content)
			)
			const actual = Buffer.from(assistant.checksum)
			if (
				expected.length !== actual.length ||
				!timingSafeEqual(expected, actual)
			)
				return false

			previous = assistant.checksum
		}

		return true
	}
}

type Outcome = 'done' | 'error' | 'aborted'

/**
 * Plays a conversation against Arona's /ask rules: the request must pass the schema
 * (≤ 8 items, ≤ 16384 chars) and the chain check, then the reply is signed like
 * src/modules/ai/index.ts does
 */
function converse(replies: { response: string; outcome?: Outcome }[]) {
	const exchanges: Exchange[] = []

	replies.forEach(({ response, outcome = 'done' }, index) => {
		const message = `question ${index}`
		const { history, anchor } = windowHistory(exchanges)

		expect(history.length).toBeLessThanOrEqual(8)
		for (const item of history)
			expect(item.content.length).toBeLessThanOrEqual(16384)
		if (history.length) expect(Checksum.verify(history, anchor)).toBe(true)

		exchanges.push({
			message,
			response,
			checksum:
				outcome === 'done'
					? Checksum.sign(
							history.at(-1)?.checksum ?? anchor ?? '',
							message,
							response
						)
					: undefined
		})
	})

	return exchanges
}

const answer = (index: number) =>
	`answer ${index}\n\n- [Route](https://next.elysiajs.com/essential/route)`

describe('windowHistory', () => {
	test('keeps the last four signed exchanges and anchors on the one before', () => {
		const exchanges = converse(
			Array.from({ length: 7 }, (_, i) => ({ response: answer(i) }))
		)
		const { history, anchor } = windowHistory(exchanges)

		expect(history).toHaveLength(8)
		expect(history[0].content).toBe('question 3')
		expect(anchor).toBe(exchanges[2].checksum)
		expect(Checksum.verify(history, anchor)).toBe(true)
	})

	test('sends no anchor while the whole conversation fits', () => {
		const exchanges = converse([
			{ response: answer(0) },
			{ response: answer(1) }
		])
		const { history, anchor } = windowHistory(exchanges)

		expect(anchor).toBeUndefined()
		expect(history.map((item) => item.role)).toEqual([
			'user',
			'assistant',
			'user',
			'assistant'
		])
	})

	test('skips errored and stopped exchanges, which were never signed', () => {
		const exchanges = converse([
			{ response: answer(0) },
			{ response: '', outcome: 'error' },
			{ response: 'half an ans', outcome: 'aborted' },
			{ response: answer(3) },
			{ response: answer(4) },
			{ response: answer(5) },
			{ response: answer(6) }
		])
		const { history, anchor } = windowHistory(exchanges)

		expect(history.some((item) => item.content === 'half an ans')).toBe(
			false
		)
		expect(anchor).toBe(exchanges[0].checksum)
		expect(Checksum.verify(history, anchor)).toBe(true)
	})

	test('starts after an answer too long for the schema, anchored on it', () => {
		const exchanges = converse([
			{ response: answer(0) },
			{ response: 'x'.repeat(16385) },
			{ response: answer(2) },
			{ response: answer(3) }
		])
		const { history, anchor } = windowHistory(exchanges)

		expect(history).toHaveLength(4)
		expect(anchor).toBe(exchanges[1].checksum)
		expect(Checksum.verify(history, anchor)).toBe(true)
	})

	test('sends only the anchor when the latest answer is too long', () => {
		const exchanges = converse([
			{ response: answer(0) },
			{ response: 'x'.repeat(16385) }
		])

		expect(windowHistory(exchanges)).toEqual({
			history: [],
			anchor: exchanges[1].checksum
		})
	})

	test('a response changed after signing no longer verifies', () => {
		const exchanges = converse([{ response: answer(0) }])
		exchanges[0].response = exchanges[0].response.trim() + ' '
		const { history, anchor } = windowHistory(exchanges)

		expect(Checksum.verify(history, anchor)).toBe(false)
	})
})

const encoder = new TextEncoder()

function streamOf(chunks: (string | Uint8Array)[]) {
	return new ReadableStream<Uint8Array>({
		start(controller) {
			for (const chunk of chunks)
				controller.enqueue(
					typeof chunk === 'string' ? encoder.encode(chunk) : chunk
				)
			controller.close()
		}
	})
}

async function collect(stream: ReadableStream<Uint8Array>) {
	const events = []
	for await (const event of readSSE(stream)) events.push(event)
	return events
}

describe('SSE', () => {
	test('parses frames and keeps an unfinished one for later', () => {
		const { events, rest } = parseSSE(
			'event: text\ndata: "Hello"\n\nevent: tool\r\ndata: {"name":"search","input":{"query":"route"}}\r\n\r\nevent: done\ndata: {"check'
		)

		expect(events).toEqual([
			{ event: 'text', data: 'Hello' },
			{
				event: 'tool',
				data: { name: 'search', input: { query: 'route' } }
			}
		])
		expect(rest).toBe('event: done\ndata: {"check')
	})

	test('strips exactly one space after the colon', () => {
		const { events } = parseSSE('event:text\ndata:  " a"\n\n')

		expect(events).toEqual([{ event: 'text', data: ' a' }])
	})

	test('joins frames split across chunks', async () => {
		const events = await collect(
			streamOf([
				'event: te',
				'xt\ndata: "line\\none"\n',
				'\nevent: done\ndata: {"checksum":"abc"}\n\n'
			])
		)

		expect(events).toEqual([
			{ event: 'text', data: 'line\none' },
			{ event: 'done', data: { checksum: 'abc' } }
		])
	})

	test('keeps a multibyte character split between chunks intact', async () => {
		const text = 'Elysia ちゃん 🦊'
		const bytes = encoder.encode(
			`event: text\ndata: ${JSON.stringify(text)}\n\n`
		)
		const fox = bytes.indexOf(0xf0)
		const events = await collect(
			streamOf([bytes.slice(0, fox + 2), bytes.slice(fox + 2)])
		)

		expect(events).toEqual([{ event: 'text', data: text }])
	})
})

describe('renderMarkdown', () => {
	const base = 'http://localhost:4321/essential/route/'
	const hrefs = (html: string) =>
		[...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1])
	// highlighting only wraps tokens in colored spans
	const uncolored = (html: string) => html.replace(/<\/?span[^>]*>/g, '')

	test.each([
		'[a](&#106;avascript:alert(1))',
		'[a](<javascript:alert(1)>)',
		'[a](javascript:alert(1))',
		'[a](data:text/html,<script>alert(1)</script>)',
		'![x](https://evil/p.png?q=1)',
		'<img src=x onerror=alert(1)>',
		'<script>alert(1)</script>',
		// an unclosed inline tag used to switch marked into unescaped raw text
		'Hi <kbd> <img src=x onerror=alert(1)//',
		'<pre>\n<img src=x onerror=alert(1)//\n</pre>',
		// a leading // in the path would leave as a protocol-relative link to evil.com
		'[a](https://next.elysiajs.com//next.elysiajs.com//evil.com/p)',
		'[a](http://localhost:4321//evil.com/p)'
	])('renders %p inert', (payload) => {
		const html = renderMarkdown(payload, base)

		expect(html).not.toMatch(/<(img|script|iframe|svg)\b/i)
		expect(html).not.toMatch(/<[^>]+\son\w+=/i)
		for (const href of hrefs(html)) {
			expect(href).toMatch(/^(https?:\/\/|\/(?!\/))/)
			if (!html.includes('target="_blank"'))
				expect(new URL(href, base).origin).toBe(new URL(base).origin)
		}
	})

	test('docs links navigate in place, other sites open in a new tab', () => {
		const html = renderMarkdown(
			'[Route](https://next.elysiajs.com/essential/route#path) [Evil](//evil.com/x) [Hook](#hook)',
			base
		)

		expect(html).toContain('<a href="/essential/route/#path">Route</a>')
		expect(html).toContain(
			'<a href="http://evil.com/x" target="_blank" rel="noopener noreferrer">Evil</a>'
		)
		expect(html).toContain('<a href="/essential/route/#hook">Hook</a>')
	})

	test('code is escaped once', () => {
		expect(
			uncolored(
				renderMarkdown('```ts\nif (a < b && c) "&amp;"\n```', base)
			)
		).toContain(
			'<code>if (a &lt; b &amp;&amp; c) &quot;&amp;amp;&quot;</code>'
		)
	})

	test('a fence is colored only once its closing fence arrives', async () => {
		await loadHighlighter()
		const open = '```ts\nconst a = 1\n'

		expect(renderMarkdown(open, base)).not.toContain('<span')
		expect(renderMarkdown(`${open}\`\`\``, base)).toContain(
			'<span style="color:light-dark('
		)
		expect(renderMarkdown('```ruby\nputs 1\n```', base)).not.toContain(
			'<span'
		)
	})

	test('only a closed fence can be copied, half-streamed code would copy a fragment', () => {
		const open = '```ts\nconst a = 1\n'

		expect(renderMarkdown(open, base)).not.toContain('data-copy')
		expect(renderMarkdown(`${open}\`\`\``, base)).toContain('data-copy')
	})

	test('a highlighted fence stays inert', async () => {
		await loadHighlighter()
		const html = renderMarkdown(
			'```ts\nconst a = "</code><img src=x onerror=alert(1)>"\n</code></pre><img src=x onerror=alert(1)>\n```',
			base
		)

		expect(html).toContain('<span style="color:light-dark(')
		expect(html).not.toMatch(/<(img|script|iframe|svg)\b/i)
		expect(html).not.toMatch(/<[^>]+\son\w+=/i)
		expect(uncolored(html)).toContain(
			'<code>const a = &quot;&lt;/code&gt;&lt;img src=x onerror=alert(1)&gt;&quot;\n&lt;/code&gt;&lt;/pre&gt;&lt;img src=x onerror=alert(1)&gt;</code>'
		)
	})
})

describe('splitSources', () => {
	const base = 'http://localhost:4321/essential/route/'
	const answer =
		'Read it from `cookie`.\n\n- [Route](https://next.elysiajs.com/essential/route)'
	const block = [
		'- [Read the request](https://next.elysiajs.com/essential/handler#read-the-request)',
		'- [cookie](https://next.elysiajs.com/patterns/cookie#cookie)',
		'- [Read the request](https://next.elysiajs.com/essential/handler#read-the-request)'
	].join('\n')

	test('a signed answer ending in docs links shows them as chips, the rest renders as before', () => {
		const { body, sources } = splitSources(
			`${answer}\n\n${block}`,
			base,
			true
		)

		expect(body).toBe(answer)
		expect(sources).toEqual([
			{
				title: 'Read the request',
				href: '/essential/handler/#read-the-request',
				page: 'essential/handler'
			},
			{
				title: 'cookie',
				href: '/patterns/cookie/#cookie',
				page: 'patterns/cookie'
			}
		])
	})

	test.each([
		['prose', `${answer}\n\nSee also:\n${block}`],
		['another site', `${answer}\n\n${block}\n- [Evil](https://evil.com/x)`],
		[
			'a lookalike host',
			`${answer}\n\n- [a](https://next.elysiajs.com.evil.com/x)`
		],
		['a half line', `${answer}\n\n${block}\n- [Merge sch`]
	])('a block mixed with %s stays markdown', (_, response) => {
		expect(splitSources(response, base, true)).toEqual({
			body: response,
			sources: []
		})
	})

	test('a block still streaming stays markdown, even when it looks complete', () => {
		const response = `${answer}\n\n${block}`

		expect(splitSources(response, base, false)).toEqual({
			body: response,
			sources: []
		})
	})

	// splitting runs during render, a crafted answer must not freeze the panel
	test('a long run of link delimiters is rejected in linear time', () => {
		const response = `${answer}\n\n- [${']('.repeat(32_000)}!`
		const start = performance.now()

		expect(splitSources(response, base, true).sources).toEqual([])
		expect(performance.now() - start).toBeLessThan(100)
	})
})
