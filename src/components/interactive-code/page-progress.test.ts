import { expect, test } from 'bun:test';

test('the TOC ring measures whole-page progress and clamps empty ranges and overscroll', async () => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const actualFunction = source.match(/function pageScrollProgress\([^]*?\n\t\}/)![0];
	const progress = new Function(`${new Bun.Transpiler({ loader: 'ts' }).transformSync(actualFunction)}; return pageScrollProgress;`)();
	expect(progress(0, 1000, 400)).toBe(0);
	expect(progress(300, 1000, 400)).toBe(0.5);
	expect(progress(600, 1000, 400)).toBe(1);
	expect(progress(-20, 1000, 400)).toBe(0);
	expect(progress(900, 1000, 400)).toBe(1);
	expect(progress(0, 400, 400)).toBe(0);
	expect(progress(0, 300, 400)).toBe(0);
});
