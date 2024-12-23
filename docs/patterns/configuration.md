---
title: Configuration - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Configuration - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.

  - - meta
    - property: 'og:description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.
---

# Configuration

We can configure Elysia behavior by passing an object to the constructor.

```ts
import { Elysia } from 'elysia'

new Elysia({
	prefix: '/group'
})
```

Above is an example of configuring Elysia to use `/group` as the path prefix.

## Max body size
We can set the maximum body size by setting [`serve.maxRequestBodySize`](#maxrequestbodysize) in the `serve` configuration.

```ts
import { Elysia } from 'elysia'

new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 256 // 256MB
	}
})
```

By default the maximum request body size is 128MB (1024 * 1024 * 128).

## TLS
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

See [TLS Options](#tls-options) for available configuration.

## Config
Below is a config accepted by Elysia:

### prefix
@default `""`

Path prefix of the instance

### name
Name of the instance for debugging, and plugin deduplication purpose

### seed
Seed for generating checksum for [plugin deduplication](/essential/plugin.html#plugin-deduplication)

### detail
OpenAPI documentation for documentation generation

This configuration extends [Swagger Specification](https://swagger.io/specification).

@see [Swagger Specification](https://swagger.io/specification)

### tags
OpenAPI tags for documentation generation

Decorate all instance routes with tags

This configuration extends [Tag Object](https://swagger.io/specification/#tag-object)

@see [Tag Object](https://swagger.io/specification/#tag-object)

### precompile
@default `false`

Warm up Elysia before starting the server

This will perform Ahead of Time compilation and generate code for route handlers

If set to false, Elysia will perform Just in Time compilation

Only required for root instance (instance which use listen) to effect

### aot
@default `false`

Ahead of Time compliation

Reduced performance but faster startup time

## strictPath
@default `false`

Whether should Elysia tolerate suffix `/` or vice-versa

#### Example
If `strictPath` is set to `true`, Elysia will match `/id` and not `/id/`

```ts
import { Elysia } from 'elysia'

new Elysia({
	strictPath: true
})
	.get('/id', 'work')
```

Normally, both `/id` and `/id/` will match the route handler (default is `false`)

## cookie
Set default cookie options

## normalize
@default `true`

If enabled, the handlers will run a [clean](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#clean) on incoming and outgoing bodies instead of failing directly.

This allows for sending unknown or disallowed properties in the bodies. These will simply be filtered out instead of failing the request.

This has no effect when the schemas allow additional properties.

Since this uses dynamic schema it may have an impact on performance.

## nativeStaticResponse
@default `true`
@since 1.1.11

Enable Bun static response.

Whether Elysia should use Bun's static response.

This allows Elysia to improve static content performance and reduce memory significantly.

#### Example
Elysia will use Bun's static response for static content
```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/static', 'work')
```

Above is an equivalent to:
```ts
Bun.serve({
	static: {
		'static': 'work',
		'/static': '/work'
	}
})
```

::: tip
This configuration will only work if using Bun > 1.1.27 as the server
:::

## websocket
Override websocket configuration

Recommended to leave this as default as Elysia will generate suitable configuration for handling WebSocket automatically

This configuration extends [Bun WebSocket API](https://bun.sh/docs/api/websockets)

## serve
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

The following is ported from Bun JSDoc and Bun documentation:

### port
@default `3000`

Port to listen on

### unix
If set, the HTTP server will listen on a unix socket instead of a port.

(Cannot be used with hostname+port)

### hostname
@default `0.0.0.0`

Set the hostname which the server listens on

### maxRequestBodySize
@default `1024 * 1024 * 128` (128MB)

Set the maximum size of a request body (in bytes)

### reusePort
@default `true`

If the `SO_REUSEPORT` flag should be set

This allows multiple processes to bind to the same port, which is useful for load balancing

This configuration is override and turns on by default by Elysia

### id
Uniquely identify a server instance with an ID

This string will be used to hot reload the server without interrupting pending requests or websockets. If not provided, a value will be generated. To disable hot reloading, set this value to `null`.

### rejectUnauthorized
@default `NODE_TLS_REJECT_UNAUTHORIZED` environment variable

If set to `false`, any certificate is accepted.

## TLS options
This configuration extends [Bun TLS API](https://bun.sh/docs/api/http#tls)

```ts
import { Elysia } from 'elysia'

new Elysia({
	tls: {
		cert: Bun.file('cert.pem'),
		key: Bun.file('key.pem')
	}
})
```

### cert
Cert chains in PEM format. One cert chain should be provided per private key.

Each cert chain should consist of the PEM formatted certificate for a provided private key, followed by the PEM formatted intermediate certificates (if any), in order, and not
including the root CA (the root CA must be pre-known to the peer, see ca).

When providing multiple cert chains, they do not have to be in the same order as their private keys in key.

If the intermediate certificates are not provided, the peer will not be
able to validate the certificate, and the handshake will fail.

### key
Private keys in PEM format. PEM allows the option of private keys being encrypted. Encrypted keys will be decrypted with options.passphrase.

Multiple keys using different algorithms can be provided either as an array of unencrypted key strings or buffers, or an array of objects in the form .

The object form can only occur in an array.

**object.passphrase** is optional. Encrypted keys will be decrypted with

**object.passphrase** if provided, or **options.passphrase** if it is not.

### ca
Optionally override the trusted CA certificates. Default is to trust the well-known CAs curated by Mozilla.

Mozilla's CAs are completely replaced when CAs are explicitly specified using this option.

### passphrase
Shared passphrase for a single private key and/or a PFX.

### dhParamsFile
File path to a .pem file custom Diffie Helman parameters

### requestCert
@default `false`

If set to `true`, the server will request a client certificate.

### secureOptions
Optionally affect the OpenSSL protocol behavior, which is not usually necessary.

This should be used carefully if at all!

Value is a numeric bitmask of the SSL_OP_* options from OpenSSL Options

### serverName
Explicitly set a server name

### lowMemoryMode
@default `false`

This sets `OPENSSL_RELEASE_BUFFERS` to 1.

It reduces overall performance but saves some memory.
