export const swagger = `\
// Instantly Generate Swagger page
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
  .use(swagger())
  .post('/sign-in', signIn, {
    schema: {
      // add type to \`body\` and
      // validate incoming body
      body: t.Object({
        username: t.String(),
        password: t.String()
      })
    }
  })
  .listen(8080)`

export const plugins = `\
// Bring your own favorite stack
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import '@elysiajs/trpc'
import '@elysiajs/cron'

new Elysia()
  .use(websocket())
  .use(jwt({
    name: 'jwt',
    secret: 'Fischl von Luftschloss Narfidort'
  }))
  .trpc(trpcRouter)
  .cron({
    name: 'heartbeat',
    pattern: '* */5 * * * *'
  }, cleanup)`

export const typedClient = `\
// server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .post('/auth/sign-in', signIn, signModel)
  .listen(8080)

export type App = typeof app

// client.ts
import { eden } from '@elysiajs/eden'
import type { App } from 'server'

const api = eden<App>('http://0.0.0.0:8080')

// Fully type-safe both client/server like tRPC
await api.auth.signIn.post(data)
`

export const websocket = `\
// Simple chat room
import { Elysia } from 'elysia'
import { websocket } from '@elysiajs/websocket'

new Elysia()
  .use(websocket())
  .ws('/chat/:room/:user', {
    open(ws) {
      ws.subscribe(ws.data.params.room)
    },
    message(ws, message) {
      const { room, user } = ws.data.params

      ws.publish(room, user + ': ' + message)
    },
  })
  .listen(8080)`

export const codeSamples = {
    swagger,
    plugins,
    typedClient,
    websocket
} as const

export type SampleType = keyof typeof codeSamples
