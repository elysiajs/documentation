import { expect, test } from 'bun:test'
import {
	buildTrace,
	eventDelay,
	isRevealed,
	nextEvent,
	stages,
	type Hook,
	type HookStage
} from './model'

const queue = (stage: HookStage, returnAt = -1): Hook[] =>
	[0, 1, 2].map((index) => ({
		id: `${stage}-${index}`,
		stage,
		action: index === returnAt ? 'return' : 'continue'
	}))

const entry = (trace: ReturnType<typeof buildTrace>, id: string) =>
	trace.find((step) => step.id === id)!

test('empty hook groups preserve the built-in flow, with parsing after the parse entry', () => {
	const trace = buildTrace([])
	expect(
		trace.filter((step) => !step.inactive).map((step) => step.id)
	).toEqual([
		'request',
		'parse',
		'parse-default',
		'transform',
		'validation',
		'beforeHandle',
		'handler',
		'afterHandle',
		'mapResponse',
		'response-default',
		'sent',
		'afterResponse'
	])
	expect(entry(trace, 'parse').snapshot.body).toBeNull()
	expect(entry(trace, 'parse-default').snapshot.body).toEqual({
		name: 'Elysia'
	})
	expect(entry(trace, 'validation').snapshot.validated).toBe(true)
	expect(trace.at(-1)!.snapshot.response).toMatchObject({
		status: 200,
		body: 'Hello Elysia'
	})
	expect(
		trace
			.filter((step) => !step.inactive)
			.every((step) => step.skippedBy === null && step.log.length > 0)
	).toBe(true)
})

test('duplicate hooks run in registration order and keep their stable identities', () => {
	const hooks = queue('beforeHandle')
	const trace = buildTrace(hooks)
	expect(
		trace.filter((step) => step.kind === 'hook').map((step) => step.id)
	).toEqual(hooks.map((hook) => hook.id))
	const removed = buildTrace(
		hooks.filter((hook) => hook.id !== 'beforeHandle-1')
	)
	expect(
		removed.filter((step) => step.kind === 'hook').map((step) => step.id)
	).toEqual(['beforeHandle-0', 'beforeHandle-2'])
	expect(entry(removed, 'handler').snapshot.responseValue).toBe(
		'Hello Elysia'
	)
})

test('first or middle request returns skip route work but keep app response mapping and post-response hooks', () => {
	for (const returnAt of [0, 1]) {
		const trace = buildTrace([
			...queue('request', returnAt),
			...queue('parse'),
			...queue('beforeHandle'),
			...queue('afterHandle'),
			...queue('mapResponse'),
			...queue('afterResponse')
		])
		const cause = entry(trace, `request-${returnAt}`).index
		for (const id of [
			'request-2',
			'parse',
			'parse-0',
			'parse-default',
			'transform',
			'validation',
			'beforeHandle',
			'handler',
			'afterHandle',
			'afterHandle-2'
		]) {
			expect(entry(trace, id).skippedBy).toBe(cause)
		}
		expect(entry(trace, 'mapResponse-2').skippedBy).toBeNull()
		expect(entry(trace, 'afterResponse-2').skippedBy).toBeNull()
		expect(trace.at(-1)!.snapshot).toMatchObject({
			body: null,
			validated: false,
			headers: {},
			response: { status: 200, body: 'Short circuit' }
		})
	}
})

test('a returned parser body skips later parsers and becomes the validated handler input', () => {
	for (const returnAt of [0, 1]) {
		const trace = buildTrace(queue('parse', returnAt))
		expect(entry(trace, `parse-${returnAt}`).snapshot.body).toEqual({
			name: 'From parse'
		})
		expect(entry(trace, 'parse-2').skippedBy).toBe(
			entry(trace, `parse-${returnAt}`).index
		)
		expect(entry(trace, 'parse-default').skippedBy).toBe(
			entry(trace, `parse-${returnAt}`).index
		)
		expect(entry(trace, 'validation').snapshot.validated).toBe(true)
		expect(trace.at(-1)!.snapshot.response?.body).toBe('Hello From parse')
	}
	const fallback = buildTrace(queue('parse'))
	expect(entry(fallback, 'parse-2').snapshot.body).toBeNull()
	expect(entry(fallback, 'parse-default').snapshot.body).toEqual({
		name: 'Elysia'
	})
})

test('routed short circuits skip only the appropriate queue and preserve later response work', () => {
	for (const stage of [
		'beforeHandle',
		'afterHandle',
		'mapResponse'
	] as const) {
		for (const returnAt of [0, 1]) {
			const trace = buildTrace([
				...queue(
					'beforeHandle',
					stage === 'beforeHandle' ? returnAt : -1
				),
				...queue(
					'afterHandle',
					stage === 'afterHandle' ? returnAt : -1
				),
				...queue(
					'mapResponse',
					stage === 'mapResponse' ? returnAt : -1
				),
				...queue('afterResponse')
			])
			expect(
				trace
					.filter((step) => step.skippedBy !== null)
					.map((step) => step.id)
			).toEqual([
				...queue(stage)
					.slice(returnAt + 1)
					.map((hook) => hook.id),
				...(stage === 'beforeHandle' ? ['handler'] : [])
			])
			expect(trace.at(-1)!.snapshot.response).toMatchObject({
				status: 200,
				body: 'Short circuit',
				headers: { 'x-example': 'life-cycle' }
			})
			expect(entry(trace, 'afterResponse-2').skippedBy).toBeNull()
		}
	}
})

test('transform and afterResponse returns are ignored and do not stop siblings', () => {
	const trace = buildTrace([
		...queue('transform', 0),
		...queue('afterResponse', 1)
	])
	expect(trace.every((step) => step.skippedBy === null)).toBe(true)
	expect(entry(trace, 'transform-0').log).toContain('Return ignored')
	expect(entry(trace, 'afterResponse-1').log).toContain('Return ignored')
	expect(trace.at(-1)!.snapshot.response).toMatchObject({
		status: 200,
		body: 'Hello Elysia'
	})
})

test('skips reveal at their cause, without revealing unrelated later queue returns', () => {
	const trace = buildTrace([
		...queue('beforeHandle', 0),
		...queue('mapResponse', 1)
	])
	const early = entry(trace, 'beforeHandle-0').index
	const later = entry(trace, 'mapResponse-1').index
	expect(isRevealed(entry(trace, 'handler'), early - 1)).toBe(false)
	expect(isRevealed(entry(trace, 'handler'), early)).toBe(true)
	expect(isRevealed(entry(trace, 'mapResponse-2'), early)).toBe(false)
	expect(isRevealed(entry(trace, 'mapResponse-2'), later)).toBe(true)
	let cursor = -1
	const played: string[] = []
	while ((cursor = nextEvent(trace, cursor)) !== -1)
		played.push(trace[cursor].id)
	expect(played).toEqual(
		trace
			.filter((step) => step.skippedBy === null && !step.inactive)
			.map((step) => step.id)
	)
	expect(eventDelay).toBe(300)
})

test('each event keeps its own log and snapshot before later events or runs change state', () => {
	const trace = buildTrace([...queue('parse'), ...queue('afterHandle')])
	expect(entry(trace, 'parse-0').log).toContain('return undefined')
	expect(entry(trace, 'parse-0').snapshot.body).toBeNull()
	expect(entry(trace, 'transform').snapshot.validated).toBe(false)
	expect(entry(trace, 'handler').snapshot.headers).toEqual({})
	expect(entry(trace, 'response-default').snapshot.sent).toBe(false)
	expect(entry(trace, 'sent').snapshot.sent).toBe(true)
	trace.at(-1)!.snapshot.body!.name = 'Changed'
	trace.at(-1)!.snapshot.headers['x-example'] = 'Changed'
	expect(entry(trace, 'afterHandle-0').snapshot.body).toEqual({
		name: 'Elysia'
	})
	expect(entry(trace, 'afterHandle-0').snapshot.headers).toEqual({
		'x-example': 'life-cycle'
	})
	expect(buildTrace([]).at(-1)!.snapshot.headers).toEqual({})
})

test('responseValue preserves the verified v2 request-early mapper distinction', () => {
	const early = buildTrace(queue('request', 0))
	expect(early.at(-1)!.snapshot.responseValue).toBeNull()
	const earlyMapped = buildTrace([
		...queue('request', 0),
		...queue('mapResponse', 1)
	])
	expect(earlyMapped.at(-1)!.snapshot.responseValue).toEqual({
		status: 200,
		response: 'Short circuit'
	})
	const routedMapped = buildTrace(queue('mapResponse', 1))
	expect(routedMapped.at(-1)!.snapshot.responseValue).toEqual({
		kind: 'Response',
		status: 200,
		response: 'Short circuit'
	})
	expect(routedMapped.at(-1)!.snapshot.response?.status).toBe(200)
})

test('error hooks stay inactive on success and when beforeHandle bypasses a throwing handler', () => {
	for (const trace of [
		buildTrace(queue('error', 0)),
		buildTrace([...queue('beforeHandle', 0), ...queue('error', 0)], 'throw')
	]) {
		const errorSteps = trace.filter((step) => step.stage === 'error')
		expect(
			errorSteps.every(
				(step) => step.inactive && !isRevealed(step, trace.length)
			)
		).toBe(true)
		let cursor = -1
		while ((cursor = nextEvent(trace, cursor)) !== -1)
			expect(trace[cursor].stage).not.toBe('error')
		expect(trace.at(-1)!.snapshot.error).toBeNull()
	}
})

test('handled handler errors skip afterHandle and later error hooks, then run response mapping', () => {
	for (const returnAt of [0, 1]) {
		const trace = buildTrace(
			[
				...queue('afterHandle'),
				...queue('error', returnAt),
				...queue('mapResponse'),
				...queue('afterResponse')
			],
			'throw'
		)
		const thrownAt = entry(trace, 'handler').index
		expect(entry(trace, 'afterHandle').skippedBy).toBe(thrownAt)
		expect(entry(trace, 'afterHandle-2').skippedBy).toBe(thrownAt)
		expect(entry(trace, 'error-2').skippedBy).toBe(
			entry(trace, `error-${returnAt}`).index
		)
		expect(entry(trace, 'error-default').skippedBy).toBe(
			entry(trace, `error-${returnAt}`).index
		)
		expect(
			trace
				.filter(
					(step) => step.stage === 'error' && step.kind === 'hook'
				)
				.every((step) => step.snapshot.responseValue === null)
		).toBe(true)
		expect(entry(trace, 'mapResponse-2').skippedBy).toBeNull()
		expect(entry(trace, 'afterResponse-2').skippedBy).toBeNull()
		expect(trace.at(-1)!.snapshot).toMatchObject({
			error: "I'm a teapot",
			headers: {},
			response: { status: 200, body: 'Handled error' }
		})
	}
})

const errorQueue = (stage: HookStage): Hook[] =>
	queue(stage).map((hook, index) => ({
		...hook,
		action: index === 1 ? 'error' : 'continue'
	}))
const executed = (trace: ReturnType<typeof buildTrace>) =>
	trace
		.filter(
			(step) =>
				!step.inactive &&
				step.skippedBy === null &&
				(step.kind === 'hook' ||
					(step.stage === 'handler' && step.kind === 'stage'))
		)
		.map((step) => step.hookId ?? step.id)
const normalStages = [
	'request',
	'parse',
	'transform',
	'beforeHandle',
	'handler',
	'afterHandle',
	'mapResponse',
	'afterResponse'
] as const
const normalHooks = normalStages.flatMap((stage) =>
	stage === 'handler' ? [] : queue(stage)
)
const normalEvents = normalStages.flatMap((stage) =>
	stage === 'handler' ? ['handler'] : queue(stage).map((hook) => hook.id)
)
const ids = (stage: HookStage, length = 3) =>
	queue(stage)
		.slice(0, length)
		.map((hook) => hook.id)

test('HTTP errors stop their remaining queue and reach error hooks before the response', () => {
	for (const stage of [
		'request',
		'parse',
		'transform',
		'beforeHandle',
		'handler',
		'afterHandle'
	] as const) {
		for (const handled of [false, true]) {
			const hooks = normalHooks.map((hook): Hook => ({
				...hook,
				action: hook.id === `${stage}-1` ? 'error' : 'continue'
			}))
			hooks.push(...queue('error', handled ? 1 : -1))
			const trace = buildTrace(
				hooks,
				stage === 'handler' ? 'throw' : 'return'
			)
			const cause = stage === 'handler' ? 'handler' : `${stage}-1`
			const prefix = normalEvents.slice(
				0,
				normalEvents.indexOf(cause) + 1
			)
			expect(executed(trace)).toEqual([
				...prefix,
				...ids('error', handled ? 2 : 3),
				...(handled || stage === 'request' ? ids('mapResponse') : []),
				...ids('afterResponse')
			])
			expect(trace.at(-1)!.snapshot.response!.status).toBe(
				handled ? 200 : stage === 'parse' ? 400 : 418
			)
			expect(entry(trace, 'error').index).toBeGreaterThan(
				entry(trace, cause).index
			)
			if (!handled) {
				const body = JSON.parse(trace.at(-1)!.snapshot.response!.body)
				expect(body.type).toBe(stage === 'parse' ? 'parse' : 'TEAPOT')
				expect(body.detail).toBe("I'm a teapot")
			}
		}
	}
})

test('error recovery preserves the v2 error-queue and mapper snapshot distinctions', () => {
	for (const errorMode of ['none', 'continue', 'return'] as const) {
		for (const mapperMode of ['none', 'continue', 'return'] as const) {
			const trace = buildTrace(
				[
					...(errorMode === 'none'
						? []
						: queue('error', errorMode === 'return' ? 1 : -1)),
					...(mapperMode === 'none'
						? []
						: queue(
								'mapResponse',
								mapperMode === 'return' ? 1 : -1
							))
				],
				'throw'
			)
			const final = trace.at(-1)!.snapshot
			const mapped = mapperMode !== 'none' && errorMode !== 'continue'
			expect(final.response!.status).toBe(
				errorMode === 'return' || (mapped && mapperMode === 'return')
					? 200
					: 418
			)
			if (!mapped) expect(final.responseValue).toBeNull()
			else if (errorMode === 'none')
				expect(final.responseValue).toMatchObject({
					status: 418,
					response: { type: 'TEAPOT' }
				})
			else
				expect(final.responseValue).toEqual(
					mapperMode === 'return'
						? {
								kind: 'Response',
								status: 200,
								response: 'Short circuit'
							}
						: { status: 200, response: 'Handled error' }
				)
			expect(final.headers['x-example']).toBeUndefined()
		}
	}
})

test('late mapper errors appear after their cause and only reenter through the finite route and request catches', () => {
	for (const handled of [false, true]) {
		const trace = buildTrace([
			...normalHooks.filter((hook) => hook.stage !== 'mapResponse'),
			...errorQueue('mapResponse'),
			...queue('error', handled ? 1 : -1)
		])
		const firstMapping = normalEvents.slice(
			0,
			normalEvents.indexOf('mapResponse-1') + 1
		)
		expect(executed(trace)).toEqual(
			handled
				? [
						...firstMapping,
						...ids('error', 2),
						...ids('mapResponse', 2),
						...ids('error', 2),
						...ids('mapResponse', 2),
						...ids('afterResponse')
					]
				: [...firstMapping, ...ids('error'), ...ids('afterResponse')]
		)
		expect(entry(trace, 'error').index).toBeGreaterThan(
			entry(trace, 'mapResponse-1').index
		)
		expect(entry(trace, 'error').visit).toBe(1)
		expect(new Set(trace.map((step) => step.id)).size).toBe(trace.length)
		expect(trace.at(-1)!.snapshot.response!.status).toBe(
			handled ? 500 : 418
		)
		if (handled) {
			expect(
				trace
					.filter((step) => step.hookId === 'mapResponse-1')
					.map((step) => step.visit)
			).toEqual([1, 2, 3])
			expect(
				trace
					.filter(
						(step) =>
							step.kind === 'stage' && step.stage === 'error'
					)
					.map((step) => step.visit)
			).toEqual([1, 2])
			expect(trace.at(-1)!.snapshot.headers['x-example']).toBe(
				'life-cycle'
			)
			expect(
				trace.at(-1)!.snapshot.response!.headers['x-example']
			).toBeUndefined()
		}
	}
})

test('a request early response and absent error hooks both use the outer mapper retry boundary', () => {
	for (const hooks of [
		[
			...queue('request', 1),
			...errorQueue('mapResponse'),
			...queue('error')
		],
		[...errorQueue('mapResponse')]
	]) {
		const trace = buildTrace(hooks)
		expect(
			trace
				.filter(
					(step) =>
						step.kind === 'stage' && step.stage === 'mapResponse'
				)
				.map((step) => step.visit)
		).toEqual([1, 2])
		expect(
			trace.filter(
				(step) => step.kind === 'stage' && step.stage === 'error'
			).length
		).toBe(1)
		expect(trace.at(-1)!.snapshot.response!.status).toBe(500)
		expect(JSON.parse(trace.at(-1)!.snapshot.response!.body).detail).toBe(
			"I'm a teapot"
		)
	}
})

test('errors inside error hooks stop siblings and fall back once the outer catch fails', () => {
	for (const requestFailure of [false, true]) {
		const trace = buildTrace(
			[
				...(requestFailure ? errorQueue('request') : []),
				...errorQueue('error'),
				...queue('mapResponse'),
				...queue('afterResponse')
			],
			'throw'
		)
		expect(
			trace.filter(
				(step) => step.stage === 'error' && step.kind === 'stage'
			).length
		).toBe(requestFailure ? 1 : 2)
		expect(executed(trace).filter((id) => id.startsWith('error-'))).toEqual(
			requestFailure
				? ids('error', 2)
				: [...ids('error', 2), ...ids('error', 2)]
		)
		expect(
			executed(trace).some((id) => id.startsWith('mapResponse-'))
		).toBe(false)
		expect(trace.at(-1)!.snapshot.response!.status).toBe(500)
		expect(executed(trace).slice(-3)).toEqual(ids('afterResponse'))
	}
})

test('an afterResponse error is logged without changing the sent response or skipping siblings', () => {
	const trace = buildTrace([
		...queue('afterHandle'),
		...errorQueue('afterResponse'),
		...queue('error', 1)
	])
	const sent = entry(trace, 'sent').snapshot
	expect(entry(trace, 'afterResponse-1').log).toContain(
		'sent response cannot change'
	)
	for (const step of trace.filter((step) => step.stage === 'afterResponse')) {
		expect(step.snapshot.response).toEqual(sent.response)
		expect(step.snapshot.error).toBeNull()
		expect(step.skippedBy).toBeNull()
	}
	expect(sent.response!.status).toBe(200)
	expect(
		trace
			.filter((step) => step.stage === 'error')
			.every((step) => step.inactive)
	).toBe(true)
})

test('error skips reveal at their cause and saved errors stay immutable', () => {
	const trace = buildTrace(
		[...queue('error'), ...queue('mapResponse', 0)],
		'throw'
	)
	const handler = entry(trace, 'handler')
	const fallback = entry(trace, 'error-default')
	expect(isRevealed(entry(trace, 'afterHandle'), handler.index - 1)).toBe(
		false
	)
	expect(isRevealed(entry(trace, 'afterHandle'), handler.index)).toBe(true)
	expect(isRevealed(entry(trace, 'mapResponse-2'), fallback.index - 1)).toBe(
		false
	)
	expect(isRevealed(entry(trace, 'mapResponse-2'), fallback.index)).toBe(true)
	expect(entry(trace, 'beforeHandle').snapshot.error).toBeNull()
	expect(handler.snapshot.error).toBe("I'm a teapot")
	trace.at(-1)!.snapshot.error = 'Changed'
	expect(handler.snapshot.error).toBe("I'm a teapot")
	expect(entry(trace, 'sent').log).toBe('Send 418 response.')
})

test('every configured lifecycle group remains available after errors make it unreachable', () => {
	for (const stage of [
		'request',
		'parse',
		'transform',
		'beforeHandle',
		'handler',
		'afterHandle',
		'mapResponse',
		'error',
		'afterResponse'
	] as const) {
		const hooks = normalHooks.map((hook): Hook => ({
			...hook,
			action: hook.id === `${stage}-1` ? 'error' : 'continue'
		}))
		hooks.push(...errorQueue('error'))
		const trace = buildTrace(
			hooks,
			stage === 'handler' || stage === 'error' ? 'throw' : 'return'
		)
		for (const group of stages)
			expect(
				trace.some(
					(step) =>
						step.stage === group.id &&
						step.kind === 'stage' &&
						step.visit === 1
				)
			).toBe(true)
		for (const hook of hooks)
			expect(
				trace.some(
					(step) => step.hookId === hook.id && step.visit === 1
				)
			).toBe(true)
	}
	const trace = buildTrace(
		[...errorQueue('error'), ...queue('mapResponse')],
		'throw'
	)
	const mapper = entry(trace, 'mapResponse')
	expect(mapper.skippedBy).not.toBeNull()
	expect(trace[mapper.skippedBy!].id).toContain('error-fallback')
	expect(executed(trace).some((id) => id.startsWith('mapResponse-'))).toBe(
		false
	)
})
