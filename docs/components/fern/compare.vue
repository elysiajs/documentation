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
	@apply z-40 grid grid-cols-1 lg:grid-cols-2 gap-2.5 rounded-xl w-full;
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

					@media (max-width: theme(--breakpoint-sm)) {
						margin: 0 -24px;
					}

					& > pre {
						@apply h-full overflow-y-hidden;
					}
				}
			}
		}
	}
}
</style>
