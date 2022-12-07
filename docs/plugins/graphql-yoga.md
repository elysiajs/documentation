# GraphQL Yoga Plugin
This plugin integrate GraphQL yoga with Elysia

Install with:
```bash
bun add graphql graphql-yoga @elysiajs/graphql-yoga
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

import { createYoga, createSchema } from 'graphql-yoga'

const app = new Elysia()
    .use(
        yoga({
            yoga: createYoga({
                schema: createSchema({
                    typeDefs: `
                        type Query {
                            hi: String
                        }
                `,
                resolvers: {
                    Query: {
                        hi: () => 'Hi from Elysia'
                    }
                }
            })
        })
    )
    .listen(8080)
```

Accessing `/swagger` would show you a Swagger endpoint with generated endpoint from Elysia server.

## Config
Below is a config which accepted by the plugin

### yoga
GraphQL Yoga instance.

Please refers to the [GraphQL Yoga documentation](https://the-guild.dev/graphql/yoga-server/docs).

### path
@default `/graphql`

Endpoint to expose GraphQL handler
