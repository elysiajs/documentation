<template>
    <div class="absolute left-0 w-full h-0" ref="constraint">
        <motion.div
            id="elysia-chan"
            drag="x"
            :drag-constraints="constraint"
            aria-label="Elysia chan chibi"
            class="fixed z-30 bottom-0 h-40 select-none"
            style="aspect-ratio: 1251/2036"
            :style="{
                x,
                display: loaded.body && loaded.face ? 'block' : 'none'
            }"
            @click="sit = !sit"
        >
            <div className="relative isolate w-full h-full">
                <div
                    className="relative w-full h-full"
                    :style="{
                        transform:
                            sprite.side === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
                    }"
                >
                    <img
                        src="/elysia/sprite/face.webp"
                        alt="Elysia Chan"
                        class="absolute z-20 w-[66%] left-[17%] object-cover pointer-events-none"
                        style="aspect-ratio: 847/565; object-position: 0%"
                        :style="{
                            top: faceOffset + '%',
                            'object-position': sprite.face * 50 + '%'
                        }"
                        @load="loaded.body = true"
                    />
                    <img
                        src="/elysia/sprite/body.webp"
                        alt="Elysia Chan"
                        class="absolute z-10 w-full h-full object-cover pointer-events-none"
                        style="aspect-ratio: 1251/2036; object-position: 0%"
                        :style="{ 'object-position': sprite.body * 50 + '%' }"
                        @load="loaded.face = true"
                    />
                </div>
            </div>
        </motion.div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { motion, motionValue, useAnimationFrame } from 'motion-v'
import { onUnmounted } from 'vue'

const constraint = ref<HTMLDivElement>()

const body = {
    stand: 0,
    walk: 1,
    sit: 2
} as const

const face = {
    normal: 0,
    happy: 1,
    xd: 2
} as const

const faceOffsetByBody = {
    [body.stand]: 32.2,
    [body.walk]: 32.6,
    [body.sit]: 39.8
} as const

const faceOffsetByFace = {
    [face.normal]: 1.2,
    [face.happy]: 0,
    [face.xd]: 0
} as const

let loaded = ref({
    face: false,
    body: false
})

const sprite = ref({
    body: body.stand as (typeof body)[keyof typeof body],
    face: face.normal as (typeof face)[keyof typeof face],
    side: 'left'
})

const faceOffset = computed(
    () =>
        faceOffsetByBody[sprite.value.body] +
        faceOffsetByFace[sprite.value.face]
)

const x = motionValue(0)
const walkTo = ref(0)
const step = 0.5

let sit = ref(true)
let schedule = ref({
    walk: false,
    face: false
})

const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

let updateWalkSprite: number
let updateBlink: number
let updateBlinkTimeout: number

watch(
    () => loaded.value,
    (value) => {
        if (!value.body || !value.face) return

        start()
    },
    {
        deep: true,
        immediate: true
    }
)

function save() {
    clearInterval(updateWalkSprite)
    clearInterval(updateBlink)
    clearTimeout(updateBlinkTimeout)

    localStorage.setItem('elysia-chan:x', x.get() + '')
    localStorage.setItem('elysia-chan:sit', sit.value ? 'true' : 'false')
    localStorage.setItem('elysia-chan:walkTo', walkTo.value + '')
}

function start() {
    let defaultX = window.innerWidth - 100
    let defaultWalkTo = defaultX

    let pastX = +(localStorage.getItem('elysia-chan:x') || 0)
    x.set(
        !isNaN(pastX) && pastX < defaultX && pastX > 0
            ? pastX
            : window.innerWidth - 100
    )

    let pastWalkTo = +(localStorage.getItem('elysia-chan:walkTo') || 0)
    walkTo.value =
        !isNaN(pastWalkTo) && pastWalkTo < defaultWalkTo && pastWalkTo > 0
            ? pastWalkTo
            : defaultWalkTo

    if ((sit.value = localStorage.getItem('elysia-chan:sit') === 'true'))
        sprite.value.body = body.sit

    updateWalkSprite = setInterval(() => {
        if (sit.value) return

        if (x.get() === walkTo.value) {
            if (sprite.value.body === body.walk) sprite.value.body = body.stand

            return
        }

        sprite.value.body =
            sprite.value.body === body.stand ? body.walk : body.stand
    }, 250) as unknown as number

    updateBlink = setInterval(
        () => {
            const isXD = Math.random() < 0.1

            schedule.value.face = true
            sprite.value.face = isXD ? face.xd : face.happy

            updateBlinkTimeout = setTimeout(
                () => {
                    sprite.value.face = face.normal
                    schedule.value.face = false
                },
                isXD ? randomBetween(2 * 1000, 6 * 1000) : 150
            ) as unknown as number
        },
        randomBetween(4 * 1000, 12 * 1000)
    ) as unknown as number

    window.addEventListener('beforeunload', save, {
        passive: true
    })
}

onUnmounted(save)

watch(
    () => sit.value,
    () => {
        if (sit.value) {
            sprite.value.body = body.sit
            walkTo.value = x.get()
        } else
            sprite.value.body = body.stand
    }
)

useAnimationFrame(() => {
    if (sit.value) return

    const current = x.get()

    if (current === walkTo.value || walkTo.value > window.innerWidth - 100) {
        if (!schedule.value.walk) {
            schedule.value.walk = true

            setTimeout(
                () => {
                    walkTo.value = randomBetween(
                        0 + 100,
                        window.innerWidth - 100
                    )
                    schedule.value.walk = false
                },
                randomBetween(4 * 1000, 24 * 1000)
            )
        }

        return
    }

    const dir = walkTo.value > current ? 1 : -1
    const next = current + dir * step

    if (dir) sprite.value.side = dir > 0 ? 'right' : 'left'

    // Clamp to prevent overshoot
    const clamped =
        dir > 0 ? Math.min(next, walkTo.value) : Math.max(next, walkTo.value)

    x.set(clamped)
})
</script>

<style>
#elysia-chan {
    transform: translateZ(0);

    & > div {
        animation: elysia-chan-idle 6s ease-in-out 0s infinite;
    }
}

@keyframes elysia-chan-idle {
    0% {
        transform: scaleY(101%) translateY(-1%);
    }

    50% {
        transform: scaleY(99%) translateY(1%);
    }

    100% {
        transform: scaleY(101%) translateY(-1%);
    }
}
</style>
