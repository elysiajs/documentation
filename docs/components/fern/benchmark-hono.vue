<template>
    <div class="result">
        <article>
            <ol class="graph">
                <li>
                    <h6>
                        <span
                            class="!text-xl !font-semibold !text-transparent !ml-0 text-gradient from-violet-500 to-sky-500"
                        >
                            Elysia
                        </span>
                    </h6>
                    <div
                        class="w-full bg-gradient-to-r from-violet-500 to-fuchsia-400 !text-white"
                    >
                    	1,837,294 reqs/s
                    </div>
                </li>
                <li>
                    <h6>Hono</h6>
                    <div style="width: 40.03%" />
                    <p>740,451</p>
                </li>
            </ol>
            <p class="text-sm !m-0 text-gray-400 !leading-normal">
                Measured in requests/second. Result from
                <a
                    href="https://www.techempower.com/benchmarks/#section=data-r23&test=json"
                    target="_blank"
                    class="underline"
                    >TechEmpower Benchmark</a
                >
                Round 23 (2025-02-24) in JSON serialization
            </p>
        </article>
    </div>
</template>

<style scoped>
@reference "../../tailwind.css";

.result {
	@apply flex flex-col flex-1 from-sky-200 to-purple-200 dark:from-sky-900 dark:to-purple-900 bg-gradient-to-br rounded-2xl;
    padding: 1.5px;

    & > article {
        @apply flex flex-col gap-3 p-5 bg-white dark:bg-slate-800;
        border-radius: calc(var(--radius-2xl) - 1.5px);
    }
}

.graph {
    @apply flex flex-col flex-1 gap-1 m-0 px-0 py-2;

    & > li {
        @apply flex justify-start items-center gap-4 w-full h-6;

        & > h6 {
            @apply w-26 min-w-26 font-mono text-lg font-medium text-gray-500 dark:text-gray-400;

            & > span {
                @apply text-sm text-gray-400 font-normal;
            }
        }

        & > div {
            @apply flex justify-end items-center w-full h-6 font-bold font-mono text-gray-500 dark:text-gray-400 text-sm pr-3 bg-gray-200 dark:bg-gray-600 rounded-2xl;
        }

        & > p {
            @apply font-medium font-mono text-gray-400 text-sm -translate-x-2;
        }
    }
}
</style>
