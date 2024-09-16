<template>
    <section class="flex flex-col w-full max-w-5xl mx-auto mt-4 fern-gap">
        <h2
            class="text-5xl lg:text-6xl !leading-[4rem] sm:text-center font-bold text-gray-400 mb-4 bg-clip-text text-transparent bg-gradient-to-tl from-rose-400 to-fuchsia-400"
        >
            Made possible by you
        </h2>
        <p class="text-lg md:text-xl !leading-[2rem] sm:text-center w-full max-w-2xl mx-auto dark:text-gray-400 dark:font-medium">
            Elysia is
            <span class="text-gray-700 dark:text-gray-200 font-medium"
                >not own by an organization</span
            >
            but is driven by the community.
            <br>
            Elysia development is only possible thanks to your support
        </p>
        <div class="flex sm:justify-center my-8">
            <a
            	id="become-sponsor"
                class="inline-flex items-center text-white font-semibold bg-gradient-to-br from-rose-400 to-pink-400 rounded-full px-6 py-3 box-shadow shadow-pink-400/40 shadow-lg transition-transform transform hover:scale-110 focus;scale-110"
                href="https://github.com/sponsors/saltyaom"
                target="_blank"
            >
                Become a sponsor

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transform scale-75 translate-x-1.5"
                >
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                </svg>
            </a>
        </div>
        <p class="sm:text-center text-gradient from-pink-400 to-fuchsia-400 font-semibold text-base">Thanks you for making Elysia possible</p>
        <ul id="sponsors-fern" v-if="sponsors.length > 0" class="my-4">
            <li v-for="sponsor in sponsors" :key="sponsor.sponsorEntity.login">
                <a
                    :href="`https://github.com/${sponsor.sponsorEntity.login}`"
                    target="_blank"
                    class="flex flex-col justify-center items-center text-center hover:bg-pink-100 focus:bg-pink-100 dark:hover:bg-pink-500/30 dark:focus:bg-pink-500/30 px-0.5 py-4 rounded-xl transition-colors text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
                >
                    <div
                        class="w-16 h-16 bg-gray-100 overflow-hidden rounded-full mb-3"
                    >
                        <img
                            v-if="sponsor.sponsorEntity.avatarUrl"
                            :src="sponsor.sponsorEntity.avatarUrl"
                            alt="Sponsor avatar"
                            class="w-16 h-16 rounded-full object-cover object-center"
                            loading="lazy"
                        />
                    </div>
                    <p className="text-xs sponsor-name">
                        {{
                            sponsor.sponsorEntity.name ??
                            sponsor.sponsorEntity.login ??
                            '[Private]'
                        }}
                    </p>
                    <!-- <p
                        v-if="sponsor.tier.monthlyPriceInDollars"
                        class="text-3xl text-gray-400 bg-clip-text text-transparent bg-gradient-to-tl font-medium from-fuchsia-500 to-blue-500 mt-3 mb-1"
                    >
                        ${{ sponsor.tier.monthlyPriceInDollars }}
                    </p> -->
                    <p className="text-xs my-0">
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
                    class="flex flex-col justify-center items-center text-center hover:bg-pink-100/50 focus:bg-pink-100/50 dark:hover:bg-pink-500/30 dark:focus:bg-pink-500/30 px-2 py-4 rounded-xl transition-colors"
                    href="https://github.com/sponsors/saltyaom"
                    target="_blank"
                >
                    <div
                        class="flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 dark:bg-pink-400/30 overflow-hidden rounded-full mb-2 text-pink-500"
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
                        >
                            <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-pink-400 mb-2">
                        And you
                    </p>
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
#sponsors-fern {
    @apply grid gap-0.5 grid-cols-3;
}

#become-sponsor {
	transition: transform .35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

@screen sm {
    #sponsors-fern {
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    }
}
</style>
