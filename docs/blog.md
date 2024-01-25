---
title: Elysia Blog
layout: page
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Blog - ElysiaJS

    - - meta
      - name: 'description'
        content: Update of ElysiaJS, from core maintainers

    - - meta
      - property: 'og:description'
        content: Update of ElysiaJS from core maintainers
---

<script setup>
    import Blogs from '../components/blog/Landing.vue'
</script>

<Blogs
  :blogs="[
      {
        title: 'Introducing support for Scalar - Elysia',
        href: '/blog/elysia-scalar',
        detail: 'We are changing API documentation provider to Scalar instead of Swagger UI by default. Scalar is a modern, beautiful API references for OpenAPI compatible, and customizable  built on-top of Vue. Elysia now ship @elysia/swagger package by using Scalar as a default provider, with option to switch back to Swagger UI if need.'
      },
      {
        title: 'Introducing Elysia 0.8 - Gate of Steiner',
        href: '/blog/elysia-08',
        detail: 'Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.'
      },
      {
        title: 'Introducing Elysia 0.7 - Stellar Stellar',
        href: '/blog/elysia-07',
        detail: 'Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.'
      },
      {
        title: 'Introducing Elysia 0.6 - This Game',
        href: '/blog/elysia-06',
        detail: 'Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again'
      },
      {
        title: 'Accelerate your next Prisma server with Elysia',
        href: '/blog/with-prisma',
        detail: 'With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accelerate our interaction with database, Elysia accelerate our creation of backend web server in term of both developer experience and performance.'
      },
      {
          title: 'Introducing Elysia 0.5 - Radiant',
          href: '/blog/elysia-05',
          detail: 'Introducing Static Code Analysis, New router Memoirist, TypeBox 0.28, Numeric type, inline schema, state/decorate/model/group rework, and type stability.'
      },
      {
          title: 'Introducing Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)',
          href: '/blog/elysia-04',
          detail: 'Introducing Ahead of Time Compilation, TypeBox 0.26, Response validation per status, and Separation of Elysia Fn.'
      },
      {
          title: 'Elysia with Supabase. Your next backend at sonic speed',
          href: '/blog/elysia-supabase',
          detail: 'Elysia, and Supabase are a great match for rapidly developing prototype in less than a hour, let\'s take a look of how we can take advantage of both.'
      },
      {
          title: 'Introducing Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]',
          href: '/blog/elysia-03',
          detail: 'Introducing Elysia Fn, Type Rework for highly scalable TypeScript performance, File Upload support and validation, Reworked Eden Treaty.'
      },
      {
          title: 'Integrate existing tRPC server to Bun with Elysia',
          href: '/blog/integrate-trpc-with-elysia',
          detail: 'Learn how to integrate existing tRPC to Elysia and Bun with Elysia tRPC plugin and more about Eden end-to-end type-safety for Elysia.'
      },
      {
          title: 'Introducing Elysia 0.2 - The Blessing',
          href: '/blog/elysia-02',
          detail: 'Introducing Elysia 0.2, bringing more improvement, mainly on TypeScript performance, type-inference, and better auto-completion and some new features to reduce boilerplate.'
      }
  ]"
/>
