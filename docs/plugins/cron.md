# Cron Plugin
This plugin adds support for running cronjob in Elysia server.

Install with:
```bash
bun add @elysiajs/cron
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import '@elysiajs/cron'

new Elysia()
    .cron({
        name: 'heartbeat',
        pattern: '*/10 * * * * *'
    },
    () => {
        console.log('Heartbeat')
    })
    .get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'stopped'
    })
    .listen(8080)
```

The above code will log `heartbeat` every 10 seconds.

## Method
Below are the new methods registered by the plugin.

## cron
Create a cronjob for Elysia server.

type:
```
cron(config: CronConfig, callback: (Instance['store']) => void): this
```

`CronConfig` accept the parameters specified below:

### name
Job name to register to `store`.

This will register the cron instance to `store` with a specified name, which can be used to reference in later processes eg. stop the job.

### pattern
Time to run the job as specified by [cron syntax](https://en.wikipedia.org/wiki/Cron) specified as below:
```
┌────────────── second (optional)
│ ┌──────────── minute
│ │ ┌────────── hour
│ │ │ ┌──────── day of month
│ │ │ │ ┌────── month
│ │ │ │ │ ┌──── day of week
│ │ │ │ │ │
* * * * * *
```

This can be generated by tools like [Crontab Guru](https://crontab.guru/)

---
This plugin extends cron method to Elysia using [cronner](https://github.com/hexagon/croner).

Below are the config accepted by cronner.

### timezone
Time zone in Europe/Stockholm format

### startAt
Schedule start time for the job

### stopAt
Schedule stop time for the job

### maxRuns
Maximum number of executions

### catch
Continue execution even if an unhandled error is thrown by a triggered function.

### interval
The minimum interval between executions, in seconds.

## Pattern
Below you can find the common patterns to use the plugin.

## Stop cronjob
You can stop cronjob manually by accessing cronjob name registered to `store`.

```typescript
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/cookie'

new Elysia()
    .use(cookie({
        httpOnly: true
    }))
    .post('/sign/:name', ({ setCookie, params: { name } }) => {
        setCookie('name', name, {
            maxAge: 86400
        })
    })
    .listen(8080)
```

This will sign a cookie with `maxAge` of `86400` and `httpOnly` to `true`.
