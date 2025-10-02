type MaybeArray<T> = T | T[]

export interface Testcase {
    title: string
    description: string
    test: MaybeArray<{
        request: {
            url: string
            method?: string
            body?: unknown
            headers?: Record<string, string>
            cookie?: Record<string, string>
        }
        response: {
            body?: unknown
            status?: number | null
            headers?: Record<string, string>
        }
    }>
}

export type Testcases = Testcase[]
