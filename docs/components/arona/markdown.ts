import MarkdownIt from 'markdown-it'

import { fromHighlighter } from '@shikijs/markdown-it/core'
import { addCopyButton } from 'shiki-transformer-copy-button'

import { highlighter } from './shiki'

const md = MarkdownIt()

md.use(
    fromHighlighter(highlighter as any, {
        defaultLanguage: 'typescript',
        themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha'
        },
        transformers: [
            addCopyButton({
                toggle: 2000
            })
        ]
    })
)

export { md }
