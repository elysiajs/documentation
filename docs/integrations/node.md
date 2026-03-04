---
title: Integration with Node.js - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Node.js - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia provides a runtime adapter to run Elysia on multiple runtimes, including Node.js, Cloudflare Workers, and more

    - - meta
      - property: 'og:description'
        content: Elysia provides a runtime adapter to run Elysia on multiple runtimes, including Node.js, Cloudflare Workers, and more
---

# Integration with Node.js
Elysia provides a runtime adapter to run Elysia on multiple runtimes, including Node.js.

To run Elysia on Node.js, simply install Node adapter.

::: code-group

```bash [bun]
bun add elysia @elysiajs/node
```

```bash [pnpm]
pnpm add elysia @elysiajs/node
```

```bash [npm]
npm install elysia @elysiajs/node
```

```bash [yarn]
yarn add elysia @elysiajs/node
```

:::

Then apply the Node adapter to your main Elysia instance.

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node' // [!code ++]

const app = new Elysia({ adapter: node() }) // [!code ++]
	.get('/', () => 'Hello Elysia')
	.listen(3000)
```

This is all you need to run Elysia on Node.js.

### Additional Setup (optional)
For the best experience, we recommend installing `tsx` or `ts-node` with `nodemon`.

`tsx` is a CLI that transpiles TypeScript to JavaScript with hot-reload and several more features you would expect from a modern development environment.

::: code-group

```bash [bun]
bun add -d tsx @types/node typescript
```

```bash [pnpm]
pnpm add -D tsx @types/node typescript
```

```bash [npm]
npm install --save-dev tsx @types/node typescript
```

```bash [yarn]
yarn add -D tsx @types/node typescript
```

:::

Then open your `package.json` file and add the following scripts:

```json
{
   	"scripts": {
  		"dev": "tsx watch src/index.ts",
    	"build": "tsc src/index.ts --outDir dist",
  		"start": "NODE_ENV=production node dist/index.js"
   	}
}
```

These scripts refer to the different stages of developing an application:

- **dev** - Start Elysia in development mode with auto-reload on code changes.
- **build** - Build the application for production use.
- **start** - Start a production Elysia server.

Make sure to create a `tsconfig.json`:

```bash
tsc --init
```

Don't forget to update `tsconfig.json` to set `compilerOptions.strict` to `true`:
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

This will give the hot reload, JSX support to run Elysia with the similar experience as `bun dev`

### pnpm
If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.
```bash
pnpm add @sinclair/typebox openapi-types
```
