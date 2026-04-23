---
title: Deploy to Production - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Deploy to Production - ElysiaJS

  - - meta
    - name: 'description'
      content: This page

  - - meta
    - property: 'og:description'
      content: Elysia can be configured by passing an object to the constructor. We can configure Elysia behavior by passing an object to the constructor.
---

# Deploy to production
This page provides a guide on how to deploy Elysia to production.

## Cluster mode
Elysia is single-threaded by default. To take advantage of multi-core CPU, we can run Elysia in cluster mode.

Let's create an **index.ts** file that imports our main server from **server.ts** and fork multiple workers based on the number of CPU cores available.

::: code-group

```ts [src/index.ts]
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'

if (cluster.isPrimary) {
  	for (let i = 0; i < os.availableParallelism(); i++)
    	cluster.fork()
} else {
  	await import('./server')
  	console.log(`Worker ${process.pid} started`)
}
```

```ts [src/server.ts]
import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => 'Hello World!')
	.listen(3000)
```

:::

This will ensure that Elysia is running on multiple CPU cores.

::: tip
Elysia on Bun uses SO_REUSEPORT by default, which allows multiple instances to listen on the same port. This only works on Linux.
:::

## Compile to binary
We recommend running the build command before deploying to production as it could potentially reduce memory usage and file size significantly.

We recommend compiling Elysia into a single binary using the command as follows:
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	src/index.ts
```

This will generate a portable binary `server` which we can run to start our server.

Compiling server to binary usually significantly reduces memory usage by 2-3x compared to development environment.

This command is a bit long, so let's break it down:
1. **--compile** Compile TypeScript to binary
2. **--minify-whitespace** Remove unnecessary whitespace
3. **--minify-syntax** Minify JavaScript syntax to reduce file size
4. **--target bun** Optimize the binary for Bun runtime
5. **--outfile server** Output the binary as `server`
6. **src/index.ts** The entry file of our server (codebase)

To start our server, simply run the binary.
```bash
./server
```

Once binary is compiled, you don't need `Bun` installed on the machine to run the server.

This is great as the deployment server doesn't need to install an extra runtime to run making binary portable.

### Target
You can also add a `--target` flag to optimize the binary for the target platform.

```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun-linux-x64 \
	--outfile server \
	src/index.ts
```

Here's a list of available targets:
| Target                  | Operating System | Architecture | Modern | Baseline | Libc  |
|--------------------------|------------------|--------------|--------|----------|-------|
| bun-linux-x64           | Linux            | x64          | ✅      | ✅        | glibc |
| bun-linux-arm64         | Linux            | arm64        | ✅      | N/A      | glibc |
| bun-windows-x64         | Windows          | x64          | ✅      | ✅        | -     |
| bun-windows-arm64       | Windows          | arm64        | ❌      | ❌        | -     |
| bun-darwin-x64          | macOS            | x64          | ✅      | ✅        | -     |
| bun-darwin-arm64        | macOS            | arm64        | ✅      | N/A      | -     |
| bun-linux-x64-musl      | Linux            | x64          | ✅      | ✅        | musl  |
| bun-linux-arm64-musl    | Linux            | arm64        | ✅      | N/A      | musl  |

### Why not --minify
Bun has a `--minify` flag that will minify the binary.

However if we are using [OpenTelemetry](/plugins/opentelemetry), it will reduce a function name to a single character.

This makes tracing harder than it should as OpenTelemetry relies on function names.

However, if you're not using OpenTelemetry, you may opt in for `--minify` instead
```bash
bun build \
	--compile \
	--minify \
	--outfile server \
	src/index.ts
```

### Permission
Some Linux distributions might not be able to run the binary, we suggest enabling execute permissions on the binary if you're on Linux:
```bash
chmod +x ./server

./server
```

### Unknown random Chinese error
If you're trying to deploy a binary to your server but are unable to run it and are receiving random Chinese character errors.

It means that the machine you're running on **doesn't support AVX2**.

Unfortunately, Bun requires a machine that has `AVX2` hardware support.

There's no known workaround.

## Compile to JavaScript
If you are unable to compile to a binary or you are deploying on a Windows server.

You may bundle your server to a JavaScript file instead.

```bash
bun build \
	--minify-whitespace \
	--minify-syntax \
	--outfile ./dist/index.js \
	src/index.ts
```

This will generate a single portable JavaScript file that you can deploy on your server.
```bash
NODE_ENV=production bun ./dist/index.js
```

## Docker
On Docker, we recommend always compiling to a binary to reduce base image overhead.

Here's an example image using the Distroless image with a binary.
```dockerfile [Dockerfile]
FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

### OpenTelemetry
If you are using [OpenTelemetry](/patterns/opentelemetry) to deploy production server.

As OpenTelemetry relies on monkey-patching `node_modules/<library>`. It's required to make instrumentations work properly, we need to specify libraries to be instrumented as an external module to exclude it from being bundled.

For example, if you are using `@opentelemetry/instrumentation-pg` to instrument the `pg` library. We need to exclude `pg` from being bundled and make sure that it is importing `node_modules/pg`.

To make this work, we may specify `pg` as an external module with `--external pg`
```bash
bun build --compile --external pg --outfile server src/index.ts
```

This tells bun not to bundle `pg` into the final output file, and will be imported from the `node_modules` directory at runtime. So on a production server, you must also keep the `node_modules` directory.

It's recommended to specify packages that should be available in a production server as `dependencies` in `package.json` and use `bun install --production` to install only production dependencies.

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysia/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

Then after running a build command, on a production server
```bash
bun install --production
```

If the node_modules directory still includes development dependencies, you may remove the node_modules directory and reinstall production dependencies again.

### Monorepo
If you are using Elysia with Monorepo, you may need to include dependent `packages`.

If you are using Turborepo, you may place a Dockerfile inside your apps directory like **apps/server/Dockerfile**. This also applies to other monorepo managers such as Lerna, etc.

Assuming that our monorepo uses Turborepo with structure as follows:
- apps
	- server
		- **Dockerfile (place a Dockerfile here)**
- packages
	- config

Then we can build our Dockerfile on monorepo root (not app root):
```bash
docker build -f apps/server/Dockerfile -t elysia-mono .
```

With Dockerfile as follows:
```dockerfile [apps/server/Dockerfile]
FROM oven/bun:1 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lock bun.lock

COPY /apps/server/package.json ./apps/server/package.json
COPY /packages/config/package.json ./packages/config/package.json

RUN bun install

COPY /apps/server ./apps/server
COPY /packages/config ./packages/config

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
```

## Railway
[Railway](https://railway.app) is one of the popular deployment platforms.

Railway assigns a **random port** to expose for each deployment, which can be accessed via the `PORT` environment variable.

We need to modify our Elysia server to accept the `PORT` environment variable to comply with Railway port.

Instead of a fixed port, we may use `process.env.PORT` and provide a fallback on development instead.
```ts
new Elysia()
	.listen(3000) // [!code --]
	.listen(process.env.PORT ?? 3000) // [!code ++]
```

This should allow Elysia to intercept port provided by Railway.

::: tip
Elysia assigns the hostname to `0.0.0.0` automatically, which works with Railway
:::
