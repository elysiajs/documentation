const { join } = require('path')

const withPwa = require('next-pwa')
const withAnalyze = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

const withPlugins = require('next-compose-plugins')
const pwaConfig = require('./tools/withPwa')

module.exports = withPlugins(
    [
        // [withPwa, pwaConfig]
        [withAnalyze]
    ],
    {
        swcMinify: true,
        async rewrites() {
            return [
                {
                    source: '/service-worker.js',
                    destination: '/_next/static/service-worker.js'
                }
            ]
        },
        images: {
            deviceSizes: [640, 750, 828, 1080],
            imageSizes: [16, 32, 48, 64, 96],
            path: '/_next/image',
            loader: 'default'
        },
        webpack(config, options) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@app': join(__dirname, 'src/app'),
                '@layouts': join(__dirname, 'src/layouts'),
                '@components': join(__dirname, 'src/components'),
                '@shared': join(__dirname, 'src/components/shared'),
                '@modules': join(__dirname, 'src/components/modules'),
                '@styles': join(__dirname, 'src/styles'),
                '@services': join(__dirname, 'src/services'),
                '@models': join(__dirname, 'src/models'),
                '@stores': join(__dirname, 'src/stores'),
                '@public': join(__dirname, 'public'),
                '@': __dirname
            }

            return config
        },
        i18n: {
            locales: ['en-US'],
            defaultLocale: 'en-US'
        }
    }
)
