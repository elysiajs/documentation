'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ItWorks() {
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
            <h2
                className="flex flex-col md:flex-row justify-center items-start md:items-end gap-4 w-full text-4xl md:text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-purple-400 mb-8"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    transition: 'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1)'
                }}
            >
                It works with that
                <span
                    className="text-2xl font-light leading-relaxed text-gray-400"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                    }}
                >
                    From simple REST utils, to complex GraphQL
                </span>
            </h2>

            <section className="flex flex-col sm:flex-row items-strech gap-4 md:gap-6 w-full max-w-6xl">
                <article
                    className="aspect-1 w-full rounded-xl border"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all .875s cubic-bezier(0.17, 0.55, 0.55, 1) .3s'
                    }}
                >
                    <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                        <div className="flex justify-center items-center">
                            <div
                                style={{
                                    width: '560px',
                                    height: '560px',
                                    transform: 'translateX(-8.5px) scale(2)',
                                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 13.5px, #ddd 14px),
                                repeating-linear-gradient(to right, transparent, transparent 13.5px, #ddd 14px)`
                                }}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="flex justify-center items-center w-[113px] h-[113px] m-auto bg-gray-100 border">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width=".75"
                                    className="w-[70px] h-[70px] text-gray-400"
                                >
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <header className="flex flex-col p-6 border-t">
                        <h4 className="text-2xl font-medium text-gray-700 mb-2">
                            Fast
                        </h4>
                        <p className="text-gray-500">
                            Built to be fast with minimal overheads, top
                            performing TypeScript framework
                        </p>
                    </header>
                </article>
                <article
                    className="aspect-1 w-full rounded-xl border"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .45s'
                    }}
                >
                    <div className="aspect-w-4 aspect-h-3">
                        <h4 className="flex justify-center items-center text-6xl text-gray-700 font-light">
                            a b c
                        </h4>
                    </div>
                    <header className="flex flex-col p-6 border-t">
                        <h4 className="text-2xl font-medium text-gray-700 mb-2">
                            Simple
                        </h4>
                        <p className="text-gray-500">
                            Easy to grasp concept. Designed to eliminate
                            redundant and mundane task.
                        </p>
                    </header>
                </article>
                <article
                    className="aspect-1 w-full rounded-xl border overflow-hidden"
                    style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                            ? `translateX(0)`
                            : `translateX(-1em)`,
                        transition:
                            'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .6s'
                    }}
                >
                    <div className="aspect-w-4 aspect-h-3">
                        <div className="flex justify-center items-center">
                            <div className="w-24 h-24 mask mask-hexagon bg-gradient-to-tr from-yellow-100 to-cyan-100 rounded transform translate-y-4 -rotate-12" />
                            <div className="w-24 h-24 mask mask-circle bg-gradient-to-r from-green-100 to-sky-100 rounded transform -translate-y-4" />
                            <div className="w-24 h-24 mask mask-squircle bg-gradient-to-r from-sky-100 to-purple-200 rounded transform translate-y-4 rotate-12 translate-x-1" />
                        </div>
                    </div>
                    <header className="flex flex-col p-6 border-t">
                        <h4 className="text-2xl font-medium text-gray-700 mb-2">
                            Flexible
                        </h4>
                        <p className="text-gray-500">
                            Crafted from well–thought design decision to
                            versatile building blocks.
                        </p>
                    </header>
                </article>
            </section>

            <p
                className="ml-4 text-xl leading-relaxed text-gray-400 mt-8"
                style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? `translateX(0)` : `translateX(-1em)`,
                    transition:
                        'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .8s'
                }}
            >
                Elysia is a fast, and friendly Bun web framework
            </p>
        </section>
    )
}
