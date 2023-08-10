---
title: Quick Start - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Quick Start - Elysia.js

  - - meta
    - name: 'description'
      content: Elysia is a library built for Bun, and it's all you need to get started. Bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun run dev". That's all you need to work on Elysia.js!


  - - meta
    - property: 'og:description'
      content: Elysia is a library built for Bun, and it's all you need to get started. Bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun run dev". That's all you need to work on Elysia.js!
---

# Quick Start
Elysia is a library built for Bun.

Bun is all you need to get started.
```bash
curl https://bun.sh/install | bash
```

Bootstrap a new project with `bun create`:
```bash
bun create elysia hi-elysia
```

Then you should see the folder name `hi-elysia` in your directory.
```bash
cd hi-elysia
```

Open `src/index.ts`, and you should see:
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(8080)
	 
console.log(`🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`)
```

Start a development server by:
```bash
bun run dev
```

Open your browser and go to `http://localhost:8080`.

You should see your server is running.

---

Congrats! You've just created a new web server with Elysia 🎉🎉
