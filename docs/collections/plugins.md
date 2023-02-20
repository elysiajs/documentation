# Ecosystem
Elysia is designed to be modular and lightweight.

Following the same idea as Arch Linux (btw, I use Arch):

> Design decisions are made on a case-by-case basis through developer consensus

To ensure that developers endup with performant web server they intent to created.

That's why Elysia is creating pre-built common pattern plugin for convinient usage for developers:

## Official plugins:
- [Bearer](/plugins/bearer) - retreiving Bearer token.
- [Cookie](/plugins/cookie) - get/set cookie
- [CORS](/plugins/cors) - handle CORS request
- [Cron](/plugins/cron) - running cron
- [Eden](/collections/eden) - fully type-safe client for Elysia server
- [GraphQL Apollo](/plugins/graphql-apollo) - using GraphQL Apollo with Elysia
- [GraphQL Yoga](/plugins/graphql-yoga) - using GraphQL Yoga with Elysia
- [HTML](/plugins/html) - shorthand returning HTML
- [JWT](/plugins/jwt) - authenticating with JWT
- [Static](/plugins/static) - serve static file/folders
- [Swagger](/plugins/swagger) - generate Swagger on fly
- [tRPC](/plugins/trpc) - add tRPC support
- [WebSocket](/plugins/websocket) - websocket support

## Community plugins:
- [OAuth2](https://github.com/bogeychan/elysia-oauth2) - handle OAuth 2.0 authorization code flow

---
If you have plugin written for Elysia, feels free to share you plugin by creating PR to [documentation repo](https://github.com/elysiajs/documentation).
