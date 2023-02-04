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
    - property: 'description'
      content: Update of Elysia.js from core maintainers
---

<script setup>
    import Blogs from '../components/blog/Landing.vue'
</script>

<Blogs 
    :blogs="[
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