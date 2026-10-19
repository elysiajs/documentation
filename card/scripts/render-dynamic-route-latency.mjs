import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = join(root, '../public/blog/elysia-20-rc/dynamic-route-latency.webp');
const logo = readFileSync(join(root, '../public/assets/elysia_v.svg')).toString('base64');
const measurements = [
	{ version: 'Elysia 1.4', nanoseconds: 307 },
	{ version: 'Elysia 2 RC', nanoseconds: 224 },
];
const changePercent = -27;

if (Math.round((measurements[1].nanoseconds / measurements[0].nanoseconds - 1) * 100) !== changePercent) {
	throw new Error('Percent change disagrees with the measured timings');
}

const metrics = measurements.map(({ version, nanoseconds }, index) => `
	<div class="metric${index === 1 ? ' current' : ''}">
		<span class="version">${version}</span>
		<div class="reading">${nanoseconds}<span>ns</span></div>
	</div>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/src/index.css"><style>
	* { box-sizing: border-box; }
	html, body { margin: 0; width: 2000px; height: 1125px; }
	#artboard { position: relative; width: 2000px; height: 1125px; overflow: hidden; background: var(--surface-wash); color: var(--color-ink); padding: 68px 96px 74px; }
	#artboard::after { content: '✦'; position: absolute; right: 568px; top: 252px; color: var(--color-harmony-left); font-size: 32px; opacity: .7; }
	header { display: flex; align-items: flex-start; justify-content: space-between; }
	.eyebrow { font: 700 22px var(--font-sans); color: var(--color-primary-deep); margin: 0 0 12px; }
	h1 { font: 400 84px/.95 var(--font-display); color: var(--color-ink-muted); margin: 0; }
	.subtitle { font: 400 28px var(--font-sans); color: var(--color-ink-soft); margin: 20px 0 0; }
	.logo { display: block; width: 225px; height: auto; margin: -30px 8px 0 0; }
	.hero { display: grid; grid-template-columns: 910px 1fr; align-items: center; margin-top: 58px; min-height: 355px; }
	.change { font: 400 246px/.9 var(--font-display); letter-spacing: -10px; background: linear-gradient(110deg, var(--color-primary), var(--color-harmony-right)); -webkit-background-clip: text; background-clip: text; color: transparent; white-space: nowrap; }
	.hero-copy { border-left: 2px solid var(--color-harmony-center-line); padding: 20px 0 20px 64px; }
	.hero-copy h2 { font: 400 67px/1.05 var(--font-display); margin: 0 0 22px; color: var(--color-ink); }
	.hero-copy p { font: 400 28px/1.4 var(--font-sans); color: var(--color-ink-soft); margin: 0; }
	.comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; margin-top: 46px; position: relative; }
	.metric { height: 263px; padding: 38px 48px; border: 1px solid var(--color-harmony-center-line); border-radius: 34px; background: color-mix(in oklab, white 82%, var(--color-harmony-center-soft)); box-shadow: 0 18px 50px color-mix(in oklab, var(--color-harmony-center) 13%, transparent); }
	.metric.current { border-color: var(--color-primary-line); background: color-mix(in oklab, white 77%, var(--color-primary-soft)); }
	.version { font: 700 28px var(--font-sans); color: var(--color-ink-soft); }
	.current .version { color: var(--color-primary-deep); }
	.reading { margin-top: 18px; font: 400 112px/1 var(--font-display); color: var(--color-ink); }
	.current .reading { color: var(--color-primary-deep); }
	.reading span { margin-left: 14px; font: 400 34px var(--font-sans); color: var(--color-ink-muted); }
	.arrow { position: absolute; z-index: 1; top: 101px; left: 50%; transform: translateX(-50%); width: 62px; height: 62px; display: grid; place-items: center; border: 1px solid var(--color-primary-line); border-radius: 50%; background: white; color: var(--color-primary-deep); font: 400 39px/1 var(--font-sans); box-shadow: 0 5px 22px color-mix(in oklab, var(--color-harmony-center) 17%, transparent); }
	footer { margin-top: 30px; color: var(--color-ink-muted); font: 400 23px var(--font-sans); }
</style></head><body><main id="artboard">
	<header><div><p class="eyebrow">Route benchmarks</p><h1>Dynamic route</h1><p class="subtitle">2,000-route app</p></div><img class="logo" src="data:image/svg+xml;base64,${logo}" alt="Elysia"></header>
	<section class="hero" aria-label="27 percent reduction in request latency"><div class="change">−27%</div><div class="hero-copy"><h2>change in<br>request latency</h2><p>Elysia 2 RC compared with Elysia 1.4</p></div></section>
	<section class="comparison" aria-label="Latency per request">${metrics}<span class="arrow" aria-hidden="true">→</span></section>
	<footer>Latency per request · lower is better</footer>
</main></body></html>`;

const server = await createServer({ root, server: { port: 5203 }, logLevel: 'error' });
await server.listen();
const browser = await puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: true,
	args: ['--force-color-profile=srgb', '--hide-scrollbars'],
	defaultViewport: { width: 2000, height: 1125, deviceScaleFactor: 1 },
});
try {
	const page = await browser.newPage();
	await page.goto(server.resolvedUrls.local[0], { waitUntil: 'networkidle0' });
	await page.setContent(html, { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);
	const layout = await page.evaluate(() => {
		const artboard = document.getElementById('artboard');
		const text = artboard.textContent;
		return {
			width: artboard.getBoundingClientRect().width,
			height: artboard.getBoundingClientRect().height,
			metricCount: document.querySelectorAll('.metric').length,
			hasBeta: /beta/i.test(text),
			hasBar: document.querySelector('.track, .fill, progress') !== null,
			logoLoaded: document.querySelector('.logo').naturalWidth > 0,
			scrollWidth: artboard.scrollWidth,
			scrollHeight: artboard.scrollHeight,
			overflow: artboard.scrollWidth > artboard.clientWidth || artboard.scrollHeight > artboard.clientHeight,
		};
	});
	if (layout.width !== 2000 || layout.height !== 1125 || layout.metricCount !== 2 || layout.hasBeta || layout.hasBar || !layout.logoLoaded || layout.overflow) {
		throw new Error(`Card layout failed: ${JSON.stringify(layout)}`);
	}
	const bytes = await (await page.$('#artboard')).screenshot({ type: 'webp', quality: 95 });
	writeFileSync(output, bytes);
	console.log(JSON.stringify({ output, bytes: bytes.length, layout }, null, 2));
} finally {
	await browser.close();
	await server.close();
}
