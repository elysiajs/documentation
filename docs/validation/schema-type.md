---
title: Schema type - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: Validation

    - - meta
      - name: 'description'
        content: Elysia supports declarative schema with the following types. Body for validating an incoming HTTP message. Query for query string or URL parameter. Params for path parameters. Header for request headers. Cookie for  cookies. Response for validating response.

    - - meta
      - name: 'og:description'
        content: Elysia supports declarative schema with the following types. Body for validating an incoming HTTP message. Query for query string or URL parameter. Params for path parameters. Header for request headers. Cookie for  cookies. Response for validating response.
---


<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

# Schema Type

Elysia supports declarative schema with the following types:

<Deck>
    <Card title="Body" href="#body">
        Validate an incoming HTTP Message
    </Card>
    <Card title="Query" href="#query">
        Query string or URL parameter
    </Card>
    <Card title="Params" href="#query">
        Path parameters
    </Card>
    <Card title="Header" href="#header">
        Header of the request
    </Card>
    <Card title="Cookie" href="#cookie">
        Cookie of the request
    </Card>
    <Card title="Response" href="#response">
        Response of the request
    </Card>
</Deck>

---

These properties should be provided as the third argument of the route handler to validate the incoming request.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', () => 'Hello World!', {
        query: t.Object({
            name: t.String()
        }),
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

The response should as follows:
| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

When schema is provided, the type will be inferred from the schema automatically, and generate an OpenAPI type for Swagger documentation generation, leaving out the redundant task of providing type manually.

## Body

Validate an incoming [HTTP Message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (or body).

These messages are additional messages for the webserver to process.

The body is provided as same as `body` in `fetch` API.

```typescript
fetch('https://elysiajs.com', {
    method: 'POST',
    body: JSON.stringify({
        hello: 'Elysia'
    })
})
```

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World!', {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)
```

The validation should be as follows:
| Body | Validation |
| --- | --------- |
| \{ hello: 'Elysia' \} | ✅ |
| \{ hello: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

Elysia disabled body-parser for **GET** and **HEAD** message by default, following the specs of HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> If the request method does not include defined semantics for an entity-body, then the message-body SHOULD be ignored when handling the request.

Most browsers disable the attachment of the body by default for **GET** and **HEAD** method.

## Query

Query string or search parameter is an addition string provided after pathname starting with **?** to provide additional information, usually for customized web server behavior like filter or search.

![URL Object](/essential/url-object.svg)

Query is provided after the **?** in Fetch API.

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

This field is usually used to enforce an important query name or a specific value pattern.

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ query }) => query, {
        query: t.Object({
            name: t.String(),
            alias: t.Optional(t.String())
        })
    })
    .listen(3000)
```

The validation should be as follows:
| Body | Validation |
| --- | --------- |
| \{ hello: 'Elysia' \} | ✅ |
| \{ hello: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

## Params

For a detailed explanation, see [path](/new/essential/path), but to summarize.

The dynamic path is a pattern matching for a specific part of the URL segment which could store potentially important information, to be used later.

Elysia uses the segment prefix with a colon "**:**"

![Path Parameters](/essential/path-parameter.webp)

For instance, **/id/:id** tells Elysia to match any path up until /id, then the next segment as a params object.

**params** is used to validate the path parameter object.

**This field is usually not needed as Elysia can infer type from path parameter automatically**, unless a need for specific value pattern is needed, for example, numeric value or template literal pattern.

```typescript
fetch('https://elysiajs.com/id/1')
```

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ query }) => query, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

The validation should be as follows:
| URL | Validation |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

## Header

HTTP headers let the client and the server pass additional information with an HTTP request or response, usually treated as metadata.

This field is usually used to enforce some specific header field, for example, `Authorization`.

Headers are provided as same as `body` in `fetch` API.

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia will parse headers as a lower-case key only.

Please make sure that you are using a lower-case field name when using header validation.
:::

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', ({ query }) => query, {
        headers: t.Object({
            authorization: t.String()
        })
    })
    .listen(3000)
```

The validation should be as follows:
| URL | Validation |
| --- | --------- |
| \{ authorization: 'Bearer 12345' \} | ✅ |
| \{ X-Request-Id: '1' \} | ❌ |

## Cookie

An HTTP cookie is a small piece of data that a server sends to the client, it's data that is sent with every visit to the same web server to let the server remember client information.

In simpler terms, a stringified state that sent with every request.

This field is usually used to enforce some specific cookie field.

A cookie is a special header field that Fetch API doesn't accept a custom value but is managed by the browser. To send a cookie, you must use a `credential` field instead:

```typescript
fetch('https://elysiajs.com/', {
    credential: 'include'
})
```

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia().get('/', ({ cookie }) => cookie.session.value, {
    params: t.Object({
        session: t.String()
    })
})
```

## Response

Validate the return value of the handler.

This field isn't usually used unless the need to enforce a specific value of return type is needed or for documentation purposes.

If provided, by default, Elysia will try to enforce type using TypeScript to provide a type hint for your IDE.

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia().get('/', () => 'hello world', {
    response: t.String()
})
```

The response could accept an object with a key of HTTP status to enforce the response type on a specific status.

```typescript
import { Elysia, t } from 'elysia'

new Elysia().get('/', () => 'hello world', {
    response: {
        200: t.String(),
        400: t.Number()
    }
})
```

The validation should be as follows:
| Response | Status | Validation |
| --- | --- | --------- |
| 'hello' | 200 | ✅ |
| 1 | 200 | ❌ |
| 'hello' | 400 | ❌ |
| 1 | 200 | ✅ |
| `false` | 200 | ❌ |
| `false` | 400 | ❌ |
