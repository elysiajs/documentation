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
            status?: number | null | ((status: number) => boolean)
            headers?: Record<string, string | ((status: string) => boolean)>
        }
    }>
}

export type Testcases = Testcase[]
