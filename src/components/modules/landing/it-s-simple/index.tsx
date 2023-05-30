'use client'

import { useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function ItsSimple() {
    const element = useRef<HTMLElement>(null)
    const inView = useInView(element, {
        once: true,
        margin: '-50%'
    })

    return (
        <article
            ref={element}
            className="flex flex-col justify-between items-center w-full max-w-6xl mx-auto my-8 gap-12"
        >
            <section className="flex flex-col w-full">
                <header className="flex flex-col justify-center items-start">
                    <h2
                        className="text-6xl md:text-7xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-lime-300 to-cyan-300"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1)'
                        }}
                    >
                        It's easy
                    </h2>
                    <h2
                        className="text-3xl leading-tight font-medium text-gray-400 mt-2 mb-8"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                        }}
                    >
                        From beginner to pro
                    </h2>
                </header>
                <p
                    className="text-xl text-gray-400 w-full max-w-lg mb-4"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .3s'
                    }}
                >
                    If you found yourself writing code for the framework, then
                    there's something wrong with the framework.
                </p>
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <p
                        className="text-xl text-gray-400 w-full max-w-lg"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .45s'
                        }}
                    >
                        That's why Elysia invest times to experiment with design
                        decision to craft the most ergonomic way possible for
                        everyone
                    </p>
                    <p
                        className="text-xl text-gray-400 w-full max-w-lg"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .6s'
                        }}
                    >
                        From built-in strict-type validaiton to unified types
                        system, and documentation generation, making an ideal
                        framework for building server with TypeScript.
                    </p>
                </div>
            </section>
        </article>
    )
}
