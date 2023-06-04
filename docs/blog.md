---
title: Elysia Blog
layout: page
sidebar: false
editLink: false
head:
    - - meta
      - property: 'og:title'
        content: Blog - Elysia.js

    - - meta
      - name: 'description'
        content: Update of Elysia.js, from core maintainers

    - - meta
      - property: 'og:description'
        content: Update of Elysia.js from core maintainers
---

<script setup>
    import Blogs from '../components/blog/Landing.vue'
</script>

<Blogs 
  :blogs="[
      {
        title: 'Accerate your next Prisma server with Elysia',
        href: '/blog/with-prisma',
        detail: 'With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accerate our interaction with database, Elysia accerate our creation of backend web server in term of both developer experience and performance.'
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
