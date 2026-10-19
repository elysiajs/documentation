import { z } from 'astro/zod'

const sponsorSchema = z
	.object({
		login: z.string().min(1),
		name: z.string().nullable(),
		avatarUrl: z.string().url()
	})
	.transform((sponsor) => ({
		...sponsor,
		name: sponsor.name ?? sponsor.login
	}))

const sponsorshipSchema = z.object({
	sponsorEntity: sponsorSchema,
	createdAt: z.string().datetime(),
	tier: z.object({
		isOneTime: z.boolean(),
		monthlyPriceInDollars: z.number().finite().nonnegative()
	})
})

const responseSchema = z.object({
	errors: z.array(z.unknown()).optional(),
	data: z.object({
		user: z.object({
			sponsorshipsAsMaintainer: z.object({
				nodes: z.array(z.unknown())
			})
		})
	})
})

export type Sponsor = z.infer<typeof sponsorSchema>

let sponsors: Promise<Sponsor[]> | undefined

export function getSponsors(): Promise<Sponsor[]> {
	return (sponsors ??= loadSponsors())
}

async function loadSponsors(): Promise<Sponsor[]> {
	const token = import.meta.env?.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN
	if (!token) {
		console.warn('Sponsors unavailable: GITHUB_TOKEN is not set')
		return []
	}

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${token}`,
				'Content-Type': 'application/json'
			},
			signal: AbortSignal.timeout(10_000),
			body: JSON.stringify({
				query: `query {
					user(login: "saltyaom") {
						sponsorshipsAsMaintainer(first: 100, activeOnly: true) {
							nodes {
								sponsorEntity {
									... on User { login name avatarUrl }
									... on Organization { login name avatarUrl }
								}
								createdAt
								tier { isOneTime monthlyPriceInDollars }
							}
						}
					}
				}`
			})
		})
		if (!response.ok) throw new Error('GitHub request failed')

		const body: unknown = await response.json()
		const result = responseSchema.safeParse(body)
		if (!result.success || result.data.errors?.length)
			throw new Error('Invalid GitHub response')

		return result.data.data.user.sponsorshipsAsMaintainer.nodes
			.flatMap((node) => {
				const result = sponsorshipSchema.safeParse(node)
				return result.success ? [result.data] : []
			})
			.filter(
				(sponsor) =>
					!sponsor.tier.isOneTime &&
					sponsor.tier.monthlyPriceInDollars >= 200 &&
					sponsor.sponsorEntity.login !== 'l2D'
			)
			.sort(
				(a, b) =>
					b.tier.monthlyPriceInDollars -
						a.tier.monthlyPriceInDollars ||
					Date.parse(a.createdAt) - Date.parse(b.createdAt)
			)
			.map((sponsor) => sponsor.sponsorEntity)
	} catch {
		console.warn('Sponsors unavailable: GitHub sponsor request failed')
		return []
	}
}
