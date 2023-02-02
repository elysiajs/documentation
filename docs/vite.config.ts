import { defineConfig } from 'vite'
import { SearchPlugin } from 'vitepress-plugin-search'
import WindiCSS from 'vite-plugin-windicss'
import { join } from 'path'

export default defineConfig({
    plugins: [
        WindiCSS({
            config: join(__dirname, '../windi.config.ts')
        }),
        SearchPlugin({
            preset: 'performance',
            tokenize: 'full',
            previewLength: 24,
            buttonLabel: 'Find in docs',
            placeholder: 'Find in docs',
        })
    ]
})
