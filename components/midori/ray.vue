<!-- https://codepen.io/TWilson/pen/jOdWqbZ -->
<template>
    <div class="absolute flex flex-col w-full items-center justify-center bg-transparent transition-bg" :class="className">
        <div class="jumbo absolute -inset-[10px] opacity-50" :class="{ '-safari': isSafari }" />
    </div>
</template>

<style scoped>
@keyframes jumbo {
    from {
        background-position: 50% 50%, 50% 50%;
    }

    to {
        background-position: 350% 50%, 350% 50%;
    }
}

.jumbo {
    --stripes: repeating-linear-gradient(100deg,
            #fff 0%,
            #fff 7%,
            transparent 10%,
            transparent 12%,
            #fff 16%);
    --stripesDark: repeating-linear-gradient(100deg,
            #000 0%,
            #000 7%,
            transparent 10%,
            transparent 12%,
            #000 16%);
    --rainbow: repeating-linear-gradient(100deg,
            #60a5fa 10%,
            #e879f9 15%,
            #60a5fa 20%,
            #5eead4 25%,
            #60a5fa 30%);
    background-image: var(--stripes), var(--rainbow);
    background-size: 300%, 200%;
    background-position: 50% 50%, 50% 50%;

    filter: blur(15px) invert(100%);

    mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);

    pointer-events: none;
}

.jumbo::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--stripes), var(--rainbow);
    background-size: 200%, 100%;
    animation: jumbo 45s linear infinite;
    /* background-attachment: fixed; */
    mix-blend-mode: difference;
}

.-safari {
    background-attachment: unset !important;
}

.-safari::after {
    animation: unset !important;
}

.dark .jumbo {
    background-image: var(--stripesDark), var(--rainbow);
    filter: blur(15px) opacity(50%) saturate(200%);
}

.dark .jumbo::after {
    background-image: var(--stripesDark), var(--rainbow);
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
    class?: string
}>()

const className = ref(props.class || 'h-screen')
const isSafari = ref(
    navigator.userAgent.indexOf('Safari') !== -1 &&
    navigator.userAgent.indexOf('Chrome') === -1
)
</script>
