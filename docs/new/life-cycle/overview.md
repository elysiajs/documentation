# Life Cycle
It's recommended that you have read [Essential life-cycle](/new/essential/life-cycle) for better understanding of Elysia's Life Cycle.

Life Cycle allow us to intercept an important event at the predefined point allowing us to customize the behavior of our server as need.

Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle.webp)

Below are the request lifecycle available in Elysia:
1. Request
2. Parse
3. Transform
4. Validation
5. Before Handle
6. Handle
7. After Handle
8. Error
9. Response

Below are the additional life-cycle event available in Elysia:
1. Trace
2. Start
3. Stop

Every life-cycle could be apply at both:
1. Local Hook (route)
2. Global Hook

## Local Hook

The local hook is executed on a specific route.

To use a local hook, you can inline hook into a route handler:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

## Global Hook

Register hook into **every** handler that came after.

To add a global hook, you can use `.on` followed by a life cycle event in camelCase:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/none', () => '<h1>Hello World</h1>')
    .onAfterhandle(() => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>Hello World</h1>')
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

Events from other plugins are also applied to the route so the order of code is important.
