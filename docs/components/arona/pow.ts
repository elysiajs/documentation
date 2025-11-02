interface Challenge {
    nonce: string
    bits: number
    expires: number
}

interface VerifyPayload {
    pow: {
        suffix: string
        bits: number
    }
}

async function sha256Hex(str: string) {
    const buf = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(str)
    )

    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

async function solvePoW(nonce: string, bits: number): Promise<string> {
    const target = '0'.repeat(bits / 4)

    const startTime = performance.now()

    let i = 0
    while (true) {
        const input = `${nonce}:${i}`
        const hash = await sha256Hex(input)

        if (hash.startsWith(target)) {
            const elapsed = (performance.now() - startTime).toFixed(2)
            console.log(`PoW solved in ${elapsed}ms (${i} attempts)`)

            return i.toString()
        }

        i++
    }
}

export async function request(url: string) {
    const challengeRes = await fetch(`${url}/pow/request`, {
        credentials: 'include'
    })

    if (!challengeRes.ok)
        throw new Error(`Failed to get challenge: ${challengeRes.statusText}`)

    const challenge: Challenge = await challengeRes.json()

    if (Date.now() > challenge.expires)
        throw new Error('Challenge expired before completion')

    const { bits, expires, nonce } = challenge

    const suffix = await solvePoW(nonce, bits)

    if (Date.now() > expires)
        throw new Error('Challenge expired before submission')

    return suffix
}
