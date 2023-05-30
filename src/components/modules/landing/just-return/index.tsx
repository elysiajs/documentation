'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { Code } from '@shared'

const code = `import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .get('/json', () => {
        return {
            hello: 'world'
        }
    })
    .listen(3000)`

export default function JustReturn() {
    const element = useRef<HTMLElement>(null)
    const inView = useInView(element, {
        once: true,
        margin: '-40%'
    })

    return (
        <article
            ref={element}
            className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl"
        >
            <section
                className="w-full"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    transition: 'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1)'
                }}
            >
                <Code code={code} />
            </section>
            <header className="flex flex-col gap-3 w-full">
                <h3
                    className="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-sky-300"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                    }}
                >
                    Just return
                </h3>
                <p
                    className="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .3s'
                    }}
                >
                    No need for additional method, just return a value to send
                    data back to client
                </p>
                <p
                    className="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .45s'
                    }}
                >
                    Whether it's a normal string, or complex JSON, just return
                    value and Elysia will handle the rest
                </p>
            </header>
        </article>
    )
}
