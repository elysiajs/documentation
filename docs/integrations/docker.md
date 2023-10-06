---
title: Docker - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Docker - ElysiaJS

  - - meta
    - name: 'description'
      content: You use Elysia with Docker with the following Dockerfile by using "oven/bun", or copy the snippet from the page

  - - meta
    - property: 'og:description'
      content: You use Elysia with Docker with the following Dockerfile by using "oven/bun", or copy the snippet from the page
---

# Docker
You use Elysia with Docker with the following Dockerfile below:
```docker
FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000
```

## Distroless
If you like to use Distroless:
```docker
FROM debian:11.6-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 3000
```

## Development

To develop with Elysia in Docker, you can use the following minimal docker compose template:

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    image: "oven/bun"
    # override default entrypoint allows us to do `bun install` before serving
    entrypoint: []
    # execute bun install before we start the dev server in watch mode
    command: "/bin/sh -c 'bun install && bun run --watch src/index.ts'"
    # expose the right ports
    ports: ["3000:3000"]
    # setup a host mounted volume to sync changes to the container
    volumes: ["./:/home/bun/app"]
```