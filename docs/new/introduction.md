---
title: Introduction - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Introduction - ElysiaJS

  - - meta
    - name: 'description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.

  - - meta
    - property: 'og:description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.
---

# Introduction
Elysia is an ergonomic web framework for building backend servers for Bun with JavaScript or TypeScript.

Design with simplicity and type-safety in mind, allowing you to create server with familiar APIs like Express and Fastify.

```typescript
new Elysia()
    .get('/', () => 'hi')
    .get('/id/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(8080)
```

## Features
Our most loved feature of Elysia that make Elysia standout from other frameworks.

| Feature | Description |
| --- | --- |
| Performance | Static code analysis to generate optimized code |
| Unified Type | Shared DTO runtime and compile time validation |
| End-to-end Type Safety | Single Source of truth for your data both backend and frontend |
| TypeScript | Extensive type system for full TypeScript experience |
| JSX Template Engine | Familiar experience for frontend developer |
| Ergonomic by design | Simple and familiar API for building server |

## Environment
Elysia designed but was **not limited to Bun**. Being [WinterCG compliant](https://wintercg.org/) allows you to deploy the Elysia server on Cloudflare Worker, Vercel Edge Function, and most other runtime that support Web Standard Request.

## TypeScript
Elysia designed to help you write less TypeScript.

Elysia's Type System is fine-tuned to infer your code into type automatically without needing to write explicit TypeScrip while providing type-safety for both runtime and compile time to provide you with the most ergonomic developer experience.

You don't need to use TypeScript with Elysia, but it's recommended to use TypeScript with Elysia.

## How to use the documentation
The documentation designed to be beginner-friendly. Basic networking and server concept will be briefly covered to help beginners understand how API and the behavior of the framework works.

There's no correct or organized way to learn Elysia, however we recommended completing the essential chapter first as the chapter briefly covering most of Elysia's features and foundation before jumping to other topics that interested you.

As mentioned before, you can use Elysia with other runtime beside Bun, but the documentation will assume that you are using Bun.

On the left side of your screen, you'll find a chapter navigation bar. The pages of the docs are organized sequentially, from basic to advanced. You can follow them step-by-step to learn about building with Elysia. However, you can read them in any order or skip to the pages that apply to your use case.

On the right side of the screen, you'll find a table of contents for each page for navigation in the page. If you need to find content, you can use the search bar at the top, or the search shortcut (`Ctrl+K` or `Cmd+K`).

To get started, check out the Installation Guide.

## Prerequisite Knowledge
Although Elysia's documentation design to be beginner-friendly, we need to establish a baseline so that the docs can stay focused on Elysia's functionality. We will provide links to relevant documentation whenever we introduce a new concept.

To get the most out of our documentation, it's recommended that you have a basic understanding of Node.js and basic HTTP.

## Our Community
If you have questions about Elysia, feels free to ask our community on GitHub Discussions, Discord, and Twitter.
