import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { spicaDark } from '../code-themes.mjs';

test('native and Tailwind dark tokens stay in sync without depending on Tailwind gray', () => {
	const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
	const native = read('./colors.css') + read('./effects.css');
	const bridge = read('../../styles/spica.css').replaceAll('--color-', '--');
	const dark = (css: string) => [...css.matchAll(/:root\[data-theme='dark'\]\s*\{([^}]+)\}/g)]
		.flatMap(([, block]) => [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)])
		.map(([, name, value]) => [name, value.replace(/\s+/g, ' ').trim()]);

	expect(dark(bridge)).toEqual(dark(native));
	expect(dark(native)).toContainEqual(['--base', 'oklch(0.2100 0.0240 285.00)']);
	expect(dark(bridge).some(([, value]) => value.includes('--gray-'))).toBe(false);

	// Neutral selections must lift above their tray; floating glass uses that same raised tone.
	const tokens = Object.fromEntries(dark(native));
	const levels = ['--base', '--surface', '--surface-2', '--surface-raised']
		.map((name) => Number(tokens[name].match(/^oklch\(([\d.]+)/)![1]));
	for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeGreaterThan(levels[i - 1]);
	expect(tokens['--glass']).toBe('color-mix(in oklab, var(--surface-raised) 99%, transparent)');
});

type RGB = number[];
const linear = (v: number) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const encoded = (v: number) => v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
const luminance = (rgb: RGB) => rgb.map(linear).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const blend = (front: RGB, back: RGB, alpha: number) => front.map((v, i) => v * alpha + back[i] * (1 - alpha));
const fromLab = ([l, a, b]: RGB) => {
	const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
		-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
		-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S]
		.map((v) => encoded(Math.max(0, Math.min(1, v))));
};

test('dark semantic text, action labels, controls and code retain contrast on their actual surfaces', () => {
	const css = readFileSync(new URL('./colors.css', import.meta.url), 'utf8')
		+ readFileSync(new URL('./effects.css', import.meta.url), 'utf8');
	const tokens = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
	// The audited ink must actually replace the browser's placeholder color and opacity.
	for (const sheet of [css, readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8')]) {
		const placeholder = sheet.replaceAll('--color-', '--').match(/(?:html|:root)\[data-theme='dark'\] :is\(input, textarea\)::placeholder\s*\{([^}]+)\}/)![1];
		expect(placeholder).toMatch(/color:\s*var\(--ink-muted\)/);
		expect(placeholder).toMatch(/opacity:\s*1\s*;/);
	}
	const lab = (name: string): RGB => {
		const [, l, c, h] = tokens[name].match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/)!;
		const angle = Number(h) * Math.PI / 180;
		return [Number(l), Number(c) * Math.cos(angle), Number(c) * Math.sin(angle)];
	};
	const color = (name: string): RGB => {
		const value = tokens[name] ?? name;
		if (value.startsWith('var(')) return color(value.match(/var\(--([\w-]+)\)/)![1]);
		if (value.startsWith('#')) return value.slice(1, 7).match(/../g)!.map((v) => parseInt(v, 16) / 255);
		return fromLab(lab(name));
	};
	const checked: { label: string; ratio: number; minimum: number }[] = [];
	expect(luminance(fromLab([1, 0, 0]))).toBeCloseTo(1, 6);
	expect(luminance(fromLab([0, 0, 0]))).toBe(0);
	const check = (label: string, foreground: RGB, background: RGB, minimum = 4.5) => {
		const [dark, light] = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
		checked.push({ label, ratio: (light + 0.05) / (dark + 0.05), minimum });
	};
	const surfaces = Object.fromEntries(['base', 'surface', 'surface-2', 'surface-raised'].map((name) => [name, color(name)]));
	// A transparent OKLab mix retains the source color and changes alpha; compositing is sRGB.
	const [, glassColor, glassOpacity] = tokens.glass.match(/var\(--([\w-]+)\) ([\d.]+)%/)!;
	surfaces['glass over white'] = blend(color(glassColor), [1, 1, 1], Number(glassOpacity) / 100);
	for (const name of ['surface-wash', 'surface-wash-rose', 'surface-wash-cool', 'surface-wash-iris', 'surface-wash-dawn']) {
		// Corner blooms taper separately. Stacking every peak invents a background the CSS never paints.
		const radial = /radial-gradient\(([\d.]+)% ([\d.]+)% at (-?[\d.]+)% (-?[\d.]+)%,\s*color-mix\(in oklab, var\(--([\w-]+)\) ([\d.]+)%, transparent\), transparent ([\d.]+)%\)/g;
		const layers = [...tokens[name].matchAll(radial)].map(([, rx, ry, cx, cy, token, alpha, end]) => ({
			rx: Number(rx), ry: Number(ry), cx: Number(cx), cy: Number(cy),
			foreground: color(token), alpha: Number(alpha) / 100, end: Number(end) / 100,
		}));
		expect(layers.length).toBeGreaterThan(0);
		expect(tokens[name].replace(radial, '').replace(/\s+/g, '')).toBe(','.repeat(layers.length) + 'var(--base)');
		const xs = Array.from({ length: 101 }, (_, x) => x);
		const ys = Array.from({ length: 101 }, (_, y) => y);
		for (const { rx, ry, cx, cy, end } of layers) {
			expect(Math.min(rx, ry, end)).toBeGreaterThan(0);
			if (cx >= 0 && cx <= 100 && cy >= 0 && cy <= 100) {
				xs.push(cx);
				ys.push(cy);
			}
		}
		const paintOrder = layers.reverse();
		let brightest = color('base');
		let peakLuminance = luminance(brightest);
		for (const x of xs) for (const y of ys) {
			const background = paintOrder.reduce((back, { rx, ry, cx, cy, foreground, alpha, end }) => {
				const remaining = Math.max(0, 1 - Math.hypot((x - cx) / rx, (y - cy) / ry) / end);
				return blend(foreground, back, alpha * remaining);
			}, color('base'));
			const brightness = luminance(background);
			if (brightness > peakLuminance) {
				brightest = background;
				peakLuminance = brightness;
			}
		}
		surfaces[name] = brightest;
	}
	for (const [name, background] of Object.entries(surfaces)) {
		for (const ink of ['ink', 'ink-soft', 'ink-muted', 'primary', 'primary-deep', 'primary-ink', 'danger-deep']) check(`${ink} / ${name}`, color(ink), background);
		for (const control of ['control-border', 'primary', 'danger']) check(`${control} control or focus / ${name}`, color(control), background, 3);
	}
	const numbered = readFileSync(new URL('../../components/ui/numbered-cards.css', import.meta.url), 'utf8');
	const bloomOpacity = Number(numbered.match(/--card-bloom-opacity:\s*([\d.]+)%/)![1]) / 100;
	const lightOpacity = Number(numbered.match(/--card-light-opacity:\s*([\d.]+)%/)![1]) / 100;
	for (const [, bloom, light] of numbered.matchAll(/--card-bloom:\s*var\(--color-([\w-]+)\);\s*--card-light:\s*var\(--color-([\w-]+)\)/g)) {
		const peak = blend(color(bloom), blend(color(light), color('surface'), lightOpacity), bloomOpacity);
		for (const ink of ['ink', 'ink-muted']) check(`${ink} / numbered card ${bloom}`, color(ink), peak);
	}
	// Unlike quiet washes, night blooms are stronger and separated: sample their actual geometry.
	const nightLayers = [...tokens['surface-night'].matchAll(/radial-gradient\(([\d.]+)% ([\d.]+)% at ([\d.]+)% ([\d.]+)%,\s*rgba\((\d+),(\d+),(\d+),([.\d]+)\) 0%, rgba\([^)]*\) ([\d.]+)%\)/g)].map((match) => match.slice(1).map(Number));
	expect(nightLayers).toHaveLength(3);
	const nightBase = [...tokens['surface-night'].matchAll(/#[\dA-Fa-f]{6}/g)].map(([hex]) => color(hex)).sort((a, b) => luminance(b) - luminance(a))[0];
	for (let x = 0; x <= 100; x += 5) for (let y = 0; y <= 100; y += 5) {
		const background = [...nightLayers].reverse().reduce((back, [rx, ry, cx, cy, r, g, b, alpha, end]) => {
			const remaining = Math.max(0, 1 - Math.hypot((x - cx) / rx, (y - cy) / ry) / (end / 100));
			return blend([r / 255, g / 255, b / 255], back, alpha * remaining);
		}, nightBase);
		for (const ink of ['night-ink', 'night-soft']) check(`${ink} / night grid ${x},${y}`, color(ink), background);
	}
	for (const hue of ['primary', 'harmony-left', 'harmony-center', 'harmony-right', 'success', 'warning', 'danger']) {
		check(`${hue} deep / soft`, color(`${hue}-deep`), color(`${hue}-soft`));
	}
	for (const background of ['primary-soft', 'primary-line']) {
		for (const ink of ['primary-deep', 'primary-ink']) check(`${ink} / ${background}`, color(ink), color(background));
	}
	check('selected radio description', color('ink-muted'), color('primary-soft'));
	check('harmony button hover', color('harmony-center-deep'), color('harmony-center-line'));
	for (const background of ['primary', 'primary-cta-deep']) check(`action label / ${background}`, color('on-primary'), color(background));
	check('destructive action label', color('on-danger'), color('danger'));
	check('checkbox mark and switch thumb', color('on-primary'), color('primary'), 3);
	check('split button secondary cell', color('on-primary'), fromLab(lab('primary').map((v) => v * 0.88)));
	check('harmony split button secondary cell', color('harmony-right-deep'), fromLab(blend(lab('harmony-right-soft'), lab('harmony-right'), 0.78)));
	check('primary tab count badge', color('on-primary'), blend(color('on-primary'), color('primary'), 0.18));
	// Featured gradients use these endpoints. Sample both interpolation spaces, including endpoints.
	for (const [start, end] of [['bloom-soft', 'harmony-center-soft'], ['harmony-center-soft', 'harmony-left-soft'], ['primary-line', 'harmony-right-soft'], ['harmony-right-soft', 'harmony-left-soft']]) {
		for (let step = 0; step <= 20; step++) {
			for (const background of [fromLab(blend(lab(start), lab(end), step / 20)), blend(color(start), color(end), step / 20)]) {
				for (const ink of ['ink', 'ink-soft']) check(`${ink} / gradient ${start} to ${end}`, color(ink), background);
			}
		}
	}
	for (const wash of ['surface-wash-cool', 'surface-wash-iris']) {
		const marked = blend(color('border'), surfaces[wash], 0.8);
		for (const background of [surfaces[wash], marked]) {
			for (const foreground of [spicaDark.colors['editor.foreground'], ...spicaDark.tokenColors.map(({ settings }) => settings.foreground)]) check(`code ${foreground} / ${wash} or marked line`, color(foreground), background);
		}
	}
	const monaco = readFileSync(new URL('../../components/tutorial/playground-monaco.tsx', import.meta.url), 'utf8');
	const editorColors = Object.fromEntries([...monaco.matchAll(/'([\w.]+)': dark \? '(#[\da-fA-F]+)'/g)].map(([, name, value]) => [name, value]));
	const editorBackgrounds = [color('surface'), color(editorColors['editorWidget.background'])];
	for (const [name, hex] of Object.entries(editorColors)) {
		if (/lineHighlightBackground|selectionBackground|inactiveSelectionBackground|selectedBackground/.test(name)) {
			for (const background of [color('surface'), color(editorColors['editorWidget.background'])]) editorBackgrounds.push(blend(color(hex), background, parseInt(hex.slice(7) || 'ff', 16) / 255));
		}
	}
	for (const background of editorBackgrounds) {
		for (const foreground of [spicaDark.colors['editor.foreground'], ...spicaDark.tokenColors.map(({ settings }) => settings.foreground), editorColors['editorLineNumber.foreground'], editorColors['editorLineNumber.activeForeground']]) check(`Monaco text ${foreground}`, color(foreground), background);
	}
	const failures = checked.filter(({ ratio, minimum }) => !Number.isFinite(ratio) || ratio < minimum);
	expect(failures.map(({ label, ratio, minimum }) => `${label}: ${ratio.toFixed(2)} < ${minimum}`)).toEqual([]);
});
