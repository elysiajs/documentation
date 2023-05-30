'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Code } from '@shared'

const server = `// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/age',
        ({ body }) => signIn(body), 
        {
            body: t.Object({
                name: t.String(),
                age: t.String()
            })
        }
    )
    .listen(80)

export type App = typeof app`

const client = `// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from 'server'

const eden = edenTreaty<App>('http://localhost')

await eden.user.age.patch({
    name: 'saltyaom',
    age: '21'
})`

export default function E2ETypeSafety() {
    const element = useRef<HTMLElement>(null)
    const inView = useInView(element, {
        once: true,
        margin: '-50%'
    })

    return (
        <section
            ref={element}
            className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto"
        >
            <h3
                className="text-2xl mr-auto md:mx-auto font-medium text-gray-400"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    transition: 'all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1)'
                }}
            >
                Introducing
            </h3>
            <h2
                className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 my-4"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    lineHeight: '1.25',
                    transition:
                        'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                }}
            >
                End–to-End Type Safety
            </h2>

            <p
                className="text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-2xl"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    transition:
                        'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .3s'
                }}
            >
                Synchornize types across all applications.
                <br />
                Move fast and break nothing like tRPC.
            </p>

            <section className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl my-8">
                <div
                    className="w-full"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) .5s'
                    }}
                >
                    <Code noLine code={server} />
                </div>
                <div
                    className="relative w-full"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) .65s'
                    }}
                >
                    <Code noLine code={client} />
                    <div
                        className="absolute p-1 rounded bg-red-400/25"
                        style={{
                            top: '13em',
                            left: '6.375em',
                            width: '2.5em',
                            height: '1.375em'
                        }}
                    />
                    <p
                        className="absolute px-3 py-1.5 rounded bg-white border"
                        style={{
                            top: '14.75em',
                            left: '3.25em'
                        }}
                    >
                        Type 'string' is not assignable to type 'number'
                    </p>
                </div>
            </section>
        </section>
    )
}
