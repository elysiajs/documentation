---
name: elysia-2
description: Use this skill to write or migrate Elysia 1.x code to Elysia 2.x. It covers changes in API, behavior, and TypeBox alignment.
---

Elysia is a backend TypeScript framework for building REST APIs. See https://elysiajs.com/llms.txt for information about v1, and https://next.elysiajs.com/llms.txt for the Elysia 2 documentation.

Elysia 2.x introduces several breaking changes and improvements over 1.x. The following are the key changes you need to be aware of when writing/migrating your code:

## 1. Hook and handler argument are swapped

The verb methods take the **schema/hook object before the handler**.

Applies to `get`/`post`/`put`/`patch`/`delete`/`options`/`head`/`all`/`method`

**Migration:** swap position of hook and handler

```ts
// 1.x
app.get('/user/:id', ({ params, query }) => params.id, {
  params: t.Object({ id: t.Number() }),
  query: t.Object({ name: t.String() })
})

// 2.0
app.get('/user/:id', {
  params: t.Object({ id: t.Number() }),
  query: t.Object({ name: t.String() })
}, ({ params, query }) => params.id)

// no hook, unchanged
app.get('/', () => 'hi')
```

---

## 2. WebSocket

- `websocket` is now opt-in plugin and need to apply at least once in any part of app
- `.ws()` now accept 2-3 arguments
	- 2-arg forms (`.ws('/ws', handler)`, `.ws('/ws', options)`) are unchanged
	- 3-arg form is now `.ws('/ws', options, handler)`
- `ws.data` is now inline to `ws` directly
- generator function and `yield` is now preferred way of sending data instead of `ws.send` for type safety

```ts
// 1.x
new Elysia()
	.ws('/', {
		message({ send, data: { params: { id } } }) {
			send(id)
		}
	})

// 2.x
import { websocket } from 'elysia/websocket'

new Elysia()
	.use(websocket())
	.ws('/', ({ params: { id } }) => id)
```

## 3. Lifecycle methods keep the `on` prefix

Unchanged from 1.x. Early 2.0 betas used bare method names (`.beforeHandle()`, `.error()`, `.setup()`, `.cleanup()`). Those methods don't exist.

- Methods: `onRequest`, `onParse`, `onTransform`, `onBeforeHandle`, `onAfterHandle`, `onAfterResponse`, `onError`, `onStart`, `onStop`
- No prefix: `mapResponse`, `derive`, `mapDerive`, `trace`, `guard`, `parser`
- Hook keys in route, guard and macro options keep the bare event name: `beforeHandle`, `afterHandle`, `parse`, `transform`, `error`, `afterResponse`

```ts
app
	.onRequest(fn)
	.onBeforeHandle(fn)
	.get('/', { beforeHandle: fn }, () => 'hi')
	.onStart(fn)
```

---

## 4. Code is drop from error

- `onError(ErrorClass, fn)` registers a per-class handler
- `onError(fn)` registers the general handler
- **`error.code` is removed**: dispatch with `instanceof` or `onError(SomeError, fn)`

```ts
// 1.x
app
	.onError(({ code, error }) => {
	  	if (code === 'NOT_FOUND') return 'nope'
	})

// 2.0
app.onError(NotFound, () => 'nope')
app.onError(({ error }) => { /* ... */ })
```

---

## 5. `resolve` removed entirely

- `derive` now run on `beforeHandle` (previous `resolve` behavior)
- `resolve` are now removed

```ts
// 1.x
app.resolve(({ headers }) => ({ user: auth(headers) }))
// 2.0
app.derive(({ headers }) => ({ user: auth(headers) }))
```

## 6. Scope changes

- The `'scoped'` scope is **renamed to `'plugin'`**, a positional `'scoped'` throws
- The `{ as: 'scope' }` object form is **deprecated**: hook methods still accept it with a one-time warning (`'scoped'` maps to `'plugin'`), `.guard({ as })` throws. Pass the scope as the first argument
- `.decorate()` / `.state()` `{ as: 'append' | 'override' }`

```ts
// 1.x
app.onBeforeHandle({ as: 'scoped' }, fn)
app.as('scoped')
app.guard({ as: 'scoped' }, fn)
app.decorate({ as: 'override' }, 'db', db)

// 2.0
app.onBeforeHandle('plugin', fn)
app.as('plugin')
app.guard('plugin', fn)
app.decorate('override', 'db', db)
```

---

## 7. Guard/group default to OVERRIDE channel

**Every** `.guard()` and `.group()` is default to **override**

- the closer to the route, the more power, the nearer schema **replaces** an inherited one
- Use `schema: 'merge'` when both the guard and route schemas must be satisfied

**Migration:** add `schema: 'merge'` to a guard when preserving additive validation behavior:

```ts
// 1.x string-scope & run forms were implicitly additive
app.guard({ body: t.Object({ a: t.String() }) })

// 2.0 overrides by default; opt into accumulating constraints
app.guard({ schema: 'merge', body: t.Object({ a: t.String() }) })
```

---

## 8. TypeBox 1.0 alignment

See [TypeBox 1.0 migration](https://github.com/sinclairzx81/typebox/blob/main/changelog/1.0.0-migration.md)

But to summarize:
- `t.Transform` → **`t.Codec`**.
- Removed `t.Recursive`, `t.Not`, `t.RegExp`
- **`t.NoValidate` semantics changed:** now skips `Check` only `Default`/`Convert`/`Decode`/`Encode` still run.
	- `NoValidate` will throw `ValidationError` if Encode runs.
- `Error.summary` now uses TypeBox's default message (and supports Standard Schema).

---

## 9. Macros

- **Functional macro must use the object form:** `.macro({ name: fn })`.
- **`.macro(name, definition)` removed**, use `.macro({ [name]: definition })`.
	- The object form is now fully inferred (own schema, derive results, function-form arg, typo rejection)
- **Requires TypeScript ≥ 5.7** for macro definition inference.

```ts
// 1.x named form
app.macro('auth', {
  resolve: ({ headers }) => ({ user: auth(headers) })
})

// 2.0 object form only (fully inferred)
app.macro({
  auth: {
    resolve: ({ headers }) => ({ user: auth(headers) })
  }
})
```

## 10. Removed / renamed APIs & exports

- `NotFoundError` → **`NotFound`** (a thrown 404 is `instanceof NotFound`)
- `getSchemaValidator` → **`Validator.create`**
- `set.redirect`: use the `redirect()` context helper
- `context.contentType` is removed from `Context` in `parse`, use `context.contentType` instead
- Deprecated `response` field on `mapResponse`/`afterResponse` is removed
- Removed instance methods `.route()`, `.connect()`, `.env()`,
  `.affix()`/`.prefix()`/`.suffix()` and the `.store`/`.decorator`/`.config`
  **instance getters**, use the verb methods, `new Elysia({ name, prefix })` for
  plugin naming, and in-handler `context.store`/`context.decorator`
- Passing an Elysia instance to `.mount` is deprecated, use `.use` instead
- `config.encodeSchema` dropped (always enabled now)

```ts
import { NotFound } from 'elysia'          // was NotFoundError
import { Validator } from 'elysia'         // getSchemaValidator → Validator.create

// redirect
;({ set }) => { set.redirect = '/' }       // 1.x
;({ redirect }) => redirect('/')           // 2.0

// afterResponse / mapResponse field
app.onAfterResponse(({ responseValue }) => {})   // was `response`

// parse contentType
app.onParse((ctx, contentType) => {})      // 1.x (2nd param)
app.onParse((ctx) => ctx.contentType)      // 2.0

// removed instance getters / methods → use context or constructor
new Elysia({ name: 'x', prefix: '/v1' })   // was .prefix()/.affix()/.suffix()/name
;({ store, decorator }) => {}              // was app.store / app.decorator getters

// mount an instance
app.use(plugin)                            // was app.mount(plugin)
```

---

## 11. Behavior changes worth knowing (no API change, but observable)

- **`afterHandle` skips the rest on short-circuit.**
- **Bodyless `GET`/`HEAD` no longer run `parse` hooks**, a `parse` hook that must run on every request belongs in `request`/`transform`
- **422 response no longer echoes large bodies**, `found` is scoped; a request body whose JSON exceeds 4KB isn't reflected back in full. `error.value` still exposes the full value to custom handlers.
- **Returned `Response` passed by reference when `set` is untouched** (preserves
  `content-length`).
	- **Trap:** returning the *same* `Response` object across requests while writing per-request `set.headers` now mutates the shared object and leaks headers (previously errored loudly). Return a fresh `Response` per
  request.
- **`streamResponse` yields raw bytes**, re-streamed bodies are now byte-identical; a headerless binary-first chunked stream defaults to `application/octet-stream` (was `application/json`)
- **WS query parsing** now matches HTTP (duplicate keys → arrays, not last-wins; null-prototype records)
- **Validator runs `Convert → Check → DecodeUnsafe`** for codec schemas (fixes `t.Numeric({ minimum, maximum })` and `t.Codec(...).Decode(...)` against wire input)
- `file-type` is no longer shipped by default. If `t.File({ type: 'string' })` is used without file type detector, Elysia will warn to set `setFileTypeDetector()` which can run by adding `fileTypeFromBlob` from `file-type` package
