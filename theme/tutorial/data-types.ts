type MaybeArray<T> = T | T[]

export interface TutorialRequest {
    url: string
    method?: string
    body?: unknown
    headers?: Record<string, string>
    cookie?: Record<string, string>
}

export interface TutorialExpectedResponse {
    body?: unknown | ((body: string) => boolean)
    status?: number | null | ((status: number) => boolean)
    headers?: Record<string, string | ((value: string) => boolean)>
}

export interface TutorialTestcase {
    title: string
    description?: string
    test: MaybeArray<{
        request: TutorialRequest
        response: TutorialExpectedResponse
    }>
}

export type Testcases = TutorialTestcase[]
