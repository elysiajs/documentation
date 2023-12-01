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

When schema is provided, type will be infered from the schema automatically, and generate an OpenAPI type for Swagger documentation generation, leaving out redudant task of providing type manually.

## Body

Validate an incoming [HTTP Message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (or body).

These message are an additional message for web server to process.

Body is provided as same as `body` in `fetch` API.

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

Elysia disabled body parser for **GET** and **HEAD** message by default, following the specs of HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> If the request method does not include defined semantics for an entity-body, then the message-body SHOULD be ignored when handling the request.

And most browser disable attachment of body by default for **GET** and **HEAD** method.

## Query

Query string or search parameter is an addition string provided after pathname starting with **?** to provide additional information, usually for customize web server behavior like filter or search.

![URL Object](/essential/url-object.svg)

Query is provided after the **?** in Fetch API.

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

This field is usually use to enforce important query name or a specific value pattern.

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

For detail explaination, see [path](/new/essential/path), but to summarize.

Dynamic path is a pattern matching for a specific part of URL segment to which could store a potential important information, to be used later.

Elysia use the segment prefix with colon "**:**"

![Path Parameters](/essential/path-parameter.webp)

For instance **/id/:id** tells Elysia to match any path up until /id, then the next segment as params object.

**params** is use to validate the path parameter object.

**This field is usually doesn't need as Elysia can infers type from path parametr automatically**, unless a need for specific value pattern is need, for example numeric value or template literal pattern.

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

HTTP headers let the client and the server pass additional information with an HTTP request or response, usually threat as metadata.

This field is usually use to enforce some specific header field, for example `Authorization`.

Headers is provided as same as `body` in `fetch` API.

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia will parse headers as a lower-case key only.

Please make sure that you are using lower-case field name when using header validation.
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

An HTTP cookie is a small piece of data that server sends to client, it's a data that send with every visits to the same web server to let the server remember information about client.

In a simpler term, a stringified state that sent with every request.

This field is usually use to enforce some specific cookie field.

Cookie is a special header field that Fetch API doesn't accept a custom value, but managed by browser. To send a cookie, you must use a `credential` field instead:

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

Validate the return value of handler.

This field isn't usually use unless the need to enforce a specific value of return type is need or for documentation purpose.

If provided, by default, Elysia will try to enforce type using TypeScript to provide type-hint for your IDE.

### Example

```typescript
import { Elysia, t } from 'elysia'

new Elysia().get('/', () => 'hello world', {
    response: t.String()
})
```

Response could accept an object with key of HTTP status to enforce response type on specific status.

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
