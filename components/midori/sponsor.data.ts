import { defineLoader } from 'vitepress';

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
}

declare const data: Sponsor[]
export { data }

export default defineLoader({
    async load(): Promise<Sponsor[]> {
        const result = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            },
            body: JSON.stringify({
                query: `{
              user(login: "saltyaom") {
                sponsorshipsAsMaintainer(
                    first: 100,
                ) {
                  totalRecurringMonthlyPriceInDollars
                  nodes {
                    sponsorEntity {
                      ... on User {
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

        // @ts-ignore
        const data: Sponsor[] = result.data?.user?.sponsorshipsAsMaintainer?.nodes || []

        return data.filter(x => !x.tier.isOneTime).sort(
            (a, b) =>
                b?.tier?.monthlyPriceInDollars -
                    a?.tier?.monthlyPriceInDollars ||
                new Date(a?.createdAt).getTime() -
                    new Date(b?.createdAt).getTime()
        )
    }
})
