---
title: Plugin Overview - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is designed to be modular and lightweight. That's why Elysia is creating pre-built common pattern plugin for convinient usage for developers, and thanks to community plugins for customizing Elysia even further.

    - - meta
      - name: 'og:description'
        content: Elysia is designed to be modular and lightweight. That's why Elysia is creating pre-built common pattern plugin for convinient usage for developers, and thanks to community plugins for customizing Elysia even further.
---

# Overview
Elysia is designed to be modular and lightweight.

Following the same idea as Arch Linux (btw, I use Arch):

> Design decisions are made on a case-by-case basis through developer consensus

To ensure that developers endup with performant web server they intent to created.

That's why Elysia is creating pre-built common pattern plugin for convinient usage for developers:

## Official plugins:
- [Bearer](/plugins/bearer) - retreiving Bearer token automatically
- [Cookie](/plugins/cookie) - toolkits for handling cookie
- [CORS](/plugins/cors) - setup Cross Origin Request request
- [Cron](/plugins/cron) - setup cronjob
- [Eden](/plugins/eden/overview) - end-to-end type safe client for Elysia
- [GraphQL Apollo](/plugins/graphql-apollo) - run GraphQL Apollo on Elysia
- [GraphQL Yoga](/plugins/graphql-yoga) - run GraphQL Yoga on Elysia
- [HTML](/plugins/html) - convenient plugin for handling HTML response
- [JWT](/plugins/jwt) - authentication with JWT
- [Static](/plugins/static) - serve static file/folders
- [Swagger](/plugins/swagger) - generate Swagger documentation in 1 line
- [tRPC](/plugins/trpc) - add tRPC support
- [WebSocket](/patterns/websocket) - websocket support

## Community plugins:
- [Lucia Auth](https://github.com/pilcrowOnPaper/lucia) - Authentication, simple and clean
- [Elysia Clerk](https://github.com/wobsoriano/elysia-clerk) - Unofficial Clerk plugin for ElysiaJS
- [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) - run Elysia ecosystem on Node and Deno
- [Vite](https://github.com/timnghg/elysia-vite) - Simple Elysia plugin that helps you use Vite. It serve your entry html file with Vite's scripts injected
- [Elysia Helmet](https://github.com/DevTobias/elysia-helmet) - secure Elysia apps with various HTTP headers.
- [Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) - Vite Plugin SSR using Elysia server
- [OAuth2](https://github.com/bogeychan/elysia-oauth2) - handle OAuth 2.0 authorization code flow
- [Rate Limit](https://github.com/rayriffy/elysia-rate-limit) - simple lightweight rate limiter
- [Logger](https://github.com/bogeychan/elysia-logger) - pino logging elysia middleware
- [Elysia Lambda](https://github.com/TotalTechGeek/elysia-lambda) - deploy Elysia on AWS Lambda
- [Decorators](https://github.com/gaurishhs/elysia-decorators) - use typescript decorators with elysia
- [Autoroutes](https://github.com/wobsoriano/elysia-autoroutes) - file system routes for Elysia
- [Group Router](https://github.com/itsyoboieltr/elysia-group-router) - file system and folder-based router for groups.
- [Basic Auth](https://github.com/itsyoboieltr/elysia-basic-auth) - basic http authentication for Elysia.
- [Basic Auth](https://github.com/eelkevdbos/elysia-basic-auth) - Basic http authentication for Elysia (using 'request' event).

---
If you have plugin written for Elysia, feels free to share you plugin by creating PR to [documentation repo](https://github.com/elysiajs/documentation).
