---
title: Getting Started - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Getting Start - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia is a library built for Bun and the only prerequisite. To start, boostrap a new project with "bun create elysia hi-elysia" and start development server with "bun dev". This is all it need to do a quick start or getting start with ElysiaJS

  - - meta
    - property: 'og:description'
      content: Elysia is a library built for Bun, and it's all you need to get started. Bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". That's all you need to work on Elysia.js!
---

# Quick Start
Elysia is a library built for Bun, a fast JavaScript runtime.

To get started, make sure you have Bun installed.
```bash
curl https://bun.sh/install | bash
```

Bootstrap a new project with `bun create`:
```bash
bun create elysia hi-elysia
```

You should now see a folder named `hi-elysia` in your directory.
```bash
cd hi-elysia
```

The code for your server is inside of `src/index.ts`:
```typescript
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

Start a development server by:
```bash
bun dev
```

Open your browser and go to `http://localhost:3000`.

You should see `🦊 Elysia is running at localhost:3000`

---

Congrats! You've just created a new web server with Elysia 🎉🎉
