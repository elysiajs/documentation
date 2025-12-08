---
title: Elysia Blog
layout: page
sidebar: false
editLink: false
search: false
comments: false
authors: []
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
    import Blogs from './components/blog/Landing.vue'
</script>

<Blogs
  :blogs="[
      {
        title: '2x faster than Encore - 1 year later',
		href: '/blog/elysia-v-encore',
		cover: 'elysia-v-encore.webp',
		detail: 'After 1.5 year of development, Elysia is now 2x faster than Encore. Updated from the original benchmark, and deep dive into how we achieved this performance.',
		date: '14 Nov 2025'
      },
      {
        title: 'Elysia 1.4 - Supersymmetry',
		href: '/blog/elysia-14',
		cover: 'elysia-14.webp',
		detail: 'Support for Standard Validator. Macro with schema, extension, and OpenAPI detail. Lifecycle type soundness. Improve type inference performance by 10%.',
		date: '13 Sep 2025'
      },
      {
        title: 'Introducing OpenAPI Type Gen for Elysia',
		href: '/blog/openapi-type-gen',
		cover: 'cover.webp',
		detail: 'Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types without any manual annotation.'
      },
      {
        title: 'Elysia 1.3 and Scientific Witchery',
        href: '/blog/elysia-13',
        cover: 'elysia-13.webp',
        detail: 'Near 0 overhead normalization with Exact Mirror, Bun System Router, Standalone Validator, Half the type instatiation, and significant memory usage reduction and faster start up time.'
      },
      {
        title: 'Elysia 1.2 - You and Me',
        href: '/blog/elysia-12',
        cover: 'elysia-12.webp',
        detail: 'Introducing Adapter for universal runtime suppport, Object macro with resolve, Parser with custom name, WebSocket with lifecycle, TypeBox 0.34 with recursive type, and Eden validation inference.'
      },
	  {
	    title: 'Elysia 1.1 - Grown-up\'s Paradise',
	    href: '/blog/elysia-11',
        cover: 'elysia-11.webp',
	    detail: 'Introducing OpenTelemetry, and Trace v2. Data coercion and normalization. Guard plugin and bulk cast. Optional path parameter. Decorator and Response status reconcilation. Generator response stream.'
	  },
      {
        title: 'Elysia 1.0 - Lament of the Fallen',
        href: '/blog/elysia-10',
        cover: 'lament-of-the-fallen.webp',
        detail: 'Introducing Sucrose, a better static code analysis engine, improved starts up time up to 14x, remove 40 routes/instance limitation, faster type inference up to ~3.8x, Eden Treaty 2, Hook type (breaking change), and inline error for strict type check.'
      },
      {
        title: 'Introducing Elysia 0.8 - Gate of Steiner',
        href: '/blog/elysia-08',
        cover: 'gate-of-steiner.webp',
        detail: 'Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.'
      },
      {
        title: 'Introducing Elysia 0.7 - Stellar Stellar',
        href: '/blog/elysia-07',
        cover: 'stellar-stellar.webp',
        detail: 'Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.'
      },
      {
        title: 'Introducing Elysia 0.6 - This Game',
        href: '/blog/elysia-06',
        cover: 'this-game.webp',
        detail: 'Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again'
      },
      {
        title: 'Accelerate your next Prisma server with Elysia',
        href: '/blog/with-prisma',
        cover: 'prism.webp',
        detail: 'With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accelerate our interaction with database, Elysia accelerate our creation of backend web server in term of both developer experience and performance.'
      },
      {
          title: 'Introducing Elysia 0.5 - Radiant',
          href: '/blog/elysia-05',
          cover: 'radiant.webp',
          detail: 'Introducing Static Code Analysis, New router Memoirist, TypeBox 0.28, Numeric type, inline schema, state/decorate/model/group rework, and type stability.'
      },
      {
          title: 'Introducing Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)',
          href: '/blog/elysia-04',
          cover: 'moonlit-night-concert.webp',
          detail: 'Introducing Ahead of Time Compilation, TypeBox 0.26, Response validation per status, and Separation of Elysia Fn.'
      },
      {
          title: 'Elysia with Supabase. Your next backend at sonic speed',
          href: '/blog/elysia-supabase',
          cover: 'elysia-supabase.webp',
          detail: 'Elysia, and Supabase are a great match for rapidly developing prototype in less than a hour, let\'s take a look of how we can take advantage of both.'
      },
      {
          title: 'Introducing Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]',
          href: '/blog/elysia-03',
          cover: 'edge-of-ground.webp',
          detail: 'Introducing Elysia Fn, Type Rework for highly scalable TypeScript performance, File Upload support and validation, Reworked Eden Treaty.'
      },
      {
          title: 'Introducing Elysia 0.2 - The Blessing',
          href: '/blog/elysia-02',
          cover: 'blessing.webp',
          detail: 'Introducing Elysia 0.2, bringing more improvement, mainly on TypeScript performance, type-inference, and better auto-completion and some new features to reduce boilerplate.'
      }
  ]"
/>
