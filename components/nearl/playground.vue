<template>
    <article class="mockup-browser dark:bg-slate-800 border dark:border-slate-700 playground">
        <div class="mockup-browser-toolbar">
            <div class="input flex dark:!bg-slate-700">
                <span>localhost</span>
                <select
                    name="route"
                    class="flex-1 rounded text-blue-500 font-bold bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-500/25 dark:hover:bg-blue-500/40 border border-solid border-blue-500/50 dark:border-blue-500/75 px-1 cursor-pointer transition-colors"
                    v-model="current"
                >
                    <option
                        v-for="{ method, path } in routes"
                        :key="method + '_' + path"
                        :value="{ method, path }"
                    >
                        {{ alias && path in alias ? alias[path] : path }}
                    </option>
                </select>
            </div>
            <p
                class="!my-0 font-bold pl-2 min-w-[5ch] text-right"
                :class="
                    current.method === 'GET'
                        ? 'text-green-600'
                        : 'text-blue-500'
                "
            >
                {{ current.method }}
            </p>
        </div>
        <section
            class="flex justify-start items-stretch w-full h-full px-4 whitespace-pre-wrap pb-3"
            style="min-height: 16rem"
        >
            {{ response }}
        </section>
    </article>
    <!-- <ul class="flex flex-col">
        <li v-for="{ method, path } in routes" :key="method + '_' + path">
            <button @click="current = { method, path }">
                {{ method }} {{ path }}
            </button>
        </li>
    </ul> -->
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import type { Elysia } from 'elysia'

const { elysia, mock = {}, alias = {} } = defineProps<{
    elysia: Elysia<any, any, any, any, any, any>
    mock?: Record<string, Record<string, string>>
    alias?: Record<string, string>
}>()

const routes = elysia?.router.history

const current = ref({
    method: routes?.[0]?.method ?? 'get',
    path: routes?.[0]?.path ?? '/'
})

const response = ref('')

const compute = async () => {
    const { method, path } = current.value

    if (mock && path in mock && method in mock[path]) {
        response.value = mock[path][method]
        return
    }

    const res = await elysia
        .handle(
            new Request('http://elysiajs.com' + path, {
                method
            })
        )
        .then((x) => x.text())

    response.value = res
}

compute()
watch([current], compute)
</script>

<style global>
.playground {
    box-shadow: 0 7px 25px rgba(0,0,0,.0625);
}

@media screen and (max-width: 567.9px) {
    .playground > .mockup-browser-toolbar {
        padding-left: 0.7em;
        padding-right: 0.7em;
    }

    .playground > .mockup-browser-toolbar::before {
        display: none !important;
    }
}
</style>
