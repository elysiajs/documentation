---
title: Numeric Type - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Numeric Type - ElysiaJS

  - - meta
    - name: 'description'
      content: By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process. This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time but you can explicitly control Elysia to use a certain function.


  - - meta
    - property: 'og:description'
      content: By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process. This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time but you can explicitly control Elysia to use a certain function.
---

# Numeric

Sometimes you might find yourself in need of numeric string like extracting path parameter, but it's typed as string and need to be convert to number.

Using Elysia's `transform` life-cycle, you can manually parse number to string and re-use the transform function in other handler as well.

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number()
    }),
    transform({ params }) {
        const id = +params.id

        if(!Number.isNaN(id))
            params.id = id
    }
})
```

However, it's a little bit redundant and requires boilerplate, so Elysia has a custom type to speed up the situation with `t.Numeric`

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

This allows us to convert a **valid** numeric string to a number automatically.

If the string is not a valid numeric string, it will throw an error in the runtime and prevent execution inside the handler.

You can use the numeric type on any property that supports schema typing, including:
- params
- query
- headers
- body
- response
