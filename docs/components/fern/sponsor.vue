<template>
    <section
        class="flex flex-col w-full max-w-5xl mx-auto mt-4 fern-gap"
        ref="scope"
    >
        <motion.h2
            class="text-5xl lg:text-6xl !leading-[4rem] sm:text-center font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-tl from-rose-400 to-fuchsia-400"
            v-bind="flyIn()"
        >
            Made possible by you
        </motion.h2>
        <p
            class="flex flex-col text-lg md:text-xl !leading-[2rem] sm:text-center w-full max-w-2xl mx-auto mb-8 dark:text-gray-400 dark:font-medium"
        >
            <motion.span class="inline-block" v-bind="flyIn(0.1)">
                Elysia is
                <span class="text-gray-700 dark:text-gray-200 font-medium">
                    not owned by an organization </span
                >, driven by volunteer, and community.
            </motion.span>
            <motion.span class="inline-block mt-2" v-bind="flyIn(0.2)">
                Elysia is possible by these awesome sponsors.
            </motion.span>
        </p>

        <section v-if="goldSponsors.length">
            <header class="mt-4 text-center" v-bind="flyIn(0.3)">
                <motion.h4
                    class="text-4xl text-center font-semibold text-gradient from-sky-500 to-violet-500"
                    v-bind="flyIn(0.4)"
                >
                    Gold Sponsors <span class="text-pink-400 ml-0.5">💖</span>
                </motion.h4>
            </header>
            <motion.ul id="sponsors-fern-gold" class="my-4" v-bind="flyIn(0.5)">
                <li
                    v-for="sponsor in goldSponsors"
                    :key="sponsor.sponsorEntity.login"
                >
                    <a
                        :href="
                            // @ts-ignore
                            sponsorOverride.href[sponsor.sponsorEntity.login] ??
                            `https://github.com/${sponsor.sponsorEntity.login}`
                        "
                        target="_blank"
                        class="sponsor"
                    >
                        <div>
                            <img
                                v-if="sponsor.sponsorEntity.avatarUrl"
                                :src="sponsor.sponsorEntity.avatarUrl"
                                alt="Sponsor avatar"
                                loading="lazy"
                            />
                        </div>
                        <section>
                            <h5>
                                {{
                                    sponsor.sponsorEntity.name ??
                                    sponsor.sponsorEntity.login ??
                                    '[Private]'
                                }}
                            </h5>
                            <p>
                                {{ sponsor.duration }}
                            </p>
                        </section>
                    </a>
                </li>
            </motion.ul>
        </section>

        <section v-if="silverSponsors.length">
            <header class="mt-4 text-center">
                <motion.h4
                    class="text-3xl text-center font-semibold text-gradient from-violet-500 to-sky-400"
                    v-bind="flyIn(0.5)"
                >
                    Silver Sponsors <span class="text-pink-400 ml-0.5">💞</span>
                </motion.h4>
            </header>

            <motion.ul
                id="sponsors-fern-silver"
                v-if="sponsors.length > 0"
                class="my-4"
                v-bind="flyIn(0.6)"
            >
                <li
                    v-for="sponsor in silverSponsors"
                    :key="sponsor.sponsorEntity.login"
                >
                    <a
                        :href="`https://github.com/${sponsor.sponsorEntity.login}`"
                        target="_blank"
                        class="sponsor"
                    >
                        <div>
                            <img
                                v-if="sponsor.sponsorEntity.avatarUrl"
                                :src="sponsor.sponsorEntity.avatarUrl"
                                alt="Sponsor avatar"
                                loading="lazy"
                            />
                        </div>
                        <section>
                            <h6>
                                {{
                                    sponsor.sponsorEntity.name ??
                                    sponsor.sponsorEntity.login ??
                                    '[Private]'
                                }}
                            </h6>
                            <p>
                                {{ sponsor.duration }}
                            </p>
                        </section>
                    </a>
                </li>
            </motion.ul>
        </section>

        <section v-if="individualSponsors.length">
            <header class="mt-6 text-center">
                <motion.h4
                    class="text-2xl text-center font-semibold text-gradient from-rose-400 to-pink-400"
                    v-bind="flyIn(0.7)"
                >
                    Individual Sponsors
                    <span class="text-pink-400 ml-0.5">💕</span>
                </motion.h4>
            </header>

            <motion.ul
                id="sponsors-fern"
                v-if="individualSponsors.length > 0"
                class="my-4"
                v-bind="flyIn(0.8)"
            >
                <li
                    v-for="sponsor in individualSponsors"
                    :key="sponsor.sponsorEntity.login"
                >
                    <a
                        :href="`https://github.com/${sponsor.sponsorEntity.login}`"
                        target="_blank"
                        class="sponsor"
                    >
                        <div>
                            <img
                                v-if="sponsor.sponsorEntity.avatarUrl"
                                :src="sponsor.sponsorEntity.avatarUrl"
                                alt="Sponsor avatar"
                                loading="lazy"
                            />
                        </div>
                        <p>
                            {{
                                sponsor.sponsorEntity.name ??
                                sponsor.sponsorEntity.login ??
                                '[Private]'
                            }}
                        </p>
                        <p>
                            {{ sponsor.duration }}
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
            </motion.ul>
        </section>

        <p class="inline-block text-center mb-4">
            Thank you for making Elysia possible
        </p>

        <p class="inline-block text-center">
            We can only develop Elysia full-time thanks to your supports.
        </p>

        <div class="flex sm:justify-center my-8">
            <a
                id="become-sponsor"
                class="inline-flex items-center text-white font-semibold bg-gradient-to-br from-rose-400 to-pink-400 rounded-full px-6 py-3 box-shadow shadow-pink-400/40 shadow-lg transition-transform transform hover:scale-110 focus:scale-110"
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

        <p
            class="sm:text-center text-gradient from-pink-400 to-fuchsia-400 font-semibold text-base"
        >
            With love from our community
        </p>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

import { data, type Sponsor } from './sponsor.data'
import { sponsorOverride } from './sponsor.constant'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)

const sponsors: Sponsor[] = data

const goldSponsors = sponsors.filter(
    (sponsor) => sponsor.tier.monthlyPriceInDollars >= 200
)
const silverSponsors = sponsors.filter(
    (sponsor) =>
        sponsor.tier.monthlyPriceInDollars >= 75 &&
        sponsor.tier.monthlyPriceInDollars < 200
)
const individualSponsors = sponsors.filter(
    (sponsor) => sponsor.tier.monthlyPriceInDollars < 75
)
</script>

<style>
@reference "../../tailwind.css";

#sponsors-fern {
    @apply grid gap-0.5 grid-cols-3;

    & > li > .sponsor {
        @apply flex flex-col justify-center items-center text-xs text-center hover:bg-pink-500/10 focus:bg-pink-500/10 dark:hover:bg-pink-500/25 dark:focus:bg-pink-500/25 px-0.5 py-4 rounded-xl transition-colors text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400;

        & > div {
            @apply w-16 h-16 bg-gray-100 overflow-hidden rounded-full mb-3;

            & > img {
                @apply w-16 h-16 rounded-full object-cover object-center;
            }
        }

        & > p {
            @apply my-0;
        }
    }
}

#sponsors-fern-gold {
    @apply grid gap-2 grid-cols-1;

    & > li > .sponsor {
        @apply flex justify-start items-center gap-3 text-xs text-center py-2;

        & > div {
            @apply min-w-21 min-h-21 overflow-hidden rounded-full;

            & > img {
                @apply w-21 h-21 !rounded-sm object-cover object-center;
            }
        }

        & > section {
            @apply flex flex-col gap-1;
            zoom: 0.9;

            & > h5 {
                @apply text-left text-xl font-medium m-0;
            }

            & > p {
                @apply text-left my-0;
            }
        }
    }
}

#sponsors-fern-silver {
    @apply grid gap-2 grid-cols-1;

    & > li > .sponsor {
        @apply flex justify-center items-center gap-3 text-xs text-center py-2;

        & > div {
            @apply min-w-16 min-h-16 bg-gray-100 overflow-hidden rounded-full;

            & > img {
                @apply w-16 h-16 rounded-full object-cover object-center;
            }
        }

        & > section {
            @apply flex flex-col;

            & > h6 {
                @apply text-left text-lg font-medium m-0;
            }

            & > p {
                @apply text-left my-0;
            }
        }
    }
}

#become-sponsor {
    transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

/* equivalent to md screen */
@media (min-width: 40rem) {
    #sponsors-fern {
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)) !important;
    }

    #sponsors-fern-gold {
        grid-template-columns: repeat(
            auto-fit,
            minmax(224px, 288px)
        ) !important;
        justify-content: center;
    }

    #sponsors-fern-silver {
        grid-template-columns: repeat(
            auto-fit,
            minmax(192px, 224px)
        ) !important;
        justify-content: center;
    }
}
</style>
