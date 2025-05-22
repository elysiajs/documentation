<template>
    <article id="people-tweets" class="fern-gap" ref="scope">
        <motion.h2
            class="sm:text-center text-4xl font-semibold text-gray-700 dark:text-gray-300 leading-[3rem]"
            v-bind="flyIn()"
        >
            Powered by
            <span class="text-gradient from-rose-400 to-orange-400">
                love
            </span>
            <br />from the
            <span class="text-gradient from-rose-400 to-amber-400">
                community
            </span>
        </motion.h2>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-12 pb-8">
            <motion.div
                class="flex flex-col gap-3 lg:mt-12"
                v-bind="flyIn(0.1)"
            >
                <Tweet
                    id="AqueelMiq"
                    user="Aqueel"
                    image="/tweets/aqueel.webp"
                    content="Jetfuel on bun at X! @shlomiatar who built the framework has an eye for picking the right tools for the job."
                    href="https://x.com/AqueelMiq/status/1822380943279296832"
                />
                <Tweet
                    id="shlomiatar"
                    user="Shlomi Atar"
                    image="/tweets/shlomi.webp"
                    content="also a shoutout to @saltyAom and the phenomenal Elysia js that is powering our server driven UI. Incredible work."
                    href="https://x.com/shlomiatar/status/1822381556142362734"
                />
                <Tweet
                    id="htmx_org"
                    user="htmx.org"
                    image="/tweets/htmx.webp"
                    content="htmx works great w/ @bunjavascript, @elysiaJS and @tursodatabase btw"
                    href="https://x.com/htmx_org/status/1792949584769224897"
                />
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
            <motion.div class="flex flex-col gap-3" v-bind="flyIn(0.1)">
                <Tweet
                    id="jarredsumner"
                    user="Jarred Sumner"
                    image="/tweets/jarred.webp"
                    content="You can use Express with Bun, but often we see people using Elysia, Hono, or Bun.serve() directly."
                    href="https://x.com/jarredsumner/status/1781132294692233609"
                />
                <Tweet
                    id="runyasak"
                    user="Runyasak Ch. 💚"
                    image="/tweets/runyasak.webp"
                    content="Started using @elysiaJS to create a Discord Bot and found the type system beautifully easy. DX is fantastic and coding is fun!

Use @DrizzleORM with PostgreSQL. So much easier than I've used before.

ElysiaJS has proved to me that great performance and DX can live together. 😎"
                    href="https://x.com/runyasak/status/1797618641648968117"
                />
                <Tweet
                    id="hd_nvim"
                    user="Herrington Darkholme"
                    image="/tweets/herrington.webp"
                    content="Was introduced to @elysiaJS today and it looks pretty solid. end-to-end type safety/guard/swapper are killer features of the modern web! (and it's fast)"
                    href="https://x.com/hd_nvim/status/1735182378036027650"
                />
                <Tweet
                    id="scalar"
                    user="scalar.com"
                    image="/tweets/scalar.webp"
                    content="so excited to be part of the amazing @elysiaJS community!"
                    href="https://x.com/scalar/status/1744024831014920403"
                />
            </motion.div>
            <motion.div class="flex flex-col gap-3 lg:mt-6" v-bind="flyIn(0.3)">
                <Tweet
                    id="josedonato__"
                    user="José Donato 🦋"
                    image="/tweets/josedonato.webp"
                    content="handling tables with ~350k rows like it's nothing.

Working on allowing @ag_grid server side row model when connecting a custom backend to @openbb_finance Terminal Pro.

Backend in @elysiaJS + @bunjsproject."
                    href="https://x.com/josedonato__/status/1815706393367703890"
                />
                <Tweet
                    id="pilcrow"
                    user="pilcrowonpaper"
                    image="/tweets/pilcrow.webp"
                    content="Just in time for Bun 1.0 - Lucia 2.5 now supports @elysiajs out of the box!! You can also use Bun.serve() directly as well. This release also comes with 2 new OAuth providers, Strava and AWS Cognito!"
                    href="https://x.com/pilcrowonpaper/status/1699766618665181308"
                />
                <Tweet
                    id="MikroORM"
                    user="MikroORM"
                    image="/tweets/mikroorm.webp"
                    content="I've been playing a bit with @bunjavascript and @elysiaJS, need to do a few more tweaks before the release, but next version should work more natively with bun when it comes to TS support detection, e.g. the CLI works without ts-node installed."
                    href="https://x.com/MikroORM/status/1821993062114967711"
                />
            </motion.div>
        </section>
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
    margin: '0px 0px -50% 0px',
})
const flyIn = useFlyIn(isInView)
</script>

<style>
@reference "../../tailwind.css";

#people-tweets {
    @apply flex flex-col max-w-5xl w-full my-8 mx-auto;
}
</style>
