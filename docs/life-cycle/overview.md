---
title: Life Cycle Event - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Life Cycle Event - ElysiaJS

    - - meta
      - name: 'description'
        content: Life Cycle allow us to intercept an important event at the predefined point allowing us to customize the behavior of our server as need.

    - - meta
      - property: 'og:description'
        content: Life Cycle allow us to intercept an important event at the predefined point allowing us to customize the behavior of our server as need.
---

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

# Life Cycle
It's recommended that you have read [Essential life-cycle](/essential/life-cycle) for better understanding of Elysia's Life Cycle.

Life Cycle allow us to intercept an important event at the predefined point allowing us to customize the behavior of our server as need.

Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle.webp)

Below are the request lifecycle available in Elysia:

<Deck>
    <Card title="Request" href="request">
        Notify new event is received
    </Card>
    <Card title="Parse" href="parse">
        Parse body into <b>Context.body</b>
    </Card>
    <Card title="Transform" href="transform">
        Modify <b>Context</b> before validation
    </Card>
    <Card title="Before Handle" href="before-handle">
        Custom validation before route handler
    </Card>
    <Card title="After Handle" href="after-handle">
        Transform returned value into a new value
    </Card>
    <Card title="Map Response" href="on-error">
        Map returned value into a response
    </Card>
    <Card title="On Error" href="on-error">
        Capture error when thrown
    </Card>
    <Card title="On Response" href="on-response">
        Executed after response sent to the client
    </Card>
    <Card title="Trace" href="trace">
        Audit and capture timespan of each event
    </Card>
</Deck>

---

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
