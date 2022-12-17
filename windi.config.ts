import { defineConfig } from 'vite-plugin-windicss'

import { join } from 'path'

export default defineConfig({
    preflight: false,
    purge: [join(__dirname, 'components/**/*.vue')],
    extract: {
        include: [join(__dirname, 'components/**/*.vue')]
    }
})