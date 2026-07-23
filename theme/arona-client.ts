export type AronaRole = 'user' | 'assistant'

export type AronaMessage = {
    id?: string
    role: AronaRole
    content: string
    checksum: string
}

type Challenge = {
    nonce: string
    bits: number
    expires: number
}

const endpoint = 'https://arona.elysiajs.com'

async function sha256Hex(value: string) {
    const buffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(value)
    )

    return Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')
}

async function solveChallenge({ nonce, bits, expires }: Challenge) {
    const target = '0'.repeat(Math.ceil(bits / 4))

    for (let attempt = 0; Date.now() <= expires; attempt++) {
        const hash = await sha256Hex(`${nonce}:${attempt}`)
        const significantBits = bits % 4
        const fullNibbles = Math.floor(bits / 4)
        const fullMatch = hash.startsWith(target.slice(0, fullNibbles))
        const partialMatch =
            significantBits === 0 ||
            Number.parseInt(hash[fullNibbles] ?? 'f', 16) < 2 ** (4 - significantBits)

        if (fullMatch && partialMatch) return String(attempt)
    }

    throw new Error('Verification expired. Please try again.')
}

export async function requestProofOfWork() {
    const response = await fetch(`${endpoint}/pow/request`, {
        credentials: 'include'
    })

    if (!response.ok) throw new Error('Could not start verification.')

    return solveChallenge((await response.json()) as Challenge)
}

function parseStream(raw: string) {
    let content = raw.replace(/(^|\n\n)\.{3,}\n\n/g, (_, lead) => lead)
    const thinking = /(^|\n\n)\.{3,}$/.exec(content)

    if (thinking) content = content.slice(0, thinking.index)

    return content.trimStart()
}

export async function askArona({
    message,
    history,
    proof,
    turnstileToken,
    reference,
    signal,
    onChunk
}: {
    message: string
    history: AronaMessage[]
    proof: string
    turnstileToken: string
    reference?: string
    signal: AbortSignal
    onChunk: (content: string) => void
}) {
    const response = await fetch(`${endpoint}/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-turnstile-token': turnstileToken
        },
        credentials: 'include',
        body: JSON.stringify({
            pow: { suffix: proof },
            message: message.slice(0, 8192),
            history: history.slice(-8),
            ...(reference ? { reference } : {})
        }),
        signal
    })

    if (!response.ok || !response.body)
        throw new Error((await response.text()) || 'Elysia chan is unavailable.')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let raw = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        raw += decoder.decode(value, { stream: true })
        onChunk(parseStream(raw))
    }

    return parseStream(raw).split('\n---Elysia-Metadata---', 1)[0].trimEnd()
}
