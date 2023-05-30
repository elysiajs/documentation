module.exports = {
    mode: 'jit',
    content: ['src/**/*.{jsx,tsx,js,ts}'],
    darkMode: 'class',
    theme: {
        extend: {}
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        require('daisyui')
    ]
}
