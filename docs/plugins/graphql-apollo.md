---
title: Apollo GraphQL Plugin - Elysia.js
head:
    - - meta
      - property: 'og:title'
        content: Apollo GraphQL Plugin - Elysia.js

    - - meta
      - name: 'description'
        content: Plugin for Elysia that add support for using GraphQL Apollo on Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add support for using GraphQL Apollo on Elysia server. Start by installing the plugin with "bun add graphql @elysiajs/apollo @apollo/server".
---

# GraphQL Apollo Plugin
Plugin for [elysia](https://github.com/elysiajs/elysia) for using GraphQL Apollo.

Install with:
```bash
bun add graphql @elysiajs/apollo @apollo/server
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

Accessing `/graphql` should show Apollo GraphQL playground work with.

## Context
Because Elysia is based on Web Standard Request and Response which is different from Node's `HttpRequest` and `HttpResponse` that Express use, result in `req, res` being undefined in context.

Because of this, Elysia replace both with `context` like route parameter.
```typescript
const app = new Elysia()
    .use(
        apollo({
            typeDefs,
            resolvers,
            context: async ({ request }) => {
                const authorization = request.headers.get('Authorization')

                return {
                    authorization
                }
            }
        })
    )
    .listen(8080)
```


## Config
This plugin extends Apollo's [ServerRegistration](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options) (which is `ApolloServer`'s' constructor parameter).

Below are the extended parameters for configuring Apollo Server with Elysia.
### path
@default "/graphql"

Path to expose Apollo Server.

### enablePlayground
@default "process.env.ENV !== 'production'

Determine whether should Apollo should provide Apollo Playground.
