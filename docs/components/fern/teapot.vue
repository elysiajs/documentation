<template>
	<div
		class="flex flex-col justify-center items-center max-w-4xl w-full min-h-dvh mx-auto p-4"
	>
		<img id="teapot-spin" src="/oiia/teapot.webp" class="max-w-full" />
		<h6 class="text-6xl font-medium mb-2">418</h6>
		<p>I'm a teapot</p>
	</div>
</template>

<style>
@reference "../../tailwind.css";

#teapot-spin {
	animation: teapot-spin 2s linear infinite;
}

@keyframes teapot-spin {
	0% {
		transform: rotateY(0deg);
	}
	100% {
		transform: rotateY(360deg);
	}
}
</style>
