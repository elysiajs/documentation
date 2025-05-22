import { defineLoader } from 'vitepress'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface Sponsor {
    sponsorEntity: {
        login: string
        name: string
        avatarUrl: string
    }
    createdAt: string
    tier: {
        isOneTime: boolean
        isCustomAmount: boolean
        monthlyPriceInDollars: number
    }
    duration: string
}

declare const data: Sponsor[]
export { data }

export default defineLoader({
    async load(): Promise<Sponsor[]> {
        try {
            if (!process.env.GITHUB_TOKEN)
                throw new Error('GITHUB_TOKEN is not set')

            const result = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `bearer ${process.env.GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    query: `query {
	                  user(login: "saltyaom") {
	                    sponsorshipsAsMaintainer(
	                        first: 100
	                    ) {
	                      totalRecurringMonthlyPriceInDollars
	                      nodes {
	                        sponsorEntity {
	                          ... on User {
	                            login
	                            name
	                            avatarUrl
	                          }
	                          ... on Organization {
	                            login
	                            name
	                            avatarUrl
	                          }
	                        }
	                        createdAt
	                        tier {
	                          isOneTime
	                          isCustomAmount
	                          monthlyPriceInDollars
	                        }
	                      }
	                    }
	                  }
	                }`
                })
            }).then((x) => x.json())

            const data: Sponsor[] =
                result.data?.user?.sponsorshipsAsMaintainer?.nodes || []

            return data
                .filter((x) => !x.tier.isOneTime)
                .sort(
                    (a, b) =>
                        b?.tier?.monthlyPriceInDollars -
                            a?.tier?.monthlyPriceInDollars ||
                        new Date(a?.createdAt).getTime() -
                            new Date(b?.createdAt).getTime()
                )
                .map((sponsor) => ({
                    ...sponsor,
                    duration: dayjs()
                        .from(dayjs(sponsor.createdAt))
                        .replace('in', 'for')
                }))
        } catch (error) {
            console.warn('Fetch sponsors error')
            console.warn(error)

            return []
        }
    }
})
