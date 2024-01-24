<template>
    <section class="flex flex-col w-full max-w-6xl mx-auto mt-16">
        <h2
            class="mb-4 text-5xl font-bold leading-tight text-center text-transparent text-gray-400 bg-clip-text bg-gradient-to-tl from-fuchsia-500 to-blue-500"
        >
            Made possible by you
        </h2>
        <p
            class="w-full max-w-2xl mx-auto text-lg leading-loose text-center text-gray-400 md:text-xl leading"
        >
            Elysia is
            <b class="text-gray-500">not backed by any organization</b>
            <br />
            Made possible by the support of the community and
            <span class="font-medium text-pink-400 underline">you</span>
        </p>
        <ul id="sponsors" v-if="sponsors.length > 0" class="my-8">
            <li v-for="sponsor in sponsors" :key="sponsor.sponsorEntity.login">
                <a
                    :href="`https://github.com/${sponsor.sponsorEntity.login}`"
                    target="_blank"
                    class="flex flex-col items-center justify-center px-2 py-4 text-center transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 rounded-xl"
                >
                    <div
                        class="w-16 h-16 mb-3 overflow-hidden bg-gray-100 rounded-full mask mask-hexagon"
                    >
                        <img
                            v-if="sponsor.sponsorEntity.avatarUrl"
                            :src="sponsor.sponsorEntity.avatarUrl"
                            alt="Sponsor avatar"
                            class="object-cover object-center w-16 h-16 rounded-full mask mask-hexagon"
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
                        class="mt-3 mb-1 text-3xl font-medium text-transparent text-gray-400 bg-clip-text bg-gradient-to-tl from-fuchsia-500 to-blue-500"
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
                    class="flex flex-col items-center justify-center px-2 py-4 text-center transition-colors hover:bg-pink-100/50 focus:bg-pink-100/50 dark:hover:bg-pink-500/30 dark:focus:bg-pink-500/30 rounded-xl"
                >
                    <div
                        class="flex items-center justify-center mb-2 overflow-hidden text-pink-500 bg-pink-100 rounded-full w-14 h-14 sm:w-16 sm:h-16 dark:bg-pink-400/30 mask mask-hexagon"
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

import { data, type Sponsor } from './sponsor.data'

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
