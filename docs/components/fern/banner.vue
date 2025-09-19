<template>
    <header
        class="group relative isolate flex flex-col md:flex-row gap-8 w-full items-center max-w-5xl mx-auto px-4 py-6 md:p-12 md:pr-8 bg-neutral-50 border border-neutral-200 border-x-0 md:border-x md:rounded-[2.5rem] overflow-hidden"
        :class="props.class"
    >
    	<Ray class="-top-36 h-full opacity-50 pointer-none" />
        <div
            class="absolute -top-28 md:top-auto md:translate-y-44 -left-76 sm:-left-66 md:-left-26 aspect-square size-192 bg-neutral-500 opacity-4 border border-neutral-900 rounded-full pointer-none"
        />
        <div
            class="absolute -top-44 md:top-auto md:translate-y-44 -left-76 sm:-left-66 md:-left-26 aspect-square size-216 bg-neutral-500 opacity-4 border border-neutral-900 rounded-full pointer-none"
        />
        <div
            class="absolute -top-60 md:top-auto md:translate-y-44 -left-76 sm:-left-66 md:-left-26 aspect-square size-240 bg-neutral-500 opacity-4 border border-neutral-900 rounded-full pointer-none"
        />
        <img
            class="absolute -top-24 md:top-auto md:translate-y-32 -left-76 sm:-left-66 md:-left-26 aspect-square min-w-168 min-h-168 size-168 opacity-6 pointer-none"
            src="/assets/elysia.svg"
            alt="Elysia Logo"
        />
        <div class="flex items-center gap-6 z-10">
            <img
                class="aspect-square size-24 md:-translate-y-2"
                src="/assets/elysia.svg"
                alt="Elysia Logo"
            />
            <section class="flex flex-col gap-2.5 pt-4">
                <h3 class="text-7xl text-black font-semibold">Elysia</h3>
                <h4 class="text-sm text-neutral-500/70">
                    Ergonomic Framework for Humans
                </h4>
            </section>
        </div>
        <div
            class="z-10 grid grid-cols-2 gap-3 sm:gap-x-12 md:gap-x-8 gap-y-6 md:ml-auto"
        >
            <div class="flex items-center gap-3">
                <Rocket
                    class="size-8 md:size-10.5 text-neutral-700"
                    stroke-width="1"
                />
                <div class="flex flex-col">
                    <h5 class="text-xs text-neutral-500/70">Speed</h5>
                    <p class="text-black text-base md:text-lg font-medium">
                        Top Performance
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <Shield
                    class="size-8 md:size-10.5 text-neutral-700"
                    stroke-width="1"
                />
                <div class="flex flex-col">
                    <h5 class="text-xs text-neutral-500/70">Type Safety</h5>
                    <p class="text-black text-base md:text-lg font-medium">
                        Best in class
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <Code
                    class="size-8 md:size-10.5 text-neutral-700"
                    stroke-width="1"
                />
                <div class="flex flex-col">
                    <h5 class="text-xs text-neutral-500/70">
                        Developer Experience
                    </h5>
                    <p class="text-black text-base md:text-lg font-medium">
                        Exceptional
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <Pen
                    class="size-8 md:size-10.5 text-neutral-700"
                    stroke-width="1"
                />
                <div class="flex flex-col">
                    <h5 class="text-xs text-neutral-500/70">OpenAPI Support</h5>
                    <p class="text-black text-base md:text-lg font-medium">
                        One of a kind
                    </p>
                </div>
            </div>
        </div>

        <aside
            class="md:absolute z-10 -right-50 group-hover:right-0 ease-out-expo duration-350 transition-all h-full"
        >
            <div id="elysia-banner" class="hidden md:block">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div
                class="flex flex-col justify-center items-end h-full p-4 md:pl-24 md:p-8 gap-2"
            >
                <a
                    href="/at-glance"
                    class="group/button relative z-20 flex items-center gap-1 text-lg text-white font-medium bg-neutral-950 pl-6 pr-4 py-2 rounded-full hover:scale-105 transition-transform ease-out-expo duration-350"
                >
                    Get Started
                    <ChevronRight
                        class="size-6 group-hover/button:translate-x-0.75 transition-transform ease-out-expo "
                    />
                </a>
                <small class="relative z-20 w-full text-xs font-medium text-center text-neutral-600">Elysia in < 5 mins</small>
            </div>
        </aside>
    </header>
</template>

<script setup lang="ts">
import { Rocket, Shield, Code, Pen, ChevronRight } from 'lucide-vue-next'
import Ray from './ray.vue'

const props = defineProps<{
	class?: string
}>()
</script>

<style>
@reference "../../tailwind.css";

#elysia-banner {
    @apply z-10;
}

#elysia-banner > div,
#elysia-banner::before,
#elysia-banner::after {
    @apply absolute inset-0 isolate;
}
#elysia-banner::before {
    content: '';
    z-index: 1;
    backdrop-filter: blur(0.5px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 12.5%,
        rgba(0, 0, 0, 1) 25%,
        rgba(0, 0, 0, 0) 37.5%
    );
}
#elysia-banner > div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 12.5%,
        rgba(0, 0, 0, 1) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 0) 50%
    );
}
#elysia-banner > div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 0) 62.5%
    );
}
#elysia-banner > div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 0) 75%
    );
}
#elysia-banner > div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 0) 87.5%
    );
}
#elysia-banner > div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 0) 100%
    );
}
#elysia-banner > div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 1) 100%
    );
}
#elysia-banner::after {
    content: '';
    z-index: 8;
    backdrop-filter: blur(64px);
    mask: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 87.5%,
        rgba(0, 0, 0, 1) 100%
    );
}
</style>
