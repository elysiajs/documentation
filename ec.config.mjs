import { pluginErrorPreview } from './src/lib/expressive-code-error.mjs'

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
	plugins: [pluginErrorPreview()]
}
