# Plugin
A plugin is a way to decouple logic into smaller parts, defining reusable components across the server.

Defining a plugin is as simple as:
```typescript
import { Elysia } from 'elysia'

const plugin = (app: Elysia) => app
    .state('plugin-version', 1)
    .get('/from-plugin', () => 'Hi')

const app = new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(8080)
```

Plugin can register by using `use`.

Registering a plugin will combine types between plugin and current instance, and the scope of hooks, and schema get merged too.

## Config
You can customize plugin by creating function to return callback which accepts Elysia.

```typescript
import { Elysia } from 'elysia'

const plugin = ({
    prefix: '/v1'
}) => (app: Elysia) => app
    .get(`/${prefix}/hi`, () => 'Hi')

const app = new Elysia()
    .use(plugin({
        prefix: '/v2'
    }))
    .listen(8080)
```

Config type will be inferred into `use`, generating auto completion and type strict as intend.
