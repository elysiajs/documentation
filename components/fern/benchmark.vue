<template>
    <article id="benchmark">
        <div class="grid">
            <div class="fog" />
        </div>
        <header class="flex flex-row md:flex-col justify-around md:justify-center z-10 w-full md:max-w-[10.5rem]">
            <div class="title md:mb-10">
                <h3 class="text-gradient from-pink-400 to-fuchsia-400">21x</h3>
                <p>faster than Express</p>
            </div>

            <div class="title">
                <h3 class="md:!text-7xl text-gradient from-violet-400 to-pink-400">
                    6x
                </h3>
                <p>faster than Fastify</p>
            </div>
        </header>
        <div class="result">
            <ol class="graph">
                <li>
                    <h6><span class="!text-xl !font-semibold !text-transparent !ml-0 text-gradient from-violet-500 to-sky-500">Elysia</span> <span>Bun</span></h6>
                    <div
                        class="w-full bg-gradient-to-r from-violet-500 to-fuchsia-400 !text-white"
                    >
                        2,454,631 reqs/s
                    </div>
                </li>
                <li>
                    <h6>Gin <span>Go</span></h6>
                    <div style="width: 27.54%" />
                    <p>676,019</p>
                </li>
                <li>
                    <h6>Spring <span>Java</span></h6>
                    <div style="width: 20.62%" />
                    <p>506,087</p>
                </li>
                <li>
                    <h6>Fastify <span>Node</span></h6>
                    <div style="width: 16.93%" />
                    <p>415,600</p>
                </li>
                <li>
                    <h6>Express <span>Node</span></h6>
                    <div style="width: 4.61%" />
                    <p>113,117</p>
                </li>
                <li>
                    <h6>Nest <span>Node</span></h6>
                    <div style="width: 4.28%" />
                    <p>105,064</p>
                </li>
            </ol>
            <p class="text-sm mt-3 text-gray-400">
                Measure in requests/second. Result from
                <a
                    href="https://www.techempower.com/benchmarks/#hw=ph&test=plaintext&section=data-r22"
                    target="_blank"
                    class="underline"
                    >TechEmpower Benchmark</a
                >
                Round 22 (2023-10-17) in PlainText
            </p>
        </div>
    </article>
</template>

<style scoped>
#benchmark {
    @apply relative flex flex-col md:flex-row items-center gap-24 max-w-5xl w-full my-4 py-12 px-6 mx-auto;
}

.fog {
    @apply w-full h-full;
    background-image: radial-gradient(
        closest-side at center,
        transparent 0%,
        rgba(255, 255, 255, 1) 100%
    );

    html.dark & {
	    background-image: radial-gradient(
	        closest-side at center,
	        transparent 0%,
	        theme(colors.gray.900) 100%
	    );
    }
}

.grid {
    @apply absolute top-0 left-0 w-full h-full pointer-events-none;
    background-color: transparent;
    background-image: linear-gradient(#ddd 1px, transparent 1px),
        linear-gradient(to right, #ddd 1px, transparent 1px);
    background-size: 40px 40px;

    html.dark & {
    	background-image: linear-gradient(#646464 1px, transparent 1px),
			linear-gradient(to right, #646464 1px, transparent 1px);
    }
}

.title {
    @apply flex flex-col justify-start items-start gap-0.5 text-gray-400;

    & > h3 {
        @apply text-7xl sm:text-8xl font-bold;
    }

    & > p {
        @apply text-lg sm:text-xl;
    }
}

.result {
	@apply z-10 flex flex-col flex-1 gap-4;
}

.graph {
    @apply flex flex-col flex-1 gap-4;

    & > li {
        @apply flex justify-start items-center gap-4 w-full h-6;

        & > h6 {
            @apply w-36 min-w-36 font-mono text-lg font-medium text-gray-500 dark:text-gray-400;

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
