export interface Sponsor {
    sponsorEntity: {
        login: string
        name: string
        avatarUrl: string
    }
    createdAt: string
    tier: {
        isCustomAmount: boolean
        monthlyPriceInDollars: number
    }
}

export default {
    async load() {
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
        const data: Sponsor[] = result.data.user.sponsorshipsAsMaintainer.nodes

        return data.sort(
            (a, b) =>
                b?.tier?.monthlyPriceInDollars -
                    a?.tier?.monthlyPriceInDollars ||
                new Date(b?.createdAt).getTime() -
                    new Date(a?.createdAt).getTime()
        )
    }
}
