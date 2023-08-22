<template>
    <article
        class="flex justify-between flex-col lg:flex-row-reverse items-center w-full max-w-6xl mx-auto my-8 gap-12"
    >
        <section class="flex flex-col w-full max-w-lg">
            <header class="flex flex-col justify-center items-start">
                <h2
                    class="text-2xl md:text-3xl leading-tight font-medium text-gray-400 mb-2"
                >
                    Can't find what you're looking for?
                </h2>
                <h2
                    class="text-5xl leading-tight font-semibold text-gray-400 mb-4 bg-clip-text text-transparent bg-gradient-to-tl from-fuchsia-500 to-blue-500"
                >
                    Join the community
                </h2>
            </header>
            <p class="text-xl text-gray-400 w-full max-w-lg mb-4">
                Elysia is one of the biggest community base for Bun first web framework.
            </p>
            <p class="text-xl text-gray-400 w-full max-w-lg">
                You can ask your questions / propose a new feature / file a bug with our community and mainters.
            </p>
        </section>
        <section class="flex flex-col w-full max-w-xl rounded-lg overflow-hidden">
            <iframe
                class="w-full h-64"
                src="https://discord.com/widget?id=1044804142461362206&theme=dark"
                allowtransparency="true"
                frameborder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
        </section>
    </article>
</template>
