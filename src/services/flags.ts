export const isProduction = process.env.NODE_ENV === 'production'
export const isServer = typeof window === 'undefined'
