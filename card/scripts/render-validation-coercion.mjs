import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = join(root, '../public/blog/elysia-20-rc/validation-coercion-latency.webp');
const logo = readFileSync(join(root, '../public/assets/elysia_v.svg')).toString('base64');
const columns = ['Elysia 1.4', 'Elysia 2 beta', 'Elysia 2 RC'];
const benchmarks = [
	{ route: 'POST /json', operation: 'validation', values: [960, 825, 821], changePercent: -14 },
	{ route: 'GET /search', operation: 'coercion', values: [912, 546, 493], changePercent: -46 },
];

for (const benchmark of benchmarks) {
	const actual = Math.round((benchmark.values[2] / benchmark.values[0] - 1) * 100);
	if (actual !== benchmark.changePercent) throw new Error(`Percent change disagrees with ${benchmark.route}`);
}

const panels = benchmarks.map(({ route, operation, values, changePercent }) => {
	const max = Math.max(...values);
	const rows = values.map((value, index) => `
		<div class="row">
			<div class="row-heading"><span>${columns[index]}</span><strong>${value} <small>ns</small></strong></div>
			<div class="track"><div class="fill ${index === 2 ? 'final' : ''}" style="width:${(value / max) * 100}%"></div></div>
		</div>`).join('');
	return `
		<section class="panel" aria-label="${route} ${operation}">
			<div class="panel-heading">
				<div><div class="route">${route}</div><h2>${operation}</h2></div>
				<div class="change"><strong>${String(changePercent).replace('-', '−')}%</strong><span>1.4 → RC</span></div>
			</div>
			<div class="rows">${rows}</div>
		</section>`;
}).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/src/index.css"><style>
	* { box-sizing: border-box; }
	html, body { margin: 0; width: 2000px; height: 1125px; }
	#artboard { position: relative; width: 2000px; height: 1125px; overflow: hidden; background: var(--surface-wash); color: var(--color-ink); padding: 60px 96px 52px; display: flex; flex-direction: column; }
	#artboard::after { content: '✦'; position: absolute; right: 704px; top: 178px; color: var(--color-harmony-left); font-size: 32px; opacity: .7; }
	header { display: flex; align-items: flex-start; justify-content: space-between; min-height: 250px; }
	.eyebrow { font: 700 22px var(--font-sans); color: var(--color-primary-deep); margin: 0 0 12px; }
	h1 { font: 400 84px/.95 var(--font-display); color: var(--color-ink-muted); margin: 0; }
	.subtitle { font: 400 27px var(--font-sans); color: var(--color-ink-soft); margin: 19px 0 0; }
	.logo { display: block; width: 225px; height: auto; margin: -24px 8px 0 0; }
	.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; flex: 1; min-height: 0; }
	.panel { border: 1px solid color-mix(in oklab, var(--color-harmony-center-line) 65%, white); border-radius: 36px; background: color-mix(in oklab, white 81%, transparent); box-shadow: 0 18px 55px color-mix(in oklab, var(--color-harmony-center) 17%, transparent); padding: 46px 52px 44px; }
	.panel-heading { display: flex; justify-content: space-between; align-items: flex-start; min-height: 156px; gap: 20px; }
	.route { display: inline-block; border-radius: 14px; background: var(--color-primary-soft); color: var(--color-primary-deep); font: 700 22px var(--font-sans); padding: 9px 17px; }
	h2 { font: 400 55px/1 var(--font-display); margin: 14px 0 0; color: var(--color-ink); }
	.change { color: var(--color-primary-deep); text-align: right; white-space: nowrap; }
	.change strong { display: block; font: 400 72px/1 var(--font-display); }
	.change span { display: block; margin-top: 6px; font: 700 18px var(--font-sans); color: var(--color-ink-muted); }
	.rows { display: grid; gap: 32px; }
	.row { min-width: 0; }
	.row-heading { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 11px; font: 700 25px var(--font-sans); color: var(--color-ink-soft); }
	.row-heading strong { color: var(--color-ink); font: 400 38px var(--font-display); }
	.row-heading small { font: 400 23px var(--font-sans); color: var(--color-ink-muted); }
	.track { height: 43px; border-radius: 999px; padding: 4px; border: 1px solid var(--color-border); background: color-mix(in oklab, white 88%, var(--color-harmony-center-soft)); }
	.fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--color-harmony-left-soft), var(--color-harmony-center-line)); }
	.fill.final { background: linear-gradient(90deg, var(--color-primary), var(--color-harmony-right)); box-shadow: 0 5px 22px color-mix(in oklab, var(--color-primary) 23%, transparent); }
	footer { display: flex; align-items: center; justify-content: space-between; min-height: 86px; color: var(--color-ink-muted); font: 400 22px var(--font-sans); }
	footer strong { color: var(--color-primary-deep); }
</style></head><body><main id="artboard">
	<header><div><p class="eyebrow">Route benchmarks</p><h1>Validation &amp; coercion</h1><p class="subtitle">Latency per request · lower is better</p></div><img class="logo" src="data:image/svg+xml;base64,${logo}" alt="Elysia"></header>
	<div class="panels">${panels}</div>
	<footer><span><strong>Each route has its own scale.</strong> Bars are proportional within each panel.</span><span>Percent change compares Elysia 1.4 with Elysia 2 RC.</span></footer>
</main></body></html>`;

const server = await createServer({ root, server: { port: 5202 }, logLevel: 'error' });
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
		const panels = [...document.querySelectorAll('.panel')];
		return {
			width: artboard.getBoundingClientRect().width,
			height: artboard.getBoundingClientRect().height,
			barCount: document.querySelectorAll('.fill').length,
			font: getComputedStyle(document.querySelector('h1')).fontFamily,
			logoLoaded: document.querySelector('.logo').naturalWidth > 0,
			overflow: artboard.scrollWidth > artboard.clientWidth || artboard.scrollHeight > artboard.clientHeight,
			panelOverflow: panels.some((panel) => panel.scrollWidth > panel.clientWidth || panel.scrollHeight > panel.clientHeight),
		};
	});
	if (layout.width !== 2000 || layout.height !== 1125 || layout.barCount !== 6 || !layout.logoLoaded || layout.overflow || layout.panelOverflow) {
		throw new Error(`Card layout failed: ${JSON.stringify(layout)}`);
	}
	const bytes = await (await page.$('#artboard')).screenshot({ type: 'webp', quality: 95 });
	writeFileSync(output, bytes);
	console.log(JSON.stringify({ output, bytes: bytes.length, layout }, null, 2));
} finally {
	await browser.close();
	await server.close();
}
