---
title: End-to-End Type Safety - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: End-to-End Type Safety - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia support end-to-end type safety with Elysia Eden since start. End-to-end type-safety refers to a system in which every component of the system is checked for type consistency, meaning that data is passed between components only if the types of the data are compatible.

  - - meta
    - property: 'og:description'
      content: Elysia support end-to-end type safety with Elysia Eden since start. End-to-end type-safety refers to a system in which every component of the system is checked for type consistency, meaning that data is passed between components only if the types of the data are compatible.
---

# End-to-End Type-Safety
End-to-end type-safety refers to a system in which every component of the system is checked for type consistency, meaning that data is passed between components only if the types of the data are compatible. 

This can help prevent bugs and errors by catching type mismatches early in the development process, rather than at runtime.

It ensures that the system is working in a predictable way, thus reducing the risk of unexpected behavior.

---

Elysia supports End-to-End Type-Safety between client-server with the [Eden](/plugins/eden/overview) plugin.

<iframe
    id="embedded-editor"
    src="https://codesandbox.io/p/sandbox/bun-elysia-rdxljp?embed=1&codemirror=1&hidenavigation=1&hidedevtools=1&file=eden.ts"
    allow="accelerometer"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    loading="lazy"
/>

::: tip
Hover over variable and function to see type definition.
:::

Elysia allows you change the type on server and it will be instantly reflected on the client, helping with auto-completion and type-enforcement.

See [Eden](/plugins/eden/overview) for more examples.
