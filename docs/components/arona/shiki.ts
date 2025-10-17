import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { addCopyButton } from 'shiki-transformer-copy-button'

export const highlighter = await createHighlighterCore({
    themes: [
        import('@shikijs/themes/catppuccin-latte'),
        import('@shikijs/themes/catppuccin-mocha')
    ],
    langs: [
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/javascript'),
        import('@shikijs/langs/tsx'),
        import('@shikijs/langs/jsx'),
        import('@shikijs/langs/vue'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/toml'),
        import('@shikijs/langs/bash'),
        import('@shikijs/langs/bash')
    ],
    engine: createOnigurumaEngine(() => import('shiki/wasm'))
})
