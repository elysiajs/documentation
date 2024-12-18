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

Elysia is optimized for Bun which is a JavaScript runtime that aims to be a drop-in replacement for Node.js.

You can install Bun with the command below:

```bash
curl https://bun.sh/install | bash
```

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

## Next Steps

We recommend checking out the either one of the following:

<Deck>
    <Card title="Key Concepts (5 minutes)" href="/key-concepts">
    	The core concept of Elysia and how to use it.
    </Card>
    <Card title="Tutorial (15 minutes)" href="/tutorial">
    	A step-by-step guide walkthrough Elysia's features.
    </Card>
</Deck>

If you have any questions, feel free to ask in our [Discord](https://discord.gg/elysia) community.
