import { defineConfig } from 'vite'
import { SearchPlugin } from 'vitepress-plugin-search'
import { join } from 'path'

export default defineConfig({
    plugins: [
        SearchPlugin({
            preset: 'match',
            tokenize: 'full',
            previewLength: 24,
            buttonLabel: 'Find in docs',
            placeholder: 'Find in docs'
        })
    ]
})
