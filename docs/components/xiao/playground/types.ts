export interface Testcase {
    title: string
    description: string
	request: {
		url: string
		method?: string
		body?: string
		headers?: Record<string, string>
		cookies?: Record<string, string>
	}
    response: {
        body?: string | null
        status?: number | null
        headers?: Record<string, string>
    }
}

export type Testcases = Testcase[]
