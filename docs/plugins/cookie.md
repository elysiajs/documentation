---
title: Cookie Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Cookie Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia that adds support for using cookie in Elysia handler. Start by installing the plugin with "bun add @elysiajs/cookie".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia that adds support for using cookie in Elysia handler. Start by installing the plugin with "bun add @elysiajs/cookie".
---

# Cookie Plugin
This plugin adds support for using cookie in Elysia handler.

Install with:
```bash
bun add @elysiajs/cookie
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { cookie } from '@elysiajs/cookie'

new Elysia()
    .use(cookie())
    .get('/profile', ({ cookie: { name } }) => name)
    .put('/sign/:name', ({ setCookie, params: { name } }) => {
        setCookie('name', name)

        return name
    })
    .listen(8080)
```

## Config
This plugin extends config from [cookie](https://npmjs.com/package/cookie)

Below is a config which accepted by the plugin

### secret
The secret key for signing/un-signing cookies.

If an array is passed, will use Key Rotation.

Key rotation is when an encryption key is retired and replaced by generating a new cryptographic key.

---
Below is a config extends from [cookie](https://npmjs.com/package/cookie)

### domain
Specifies the value for the [Domain Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3).
 
By default, no domain is set, and most clients will consider the cookie to apply to only the current domain.


### encode
@default `encodeURIComponent`

Specifies a function that will be used to encode a cookie's value. 

Since the value of a cookie has a limited character set (and must be a simple string), this function can be used to encode a value into a string suited for a cookie's value.

The default function is the global `encodeURIComponent`, which will encode a JavaScript string into UTF-8 byte sequences and then URL-encode any that fall outside of the cookie range.

### expires
Specifies the Date object to be the value for the [Expires Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.1). 

By default, no expiration is set, and most clients will consider this a "non-persistent cookie" and will delete it on a condition like exiting a web browser application.

::: tip
The [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but not all clients may obey this, so if both are set, they should point to the same date and time.
:::

### httpOnly
@default `false`

Specifies the boolean value for the [HttpOnly Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.6). 

When truthy, the HttpOnly attribute is set, otherwise, it is not. 

By default, the HttpOnly attribute is not set.

::: tip 
be careful when setting this to true, as compliant clients will not allow client-side JavaScript to see the cookie in `document.cookie`.
:::

### maxAge
@default `undefined`

Specifies the number (in seconds) to be the value for the [Max-Age Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.2). 

The given number will be converted to an integer by rounding down. By default, no maximum age is set.

::: tip
The [cookie storage model specification](https://tools.ietf.org/html/rfc6265#section-5.3) states that if both `expires` and `maxAge` are set, then `maxAge` takes precedence, but not all clients may obey this, so if both are set, they should point to the same date and time.
:::

### path
Specifies the value for the [Path Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4).

By default, the path handler is considered the default path.

### priority
Specifies the string to be the value for the [Priority Set-Cookie attribute](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1).
`low` will set the Priority attribute to Low.
`medium` will set the Priority attribute to Medium, the default priority when not set.
`high` will set the Priority attribute to High.

More information about the different priority levels can be found in [the specification](https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1).

::: tip
This is an attribute that has not yet been fully standardized and may change in the future. This also means many clients may ignore this attribute until they understand it.
:::

### sameSite
Specifies the boolean or string to be the value for the [SameSite Set-Cookie attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7).
true will set the SameSite attribute to Strict for strict same-site enforcement.
false will not set the SameSite attribute.
'lax' will set the SameSite attribute to Lax for lax same-site enforcement.
'none' will set the SameSite attribute to None for an explicit cross-site cookie.
'strict' will set the SameSite attribute to Strict for strict same-site enforcement.
More information about the different enforcement levels can be found in [the specification](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7).

::: tip
This is an attribute that has not yet been fully standardized and may change in the future. This also means many clients may ignore this attribute until they understand it.
:::

### secure
Specifies the boolean value for the [Secure Set-Cookie attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5). When truthy, the Secure attribute is set, otherwise, it is not. By default, the Secure attribute is not set.

::: tip
Be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.
:::

## Handler
Below are the value added to the handler.

### cookie
An object representation of request cookies.

Type:
```typescript
cookie: Record<string, string>
```

### setCookie
A function to set a cookie and return it to the client.

Type:
```typescript
setCookie(name: string, value: string, options?: SetCookieOptions) => void
```

`SetCookieOptions` extends [cookie](https://npmjs.com/package/cookie), which is the same as [config](#config).

### removeCookie
A function to unset cookies.

Type:
```typescript
removeCookie(name: string) => void
```

### unsignCookie
A function to validate and signed cookies and retrieved their value.

```typescript
unsignCookie(input: string, secret: string):
    | {
        valid: true
        value: string
    }
    |  {
        valid: false
        value: undefined
    }
```

## Pattern
Below you can find the common patterns to use the plugin.

## Set default config:
By default, the config is passed to `setCookie` and inherits its value.

```typescript
import { Elysia } from 'elysia'
import { cookie } from '@elysiajs/cookie'

new Elysia()
    .use(cookie({
        httpOnly: true
    }))
    .post('/sign/:name', ({ setCookie, params: { name } }) => {
        setCookie('name', name, {
            maxAge: 86400
        })
    })
    .listen(8080)
```

This will sign a cookie with `maxAge` of `86400` and `httpOnly` to `true`.

## Sign & unsign cookie
```typescript
new Elysia()
    .get('/sign/:name', ({ params: { name }, setCookie }) => {
        setCookie('name', name, {
            signed: true
        })

        return name
    })
    .get('/auth', ({ unsignCookie, cookie: { name }, set }) => {
        const { valid, value } = unsignCookie(name)

        if (!valid) {
            set.status = 401
            return 'Unauthorized'
        }

        return value
    })
```
