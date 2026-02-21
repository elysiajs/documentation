<template>
    <article id="people-tweets" class="fern-gap relative overflow-hidden" ref="scope">
        <motion.div
            class="flex justify-center flex-wrap gap-y-2 text-center"
            v-bind="flyIn()"
        >
            <h2
                class="text-3xl font-medium text-mauve-500 dark:text-mauve-300 leading-[3rem]"
                v-bind="flyIn()"
            >
                What people say about
            </h2>
            <div class="flex items-center">
                <img
                    src="/assets/elysia.svg"
                    alt="Elysia Logo"
                    class="inline size-11 ml-4 mr-3"
                />
                <span
                    class="text-5xl font-semibold text-neutral-950 dark:text-white"
                >
                    Elysia
                </span>
            </div>
        </motion.div>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-12 pb-8 max-w-5xl w-full mx-auto">
            <div class="flex flex-col gap-3 lg:mt-12">
                <motion.div v-bind="flyIn(0.1)">
                    <Tweet
                        id="AqueelMiq"
                        user="Aqueel"
                        image="/tweets/aqueel.webp"
                        content="Jetfuel on bun at X! @shlomiatar who built the framework has an eye for picking the right tools for the job."
                        href="https://x.com/AqueelMiq/status/1822380943279296832"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.2)">
                    <Tweet
                        id="shlomiatar"
                        user="Shlomi Atar"
                        image="/tweets/shlomi.webp"
                        content="also a shoutout to @saltyAom and the phenomenal Elysia js that is powering our server driven UI. Incredible work."
                        href="https://x.com/shlomiatar/status/1822381556142362734"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.3)">
                    <Tweet
                        id="htmx_org"
                        user="htmx.org"
                        image="/tweets/htmx.webp"
                        content="htmx works great w/ @bunjavascript, @elysiaJS and @tursodatabase btw"
                        href="https://x.com/htmx_org/status/1792949584769224897"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.4)">
                    <Tweet
                        id="nuqs47ng"
                        user="nuqs"
                        image="/tweets/nuqs.webp"
                        content="I’m a Node.js + Fastify diehard, but the Bun + Elysia combo looks very promising 👀"
                        href="https://x.com/nuqs47ng/status/1991618158583771524"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.5)">
                    <Tweet
                        id="Erwin_AI"
                        user="Erwin"
                        image="/tweets/erwin.webp"
                        content="Already using Elysia (+Bun) anywhere I can. Wouldn't want to back to node+express even if you'd pay me a mil."
                        href="https://x.com/Erwin_AI/status/1991740419110269107"
                    />
                </motion.div>
            </div>
            <div class="flex flex-col gap-3">
                <motion.div v-bind="flyIn(0.2)">
                    <Tweet
                        id="jarredsumner"
                        user="Jarred Sumner"
                        image="/tweets/jarred.webp"
                        content="You can use Express with Bun, but often we see people using Elysia, Hono, or Bun.serve() directly."
                        href="https://x.com/jarredsumner/status/1781132294692233609"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.3)">
                    <Tweet
                        id="runyasak"
                        user="Runyasak Ch. 💚"
                        image="/tweets/runyasak.webp"
                        content="Started using @elysiaJS to create a Discord Bot and found the type system beautifully easy. DX is fantastic and coding is fun!

Use @DrizzleORM with PostgreSQL. So much easier than I've used before.

ElysiaJS has proved to me that great performance and DX can live together. 😎"
                        href="https://x.com/runyasak/status/1797618641648968117"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.4)">
                    <Tweet
                        id="hd_nvim"
                        user="Herrington Darkholme"
                        image="/tweets/herrington.webp"
                        content="Was introduced to @elysiaJS today and it looks pretty solid. end-to-end type safety/guard/swapper are killer features of the modern web! (and it's fast)"
                        href="https://x.com/hd_nvim/status/1735182378036027650"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.5)">
                    <Tweet
                        id="scalar"
                        user="scalar.com"
                        image="/tweets/scalar.webp"
                        content="so excited to be part of the amazing @elysiaJS community!"
                        href="https://x.com/scalar/status/1744024831014920403"
                    />
                </motion.div>
            </div>
            <div class="flex flex-col gap-3 lg:mt-6">
                <motion.div v-bind="flyIn(0.3)">
                    <Tweet
                        id="josedonato__"
                        user="José Donato 🦋"
                        image="/tweets/josedonato.webp"
                        content="handling tables with ~350k rows like it's nothing.

Working on allowing @ag_grid server side row model when connecting a custom backend to @openbb_finance Terminal Pro.

Backend in @elysiaJS + @bunjsproject."
                        href="https://x.com/josedonato__/status/1815706393367703890"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.4)">
                    <Tweet
                        id="Bewinxed"
                        user="Bewinxed"
                        image="/tweets/bewinxed.webp"
                        content="Elysia single handedly carrying js backends

I have been using it almost exclusively for all my projects"
                        href="https://x.com/Bewinxed/status/1896977430247833858"
                    />
                </motion.div>
                <motion.div v-bind="flyIn(0.5)">
                    <Tweet
                        id="MikroORM"
                        user="MikroORM"
                        image="/tweets/mikroorm.webp"
                        content="I've been playing a bit with @bunjavascript and @elysiaJS, need to do a few more tweaks before the release, but next version should work more natively with bun when it comes to TS support detection, e.g. the CLI works without ts-node installed."
                        href="https://x.com/MikroORM/status/1821993062114967711"
                    />
                </motion.div>
            </div>
        </section>

        <motion.div
            v-bind="flyIn(0.2)"
            class="hidden lg:block absolute w-[333px] top-48 left-[calc(50%-53.5rem)]"
        >
            <Tweet
                id="MarcLaventure"
                user="Marc Laventure"
                image="/tweets/marc.webp"
                content="both engineering+monetary contributions are paramount for OSS

we proudly sponsor dozens of projects: @elysiaJS @LitestarAPI @honojs @daveshanley @kevin_jahns @MarijnJH & help maintain repos+contribute to OSS at blistering cadence.

it's @scalar's ethos to be a catalyst for OSS"
                href="https://x.com/MarcLaventure/status/1773751085792174246"
            />
        </motion.div>
        <motion.div
            v-bind="flyIn(0.3)"
            class="hidden lg:block absolute w-[333px] top-[562px] left-[calc(50%-53.5rem)]"
        >
            <Tweet
                id="Meabed"
                user="meabed"
                image="/tweets/meabed.webp"
                content="I am building something with Bun + ElysiaJS and the speed and ergonomics are way out of this world!!!!

    I can't go back to express + node... Bun Hot reload an HTTP server and test runner is instantaneous!!!

    Elysia is a breath of fresh air + inferred types + openapi + plugins + file handling + ai sdk + typed client....

    The dev experience is 100x - if you try you won't ever go back!!"
                href="https://x.com/meabed/status/1991531982933631247"
            />
        </motion.div>
        <motion.div
            v-bind="flyIn(0.2)"
            class="hidden lg:block absolute w-[333px] top-[160px] right-[calc(50%-53.5rem)]"
        >
            <Tweet
                id="haxiom_io"
                user="haxiom.io"
                image="/tweets/haxiom.webp"
                content="One diff ElysiaJS made in our org is that it makes it easy to refactor fearlessly. You can be pretty certain if things won't work simply because TypeScript will tell you that your types don't match"
                href="https://x.com/haxiom_io/status/1989357386398900670"
            />
        </motion.div>
        <motion.div
            v-bind="flyIn(0.3)"
            class="hidden lg:block absolute w-[333px] top-[386px] right-[calc(50%-53.5rem)]"
        >
            <Tweet
                id="stacia__x"
                user="ꜱᴛᴀᴄɪᴀ"
                image="/tweets/stacia.webp"
                content="ElysiaJS was the first framework that truly sparked my interest in JS/TS. I used to avoid it entirely.
I usually stick to Python, mostly using FastAPI.

When I tried ElysiaJS for the first time (v1.1), I immediately felt it provides an amazing dev experience.

Love ElysiaJS 😘"
                href="https://x.com/stacia__x/status/1990837540220465536"
            />
        </motion.div>
        <motion.div
            v-bind="flyIn(0.4)"
            class="hidden lg:block absolute w-[333px] top-[756px] right-[calc(50%-53.5rem)]"
        >
            <Tweet
                id="Rasmic"
                user="Micky"
                image="/tweets/rasmic.webp"
                content="I’m ngl we don’t talk about @elysiaJS enough"
                href="https://x.com/Rasmic/status/1964897923046703399"
            />
        </motion.div>
    </article>
</template>

<script setup lang="ts">
import Tweet from './tweet.vue'

import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
</script>

<style>
@reference "../../tailwind.css";

#people-tweets {
    @apply flex flex-col w-full my-8 mx-auto;
}
</style>
