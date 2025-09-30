---
title: Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Tutorial - ElysiaJS

    - - meta
      - name: 'description'
        content: Tutorial

    - - meta
      - property: 'og:description'
        content: Tutorial
---

<script setup lang="ts">
import Playground from '../../components/xiao/playground/playground.vue'
import Answer from '../../components/xiao/answer/answer.vue'

import { code, testcases } from './data'
</script>

<Playground :code="code" :testcases="testcases">

# Your First Route

<Answer>

You can change the response by changing the content inside the `.get` method from `'Hello World!'` to `'Hello Elysia!'`.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!') // [!code --]
	.get('/', 'Hello Elysia!') // [!code ++]
	.listen(3000)
```

This would make Elysia response with `"Hello Elysia!"` when you access `/`.

</Answer>

</Playground>
