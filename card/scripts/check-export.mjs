import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const marker = 'exportGateMarker';
const source = `const ${marker} = {\n\tok: true,\n}\n`;
const typed = 'typedInTheGate';
const sentinel = 'editorOnlySentinel';
const cases = ['light', 'dark'].flatMap((theme) => [{ theme, code: false }, { theme, code: true }]);

const server = await createServer({ root, server: { port: 5201 }, logLevel: 'error' });
await server.listen();
const browser = await puppeteer.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: true,
	args: ['--force-color-profile=srgb', '--hide-scrollbars'],
	defaultViewport: { width: 1600, height: 1000 },
});

let failures = 0;
const check = (ok, label) => {
	console.log(`${ok ? 'pass' : 'FAIL'}  ${label}`);
	if (!ok) failures++;
};

try {
	mkdirSync(`${root}out`, { recursive: true });
	for (const { theme, code } of cases) {
		const name = code ? `${theme}-code` : theme;
		const families = code ? ['Alice', 'Nunito', 'JetBrains Mono'] : ['Alice', 'Nunito'];
		console.log(`\n${name}`);

		const page = await browser.newPage();
		page.on('pageerror', (e) => check(false, `page error: ${e.message}`));
		await page.evaluateOnNewDocument((theme, state) => {
			localStorage.setItem('card:theme', theme);
			localStorage.setItem('card:benchmark:v3', state);
		}, theme, JSON.stringify({ code: { enabled: code, lang: 'ts', source } }));
		await page.goto(server.resolvedUrls.local[0], { waitUntil: 'networkidle0' });
		await page.waitForSelector('#artboard');

		if (code) {
			await page.$eval('textarea', (el) => {
				el.focus();
				el.select();
			});
			await page.keyboard.type(`const ${typed} = 1`);
		}
		const inDom = await page.evaluate((sentinel) => {
			const node = Object.assign(document.createElement('div'), { textContent: sentinel });
			node.dataset.editorOnly = '';
			node.style.cssText = 'position: absolute; top: 0; left: 0';
			document.getElementById('artboard').append(node);
			return { sentinel: document.querySelector('#artboard [data-editor-only]')?.textContent === sentinel, textarea: !!document.querySelector('#artboard textarea') };
		}, sentinel);

		await page.click('[aria-label="Claim highlight"]');
		await page.hover('[aria-label="Title"]');
		const editor = await page.evaluate(() => ({
			hover: getComputedStyle(document.querySelector('[aria-label="Title"]')).outlineStyle,
			focus: getComputedStyle(document.activeElement).outlineStyle,
		}));
		check(editor.hover === 'dashed' && editor.focus === 'dashed', `before export: hover outline ${editor.hover}, focus outline ${editor.focus}`);

		const result = await page.evaluate(async (families, marker, typed, sentinel) => {
			await document.fonts.ready;
			const { capture } = await import('/src/export.ts');
			const svg = await capture('svg');
			const png = await capture('png');
			const image = new Image();
			image.src = png;
			await image.decode();
			const faces = svg.match(/@font-face\s*{[^}]*}/g) ?? [];
			return {
				theme: document.documentElement.dataset.theme,
				png,
				size: [image.naturalWidth, image.naturalHeight],
				dashed: /[;"\s]outline(-style)?:\s*[^;"]*dashed/.test(svg),
				textarea: /<textarea/i.test(svg),
				sentinel: svg.includes(sentinel),
				seeded: svg.includes(marker),
				typed: svg.includes(typed),
				fonts: families.map((family) => ({
					family,
					embedded: faces.some((face) => face.includes(family) && /url\(["']?data:/.test(face)),
					check: document.fonts.check(`16px "${family}"`),
					// fonts.check() is also true when no face matches, so require a loaded face too
					loaded: [...document.fonts].some((face) => face.family.replace(/["']/g, '') === family && face.status === 'loaded'),
				})),
			};
		}, families, marker, typed, sentinel);

		check(result.theme === theme, `data-theme is ${result.theme}`);
		check(result.size[0] === 2000 && result.size[1] === 1125, `PNG decodes to ${result.size.join('x')}`);
		for (const font of result.fonts) {
			check(font.embedded, `${font.family}: data: URL embedded in the foreignObject SVG`);
			check(font.check && font.loaded, `${font.family}: document.fonts.check ${font.check}, face loaded ${font.loaded}`);
		}
		check(!result.dashed, 'no hover or focus outline in the export');
		check(inDom.sentinel && !result.sentinel, 'an editor-only node in the DOM is not in the export');
		if (code) {
			check(inDom.textarea && !result.textarea, 'the code textarea in the DOM is not in the export');
			check(result.typed && !result.seeded, 'code typed just before export is in it; the replaced text is not');
		} else {
			check(!result.typed && !result.seeded, 'no code text in the export with the code block off');
		}
		writeFileSync(`${root}out/${name}.png`, Buffer.from(result.png.split(',')[1], 'base64'));
		await page.close();
	}
} finally {
	await browser.close();
	await server.close();
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exitCode = failures ? 1 : 0;
