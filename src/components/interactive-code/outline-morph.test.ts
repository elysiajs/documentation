import { expect, test } from 'bun:test';

test('blog outline keeps scroll-selected headings and reading progress without rail geometry', async () => {
	const source = await Bun.file(new URL('../blog/outline.astro', import.meta.url)).text();
	const progress = source.match(/\n\tfunction pageScrollProgress[^]*?\n\t\}/)![0];
	const update = source.match(/\n\t{3}const updatePageLink = [^]*?\n\t{3}\};?/)![0];
	const attributes = [new Map<string, string>(), new Map<string, string>(), new Map<string, string>()];
	const pageLinks = attributes.map((values) => ({
		setAttribute: (key: string, value: string) => values.set(key, value),
		removeAttribute: (key: string) => values.delete(key),
	}));
	const window = { scrollY: 0, innerHeight: 600 };
	const ring = { style: { strokeDashoffset: '' } }, toggleRing = { style: { strokeDashoffset: '' } };
	const updatePageLink = new Function('pageLinks', 'pageTargets', 'window', 'document', 'ring', 'toggleRing', `
		let activePage = -1;
		${new Bun.Transpiler({ loader: 'ts' }).transformSync(progress + update)}
		return updatePageLink;
	`)(pageLinks, pageLinks.map((_, index) => ({ getBoundingClientRect: () => ({ top: index * 200 - window.scrollY }) })), window,
		{ documentElement: { scrollHeight: 1200 } }, ring, toggleRing);
	for (const [scroll, index] of [[0, 0], [200, 1], [400, 2], [0, 0]]) {
		window.scrollY = scroll;
		updatePageLink();
		expect(attributes.map((values) => values.get('aria-current'))).toEqual(attributes.map((_, i) => i === index ? 'location' : undefined));
		expect(Number(ring.style.strokeDashoffset)).toBeCloseTo(100 * (1 - scroll / 600));
		expect(toggleRing.style.strokeDashoffset).toBe(ring.style.strokeDashoffset);
	}
});

test('outline overlap stays stable while its shell morphs', async () => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const actualFunction = source.match(/\n\t{4}(updateOverlap = \(\) => \{[^]*?\n\t{4}\};?)/)![1];
	const codeBounds = { left: 1100, right: 1280, top: 320, bottom: 340, width: 180, height: 20 };
	const update = new Function('context', `
		const { inlineOutline, pageNavigation, desktopShell, root, document, getComputedStyle, renderOutline } = context;
		let collapsed = false, open = false, updateOverlap;
		${new Bun.Transpiler({ loader: 'ts' }).transformSync(actualFunction)}
		return () => { updateOverlap(); return collapsed; };
	`)({
		inlineOutline: { matches: true },
		pageNavigation: { getBoundingClientRect: () => ({ width: 208, height: 300 }) },
		desktopShell: {
			contains: () => false,
			getBoundingClientRect: () => { throw new Error('Animated shell must not determine overlap'); },
		},
		root: { querySelectorAll: () => [{ getBoundingClientRect: () => codeBounds }] },
		document: { documentElement: { clientWidth: 1280 } },
		getComputedStyle: () => ({ fontSize: '16px' }),
		renderOutline: () => {},
	});

	expect(update()).toBe(true);
	expect(update()).toBe(true);
	codeBounds.top = 325;
	codeBounds.bottom = 345;
	expect(update()).toBe(false);
});

test('the floating outline is measured before it opens so Safari morphs px to px', async () => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const render = source.slice(source.indexOf('\t\t\t\tsyncOutlineSize = () => {'), source.indexOf('\t\t\t\tconst setOutline ='));
	const log: string[] = [];
	const node = (name: string) => ({
		hidden: true,
		inert: true,
		style: { setProperty: (key: string, value: string) => log.push(`${name} ${key} ${value}`) },
		setAttribute() {},
		toggleAttribute: (key: string, value: boolean) => value && log.push(`${name} ${key}`),
	});
	const floating = node('floating'), desktopShell = node('desktopShell');
	// A closed floating outline is display:none, so it only has a size once unhidden.
	const pageNavigation = Object.assign(node('pageNavigation'), {
		getBoundingClientRect: () => pageNavigation.hidden ? { width: 0, height: 0 } : { width: 208.5, height: 300.25 },
	});
	new Function('context', `
		const { inlineOutline, pageNavigation, desktopShell, desktopToggle, pageToggle, floating, controls, outlineClose, document } = context;
		let collapsed = false, open = true, syncOutlineSize;
		${new Bun.Transpiler({ loader: 'ts' }).transformSync(render)}
		renderOutline();
	`)({
		inlineOutline: { matches: false }, pageNavigation, desktopShell, floating,
		desktopToggle: node('desktopToggle'), pageToggle: node('pageToggle'), controls: node('controls'), outlineClose: node('outlineClose'),
		document: { querySelector: () => null },
	});

	// The shell's width/height transition starts from its pre-toggle style, so the target length must already be set.
	expect(log).toEqual([
		'floating --outline-width 208.5px',
		'floating --outline-height 300.25px',
		'floating data-outline-open',
	]);
});
