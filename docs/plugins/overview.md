---
title: Plugin Overview - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is designed to be modular and lightweight, which is why Elysia includes pre-built plugins involving common patterns for convenient developer usage. Elysia is enhanced by community plugins which customize it even further.

    - - meta
      - name: 'og:description'
        content: Elysia is designed to be modular and lightweight, which is why Elysia includes pre-built plugins involving common patterns for convenient developer usage. Elysia is enhanced by community plugins which customize it even further.
---

# Overview

Elysia is designed to be modular and lightweight.

Following the same idea as Arch Linux (btw, I use Arch):

> Design decisions are made on a case-by-case basis through developer consensus

This is to ensure developers end up with a performant web server they intend to create. By extension, Elysia includes pre-built common pattern plugins for convenient developer usage:

## Official plugins:

-   [Bearer](/plugins/bearer) - retrieve [Bearer](https://swagger.io/docs/specification/authentication/bearer-authentication/) token automatically
-   [CORS](/plugins/cors) - set up [Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
-   [Cron](/plugins/cron) - set up [cron](https://en.wikipedia.org/wiki/Cron) job
-   [Eden](/eden/overview) - end-to-end type safety client for Elysia
-   [GraphQL Apollo](/plugins/graphql-apollo) - run [Apollo GraphQL](https://www.apollographql.com/) on Elysia
-   [GraphQL Yoga](/plugins/graphql-yoga) - run [GraphQL Yoga](https://github.com/dotansimha/graphql-yoga) on Elysia
-   [HTML](/plugins/html) - handle HTML responses
-   [JWT](/plugins/jwt) - authenticate with [JWTs](https://jwt.io/)
-   [Server Timing](/plugins/server-timing) - audit performance bottlenecks with the [Server-Timing API](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)
-   [Static](/plugins/static) - serve static files/folders
-   [Stream](/plugins/stream) - integrate response streaming and [server-sent events (SSEs)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
-   [Swagger](/plugins/swagger) - generate [Swagger](https://swagger.io/) documentation
-   [tRPC](/plugins/trpc) - support [tRPC](https://trpc.io/)
-   [WebSocket](/patterns/websocket) - support [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## Community plugins:

-   [BunSai](https://github.com/levii-pires/bunsai) - full-stack agnostic framework for the web, built upon Bun and Elysia
-   [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - authentication, simple and clean
-   [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - unofficial Clerk authentication plugin
-   [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - run Elysia ecosystem on Node.js and Deno
-   [Vite](https://github.com/timnghg/elysia-vite) - serve entry HTML file with Vite's scripts injected
-   [Nuxt](https://github.com/trylovetom/elysiajs-nuxt) - easily integrate elysia with nuxt!
-   [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - secure Elysia apps with various HTTP headers
-   [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - Vite SSR plugin using Elysia server
-   [OAuth 2.0](https://github.com/kravetsone/elysia-oauth2) - An plugin for [OAuth 2.0](https://en.wikipedia.org/wiki/OAuth) Authorization Flow with more than **42** providers and **type-safety**!
-   [OAuth2](https://github.com/bogeychan/elysia-oauth2) - handle OAuth 2.0 authorization code flow
-   [Elysia OpenID Client](https://github.com/macropygia/elysia-openid-client) - OpenID client based on [openid-client](https://github.com/panva/node-openid-client)
-   [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - simple, lightweight rate limiter
-   [Logysia](https://github.com/tristanisham/logysia) - classic logging middleware
-   [Logestic](https://github.com/cybercoder-naj/logestic) - An advanced and customisable logging library for ElysiaJS
-   [Logger](https://github.com/bogeychan/elysia-logger) - [pino](https://github.com/pinojs/pino)-based logging middleware
-   [Elylog](https://github.com/eajr/elylog) - simple stdout logging library with some customization
-   [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - deploy on AWS Lambda
-   [Decorators](https://github.com/gaurishhs/elysia-decorators) - use TypeScript decorators
-   [Autoload](https://github.com/kravetsone/elysia-autoload) - filesystem router based on a directory structure that generates types for [Eden](https://elysiajs.com/eden/overview.html)
-   [Msgpack](https://github.com/kravetsone/elysia-msgpack) - allows you to work with [MessagePack](https://msgpack.org)
-   [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - filesystem routes
-   [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - filesystem and folder-based router for groups
-   [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - basic HTTP authentication
-   [ETag](https://github.com/bogeychan/elysia-etag) - automatic HTTP [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) generation
-   [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - basic HTTP authentication (using `request` event)
-   [i18n](https://github.com/eelkevdbos/elysia-i18next) - [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) wrapper based on [i18next](https://www.i18next.com/)
-   [Elysia Request ID](https://github.com/gtramontina/elysia-requestid) - add/forward request IDs (`X-Request-ID` or custom)
-   [Elysia HTMX](https://github.com/gtramontina/elysia-htmx) - context helpers for [HTMX](https://htmx.org/)
-   [Elysia HMR HTML](https://github.com/gtrabanco/elysia-hmr-html) - reload HTML files when changing any file in a directory
-   [Elysia Inject HTML](https://github.com/gtrabanco/elysia-inject-html) - inject HTML code in HTML files
-   [Elysia HTTP Error](https://github.com/yfrans/elysia-http-error) - return HTTP errors from Elysia handlers
-   [Elysia Http Status Code](https://github.com/sylvain12/elysia-http-status-code) - integrate HTTP status codes
-   [NoCache](https://github.com/gaurishhs/elysia-nocache) - disable caching
-   [Elysia Tailwind](https://github.com/gtramontina/elysia-tailwind) - compile [Tailwindcss](https://tailwindcss.com/) in a plugin.
-   [Elysia Compression](https://github.com/gusb3ll/elysia-compression) - compress response
-   [Elysia IP](https://github.com/gaurishhs/elysia-ip) - get the IP Address
-   [OAuth2 Server](https://github.com/myazarc/elysia-oauth2-server) - developing an OAuth2 Server with Elysia
-   [Elysia Flash Messages](https://github.com/gtramontina/elysia-flash-messages) - enable flash messages
-   [Elysia AuthKit](https://github.com/gtramontina/elysia-authkit) - unnoficial [WorkOS' AuthKit](https://www.authkit.com/) authentication
-   [Elysia Error Handler](https://github.com/gtramontina/elysia-error-handler) - simpler error handling
-   [Elysia env](https://github.com/yolk-oss/elysia-env) - typesafe environment variables with typebox
-   [Elysia Drizzle Schema](https://github.com/Edsol/elysia-drizzle-schema) - Helps to use Drizzle ORM schema inside elysia swagger model.
-   [Unify-Elysia](https://github.com/qlaffont/unify-elysia) - Unify error code for Elysia
-   [Unify-Elysia-GQL](https://github.com/qlaffont/unify-elysia-gql) - Unify error code for Elysia GraphQL Server (Yoga & Apollo)
-   [Elysia Auth Drizzle](https://github.com/qlaffont/elysia-auth-drizzle) - Library who handle authentification with JWT (Header/Cookie/QueryParam).
-   [graceful-server-elysia](https://github.com/qlaffont/graceful-server-elysia) - Library inspired by [graceful-server](https://github.com/gquittet/graceful-server).
-   [Logixlysia](https://github.com/PunGrumpy/logixlysia) - A beautiful and simple logging middleware for ElysiaJS with colors and timestamps.
-   [Elysia Compress](https://github.com/vermaysha/elysia-compress) - ElysiaJS plugin to compress responses inspired by [@fastify/compress](https://github.com/fastify/fastify-compress)
---

If you have a plugin written for Elysia, feel free to add your plugin to the list by **clicking <i>Edit this page on GitHub</i>** below 👇
