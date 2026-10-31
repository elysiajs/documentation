import { solve } from './solve'

self.onmessage = async ({
	data
}: MessageEvent<{ nonce: string; bits: number }>) =>
	postMessage(await solve(data.nonce, data.bits))
