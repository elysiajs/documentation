export const ARONA_URL: string =
	import.meta.env.PUBLIC_ARONA_URL ??
	(import.meta.env.DEV
		? 'http://localhost:3000'
		: 'https://plana.elysiajs.com')

export const DOCS_ORIGIN = 'https://next.elysiajs.com'

// Arona's history item limit, model.ts
const MAX_CONTENT = 16384
const MAX_PAIRS = 4

export interface Exchange {
	message: string
	response: string
	checksum?: string
}

export interface HistoryItem {
	role: 'user' | 'assistant'
	content: string
	checksum?: string
}

export type AronaEvent =
	| { event: 'text' | 'reasoning' | 'error'; data: string }
	| { event: 'tool'; data: { name: string; input: unknown } }
	| { event: 'done'; data: { checksum: string } }

export class AskError extends Error {
	constructor(
		public status: number,
		public body: string
	) {
		super(body || `Request failed with ${status}`)
	}
}

/**
 * Last few signed exchanges, plus the checksum the window continues from.
 * Unsigned exchanges (errored, stopped) never got a checksum, so the chain skips them
 */
export function windowHistory(exchanges: Exchange[]) {
	const signed = exchanges.filter((exchange) => exchange.checksum)

	let start = Math.max(0, signed.length - MAX_PAIRS)
	for (let i = signed.length - 1; i >= start; i--)
		if (signed[i].response.length > MAX_CONTENT) {
			start = i + 1
			break
		}

	return {
		history: signed
			.slice(start)
			.flatMap(({ message, response, checksum }): HistoryItem[] => [
				{ role: 'user', content: message },
				{ role: 'assistant', content: response, checksum }
			]),
		anchor: signed[start - 1]?.checksum
	}
}

export function parseSSE(buffer: string) {
	const frames = buffer.split(/\r?\n\r?\n/)
	const rest = frames.pop()!
	const events: AronaEvent[] = []

	for (const frame of frames) {
		let event = 'message'
		const data: string[] = []

		for (const line of frame.split(/\r?\n/)) {
			const colon = line.indexOf(':')
			if (colon < 1) continue

			const field = line.slice(0, colon)
			const value = line.slice(
				line[colon + 1] === ' ' ? colon + 2 : colon + 1
			)

			if (field === 'event') event = value
			else if (field === 'data') data.push(value)
		}

		if (data.length)
			events.push({
				event,
				data: JSON.parse(data.join('\n'))
			} as AronaEvent)
	}

	return { events, rest }
}

export async function* readSSE(body: ReadableStream<Uint8Array>) {
	const reader = body.getReader()
	const decoder = new TextDecoder('utf-8')
	let buffer = ''

	try {
		while (true) {
			const { done, value } = await reader.read()
			buffer += decoder.decode(value, { stream: !done })

			const { events, rest } = parseSSE(buffer)
			buffer = rest
			yield* events

			if (done) return
		}
	} finally {
		reader.cancel().catch(() => {})
	}
}

export async function requestPow() {
	const response = await fetch(`${ARONA_URL}/pow/request`, {
		credentials: 'include'
	})
	if (!response.ok) throw new AskError(response.status, await response.text())

	return response.json() as Promise<{
		nonce: string
		bits: number
		expires: number
	}>
}

export interface AskOptions {
	message: string
	history: HistoryItem[]
	anchor?: string
	reference?: string
	pow: string
	turnstile?: string
	// any seed skips Arona's response cache, so a retry gets a new answer
	seed?: number
	signal?: AbortSignal
}

/**
 * Resolves once Arona answers with headers (its Set-Cookie consumed the challenge),
 * then streams the events
 */
export async function ask({
	message,
	history,
	anchor,
	reference,
	pow,
	turnstile,
	seed,
	signal
}: AskOptions) {
	const response = await fetch(`${ARONA_URL}/ask`, {
		method: 'POST',
		credentials: 'include',
		signal,
		headers: {
			'content-type': 'application/json',
			...(turnstile && { 'x-turnstile-token': turnstile })
		},
		body: JSON.stringify({
			message,
			pow: { suffix: pow },
			reference,
			history: history.length ? history : undefined,
			anchor,
			seed
		})
	})

	if (!response.ok || !response.body)
		throw new AskError(response.status, await response.text())

	return readSSE(response.body)
}
