import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = join(root, '../public/blog/elysia-20-rc/mem-static-route.webp');
const rows = [
	{ id: 'beta26-reg', label: '2.0 beta 26: Registration', value: '208b', sub: 'per route' },
	{ id: 'v1430-reg', label: '1.4.30: Registration', value: '856b', sub: 'per route' },
	{ id: 'beta24-compiled', label: '2.0 beta 24: After first request (compiled)', value: '400b', sub: 'per route' },
	{ id: 'v1430-compiled', label: '1.4.30: After first request (compiled)', value: '17.4kb', sub: 'per route' },
];
const card = {
	title: 'Static route use',
	claim: '43x',
	claimRest: 'less memory',
	featured: ['beta26-reg', 'beta24-compiled'],
	rows,
	caption: '',
	method: '*this is an allocation per route',
	code: { enabled: true, lang: 'ts', source: "import { Elysia } from 'elysia'\n\nnew Elysia()\n  .get('/', () => 'hi')" },
	background: 'wash',
};

const server = await createServer({ root, server: { port: 5201 }, logLevel: 'error' });
await server.listen();
const browser = await puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: true,
	args: ['--force-color-profile=srgb', '--hide-scrollbars'],
	defaultViewport: { width: 1600, height: 1000 },
});
try {
	const page = await browser.newPage();
	page.on('pageerror', (error) => console.error(error));
	await page.evaluateOnNewDocument((state) => {
		localStorage.setItem('card:theme', 'light');
		localStorage.setItem('card:benchmark:v3', JSON.stringify(state));
	}, card);
	await page.goto(server.resolvedUrls.local[0], { waitUntil: 'networkidle0' });
	await page.waitForSelector('#artboard');
	const result = await page.evaluate(async () => {
		await document.fonts.ready;
		const artboard = document.getElementById('artboard');
		const clips = [artboard, ...artboard.querySelectorAll('[data-clip]')];
		const clipMargin = parseFloat(getComputedStyle(clips[1]).overflowClipMargin) || 0;
		const overflow = clips.map((el) => ({
			name: el.id || el.className,
			vertical: el.scrollHeight - el.clientHeight - (el === clips[1] ? clipMargin : 0),
			horizontal: el.scrollWidth - el.clientWidth,
		}));
		const labels = [...artboard.querySelectorAll('[aria-label^="Row "][aria-label$="label"]')];
		const code = artboard.querySelector('.spica-code-frame');
		const caption = artboard.querySelector('[aria-label="Caption"]');
		const layout = {
			rowCount: labels.length,
			clipTop: clips[1]?.getBoundingClientRect().top,
			lastRowBottom: labels.at(-1)?.parentElement?.parentElement?.getBoundingClientRect().bottom,
			clipBottom: clips[1]?.getBoundingClientRect().bottom,
			clipMargin: clipMargin * clips[1].getBoundingClientRect().width / clips[1].clientWidth,
			claimTop: artboard.querySelector('[aria-label="Claim highlight"]')?.getBoundingClientRect().top,
			codeBottom: code?.getBoundingClientRect().bottom,
			codeRight: code?.getBoundingClientRect().right,
			captionTop: caption?.getBoundingClientRect().top,
			hasCaption: !!caption?.textContent?.trim(),
		};
		const { capture } = await import('/src/export.ts');
		const image = new Image();
		image.src = await capture();
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		canvas.getContext('2d').drawImage(image, 0, 0);
		return { webp: canvas.toDataURL('image/webp', 0.95), overflow, layout };
	});
	if (
		result.layout.rowCount !== rows.length ||
		result.overflow.some(({ vertical, horizontal }) => vertical > 1 || horizontal > 1) ||
		result.layout.claimTop < result.layout.clipTop - result.layout.clipMargin - 1 ||
		result.layout.lastRowBottom > result.layout.clipBottom + result.layout.clipMargin + 1 ||
		result.layout.codeBottom > result.layout.clipBottom + result.layout.clipMargin + 1 ||
		(result.layout.hasCaption && result.layout.lastRowBottom > result.layout.captionTop - 1)
	) {
		throw new Error(`Card content is clipped: ${JSON.stringify({ overflow: result.overflow, layout: result.layout })}`);
	}
	const bytes = Buffer.from(result.webp.split(',')[1], 'base64');
	writeFileSync(output, bytes);
	console.log(JSON.stringify({ output, bytes: bytes.length, overflow: result.overflow, layout: result.layout }, null, 2));
} finally {
	await browser.close();
	await server.close();
}
