---
title: Reactive Cookie - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Reactive Cookie - ElysiaJS

  - - meta
    - name: 'description'
      content: Reactive Cookie take a more modern approach like signal to handle cookie with an ergonomic API. There's no 'getCookie', 'setCookie', everything is just a cookie object. When you want to use cookie, you just extract the name and value directly.

  - - meta
    - property: 'og:description'
      content: Reactive Cookie take a more modern approach like signal to handle cookie with an ergonomic API. There's no 'getCookie', 'setCookie', everything is just a cookie object. When you want to use cookie, you just extract the name and value directly.
---

# Cookie
To use Cookie, you can extract the cookie property and access its name and value directly.

There's no get/set, you can extract the cookie name and retrieve or update its value directly.
```ts
app.get('/', ({ cookie: { name } }) => {
    // Get
    name.value

    // Set
    name.value = "New Value"
    name.value = {
        hello: 'world'
    }
})
```

By default, Reactive Cookie can encode/decode type of object automatically. So if you like to set the cookie as an object, it will just work.

## Reactivity
Elysia cookie is reactive, based on approach like signal.

Elysia cookie can sync the value of cookie, and set-headers automatically, providing a single source of truth for handling cookie.

If you don't set the new value for the cookie, the `Set-Cookie` header will not be send to keep the same cookie value, so you don't have to worry about the performance.

By default, cookie is an object that rely on Proxy, so the extract value can never be **undefined**, it will always be a value of `Cookie<unknown>`, which you can retrieve its value by calling **.value** property.

If you iterate over the cookie jar, the value will be only iterated over an existing cookie value, so you can treat it as a normal object.

## Cookie Attribute
To use Cookie attribute, you can either use one of the following:
1. Setting the property directly
2. Using `set` or `add` to update cookie property.

See [cookie attribute config](/patterns/cookie-signature#config) for more information.

### Assign Property
You can get/set the property of a cookie as if it's a normal object, the reactivity model will sync the cookie value automatically.

```ts
app.get('/', ({ cookie: { name } }) => {
    // get
    name.domain

    // set
    name.domain = 'millennium.sh'
    name.httpOnly = true
})
```

## set
**set** allow us to set update multiple cookie property all at once, by **reset all property** and overwrite it with a new value.

```ts
app.get('/', ({ cookie: { name } }) => {
    name.set({
        domain: 'millennium.sh',
        httpOnly: true
    })
})
```

## add
Like **set**, **add** allow us to update multiple cookie property at once, but instead, will only overwrite the property defined instead of resetting.

## Cookie Schema
You can strictly validate cookie type and providing type inference for cookie by using cookie schema with `t.Cookie`.

```ts
app.get('/', ({ cookie: { name } }) => {
    // Set
    name.value = {
        id: 617,
        name: 'Summoning 101'
    }
}, {
    cookie: t.Cookie({
        value: t.Object({
            id: t.Numeric(),
            name: t.String()
        })
    })
})
```

## Nullable Cookie
To handle nullable cookie value, you can use `t.Optional` on cookie name you want to be nullable.

```ts
app.get('/', ({ cookie: { name } }) => {
    // Set
    name.value = {
        id: 617,
        name: 'Summoning 101'
    }
}, {
    cookie: t.Cookie({
        value: t.Optional(
            t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        )
    })
})
```
