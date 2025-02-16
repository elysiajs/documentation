<template>
    <article class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl">
        <section class="w-full !text-base !font-mono rounded-xl">
            <slot></slot>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-sky-300">
                Just Value
            </h3>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                No need for an additional method, just return the value to send data
                back to the client.
            </p>
            <p class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4">
                Whether it's a regular string, or complex JSON, just return the value
                and Elysia will handle the rest
            </p>
        </header>
    </article>
</template>
