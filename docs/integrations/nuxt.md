---
title: Integration with Nuxt - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Nuxt - ElysiaJS

    - - meta
      - name: 'description'
        content: With community plugin 'nuxt-elysia', we can run Elysia on Nuxt API route with Eden Treaty setup automatically.

    - - meta
      - property: 'og:description'
        content: With community plugin 'nuxt-elysia', we can run Elysia on Nuxt API route with Eden Treaty setup automatically.
---

# Integration with Nuxt

We can use [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia), a community plugin for Nuxt, to setup Elysia on Nuxt API route with Eden Treaty.

1. Install the plugin with the following command:

```bash
bun add elysia @elysiajs/eden
bun add -d nuxt-elysia
```

2. Add `nuxt-elysia` to your Nuxt config:

```ts
export default defineNuxtConfig({
    modules: [ // [!code ++]
        'nuxt-elysia' // [!code ++]
    ] // [!code ++]
})
```

3. Create `api.ts` in the project root:

```typescript [api.ts]
export default () => new Elysia() // [!code ++]
  .get('/hello', () => ({ message: 'Hello world!' })) // [!code ++]
```

4. Use Eden Treaty in your Nuxt app:

```vue
<template>
    <div>
        <p>{{ data.message }}</p>
    </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp()

const { data } = await useAsyncData(async () => {
    const { data, error } = await $api.hello.get()

    if (error)
        throw new Error('Failed to call API')

    return data
})
</script>
```

This will automatically setup Elysia to run on Nuxt API route automatically.

## Prefix

By default, Elysia will be mounted on **/_api** but we can customize it with `nuxt-elysia` config.
```ts
export default defineNuxtConfig({
	nuxtElysia: {
		path: '/api' // [!code ++]
	}
})
```

This will mount Elysia on **/api** instead of **/_api**.

For more configuration, please refer to [nuxt-elysia](https://github.com/tkesgar/nuxt-elysia)
