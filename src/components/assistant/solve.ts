const encoder = new TextEncoder()

// Arona checks sha256(`${nonce}:${suffix}`) for '0'.repeat(bits / 4) leading hex digits
export async function solve(nonce: string, bits: number) {
	const zeros = Math.trunc(bits / 4)

	for (let suffix = 0; ; suffix++) {
		const hash = new Uint8Array(
			await crypto.subtle.digest(
				'SHA-256',
				encoder.encode(`${nonce}:${suffix}`)
			)
		)

		let digit = 0
		while (
			digit < zeros &&
			!((hash[digit >> 1] >> (digit & 1 ? 0 : 4)) & 15)
		)
			digit++

		if (digit === zeros) return String(suffix)
	}
}
