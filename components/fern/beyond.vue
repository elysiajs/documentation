<template>
    <section id="beyond" class="fern-gap">
        <article id="opentelemetry">
            <section @mousemove="move">
                <div
                    class="pointer"
                    style="width: 1.5px; height: 100%; top: 0%"
                    :style="{ left: `${left}%` }"
                >
                    <p
                        class="absolute top-12 pl-2 text-xs font-semibold font-mono text-sky-500"
                        :style="{ left: left > 80 ? '-4rem' : '0' }"
                    >
                        {{ (left / 4).toFixed(2) }}ms
                    </p>
                </div>
                <p
                    class="absolute z-10 top-2 right-2 text-xs border px-2 py-1 rounded-full bg-gray-50/40 backdrop-blur-sm pointer-events-none"
                >
                    POST /character/:id/chat
                </p>
                <p
                    class="absolute z-10 bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-blue-500 text-white font-semibold backdrop-blur-sm pointer-events-none"
                >
                    Playback
                </p>
                <div style="width: 4rem" class="bg-teal-400 text-teal-400">
                    <span>Request</span>
                </div>
                <div
                    style="width: 4rem; margin-left: 4rem"
                    class="bg-teal-400 text-teal-400"
                >
                    <span>Validation</span>
                </div>
                <div
                    style="width: 2rem; margin-left: 6rem"
                    class="bg-teal-400"
                />
                <div
                    style="width: 2rem; margin-left: 8rem"
                    class="bg-cyan-400"
                />
                <div
                    style="width: 5rem; margin-left: 10rem"
                    class="bg-sky-400 text-sky-400"
                >
                    <span>Transaction</span>
                </div>
                <div
                    style="width: 3rem; margin-left: 12rem"
                    class="bg-sky-400"
                />
                <div
                    style="width: 5rem; margin-left: 15rem"
                    class="bg-blue-400 text-blue-400"
                >
                    <span>Upload</span>
                </div>
                <div
                    style="width: 3rem; margin-left: 17rem"
                    class="bg-blue-400"
                />
                <div
                    style="width: 4rem; margin-left: 20rem"
                    class="bg-indigo-400 text-indigo-400"
                >
                    <span>Sync</span>
                </div>
                <div
                    style="width: 4rem; margin-left: 24rem"
                    class="bg-indigo-400"
                />
                <div
                    style="width: 2rem; margin-left: 26rem"
                    class="bg-indigo-400"
                />
                <div
                    style="width: 1rem; margin-left: 27rem"
                    class="bg-purple-400"
                />
            </section>
            <header>
                <h5>
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
                        class="transform scale-90"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                    For DevOps
                </h5>
                <h2 class="text-gradient from-sky-400 to-violet-400">
                    OpenTelemetry
                </h2>
                <p>
                    Elysia has 1st party support for OpenTelemetry.
                    Instrumentation is built-in, so you can easily monitor your
                    services on regardless of the platform.
                </p>
            </header>
        </article>
        <article id="e2e-type-safety">
            <section>
                <slot />
            </section>
            <header>
                <h5>
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
                        class="transform scale-90"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                    </svg>
                    For Frontend
                </h5>
                <h2 class="text-gradient from-purple-400 to-rose-400">
                    End-to-end Type Safety
                </h2>
                <p>
                    Like tRPC, Elysia provide type-safety from the backend to
                    the frontend without code generation. Interaction between
                    frontend and backend is type-checked at compile time.
                </p>
            </header>
        </article>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const left = ref(47.5)

function move(event: MouseEvent) {
    const element = event.srcElement as HTMLElement
    const rect = element.getBoundingClientRect()
    const mouseX = event.clientX - rect.left

    const _left = (mouseX / rect.width) * 100

    left.value = _left
}
</script>

<style>
#beyond {
    @apply flex flex-col md:flex-row justify-between items-start w-full max-w-5xl mx-auto my-8 gap-2;

    & > article {
        @apply flex flex-col w-full p-2 rounded-2xl overflow-hidden;

        & > header {
            @apply flex flex-col w-full;

            & > h2 {
                @apply text-3xl font-semibold mb-4 font-sans;
            }

            & > p {
                @apply leading-relaxed;
            }

            & > h5 {
                @apply flex items-center text-sm font-semibold text-gray-400 mt-5 mb-2 gap-0.5;

                & > svg {
                    transform: scale(0.6);
                }
            }
        }

        & > section {
            @apply max-w-full w-full h-full;
            aspect-ratio: 16 / 9;
        }
    }
}

#opentelemetry {
    & > section {
        @apply relative flex flex-col justify-center gap-1.5 bg-gray-50 rounded-3xl border overflow-hidden;

        background-image: linear-gradient(to right, #ddd 1px, transparent 1px);
        background-size: 6rem 6em;
        background-position: 2rem;

        & > .pointer {
            @apply absolute top-0 flex flex-col bg-sky-400 justify-center gap-1.5;
            will-move: left;
            /* transition: left 0.1s cubic-bezier(0.16, 1, 0.3, 1); */
        }

        & > div {
            @apply relative h-3.5 rounded-xl hover:bg-blue-500 shadow transition-colors pointer-events-none;

            & > span {
                @apply absolute text-xs -translate-y-0.5 font-mono font-semibold;
                left: calc(100% + 0.25rem);
            }
        }
    }
}

#e2e-type-safety {
    & > section {
        @apply rounded-xl border border-y-violet-200 border-x-blue-200 overflow-hidden;

        background-color: rgba(255, 255, 255, 1);
        background-image: radial-gradient(
                closest-side at center,
                rgba(255, 255, 255, 1) 70%,
                transparent 150%
            ),
            radial-gradient(
                closest-side at center,
                rgba(255, 255, 255, 1) 90%,
                transparent 150%
            ),
            radial-gradient(
                at 9% 67%,
                hsla(223, 100%, 65%, 0.14) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 22% 0%,
                hsla(210, 100%, 69%, 0.29) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 97% 49%,
                hsla(240, 100%, 87%, 0.35) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 100% 75%,
                hsla(280, 100%, 75%, 0.26) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 75% 100%,
                hsla(22, 100%, 77%, 0.19) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 40% 100%,
                hsla(240, 100%, 70%, 0.15) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 72% 0%,
                hsla(343, 100%, 76%, 0.17) 0px,
                transparent 50%
            );

        & > div {
            @apply !bg-transparent rounded-xl;

            & > pre {
            	@apply !p-3 lg:!p-4;
            }
        }
    }
}
</style>
