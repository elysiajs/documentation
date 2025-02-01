---
title: Quick Start - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Quick Start - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all it needs to do a quick start or get started with ElysiaJS.

    - - meta
      - property: 'og:description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all it needs to do a quick start or get started with ElysiaJS.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Tab from '../components/fern/tab.vue'
</script>

# Quick Start

Elysia is a TypeScript backend framework with multiple runtime support but optimized for Bun.

However, you can use Elysia with other runtimes like Node.js.

<Tab
	id="quickstart"
	:names="['Bun', 'Node.js', 'Web Standard']"
	:tabs="['bun', 'node', 'web-standard']"
>

<template v-slot:bun>

Elysia is optimized for Bun which is a JavaScript runtime that aims to be a drop-in replacement for Node.js.

You can install Bun with the command below:

::: code-group

```bash [MacOS/Linux]
curl -fsSL https://bun.sh/install | bash
```

```bash [Windows]
powershell -c "irm bun.sh/install.ps1 | iex"
```

:::

<Tab
	id="quickstart"
	:names="['Auto Installation', 'Manual Installation']"
	:tabs="['auto', 'manual']"
>

<template v-slot:auto>

We recommend starting a new Elysia server using `bun create elysia`, which sets up everything automatically.

```bash
bun create elysia app
```

Once done, you should see the folder name `app` in your directory.

```bash
cd app
```

Start a development server by:

```bash
bun dev
```

Navigate to [localhost:3000](http://localhost:3000) should greet you with "Hello Elysia".

::: tip
Elysia ships you with `dev` command to automatically reload your server on file change.
:::

</template>

<template v-slot:manual>

To manually create a new Elysia app, install Elysia as a package:

```typescript
bun add elysia
bun add -d @types/bun
```

This will install Elysia and Bun type definitions.

Create a new file `src/index.ts` and add the following code:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

Open your `package.json` file and add the following scripts:

```json
{
   	"scripts": {
  		"dev": "bun --watch src/index.ts",
  		"build": "bun build src/index.ts --target bun --outdir ./dist",
  		"start": "NODE_ENV=production bun dist/index.js",
  		"test": "bun test"
   	}
}
```

These scripts refer to the different stages of developing an application:

- **dev** - Start Elysia in development mode with auto-reload on code change.
- **build** - Build the application for production usage.
- **start** - Start an Elysia production server.

If you are using TypeScript, make sure to create, and update `tsconfig.json` to include `compilerOptions.strict` to `true`:

```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>
</Tab>

</template>

<template v-slot:node>

Node.js is a JavaScript runtime for server-side applications, the most popular runtime for JavaScript which Elysia supports.

You can install Node.js with the command below:

::: code-group

```bash [MacOS]
brew install node
```

```bash [Windows]
choco install nodejs
```

```bash [apt (Linux)]
sudo apt install nodejs
```

```bash [pacman (Arch)]
pacman -S nodejs npm
```

:::

## Setup

We recommended using TypeScript for your Node.js project.

<Tab
	id="language"
	:names="['TypeScript', 'JavaScript']"
	:tabs="['ts', 'js']"
>

<template v-slot:ts>

To create a new Elysia app with TypeScript, we recommended install Elysia with `tsx`:

::: code-group

```bash [bun]
bun add elysia @elysiajs/node && \
bun add -d tsx @types/node typescript
```

```bash [pnpm]
pnpm add elysia @elysiajs/node && \
pnpm add -d tsx @types/node typescript
```

```bash [npm]
npm install elysia @elysiajs/node && \
npm install --save-dev tsx @types/node typescript
```

```bash [yarn]
yarn add elysia && \
yarn add -d tsx @types/node typescript
```

:::

This will install Elysia, TypeScript, and `tsx`.

`tsx` is a CLI that transpiles TypeScript to JavaScript with hot-reload and several more feature you expected from a modern development environment.

Create a new file `src/index.ts` and add the following code:

```typescript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})
```

Open your `package.json` file and add the following scripts:

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

- **dev** - Start Elysia in development mode with auto-reload on code change.
- **build** - Build the application for production usage.
- **start** - Start an Elysia production server.

Make sure to create `tsconfig.json`

```bash
npx tsc --init
```

Don't forget to update `tsconfig.json` to include `compilerOptions.strict` to `true`:
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

<template v-slot:js>

::: warning
If you use Elysia without TypeScript you may miss out on some features like auto-completion, advanced type checking and end-to-end type safety, which are the core features of Elysia.
:::

To create a new Elysia app with JavaScript, starts by installing Elysia:

::: code-group

```bash [pnpm]
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

This will install Elysia, TypeScript, and `tsx`.

`tsx` is a CLI that transpiles TypeScript to JavaScript with hot-reload and several more feature you expected from a modern development environment.

Create a new file `src/index.ts` and add the following code:

```javascript
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() })
	.get('/', () => 'Hello Elysia')
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})
```

Open your `package.json` file and add the following scripts:

```json
{
	"type", "module",
   	"scripts": {
  		"dev": "node src/index.ts",
  		"start": "NODE_ENV=production node src/index.js"
   	}
}
```

These scripts refer to the different stages of developing an application:

- **dev** - Start Elysia in development mode with auto-reload on code change.
- **start** - Start an Elysia production server.

Make sure to create `tsconfig.json`

```bash
npx tsc --init
```

Don't forget to update `tsconfig.json` to include `compilerOptions.strict` to `true`:
```json
{
   	"compilerOptions": {
  		"strict": true
   	}
}
```

</template>

</Tab>

</template>

<template v-slot:web-standard>

Elysia is a WinterCG compliance library, which means if a framework or runtime supports Web Standard Request/Response, it can run Elysia.

First, install Elysia with the command below:

::: code-group

```bash [bun]
bun install elysia
```

```bash [pnpm]
pnpm install elysia
```

```bash [npm]
npm install elysia
```

```bash [yarn]
yarn add elysia
```

:::

Next, select a runtime that supports Web Standard Request/Response.

We have a few recommendations:

<Deck>
    <Card title="Next.js" href="/integrations/nextjs">
   		Elysia as Next.js API routes.
    </Card>
    <Card title="Expo" href="/integrations/expo">
   		Elysia as Expo App Router API.
    </Card>
	<Card title="Astro" href="/integrations/astro">
		Elysia as Astro API routes.
	</Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
		Elysia as SvelteKit API routes.
	</Card>
</Deck>

### Not in the list?
If you are using a custom runtime, you may access `app.fetch` to handle the request and response manually.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)

export default app.fetch

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

</template>

</Tab>

## Next Steps

We recommend checking out the either one of the following:

<Deck>
    <Card title="Key Concept (5 minutes)" href="/key-concept">
    	The core concept of Elysia and how to use it.
    </Card>
    <Card title="Tutorial (15 minutes)" href="/tutorial">
    	A step-by-step guide walkthrough Elysia's features.
    </Card>
</Deck>

If you have any questions, feel free to ask in our [Discord](https://discord.gg/elysia) community.
