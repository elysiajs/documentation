'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'
import { Code } from '@shared'

const code = `import { Elysia, t } from 'elysia'

new Elysia()
    .post(
        '/body', 
        ({ body }) => body, 
        {
            body: t.Object({
                username: t.String()
            })
        })
    })
    .listen(3000)`

export default function TypeStrict() {
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
                    className="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-blue-300"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                    }}
                >
                    Type Strict
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
                    Powered by TypeBox, Elysia enforce type-strict validation to
                    ensure type integrity by default
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
                    Elysia infers types to TypeScript automatically to create
                    unified type system like static type language
                </p>
            </header>
        </article>
    )
}
