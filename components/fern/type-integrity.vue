<template>
    <article id="type-integrity">
        <div
            class="relative z-10 flex justify-between items-end w-full mb-7"
        >
            <h1
                class="flex flex-col flex-1 text-4xl text-center text-gray-600 font-medium leading-[4rem]"
            >
            	The Next Level of
                <span
                    class="leading-[5rem] text-7xl font-semibold text-gradient from-cyan-400 to-indigo-400 -translate-y-1"
                >
                    Type Safety
                </span>
            </h1>
        </div>
        <!-- <div class="grid">
            <div class="fog" />
        </div> -->
        <section class="showcase">
            <div class="window">
                <div class="control">
                    <div />
                    <div />
                    <div />
                </div>
                <slot v-if="form == 1" name="type-1" />
                <slot v-else-if="form == 2" name="type-2" />
                <slot v-else-if="form == 3" name="type-3" />
                <slot v-else-if="form == 4" name="type-4" />
            </div>
        </section>
        <section class="selector">
            <form>
                <div>
                    <input
                        name="type-integrity"
                        id="type-integrity-1"
                        type="radio"
                        value="1"
                        v-model.number="form"
                    />
                    <label for="type-integrity-1">Type Inference</label>
                </div>
                <div>
                    <input
                        name="type-integrity"
                        id="type-integrity-2"
                        type="radio"
                        value="2"
                        v-model.number="form"
                    />
                    <label for="type-integrity-2">Enforce Type</label>
                </div>
                <div>
                    <input
                        name="type-integrity"
                        id="type-integrity-3"
                        type="radio"
                        value="3"
                        v-model.number="form"
                    />
                    <label for="type-integrity-3">Return Type</label>
                </div>
                <div>
                    <input
                        name="type-integrity"
                        id="type-integrity-4"
                        type="radio"
                        value="4"
                        v-model.number="form"
                    />
                    <label for="type-integrity-4">Bring your own</label>
                </div>
            </form>
        </section>
    </article>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const form = ref(1)
</script>

<style>
#type-integrity {
    @apply relative max-w-5xl w-full mx-auto mt-8 mb-12;

    & > .showcase {
        @apply flex flex-col justify-center relative mx-auto w-full h-[38rem] lg:rounded-xl my-4 px-4 bg-center bg-no-repeat;

        background-image: url(/assets/sequoia.webp);
        background-size: cover;

        & > .window {
            @apply lg:max-w-3xl w-full mx-auto !bg-white/80 border-2 rounded-xl overflow-auto backdrop-blur-lg shadow-xl;

            & > .control {
                @apply flex gap-2 pt-3 px-3;

                & > div {
                    @apply rounded-full bg-gray-400 border;
                    width: 0.825rem;
                    height: 0.825rem;

                    &:nth-child(1) {
                        background-color: rgba(237, 106, 94);
                        border: 1px solid rgba(195, 75, 70);
                    }

                    &:nth-child(2) {
                        background-color: rgba(245, 191, 79);
                        border: 1px solid rgba(203, 156, 78);
                    }

                    &:nth-child(3) {
                        background-color: rgba(101, 192, 93);
                        border: 1px solid rgba(82, 162, 74);
                    }
                }
            }

            & > div {
                @apply !bg-transparent;

                & > pre {
                    @apply !p-3;
                }
            }
        }
    }

    & > .grid {
        @apply absolute top-0 left-0 w-full h-full pointer-events-none transform scale-125 translate-y-14;

        background-color: hsla(205, 100%, 80%, 0);
        background-image: radial-gradient(
                at 18% 31%,
                hsla(75, 99%, 72%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 63% 41%,
                hsla(168, 73%, 62%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 78% 28%,
                hsla(240, 86%, 74%, 0.28) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 86% 68%,
                hsla(189, 73%, 76%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 39% 44%,
                hsla(114, 61%, 63%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 15% 83%,
                hsla(151, 99%, 75%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 48% 64%,
                hsla(180, 67%, 65%, 1) 0px,
                transparent 50%
            );

        & > .fog {
            @apply w-full h-full;
            background-image: radial-gradient(
                closest-side at center,
                transparent 0%,
                rgba(255, 255, 255, 1) 90%
            );
        }
    }

    & > .selector {
        @apply absolute z-10 flex justify-center items-center w-full md:min-h-12 -translate-y-16 md:-translate-y-10;

        & > form {
            @apply grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-1 h-full px-1 py-1 mx-auto bg-white/75 backdrop-blur-lg rounded-3xl border;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.075);

            & > div {
                @apply flex justify-center items-center min-h-10 h-full px-4 font-medium text-gray-500 rounded-full hover:bg-gray-400/15 has-[:checked]:bg-gray-400/20 transition-colors ease-out duration-200 cursor-pointer;

                & > input[type='radio'] {
                    @apply appearance-none;
                }

                & > label {
                	@apply cursor-pointer;
                }
            }
        }
    }
}
</style>
