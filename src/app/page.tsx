import {
    E2ETypeSafety,
    ItWorks,
    ItsFast,
    ItsSimple,
    JustReturn,
    OpenAPI,
    TypeStrict,
    WhatIsElysia
} from '@modules/landing'

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Hello',
    openGraph: {
        title: 'Next Starter',
        description: "SaltyAom's Next Starter",
        images: '/og',
        authors: 'SaltyAom'
    }
}

export default function Index() {
    return (
        <>
            <header className="flex flex-col justify-center items-center w-full min-h-screen px-6 pt-20">
                <h1 className="text-3xl leading-relaxed font-semibold text-transparent mr-auto md:mx-auto bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    ElysiaJS
                </h1>
                <h2 className="relative text-5xl md:text-6xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 mt-2 mb-8">
                    Ergonomic Framework for Human
                    <span className="absolute w-10 md:w-12 h-10 md:h-12 bottom-0 mb-4 ml-2 md:ml-0 md:mb-10 text-indigo-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                        >
                            <rect width="256" height="256" fill="none" />
                            <path
                                d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
                                fill="currentcolor"
                                stroke="currentcolor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="0"
                            />
                            <line
                                x1="176"
                                y1="16"
                                x2="176"
                                y2="64"
                                fill="none"
                                stroke="currentcolor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                            />
                            <line
                                x1="200"
                                y1="40"
                                x2="152"
                                y2="40"
                                fill="none"
                                stroke="currentcolor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                            />
                            <line
                                x1="224"
                                y1="72"
                                x2="224"
                                y2="104"
                                fill="none"
                                stroke="currentcolor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                            />
                            <line
                                x1="240"
                                y1="88"
                                x2="208"
                                y2="88"
                                fill="none"
                                stroke="currentcolor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                            />
                        </svg>
                    </span>
                </h2>
                <h3 className="text-xl md:text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-3xl">
                    TypeScript framework supercharged by Bun with End-to-End
                    Type Safety, unified type system and outstanding developer
                    experience
                </h3>
                <section className="flex gap-2 mt-12 mb-12">
                    <a className="text-blue-500 font-medium text-xl bg-blue-50 px-6 py-2.5 rounded-xl">
                        Get Started
                    </a>
                    <a className="text-blue-400 font-medium text-xl px-6 py-2.5 rounded-xl">
                        Learn Elysia
                    </a>
                </section>
                <p className="flex justify-center items-center gap-2 text-gray-400">
                    See why developers love Elysia
                    {/* // ? Arrow */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="w-6 h-6 motion-safe:animate-bounce"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                </p>
            </header>

            <main className="flex flex-col justify-center items-center w-full max-5xl mx-auto gap-16 px-6">
                {/*  */}
                <WhatIsElysia />
                {/* Show benchmark */}
                <ItsFast />

                {/* Show feature list */}
                <ItsSimple />
                <section className="flex flex-col justify-center items-center gap-12 w-full mb-8">
                    <JustReturn />
                    <TypeStrict />
                    <OpenAPI />
                </section>

                {/* Show e2e type safety */}
                <E2ETypeSafety />

                {/* Yes, it works with that */}
                <ItWorks />

                {/* Show how to get start */}
                <h2>Get started in seconds 🪄</h2>
                <code>bun create elysia elysia-app</code>
                {/* Trusted by the community */}
            </main>
        </>
    )
}
