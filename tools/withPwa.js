const Time = {
    second: 0,
    minute: 1,
    hour: 2,
    day: 3,
    week: 4,
    month: 5,
    year: 6
}

const getTime = (time, unit) => {
    switch (unit) {
        case unit.second:
            return time

        case unit.minute:
            return time * 60

        case unit.hour:
            return time * 3_600

        case unit.day:
            return time * 86_400

        case unit.week:
            return time * 604_800

        case unit.month:
            return time * 2_419_200

        case unit.year:
            return time * 29_030_400

        default:
            return time
    }
}

const pwaConfig = {
    dest: 'static/service-worker.js',
    runtimeCaching: [
        {
            urlPattern: '/',
            handler: 'NetworkFirst',
            options: {
                cacheName: 'start-url'
            }
        },
        {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'https-calls',
                networkTimeoutSeconds: 15,
                expiration: {
                    maxEntries: 150,
                    maxAgeSeconds: getTime(6, Time.hour)
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /\/_next\/image\?url/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'next-image-assets'
            }
        },
        {
            urlPattern: /api/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api',
                networkTimeoutSeconds: 15,
                expiration: {
                    maxEntries: 150,
                    maxAgeSeconds: getTime(1, Time.hour)
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-font-assets'
            }
        },
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-image-assets'
            }
        },
        {
            urlPattern: /\.(?:js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-js-assets'
            }
        },
        {
            urlPattern: /\.(?:css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-style-assets'
            }
        },
        {
            urlPattern: /\.(?:json|xml|csv)$/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'static-data-assets'
            }
        }
    ]
}

module.exports = pwaConfig
