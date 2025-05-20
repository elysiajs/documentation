<template>
	<section class="code-compare">
		<article>
			<section>
				<slot name="left" />
			</section>
			<slot name="left-content" />
		</article>
		<article>
			<section>
				<slot name="right" />
			</section>
			<slot name="right-content" />
		</article>
	</section>
</template>

<style>
@reference "../../tailwind.css";

.code-compare {
	@apply z-40 grid grid-cols-1 xl:grid-cols-2 gap-3 xl:w-[60rem] xl:-translate-x-20 bg-white dark:bg-slate-800 rounded-xl;
	grid-auto-rows: 1fr;

	& > article {
		@apply flex flex-col gap-4 *:!m-0;

		& > section {
			@apply flex flex-1 *:w-full rounded-xl;

			& > .vp-code-group > .blocks {
				@apply h-full;

				& > div {
					@apply m-0;
					height: calc(100% - 50px);

					& > pre {
						@apply h-full overflow-y-hidden;
					}
				}
			}
		}
	}
}
</style>
