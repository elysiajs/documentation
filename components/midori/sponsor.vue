<template>
    <section class="flex flex-col w-full max-w-6xl mx-auto mt-16">
        <h2
            class="text-5xl leading-tight text-center font-bold text-gray-400 mb-4 bg-clip-text text-transparent bg-gradient-to-tl from-fuchsia-500 to-blue-500"
        >
            Made possible by you
        </h2>
        <p
            class="text-lg md:text-xl leading-loose text-gray-400 text-center w-full max-w-2xl mx-auto leading"
        >
            Elysia is
            <b class="text-gray-500">not backed by any organization</b>
            <br />
            Made possible by the support of the community and
            <span class="text-pink-400 font-medium underline">you</span>
        </p>
        <ul id="sponsors" v-if="sponsors.length > 0" class="my-8">
            <li v-for="sponsor in sponsors" :key="sponsor.sponsorEntity.login">
                <a
                    :href="`https://github.com/${sponsor.sponsorEntity.login}`"
                    target="_blank"
                    class="flex flex-col justify-center items-center text-center hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 px-2 py-4 rounded-xl transition-colors"
                >
                    <div
                        class="w-16 h-16 rounded-full bg-gray-100 overflow-hidden mask mask-hexagon mb-3"
                    >
                        <img
                            v-if="sponsor.sponsorEntity.avatarUrl"
                            :src="sponsor.sponsorEntity.avatarUrl"
                            alt="Sponsor avatar"
                            class="w-16 h-16 rounded-full object-cover object-center mask mask-hexagon"
                            loading="lazy"
                        />
                    </div>
                    <p className="text-sm ">
                        {{
                            sponsor.sponsorEntity.name ??
                            sponsor.sponsorEntity.login ??
                            '[Private]'
                        }}
                    </p>
                    <p
                        v-if="sponsor.tier.monthlyPriceInDollars"
                        class="text-3xl text-gray-400 bg-clip-text text-transparent bg-gradient-to-tl font-medium from-fuchsia-500 to-blue-500 mt-3 mb-1"
                    >
                        ${{ sponsor.tier.monthlyPriceInDollars }}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 my-0">
                        {{
                            dayjs()
                                .from(dayjs(sponsor.createdAt))
                                .replace('in', 'for')
                        }}
                    </p>
                </a>
            </li>
            <li>
                <a
                    href="https://github.com/sponsors/saltyaom"
                    class="flex flex-col justify-center items-center text-center hover:bg-pink-100/50 focus:bg-pink-100/50 dark:hover:bg-pink-500/30 dark:focus:bg-pink-500/30 px-2 py-4 rounded-xl transition-colors"
                >
                    <div
                        class="flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 dark:bg-pink-400/30 overflow-hidden mask mask-hexagon mb-2 text-pink-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-heart"
                        >
                            <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-pink-400 mb-2">
                        And you
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Become sponsor</p>
                </a>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// @ts-ignore
import { data, type Sponsor } from './sponsor.data.ts'

console.log({
    data
})

const sponsors: Sponsor[] = data
</script>

<style>
#sponsors {
    @apply grid gap-2 grid-cols-3;
}

@screen sm {
    #sponsors {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    }
}
</style>
