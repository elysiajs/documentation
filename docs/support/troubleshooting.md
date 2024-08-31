---
title: Troubleshooting - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Troubleshooting - ElysiaJS

    - - meta
      - name: 'description'
        content: This section helps you resolve common issues in ElysiaJS. Whether you're facing compatibility problems, configuration errors, performance bottlenecks, or bugs from updates, you'll find guidance here. Start by consulting the documentation and community channels for potential solutions. Make use of debugging tools and logs to pinpoint issues. Keeping your environment well-configured and updated can prevent many common problems.

    - - meta
      - property: 'og:description'
        content: This section helps you resolve common issues in ElysiaJS. Whether you're facing compatibility problems, configuration errors, performance bottlenecks, or bugs from updates, you'll find guidance here. Start by consulting the documentation and community channels for potential solutions. Make use of debugging tools and logs to pinpoint issues. Keeping your environment well-configured and updated can prevent many common problems.
---

# Troubleshooting

## EADDRINUSE: Failed to start server. Is port in use?

Do **not** `export default app` as Bun's [auto-execution](https://bun.sh/docs/api/http#object-syntax) feature will cause the Elysia server to run twice.

Do this:

```typescript
export const app = new Elysia().listen(3000)
```

Instead of:

```typescript
const app = new Elysia().listen(3000)

export default app
```

For more details, checkout: [elysiajs/elysia#550](https://github.com/elysiajs/elysia/issues/550)
