---
title: Remapping - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Remapping - ElysiaJS

  - - meta
    - name: 'description'
      content: Remap existing `state`, `decorate`, `model`, `derive` to prevent name collision or renaminig a property

  - - meta
    - property: 'og:description'
      content: Remap existing `state`, `decorate`, `model`, `derive` to prevent name collision or renaminig a property
---

# Remapping
To use Cookie, you can extract the cookie property and access its name and value directly.

As the name suggest, this allow us to remap existing `state`, `decorate`, `model`, `derive` to anything we like to prevent name collision, or just wanting to rename a property.

By providing a function as a first parameters, the callback will accept current value, allowing us to remap the value to anything we like.
```ts
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
```

This is useful when you have to deal with a plugin that has some duplicate name, allowing you to remap the name of the plugin:
```ts
new Elysia()
    .use(
        plugin
            .decorate(({ logger, ...rest }) => ({
                pluginLogger: logger,
                ...rest
            }))
    )
```

Remap function can be use with `state`, `decorate`, `model`, `derive` to helps you define a correct property name and preventing name collision.

## Affix
The provide a smoother experience, some plugins might have a lot of property value which can be overwhelming to remap one-by-one.

The **Affix** function which consists of **prefix** and **suffix**, allowing us to remap all property of an instance.

```ts
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

Allowing us to bulk remap a property of the plugin effortlessly, preventing the name collision of the plugin.

By default, **affix** will handle both runtime, type-level code automatically, remapping the property to camelCase as naming convention.

In some condition, you can also remap `all` property of the plugin:
```ts
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```
