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

By default, Reactive Cookie can encode/decode type of object automatically allowing us to treat cookie as an object without worrying about the encoding/decoding. **It just works**.

## Reactivity
The Elysia cookie is reactive. This means that when you change the cookie value, the cookie will be updated automatically based on approach like signal.

A single source of truth for handling cookies is provided by Elysia cookies, which have the ability to automatically set headers and sync cookie values.

Since cookies are Proxy-dependent objects by default, the extract value can never be **undefined**; instead, it will always be a value of `Cookie<unknown>`, which can be obtained by invoking the **.value** property.

We can treat the cookie jar as a regular object, iteration over it will only iterate over an already-existing cookie value.

## Cookie Attribute
To use Cookie attribute, you can either use one of the following:

1. Setting the property directly
2. Using `set` or `add` to update cookie property.

See [cookie attribute config](/patterns/cookie-signature#config) for more information.

### Assign Property
You can get/set the property of a cookie like any normal object, the reactivity model synchronizes the cookie value automatically.

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
**set** permits updating multiple cookie properties all at once through **reset all property** and overwrite the property with a new value.

```ts
app.get('/', ({ cookie: { name } }) => {
    name.set({
        domain: 'millennium.sh',
        httpOnly: true
    })
})
```

## add
Like **set**, **add** allow us to update multiple cookie properties at once, but instead, will only overwrite the property defined instead of resetting.

## remove
To remove a cookie, you can use either:
1. name.remove
2. delete cookie.name

```ts
app.get('/', ({ cookie, cookie: { name } }) => {
    name.remove()

    delete cookie.name
})
```

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
        name: t.Object({
            id: t.Numeric(),
            name: t.String()
        })
    })
})
```

## Nullable Cookie
To handle nullable cookie value, you can use `t.Optional` on the cookie name you want to be nullable.

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
