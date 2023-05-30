'use client'

import { useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function ItsFast() {
    const element = useRef<HTMLElement>(null)
    const inView = useInView(element, {
        once: true,
        margin: '-50%'
    })

    return (
        <article
            ref={element}
            className="flex justify-between flex-col lg:flex-row items-center w-full max-w-6xl mx-auto my-8 gap-12"
        >
            <section className="flex flex-col w-full max-w-lg">
                <header className="flex flex-col justify-center items-start">
                    <h2
                        className="text-4xl leading-tight font-medium text-gray-400 mb-2"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1)'
                        }}
                    >
                        Elysia is fast
                    </h2>
                    <h2
                        className="text-4xl leading-tight font-medium text-gray-400 mb-4"
                        style={{
                            opacity: inView ? 1 : 0,
                            transform: inView
                                ? `translateX(0)`
                                : `translateX(-1em)`,
                            transition:
                                'all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .15s'
                        }}
                    >
                        <span className="leading-tight text-8xl font-bold bg-clip-text text-transparent pr-4 bg-gradient-to-br from-lime-300 to-cyan-300">
                            18x
                        </span>{' '}
                        faster than Express
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
                    Supercharged by Bun runtime, Static Code Analysis, and
                    various micro optimization.
                </p>
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
                    Elysia is able to outperform in various situation, being one
                    of the top-perform TypeScript framework.
                </p>
            </section>
            <section className="flex flex-col w-full max-w-xl">
                <ol className="flex flex-col gap-2 list-none w-full text-gray-500 text-lg">
                    <li className="flex flex-row items-stretch w-full gap-4">
                        <p
                            className="flex items-end gap-2 w-full max-w-[6em]"
                            style={{
                                opacity: inView ? 1 : 0,
                                transition: `all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .6s`
                            }}
                        >
                            Elysia
                            <span className="text-gray-400 text-xs pb-1">
                                Bun
                            </span>
                        </p>
                        <div className="w-full h-7">
                            <div
                                className="flex justify-end items-center text-sm font-bold text-white h-7 px-2.5 py-0.5 bg-gradient-to-r from-lime-200 to-cyan-300 rounded-full"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    width: inView ? '100%' : 0,
                                    transition: `all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) .7s`
                                }}
                            >
                                276,322
                            </div>
                        </div>
                    </li>
                    {(
                        [
                            ['Hono', 'Bun', 254376],
                            ['Baojs', 'Bun', 173587],
                            ['Fast', 'Deno', 85924],
                            ['Fastify', 'Node', 58742],
                            ['Koa', 'Node', 37198],
                            ['Express', 'Node', 15133],
                            ['Nest', 'Node', 13510]
                        ] as const
                    ).map(([name, runtime, value], index) => {
                        const scale = (value / 276322) * 100

                        const format = new Intl.NumberFormat().format

                        const title = {
                            opacity: inView ? 1 : 0,
                            transition: `all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) ${
                                0.6 + (index + 1) * 0.05
                            }s`
                        }

                        const graph = {
                            opacity: inView ? 1 : 0,
                            width: inView ? scale.toFixed(2) + '%' : 0,
                            transition: `all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) ${
                                0.7 + (index + 1) * 0.05
                            }s`
                        }

                        if (scale > 40)
                            return (
                                <li
                                    key={name}
                                    className="flex flex-row w-full gap-4"
                                >
                                    <p
                                        className="flex items-end gap-2 w-full max-w-[6em]"
                                        style={title}
                                    >
                                        {name}{' '}
                                        <span className="text-gray-400 text-xs pb-1">
                                            {runtime}
                                        </span>
                                    </p>
                                    <div className="w-full h-7">
                                        <div
                                            className="flex justify-end items-center text-sm px-2.5 py-0.5 bg-gray-200 rounded-full mr-auto h-7"
                                            style={graph}
                                        >
                                            {format(value)}
                                        </div>
                                    </div>
                                </li>
                            )

                        return (
                            <li
                                key={name}
                                className="flex flex-row w-full gap-4"
                            >
                                <p
                                    className="flex items-end gap-2 w-full max-w-[6em]"
                                    style={title}
                                >
                                    {name}{' '}
                                    <span className="text-gray-400 text-xs pb-1">
                                        {runtime}
                                    </span>
                                </p>
                                <div className="relative flex w-full h-7">
                                    <div
                                        className="flex justify-end items-center text-sm px-2.5 bg-gray-200 rounded-full h-7"
                                        style={graph}
                                    />
                                    <span
                                        className="absolute z-1 flex items-center text-sm h-7"
                                        style={{
                                            opacity: inView ? 1 : 0,
                                            transition: `all 0.625s cubic-bezier(0.17, 0.55, 0.55, 1) ${
                                                0.8 + (index + 1) * 0.05
                                            }s`,
                                            marginLeft: `calc(${scale.toFixed(
                                                2
                                            )}% + 1em)`
                                        }}
                                    >
                                        {format(value)}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ol>
                {/* <br />
                <a
                    href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c84f2e8b7de5ee2ddb8a672ddb0b8f5b477cc013#results"
                    target="_blank"
                >
                    Here
                </a> */}
            </section>
        </article>
    )
}
