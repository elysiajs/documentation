---
title: Config - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Config - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.

  - - meta
    - property: 'og:description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.
---

# Config

Elysia comes with a configurable behavior, allowing us to customize various aspects of its functionality.

We can define a configuration by using a constructor.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1',
	normalize: true
})
```

## adapter

###### Since 1.1.11

Runtime adapter for using Elysia in different environments.

Default to appropriate adapter based on the environment.

```ts
import { Elysia, t } from 'elysia'
import { BunAdapter } from 'elysia/adapter/bun'

new Elysia({
	adapter: BunAdapter
})
```

## aot

###### Since 0.4.0

Ahead of Time compilation.

Elysia has a built-in JIT _"compiler"_ that can [optimize performance](/blog/elysia-04.html#ahead-of-time-complie).

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	aot: true
})
```
Disable Ahead of Time compilation

#### Options - @default `false`

- `true` - Precompile every route before starting the server

- `false` - Disable JIT entirely. Faster startup time without cost of performance

## detail

Define an OpenAPI schema for all routes of an instance.

This schema will be used to generate OpenAPI documentation for all routes of an instance.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	detail: {
		hide: true,
		tags: ['elysia']
	}
})
```

## encodeSchema

Handle custom `t.Transform` schema with custom `Encode` before returning the response to client.

This allows us to create custom encode function for your data before sending response to the client.

```ts
import { Elysia, t } from 'elysia'

new Elysia({ encodeSchema: true })
```

#### Options - @default `true`

- `true` - Run `Encode` before sending the response to client
- `false` - Skip `Encode` entirely

## name

Define a name of an instance which is used for debugging and [Plugin Deduplication](/essential/plugin.html#plugin-deduplication)

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	name: 'service.thing'
})
```

## nativeStaticResponse
###### Since 1.1.11

Use an optimized function for handling inline value for each respective runtime.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	nativeStaticResponse: true
})
```

#### Example

If enabled on Bun, Elysia will insert inline value into `Bun.serve.static` improving performance for static value.

```ts
import { Elysia } from 'elysia'

// This
new Elysia({
	nativeStaticResponse: true
}).get('/version', 1)

// is an equivalent to
Bun.serve({
	static: {
		'/version': new Response(1)
	}
})
```

## normalize

###### Since 1.1.0

Whether Elysia should coerce field into a specified schema.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	normalize: true
})
```

When unknown properties that is not specified in schema is found on either input and output, how should Elysia handle the field?

Options - @default `true`

- `true`: Elysia will coerce fields into a specified schema using [exact mirror](/blog/elysia-13.html#exact-mirror)

- `typebox`: Elysia will coerce fields into a specified schema using [TypeBox's Value.Clean](https://github.com/sinclairzx81/typebox)

- `false`: Elysia will raise an error if a request or response contains fields that are not explicitly allowed in the schema of the respective handler.

## precompile

###### Since 1.0.0

Whether should Elysia should [precompile all routes](/blog/elysia-10.html#improved-startup-time) a head of time before starting the server.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	precompile: true
})
```

Options - @default `false`

- `true`: Run JIT on all routes before starting the server

- `false`: Dynamically compile routes on demand

It's recommended to leave it as `false`.

## prefix

Define a prefix for all routes of an instance

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
	prefix: '/v1'
})
```

When prefix is defined, all routes will be prefixed with the given value.

#### Example

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ prefix: '/v1' }).get('/name', 'elysia') // Path is /v1/name
```

## santize

A function or an array of function that calls and intercepts on every `t.String` while validation.

Allowing us to read and transform a string into a new value.

```ts
import { Elysia, t } from 'elysia'

new Elysia({
	santize: (value) => Bun.escapeHTML(value)
})
```

## seed

Define a value which will be used to generate checksum of an instance, used for [Plugin Deduplication](/essential/plugin.html#plugin-deduplication)

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	seed: {
		value: 'service.thing'
	}
})
```

The value could be any type not limited to string, number, or object.

## strictPath

Whether should Elysia handle path strictly.

According to [RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3), a path should be strictly equal to the path defined in the route.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({ strictPath: true })
```

#### Options - @default `false`

- `true` - Follows [RFC 3986](https://tools.ietf.org/html/rfc3986#section-3.3) for path matching strictly
- `false` - Tolerate suffix '/' or vice-versa.

#### Example

```ts twoslash
import { Elysia, t } from 'elysia'

// Path can be either /name or /name/
new Elysia({ strictPath: false }).get('/name', 'elysia')

// Path can be only /name
new Elysia({ strictPath: true }).get('/name', 'elysia')
```

## serve

Customize HTTP server behavior.

Bun serve configuration.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		hostname: 'elysiajs.com',
		tls: {
			cert: Bun.file('cert.pem'),
			key: Bun.file('key.pem')
		}
	},
})
```

This configuration extends [Bun Serve API](https://bun.sh/docs/api/http) and [Bun TLS](https://bun.sh/docs/api/http#tls)

### Example: Max body size
We can set the maximum body size by setting [`serve.maxRequestBodySize`](#serve-maxrequestbodysize) in the `serve` configuration.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}
})
```

By default the maximum request body size is 128MB (1024 * 1024 * 128).
Define body size limit.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// Maximum message size (in bytes)
	    maxPayloadLength: 64 * 1024,
	}
})
```

### Example: HTTPS / TLS
We can enable TLS (known as successor of SSL) by passing in a value for key and cert; both are required to enable TLS.

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

### Example: Increase timeout

We can increase the idle timeout by setting [`serve.idleTimeout`](#serve-idletimeout) in the `serve` configuration.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		// Increase idle timeout to 30 seconds
		idleTimeout: 30
	}
})
```

By default the idle timeout is 10 seconds (on Bun).

---

## serve
HTTP server configuration.

Elysia extends Bun configuration which supports TLS out of the box, powered by BoringSSL.

See [serve.tls](#serve-tls) for available configuration.

### serve.hostname
@default `0.0.0.0`

Set the hostname which the server listens on

### serve.id
Uniquely identify a server instance with an ID

This string will be used to hot reload the server without interrupting pending requests or websockets. If not provided, a value will be generated. To disable hot reloading, set this value to `null`.

### serve.idleTimeout
@default `10` (10 seconds)

By default, Bun set idle timeout to 10 seconds, which means that if a request is not completed within 10 seconds, it will be aborted.

### serve.maxRequestBodySize
@default `1024 * 1024 * 128` (128MB)

Set the maximum size of a request body (in bytes)

### serve.port
@default `3000`

Port to listen on

### serve.rejectUnauthorized
@default `NODE_TLS_REJECT_UNAUTHORIZED` environment variable

If set to `false`, any certificate is accepted.

### serve.reusePort
@default `true`

If the `SO_REUSEPORT` flag should be set

This allows multiple processes to bind to the same port, which is useful for load balancing

This configuration is override and turns on by default by Elysia

### serve.unix
If set, the HTTP server will listen on a unix socket instead of a port.

(Cannot be used with hostname+port)

### serve.tls
We can enable TLS (known as successor of SSL) by passing in a value for key and cert; both are required to enable TLS.

```ts
import { Elysia, file } from 'elysia'

new Elysia({
	serve: {
		tls: {
			cert: file('cert.pem'),
			key: file('key.pem')
		}
	}
})
```

Elysia extends Bun configuration which supports TLS out of the box, powered by BoringSSL.

### serve.tls.ca
Optionally override the trusted CA certificates. Default is to trust the well-known CAs curated by Mozilla.

Mozilla's CAs are completely replaced when CAs are explicitly specified using this option.

### serve.tls.cert
Cert chains in PEM format. One cert chain should be provided per private key.

Each cert chain should consist of the PEM formatted certificate for a provided private key, followed by the PEM formatted intermediate certificates (if any), in order, and not
including the root CA (the root CA must be pre-known to the peer, see ca).

When providing multiple cert chains, they do not have to be in the same order as their private keys in key.

If the intermediate certificates are not provided, the peer will not be
able to validate the certificate, and the handshake will fail.

### serve.tls.dhParamsFile
File path to a .pem file custom Diffie Helman parameters

### serve.tls.key
Private keys in PEM format. PEM allows the option of private keys being encrypted. Encrypted keys will be decrypted with options.passphrase.

Multiple keys using different algorithms can be provided either as an array of unencrypted key strings or buffers, or an array of objects in the form .

The object form can only occur in an array.

**object.passphrase** is optional. Encrypted keys will be decrypted with

**object.passphrase** if provided, or **options.passphrase** if it is not.

### serve.tls.lowMemoryMode
@default `false`

This sets `OPENSSL_RELEASE_BUFFERS` to 1.

It reduces overall performance but saves some memory.

### serve.tls.passphrase
Shared passphrase for a single private key and/or a PFX.

### serve.tls.requestCert
@default `false`

If set to `true`, the server will request a client certificate.

### serve.tls.secureOptions
Optionally affect the OpenSSL protocol behavior, which is not usually necessary.

This should be used carefully if at all!

Value is a numeric bitmask of the SSL_OP_* options from OpenSSL Options

### serve.tls.serverName
Explicitly set a server name

## tags

Define an tags for OpenAPI schema for all routes of an instance similar to [detail](#detail)

```ts twoslash
import { Elysia } from 'elysia'

new Elysia({
	tags: ['elysia']
})
```

### systemRouter

Use runtime/framework provided router if possible.

On Bun, Elysia will use [Bun.serve.routes](https://bun.sh/docs/api/http#routing) and fallback to Elysia's own router.

## websocket

Override websocket configuration

Recommended to leave this as default as Elysia will generate suitable configuration for handling WebSocket automatically

This configuration extends [Bun's WebSocket API](https://bun.sh/docs/api/websockets)

#### Example
```ts
import { Elysia } from 'elysia'

new Elysia({
	websocket: {
		// enable compression and decompression
    	perMessageDeflate: true
	}
})
```

---

<!-- <br />

# Experimental

Try out an experimental feature which might be available in the future version of Elysia. -->
