---
title: Quick Start - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Quick Start - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, boostrap a new project with "bun create elysia hi-elysia" and start development server with "bun dev". This is all it need to do a quick start or getting start with ElysiaJS.

    - - meta
      - property: 'og:description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, boostrap a new project with "bun create elysia hi-elysia" and start development server with "bun dev". This is all it need to do a quick start or getting start with ElysiaJS.
---

# Démarrage rapide

System Requirements:

-   [Bun](https://bun.sh)
-   MacOS, Windows (including WSL), and Linux are supported.
-   TypeScript > 5.0 (for language server)

## Bun

Elysia is optimized for Bun which is a JavaScript runtime aims to be drop-in replacement for Node.js.

You can install Bun with the command below:

```bash
curl https://bun.sh/install | bash
```

## Automatic Installation

We recommend starting a new Elysia server using `bun create elysia`, which sets up everything automatically for you.

To create a project, run:

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

## Manual Installation

To manually create a new Next.js app, install Elysia as a package:

```typescript
bun add elysia
```

Open your `package.json` file and add the following scripts:

```json
{
    "scripts": {
        "dev": "bun --watch src/index.ts",
        "build": "bun build src/index.ts",
        "start": "NODE_ENV=production bun src/index.ts",
        "test": "bun test"
    }
}
```

These scripts refer to the different stages of developing an application:

-   **dev** - Start Elysia in development mode with auto reload on code change.
-   **build** - Build the application for production usage.
-   **start** - Start an Elysia production server.

If you are using TypeScript, make sure to create, and update `tsconfig.json` to include `compilerOptions.strict` to `true`:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```

## Structure

Here's the recommended file structure for Elysia if you don't strictly prefers a specific convention:

-   **src** - Any file that associate with development of Elysia server.
    -   **index.ts** - Entry point for your Elysia server, ideal place for setting global plugin
    -   **setup.ts** - Composed of various plugins to be used as a Service Locator
    -   **controllers** - Instance which encapsulate multiple endpoints
    -   **libs** - Utility functions
    -   **models** - Data Type Objects (DTOs) for Elysia instance
    -   **types** - Shared TypeScript type if needed
-   **test** - Test file for Elysia server
