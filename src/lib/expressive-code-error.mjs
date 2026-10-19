// @ts-check
import {
	definePlugin,
	ExpressiveCodeAnnotation
} from '@astrojs/starlight/expressive-code'
import { h } from '@astrojs/starlight/expressive-code/hast'

class SquigglesAnnotation extends ExpressiveCodeAnnotation {
	/** @param {import('@astrojs/starlight/expressive-code').AnnotationRenderOptions} context */
	render({ nodesToTransform }) {
		return nodesToTransform.map((node) => h('span.error-squiggles', node))
	}
}

class ErrorMessageAnnotation extends ExpressiveCodeAnnotation {
	/** @param {import('@astrojs/starlight/expressive-code').AnnotationRenderOptions} context */
	render({ nodesToTransform }) {
		return nodesToTransform.map((node) => h('span.error-message', node))
	}
}

class ErrorMessageMarkerAnnotation extends ExpressiveCodeAnnotation {
	/** @param {import('@astrojs/starlight/expressive-code').AnnotationRenderOptions} context */
	render({ nodesToTransform }) {
		return nodesToTransform.map((node) =>
			h('span.error-message-marker', node)
		)
	}
}

/** @param {import('@astrojs/starlight/expressive-code').ExpressiveCodeBlock} codeBlock */
const isEnabled = (codeBlock) =>
	codeBlock.metaOptions.getBoolean('error-preview') === true

export function pluginErrorPreview() {
	return definePlugin({
		name: 'Error Preview',
		baseStyles: `
			.error-squiggles {
				text-decoration: underline wavy var(--color-danger, #f22);
				text-decoration-thickness: 0.1em;
				text-underline-offset: 0.14em;

				& span {
					text-decoration: unset;
				}
			}

			.error-message {
				color: var(--color-danger-deep, #c22);
				background: var(--color-danger-soft, #f002);
				padding-inline: 0.4rem;
				border-radius: 0.2rem;
				display: block;
			}

			.ec-line .error-message > span {
				color: inherit !important;
				font-style: inherit;
			}

			.error-message-marker {
				display: none;
			}
		`,
		hooks: {
			preprocessCode: ({ codeBlock }) => {
				if (!isEnabled(codeBlock)) return

				codeBlock.getLines().forEach((line) => {
					const matches = [
						...line.text.matchAll(/~~[^~]+~~/g)
					].reverse()

					matches.forEach((match) => {
						const from = match.index ?? 0
						const to = from + match[0].length
						line.addAnnotation(
							new SquigglesAnnotation({
								inlineRange: {
									columnStart: from,
									columnEnd: to
								}
							})
						)
						line.editText(from, to, match[0].slice(2, -2))
					})
				})
			},
			postprocessAnalyzedCode: ({ codeBlock }) => {
				if (!isEnabled(codeBlock)) return

				codeBlock.getLines().forEach((line) => {
					const marker = line.text.match(/(?<=^|\s)\/\/!\s/)
					if (marker?.index === undefined) return
					const markerEnd = marker.index + marker[0].length

					line.addAnnotation(
						new ErrorMessageMarkerAnnotation({
							inlineRange: {
								columnStart: marker.index,
								columnEnd: markerEnd
							}
						})
					)
					line.addAnnotation(
						new ErrorMessageAnnotation({
							inlineRange: {
								columnStart: markerEnd,
								columnEnd: line.text.length
							}
						})
					)
				})
			}
		}
	})
}
