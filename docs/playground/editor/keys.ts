export const keys = {
    code: () => `elysia-playground:code:${location.pathname}`,
    body: () => `elysia-playground:body:${location.pathname}`,
    path: () => `elysia-playground:path:${location.pathname}`,
    method: () => `elysia-playground:method:${location.pathname}`,
    headers: () => `elysia-playground:headers:${location.pathname}`,
    cookies: () => `elysia-playground:variables:${location.pathname}`
} as const
