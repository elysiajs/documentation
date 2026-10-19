export const stages = [
	{ id: 'request', label: 'Request', hook: true },
	{ id: 'parse', label: 'Parse', hook: true },
	{ id: 'transform', label: 'Transform', hook: true },
	{ id: 'validation', label: 'Validation', hook: false },
	{ id: 'beforeHandle', label: 'Before handle', hook: true },
	{ id: 'handler', label: 'Handler', hook: false },
	{ id: 'afterHandle', label: 'After handle', hook: true },
	{ id: 'error', label: 'On error', hook: true },
	{ id: 'mapResponse', label: 'Map response', hook: true },
	{ id: 'sent', label: 'Response sent', hook: false },
	{ id: 'afterResponse', label: 'After response', hook: true }
] as const

export type Stage = (typeof stages)[number]['id']
export type HookStage = Extract<(typeof stages)[number], { hook: true }>['id']
export type Hook = {
	id: string
	stage: HookStage
	action: 'continue' | 'return' | 'error'
}
export type ResponseValue =
	| string
	| {
			status: number
			response: string | Record<string, unknown>
			kind?: 'Response'
			headers?: Record<string, string>
	  }
export type ResponseSnapshot = {
	status: number
	body: string
	headers: Record<string, string>
}
export type Snapshot = {
	body: { name: string } | null
	validated: boolean
	responseValue: ResponseValue | null
	headers: Record<string, string>
	response: ResponseSnapshot | null
	sent: boolean
	error: string | null
}
export type TraceStep = {
	id: string
	hookId?: string
	visit: number
	index: number
	stage: Stage
	kind: 'stage' | 'hook' | 'builtin'
	label: string
	skippedBy: number | null
	inactive: boolean
	log: string
	snapshot: Snapshot
}

export const requestBody = '{"name":"Elysia"}'
export const eventDelay = 300
export const returnEffects: Record<HookStage, string> = {
	request: 'Return 200; skip to response mapping.',
	parse: 'Use returned body; skip remaining parsers.',
	transform: 'Return ignored; later hooks still run.',
	beforeHandle: 'Return 200; skip to afterHandle.',
	afterHandle: 'Return 200; skip remaining afterHandle hooks.',
	error: 'Return 200; skip remaining error hooks.',
	mapResponse: 'Return a 200 Response; skip remaining mappers.',
	afterResponse: 'Return ignored; the response is already sent.'
}

export function isRevealed(step: TraceStep, cursor: number) {
	return (
		!step.inactive &&
		(step.index <= cursor ||
			(step.skippedBy !== null && step.skippedBy <= cursor))
	)
}

export function nextEvent(trace: readonly TraceStep[], cursor: number) {
	return trace.findIndex(
		(step) =>
			step.index > cursor && step.skippedBy === null && !step.inactive
	)
}

type Failure = { index: number; status: 400 | 418; message: string }
type Outcome = {
	value: ResponseValue | null
	returnedAt: number | null
	failure: Failure | null
}
const problemHeaders = { 'content-type': 'application/problem+json' }
const teapotMessage = "I'm a teapot"

export function buildTrace(
	hooks: readonly Hook[],
	handler: 'return' | 'throw' = 'return'
): TraceStep[] {
	const state: Snapshot = {
		body: null,
		validated: false,
		responseValue: null,
		headers: {},
		response: null,
		sent: false,
		error: null
	}
	const trace: TraceStep[] = []
	const visits: Partial<Record<Stage, number>> = {}
	const errorHooks = hooks.filter((hook) => hook.stage === 'error')
	const mappers = hooks.filter((hook) => hook.stage === 'mapResponse')

	function append(
		stage: Stage,
		kind: TraceStep['kind'],
		id: string,
		label: string,
		log: string,
		skippedBy: number | null = null,
		inactive = false
	) {
		const visit = visits[stage] ?? 1
		const index = trace.length
		trace.push({
			id: visit === 1 ? id : `${id}:visit:${visit}`,
			...(kind === 'hook' ? { hookId: id } : {}),
			visit,
			index,
			stage,
			kind,
			label,
			log,
			skippedBy,
			inactive,
			snapshot: structuredClone(state)
		})
		return index
	}

	function fail(stage: Stage): Failure {
		const failure: Failure = {
			index: trace.length,
			status: stage === 'parse' ? 400 : 418,
			message: stage === 'parse' ? 'Bad Request' : teapotMessage
		}
		state.error = failure.message
		return failure
	}

	function runStage(
		stage: Stage,
		skippedBy: number | null = null,
		inactive = false,
		preserveMappedValue = false
	): Outcome {
		visits[stage] = (visits[stage] ?? 0) + 1
		const result: Outcome = { value: null, returnedAt: null, failure: null }
		let log = `Run ${stage} hooks in order.`
		if (stage === 'request')
			log = 'Receive POST /greet. The body is not parsed yet.'
		if (stage === 'parse')
			log = 'Try custom parsers before the built-in JSON parser.'
		if (stage === 'validation') {
			if (skippedBy === null) state.validated = true
			log = 'name is a string. Request validation passed.'
		}
		if (stage === 'handler' && skippedBy === null) {
			if (handler === 'throw') {
				result.failure = fail(stage)
				log = 'Throw TEAPOT (418); enter error handling.'
			} else {
				result.value = state.responseValue = `Hello ${state.body!.name}`
				log = `Return ${result.value}.`
			}
		}
		if (stage === 'sent') {
			state.sent = true
			log = `Send ${state.response!.status} response.`
		}
		if (stage === 'afterResponse')
			log = 'The response is sent. Run post-response hooks.'
		append(
			stage,
			'stage',
			stage,
			stages.find((item) => item.id === stage)!.label,
			log,
			skippedBy,
			inactive
		)

		for (const [position, hook] of hooks
			.filter((item) => item.stage === stage)
			.entries()) {
			const cause =
				skippedBy ?? result.failure?.index ?? result.returnedAt
			let hookLog = 'Return undefined; resume the flow.'
			if (cause === null && !inactive) {
				if (stage === 'afterHandle') {
					state.headers['x-example'] = 'life-cycle'
					hookLog =
						'Set x-example: life-cycle; keep the response value.'
				}
				if (stage === 'parse')
					hookLog =
						'Return no value, run the next parser.'
				if (stage === 'transform')
					hookLog = `Log body.name: ${state.body!.name}; continue.`
				if (stage === 'afterResponse')
					hookLog = 'Log response completion.'
				if (hook.action === 'error') {
					if (stage === 'afterResponse')
						hookLog =
							'Throw TEAPOT (418); log the error and continue. The sent response cannot change.'
					else {
						result.failure = fail(stage)
						hookLog =
							stage === 'parse'
								? 'Throw TEAPOT (418); parsing wraps it as ParseError (400).'
								: 'Throw TEAPOT (418); enter error handling.'
					}
				} else if (hook.action === 'return') {
					hookLog = returnEffects[hook.stage]
					if (stage === 'parse') {
						state.body = { name: 'From parse' }
						hookLog =
							'Return { name: "From parse" }; skip remaining parsers.'
					} else if (
						stage !== 'transform' &&
						stage !== 'afterResponse'
					) {
						result.value = {
							status: 200,
							response:
								stage === 'error'
									? 'Handled error'
									: 'Short circuit'
						}
						if (stage === 'mapResponse')
							result.value.kind = 'Response'
						if (
							stage === 'beforeHandle' ||
							stage === 'afterHandle' ||
							(stage === 'mapResponse' && !preserveMappedValue)
						)
							state.responseValue = result.value
					}
					if (stage !== 'transform' && stage !== 'afterResponse')
						result.returnedAt = trace.length
				}
			}
			append(
				stage,
				'hook',
				hook.id,
				`Hook ${position + 1}`,
				hookLog,
				cause,
				inactive
			)
		}
		if (stage === 'parse') {
			const cause =
				skippedBy ?? result.failure?.index ?? result.returnedAt
			if (cause === null) state.body = JSON.parse(requestBody)
			append(
				stage,
				'builtin',
				'parse-default',
				'Body parser',
				'Read the JSON body: { name: "Elysia" }.',
				cause
			)
		}
		return result
	}

	function errorValue(failure: Failure): ResponseValue {
		const response =
			failure.status === 400
				? {
						type: 'parse',
						code: 'parse',
						status: 400,
						detail: teapotMessage,
						title: 'Bad Request'
					}
				: {
						type: 'TEAPOT',
						code: 'TEAPOT',
						detail: teapotMessage,
						status: 418,
						title: teapotMessage
					}
		return failure.status === 400
			? {
					kind: 'Response',
					status: 400,
					response: JSON.stringify(response),
					headers: problemHeaders
				}
			: { status: 418, response, headers: problemHeaders }
	}

	function finish(value: ResponseValue, discardHeaders = false) {
		if (
			typeof value !== 'string' &&
			value.kind !== 'Response' &&
			value.headers
		)
			Object.assign(state.headers, value.headers)
		state.response = {
			status: typeof value === 'string' ? 200 : value.status,
			body:
				typeof value === 'string'
					? value
					: typeof value.response === 'string'
						? value.response
						: JSON.stringify(value.response),
			headers: {
				...(typeof value === 'string' ? {} : value.headers),
				...(discardHeaders ? {} : state.headers)
			}
		}
	}

	function map(value: ResponseValue, root: boolean): Failure | null {
		if (mappers.length) state.responseValue = value
		const result = runStage('mapResponse', null, false, root)
		if (!result.failure) finish(result.value ?? value)
		append(
			'mapResponse',
			'builtin',
			'response-default',
			'Finalize response',
			result.returnedAt === null
				? 'Map the value to a Response and merge set.headers.'
				: 'Keep the returned Response and merge set.headers.',
			result.failure?.index ?? null
		)
		return result.failure
	}

	function skipMap(cause: number) {
		if (visits.mapResponse) return
		runStage('mapResponse', cause)
		append(
			'mapResponse',
			'builtin',
			'response-default',
			'Finalize response',
			'Response mapping was skipped by the error response.',
			cause
		)
	}

	function panic(failure: Failure) {
		const body = {
			type: 'internal-server-error',
			code: 'internal-server-error',
			title: 'Internal Server Error',
			status: 500,
			detail: failure.message,
			name: failure.status === 400 ? 'ParseError' : 'TEAPOT',
			...(failure.status === 400 ? { cause: { code: 'TEAPOT' } } : {})
		}
		finish(
			{
				kind: 'Response',
				status: 500,
				response: JSON.stringify(body),
				headers: problemHeaders
			},
			true
		)
		const cause = append(
			trace.at(-1)!.stage,
			'builtin',
			'error-fallback',
			'Fallback response',
			'Error handling failed. Log the failure and send the development 500 response.'
		)
		skipMap(cause)
	}

	// V2 has one route catch and one outer request catch. The outer catch never retries itself.
	function handleError(failure: Failure, root: boolean) {
		state.error = failure.message
		const result = runStage('error')
		const cause = result.failure?.index ?? result.returnedAt
		const fallback = append(
			'error',
			'builtin',
			'error-default',
			'Default error response',
			root || !errorHooks.length
				? `Prepare ${failure.status}; run app response mappers.`
				: `Return ${failure.status}; skip response mapping.`,
			cause
		)
		if (result.failure) {
			if (root) panic(failure)
			else handleError(result.failure, true)
			return
		}
		if (result.value === null && !root && errorHooks.length) {
			finish(errorValue(failure))
			// The default error is finalized at this event, before skipped mapper rows.
			trace[fallback].snapshot = structuredClone(state)
			skipMap(fallback)
			return
		}
		const mappedFailure = map(result.value ?? errorValue(failure), root)
		if (mappedFailure) {
			if (root) panic(failure)
			else handleError(mappedFailure, true)
		}
	}

	let blockedBy: number | null = null
	let pendingFailure: Failure | null = null
	let pendingValue: ResponseValue | null = null
	let requestEarly = false
	let beforeReturn: number | null = null
	for (const stage of [
		'request',
		'parse',
		'transform',
		'validation',
		'beforeHandle',
		'handler',
		'afterHandle'
	] as const) {
		const result = runStage(
			stage,
			blockedBy ?? (stage === 'handler' ? beforeReturn : null)
		)
		if (result.failure) {
			pendingFailure = result.failure
			blockedBy = result.failure.index
		}
		if (result.value !== null) pendingValue = result.value
		if (stage === 'request' && result.returnedAt !== null) {
			requestEarly = true
			blockedBy = result.returnedAt
		}
		if (stage === 'beforeHandle') beforeReturn = result.returnedAt
	}
	if (pendingFailure)
		handleError(
			pendingFailure,
			trace[pendingFailure.index].stage === 'request' ||
				!errorHooks.length
		)
	else {
		// Keep the inactive group on normal runs; a late mapper error gets its first real visit after its cause.
		if (
			mappers.find((hook) => hook.action !== 'continue')?.action !==
			'error'
		) {
			runStage('error', null, true)
			append(
				'error',
				'builtin',
				'error-default',
				'Default error response',
				'No error occurred.',
				null,
				true
			)
		}
		const failure = map(pendingValue!, requestEarly)
		if (failure) handleError(failure, requestEarly || !errorHooks.length)
	}
	runStage('sent')
	runStage('afterResponse')
	return trace
}
