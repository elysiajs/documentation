# GraphQL Apollo Plugin
Plugin for [elysia](https://github.com/elysiajs/elysia) for using GraphQL Apollo.

Install with:
```bash
bun add @elysiajs/apollo @apollo/server graphql
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { apollo, gql } from '@elysiajs/apollo'

const app = new Elysia()
    .use(
        apollo({
            typeDefs: gql`
                type Book {
                    title: String
                    author: String
                }

                type Query {
                    books: [Book]
                }
            `,
            resolvers: {
                Query: {
                    books: () => {
                        return [
                            {
                                title: 'Elysia',
                                author: 'saltyAom'
                            }
                        ]
                    }
                }
            }
        })
    )
    .listen(8080)
```

Accessing `/swagger` would show you a Swagger endpoint with generated endpoint from Elysia server.

## Config
This plugin extends Apollo's [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options) (which is `ApolloServer`'s' constructor parameter).

Below are the extended parameters for configuring Apollo Server with Elysia.
### path
@default "/graphql"

Path to expose Apollo Server.

### enablePlayground
@default "process.env.ENV !== 'production'

Determine whether should Apollo should provide Apollo Playground.
