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
```typescript
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
# COPY public public
# COPY tsconfig.json .

ENV ENV production
CMD ["./bun", "src/index.ts"]

EXPOSE 3000
```
