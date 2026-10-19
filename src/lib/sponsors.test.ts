import { afterAll, afterEach, beforeEach, expect, spyOn, test } from 'bun:test'

const token = 'test-token-never-log'
const originalToken = process.env.GITHUB_TOKEN
const request = spyOn(globalThis, 'fetch')
const warning = spyOn(console, 'warn')
let moduleId = 0

async function freshLoader(): Promise<typeof import('./sponsors')> {
	return import(`./sponsors.ts?test=${moduleId++}`)
}

beforeEach(() => {
	process.env.GITHUB_TOKEN = token
	request.mockReset()
	request.mockRejectedValue(new Error('Unexpected request'))
	warning.mockReset()
	warning.mockImplementation(() => {})
})

afterEach(() => {
	if (originalToken === undefined) delete process.env.GITHUB_TOKEN
	else process.env.GITHUB_TOKEN = originalToken
})

afterAll(() => {
	request.mockRestore()
	warning.mockRestore()
})

function sponsorship(
	login: string,
	monthlyPriceInDollars = 200,
	createdAt = '2026-01-01T00:00:00Z',
	isOneTime = false,
	name: string | null = login
) {
	return {
		sponsorEntity: {
			login,
			name,
			avatarUrl: `https://avatars.githubusercontent.com/${login}`
		},
		createdAt,
		tier: { isOneTime, monthlyPriceInDollars }
	}
}

function response(nodes: unknown[]) {
	return { data: { user: { sponsorshipsAsMaintainer: { nodes } } } }
}

test('the sidebar shows recurring sponsors from $200, highest tier then longest supporter first', async () => {
	request.mockResolvedValue(
		Response.json(
			response([
				sponsorship('newer', 200, '2026-02-01T00:00:00Z'),
				sponsorship('below', 199),
				sponsorship('l2D', 1000),
				sponsorship('one-time', 1000, undefined, true),
				null,
				{ sponsorEntity: null },
				{ ...sponsorship('no-tier'), tier: null },
				{ ...sponsorship('bad-date'), createdAt: 'invalid' },
				sponsorship('older', 200, '2025-01-01T00:00:00Z', false, null),
				sponsorship('highest', 500, undefined, false, 'Highest sponsor')
			])
		)
	)
	const { getSponsors } = await freshLoader()

	expect(await getSponsors()).toEqual([
		{
			login: 'highest',
			name: 'Highest sponsor',
			avatarUrl: 'https://avatars.githubusercontent.com/highest'
		},
		{
			login: 'older',
			name: 'older',
			avatarUrl: 'https://avatars.githubusercontent.com/older'
		},
		{
			login: 'newer',
			name: 'newer',
			avatarUrl: 'https://avatars.githubusercontent.com/newer'
		}
	])
	expect(warning).not.toHaveBeenCalled()
})

test('all page renders share one authenticated active sponsorship request', async () => {
	request.mockResolvedValue(Response.json(response([sponsorship('sponsor')])))
	const { getSponsors } = await freshLoader()
	const results = await Promise.all([
		getSponsors(),
		getSponsors(),
		getSponsors()
	])

	expect(results[0]).toEqual(results[1])
	expect(await getSponsors()).toEqual(results[0])
	expect(request).toHaveBeenCalledTimes(1)
	const [url, options] = request.mock.calls[0]!
	expect(url).toBe('https://api.github.com/graphql')
	expect(options?.method).toBe('POST')
	expect(options?.headers).toEqual({
		Authorization: `bearer ${token}`,
		'Content-Type': 'application/json'
	})
	expect(JSON.parse(String(options?.body))).toMatchObject({
		query: expect.stringContaining('user(login: "saltyaom")')
	})
	expect(options?.body).toContain('first: 100, activeOnly: true')
	expect(options?.body).toContain('... on User')
	expect(options?.body).toContain('... on Organization')
	expect(options?.signal).toBeInstanceOf(AbortSignal)
})

test('a build without a token hides sponsors and warns once without sending a request', async () => {
	delete process.env.GITHUB_TOKEN
	const { getSponsors } = await freshLoader()

	expect(await Promise.all([getSponsors(), getSponsors()])).toEqual([[], []])
	expect(request).not.toHaveBeenCalled()
	expect(warning).toHaveBeenCalledTimes(1)
	expect(warning.mock.calls.flat().join(' ')).toContain(
		'GITHUB_TOKEN is not set'
	)
})

test('GitHub failures hide sponsors without exposing response or error details', async () => {
	for (const failedResponse of [
		new Response(token, { status: 401 }),
		Response.json({
			...response([sponsorship('partial')]),
			errors: [{ message: token }]
		}),
		Response.json({ data: null }),
		Response.json({ data: { user: { sponsorshipsAsMaintainer: {} } } }),
		new Response('not JSON')
	]) {
		request.mockResolvedValue(failedResponse)
		const { getSponsors } = await freshLoader()
		expect(await getSponsors()).toEqual([])
		expect(await getSponsors()).toEqual([])
	}
	request.mockRejectedValue(new Error(token))
	const { getSponsors } = await freshLoader()
	expect(await getSponsors()).toEqual([])
	expect(request).toHaveBeenCalledTimes(6)
	expect(warning).toHaveBeenCalledTimes(6)
	expect(warning.mock.calls.flat().join(' ')).not.toContain(token)
})
