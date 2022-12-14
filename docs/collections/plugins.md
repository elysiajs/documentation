# Ecosystem
Elysia is designed to be modular and lightweight.

Following the same idea as Arch Linux (btw, I use Arch):

> Design decisions are made on a case-by-case basis through developer consensus

To ensure that developers endup with performant web server they intent to created.

That's why Elysia is creating pre-built common pattern plugin for convinient usage for developers:

## Official plugins:
- [Eden](/collections/eden) - fully type-safe client for Elysia server
- [Static](/plugins/static) - serve static file/folders
- [Cookie](/plugins/cookie) - get/set cookie
- [CORS](/plugins/cors) - handle CORS request
- [HTML](/plugins/html) - shorthand returning HTML
- [Bearer](/plugins/bearer) - retreiving Bearer token.
- [Swagger](/plugins/swagger) - generate Swagger on fly
- [GraphQL Yoga](/plugins/graphql-yoga) - using GraphQL Yoga with Elysia
- [WebSocket](/plugins/websocket) - websocket support
- [Cron](/plugins/cron) - running cron
- [JWT](/plugins/jwt) - authenticating with JWT
- [tRPC](/plugins/trpc) - add tRPC support

## Community plugins:
- [Controllers](https://github.com/gaurishhs/kingworld-controllers) - decorator and controller-based routing
- [OAuth2](https://github.com/bogeychan/kingworld-oauth2) - handle OAuth 2.0 authorization code flow

---
If you have plugin written for Elysia, feels free to share you plugin by creating PR to [documentation repo](https://github.com/elysiajs/elysia-docs).
