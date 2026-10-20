import { expect, test } from 'bun:test';

test.each([null, { getBoundingClientRect: () => ({ height: 64 }) }])('reference-only TOC works with or without a top header: %p', async (header) => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1];
	const attributes = new Map<string, string>();
	let linkReads = 0, trackReads = 0;
	const bounds = () => ({ top: 0, bottom: 30, height: 30 });
	const link = { hash: '#reference', dataset: { pageDepth: '2' }, getBoundingClientRect: () => { linkReads++; return bounds(); },
		setAttribute: (key: string, value: string) => attributes.set(key, value), removeAttribute: (key: string) => attributes.delete(key) };
	const ring = { style: { strokeDashoffset: '' } };
	const nodes: Record<string, unknown> = {
		'[data-page-navigation]': { querySelector: () => null, querySelectorAll: () => [link], addEventListener() {} },
		'[data-page-track]': { getBoundingClientRect: () => { trackReads++; return bounds(); } },
		'[data-page-ring]': ring,
	};
	const root = { querySelector: (selector: string) => nodes[selector] ?? null, addEventListener() {} };
	const document = Object.assign(new EventTarget(), { querySelectorAll: () => [root], querySelector: (selector: string) => selector === 'body > .page > header' ? header : null,
		getElementById: () => ({ getBoundingClientRect: bounds, closest: () => null }), documentElement: { scrollHeight: 1000 }, fonts: { ready: Promise.resolve() } });
	const frames: (() => void)[] = [];
	let resize!: (entries: { target: unknown }[]) => void;
	new Function('document', 'window', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script))(
		document, { scrollY: 300, innerHeight: 400, addEventListener() {} },
		class { constructor(callback: typeof resize) { resize = callback; } observe() {} disconnect() {} }, (callback: () => void) => frames.push(callback), () => {}, () => ({ fontSize: '16' })
	);
	document.dispatchEvent(new Event('astro:page-load'));
	await Promise.resolve();
	while (frames.length) frames.shift()!();
	expect(attributes.get('aria-current')).toBe('location');
	expect(ring.style.strokeDashoffset).toBe('50');
	// A document resize changes scroll progress without changing the outline's rows.
	const initialReads = { linkReads, trackReads };
	document.documentElement.scrollHeight = 1600;
	resize([{ target: document.documentElement }]);
	while (frames.length) frames.shift()!();
	expect({ linkReads, trackReads }).toEqual(initialReads);
	expect(ring.style.strokeDashoffset).toBe('75');
	// Outline size changes preserve the selected heading and reading progress.
	for (const target of [link, nodes['[data-page-track]']]) {
		const previousReads = { linkReads, trackReads };
		resize([{ target: document.documentElement }, { target }]);
		while (frames.length) frames.shift()!();
		expect({ linkReads, trackReads }).toEqual(previousReads);
		expect(attributes.get('aria-current')).toBe('location');
	}
});

test('tabbed headings follow visible panels and deep links reveal enclosing panels without taking focus', async () => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1];
	class Element extends EventTarget {
		hidden = false;
		parentElement: Element | null = null;
		attributes = new Map<string, string>();
		setAttribute(key: string, value: string) { this.attributes.set(key, value); }
		getAttribute(key: string) { return this.attributes.get(key) ?? null; }
		removeAttribute(key: string) { this.attributes.delete(key); }
		closest(selector: string): Element | null {
			if (selector === '[hidden]' && this.hidden || selector === '[role="tabpanel"]' && panels.includes(this)) return this;
			return this.parentElement?.closest(selector) ?? null;
		}
	}
	class Anchor extends Element {
		dataset = { pageDepth: '2' };
		origin = 'http://localhost';
		pathname = '/quick-start';
		search = '';
		constructor(public hash: string) { super(); }
		closest(selector: string): Element | null { return selector === 'a[href]' ? this : super.closest(selector); }
		getBoundingClientRect() {
			const top = links.slice(0, links.indexOf(this)).filter((link) => !link.parentElement?.hidden).length * 30;
			return { top, bottom: top + 30, height: 30 };
		}
	}
	const panels = [new Element(), new Element(), new Element(), new Element()];
	const [bun, node, typescript, javascript] = panels;
	node.hidden = javascript.hidden = true;
	const controllers = [[bun, node], [typescript, javascript]].map((children) => {
		const controller = Object.assign(new Element(), {
			querySelectorAll: () => children,
		});
		children.forEach((panel) => panel.parentElement = controller);
		return controller;
	});
	controllers[1].parentElement = node;
	const ids = ['_top', 'bun', 'automatic-installation', 'nodejs', 'javascript-setup'];
	const targets = ids.map(() => Object.assign(new Element(), { getBoundingClientRect: () => ({ top: -100 }) }));
	[null, bun, bun, node, javascript].forEach((panel, i) => targets[i].parentElement = panel);
	const links = ids.map((id) => new Anchor(`#${id}`));
	links.forEach((link) => link.parentElement = new Element());
	const frames: (() => void)[] = [];
	const nodes: Record<string, unknown> = {
		'[data-page-navigation]': { querySelector: () => null, querySelectorAll: () => links, addEventListener() {} },
		'[data-page-track]': { getBoundingClientRect: () => ({ top: 0, height: links.filter((link) => !link.parentElement?.hidden).length * 30 }) },
		'[data-page-ring]': { style: {} }, '[data-page-tabs]': {},
	};
	const root = { querySelector: (selector: string) => nodes[selector] ?? null, querySelectorAll: (selector: string) => selector === '[data-page-tabs]' ? [] : panels,
		contains: (target: Element) => targets.some((item) => item === target), addEventListener() {} };
	const document = Object.assign(new EventTarget(), { querySelectorAll: () => [root], querySelector: () => null,
		getElementById: (id: string) => targets[ids.indexOf(id)],
		documentElement: { scrollHeight: 1000 }, fonts: { ready: Promise.resolve() } });
	const window = Object.assign(new EventTarget(), { scrollY: 0, innerHeight: 400 });
	const location = { origin: 'http://localhost', pathname: '/quick-start', search: '', hash: '#javascript-setup' };
	const scrolled: string[] = [];
	targets.forEach((target, i) => Object.assign(target, { scrollIntoView: () => scrolled.push(ids[i]) }));
	let mutation!: () => void;
	let disconnected = false;
	new Function('document', 'window', 'ResizeObserver', 'MutationObserver', 'location', 'Element', 'requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script))(
		document, window, class { observe() {} disconnect() {} },
		class { constructor(callback: () => void) { mutation = callback; } observe() {} disconnect() { disconnected = true; } },
		location, Element, (callback: () => void) => frames.push(callback), () => {}, () => ({ fontSize: '16' })
	);
	const flush = () => { while (frames.length) frames.shift()!(); };
	document.dispatchEvent(new Event('astro:page-load'));
	await Promise.resolve();
	flush();
	expect(panels.map((panel) => panel.hidden)).toEqual([true, false, true, false]);
	expect(scrolled).toEqual(['javascript-setup']);
	expect(links.map((link) => link.parentElement?.hidden)).toEqual([false, true, true, false, false]);
	expect(links.filter((link) => link.getAttribute('aria-current')).map((link) => link.hash)).toEqual(['#javascript-setup']);
	bun.hidden = false;
	node.hidden = true;
	mutation();
	flush();
	expect(links.map((link) => link.parentElement?.hidden)).toEqual([false, false, false, true, true]);
	expect(links.filter((link) => link.getAttribute('aria-current')).map((link) => link.hash)).toEqual(['#automatic-installation']);
	const click = (modified = false) => document.dispatchEvent(Object.assign(
		Object.defineProperty(new Event('click'), 'target', { value: links[4] }), { button: 0, metaKey: modified }
	));
	click(true);
	expect(node.hidden).toBe(true);
	click();
	expect(node.hidden).toBe(false);
	expect(javascript.hidden).toBe(false);
	expect(scrolled).toEqual(['javascript-setup', 'javascript-setup']);
	document.dispatchEvent(new Event('astro:before-swap'));
	expect(disconnected).toBe(true);
	bun.hidden = false;
	node.hidden = true;
	click();
	expect(node.hidden).toBe(true);
});

test('the floating outline dismisses and restores the same outline at lg', async () => {
	const source = await Bun.file(new URL('./layout.astro', import.meta.url)).text();
	const enhancement = source.slice(source.indexOf("\t\t\tconst floating ="), source.indexOf('\n\t\t\tconst observer ='));
	class Node extends EventTarget {
		hidden = false;
		inert = false;
		querySelectorAll() { return []; }
		attributes = new Map<string, string>();
		parent: Node | null = null;
		style = { setProperty() {} };
		querySelector(selector: string) { return selector === '[data-floating-controls]' ? controls : outlineClose; }
		contains(element: Node): boolean { return element === this || !!element?.parent && this.contains(element.parent); }
		focus() {
			if (this === pageLink && pageNavigation.attributes.has('data-interactive-hidden')) return;
			document.activeElement = this;
		}
		setAttribute(key: string, value: string) { this.attributes.set(key, value); }
		removeAttribute(key: string) { this.attributes.delete(key); }
		toggleAttribute(key: string, value: boolean) { if (value) this.attributes.set(key, ''); else this.attributes.delete(key); }
		append(node: Node) { node.parent = this; }
		getBoundingClientRect() {
			if (this === pageNavigation) return { left: 1216, right: 1424, top: 16, bottom: 316, width: 208, height: 300 };
			const compact = this === desktopShell && desktopShell.attributes.has('data-collapsed') && !desktopShell.attributes.has('data-open');
			return { left: 1216, right: 1424, top: 16, bottom: 316, width: compact ? 36 : 260, height: compact || pageNavigation.hidden ? 36 : 300 };
		}
	}
	const inlineOutline = Object.assign(new EventTarget(), { matches: false });
	const floating = new Node(), controls = new Node(), outlineClose = new Node();
	const desktopShell = new Node(), desktopToggle = new Node();
	const pageToggle = new Node(), pageNavigation = new Node(), originalParent = new Node(), pageLink = new Node();
	pageNavigation.parent = originalParent;
	outlineClose.parent = pageNavigation;
	pageLink.parent = pageNavigation;
	desktopToggle.parent = desktopShell;
	for (const node of [pageNavigation, controls, desktopToggle]) {
		node.setAttribute('id', 'original');
		node.setAttribute('data-page-navigation', '');
		node.setAttribute('onclick', 'doSomething()');
	}
	let sidebarOpen = false;
	const document = Object.assign(new EventTarget(), {
		querySelector: (selector: string) => selector === '.docs-floating' ? floating : sidebarOpen ? floating : null, activeElement: pageToggle, documentElement: { clientWidth: 1440 },
	});
	const window = new EventTarget();
	let measurements = 0, updates = 0;
	let codeBounds = { left: 800, right: 1200, top: 0, bottom: 600, width: 400, height: 600 };
	const root = { querySelectorAll: () => [{ getBoundingClientRect: () => ({ ...codeBounds, right: 900 }) }, { getBoundingClientRect: () => codeBounds }] };
	const page = new AbortController();
	const updateOverlap = new Function('getComputedStyle', 'signal', 'desktopShell', 'desktopToggle', 'root', 'pageToggle', 'pageNavigation', 'matchMedia', 'measure', 'document', 'window', 'visibleHeadings', 'activePage', 'scheduleUpdate',
		new Bun.Transpiler({ loader: 'ts' }).transformSync('let updateOverlap;\n' + enhancement + '\nreturn updateOverlap;'))(
		() => ({ fontSize: '16' }), page.signal, desktopShell, desktopToggle, root, pageToggle, pageNavigation, () => inlineOutline,
		() => measurements++, document, window, [{ link: pageLink }], 0, () => updates++
	);
	const click = (node: Node, detail = 1) => node.dispatchEvent(Object.assign(new Event('click'), { detail }));
	expect(pageNavigation.parent).toBe(floating);
	expect(pageNavigation.hidden).toBe(true);
	expect(pageNavigation.inert).toBe(true);
	click(pageToggle);
	expect(pageNavigation.hidden).toBe(false);
	expect(pageNavigation.inert).toBe(false);
	expect(controls.inert).toBe(true);
	expect(document.activeElement).toBe(outlineClose);
	expect(floating.attributes.has('data-outline-open')).toBe(true);
	click(outlineClose);
	expect(pageNavigation.hidden).toBe(true);
	// The closing fade must stop accepting focus immediately.
	expect(pageNavigation.inert).toBe(true);
	expect(document.activeElement).toBe(pageToggle);
	click(pageToggle);
	document.dispatchEvent(new Event('docs:close-outline'));
	expect(pageNavigation.hidden).toBe(true);
	inlineOutline.matches = true;
	inlineOutline.dispatchEvent(new Event('change'));
	expect(pageNavigation.parent).toBe(desktopShell);
	expect(pageNavigation.hidden).toBe(false);
	expect(pageToggle.hidden).toBe(true);
	expect(controls.hidden || controls.inert).toBe(false);
	expect(document.activeElement).toBe(pageLink);
	expect(pageNavigation.attributes.has('data-interactive-hidden')).toBe(false);
	// A panel left of the outline must not collapse it, even while vertically aligned.
	expect(desktopToggle.hidden).toBe(true);
	codeBounds.right = 1440;
	updateOverlap();
	expect(desktopToggle.hidden).toBe(false);
	expect(pageNavigation.inert).toBe(true);
	expect(document.activeElement).toBe(desktopToggle);
	updateOverlap();
	expect(desktopToggle.hidden).toBe(false);
	const controlsBefore = controls.hidden;
	click(desktopToggle);
	expect(pageNavigation.inert).toBe(false);
	expect(desktopShell.attributes.has('data-open')).toBe(true);
	expect(controls.hidden).toBe(controlsBefore);
	expect(document.activeElement).toBe(outlineClose);
	document.dispatchEvent(Object.assign(new Event('keydown'), { key: 'Escape' }));
	expect(pageNavigation.inert).toBe(true);
	expect(document.activeElement).toBe(desktopToggle);
	click(desktopToggle);
	codeBounds.top = 400;
	updateOverlap();
	expect(desktopToggle.hidden).toBe(true);
	expect(pageNavigation.inert).toBe(false);
	expect(document.activeElement).toBe(pageLink);
	// Resize across xl only changes collision geometry, never the desktop mode.
	codeBounds.top = 0;
	codeBounds.right = 1100;
	window.dispatchEvent(new Event('resize'));
	updateOverlap();
	expect(desktopToggle.hidden).toBe(true);
	codeBounds.right = 1440;
	updateOverlap();
	click(desktopToggle);
	document.dispatchEvent(Object.defineProperty(new Event('pointerdown'), 'target', { value: originalParent }));
	expect(desktopShell.attributes.has('data-open')).toBe(false);
	// Background dismissal never leaves focus inside the inert outline.
	expect(document.activeElement).toBe(desktopToggle);
	click(desktopToggle);
	originalParent.focus();
	document.dispatchEvent(Object.defineProperty(new Event('pointerdown'), 'target', { value: originalParent }));
	expect(document.activeElement).toBe(originalParent);
	sidebarOpen = true;
	inlineOutline.matches = false;
	inlineOutline.dispatchEvent(new Event('change'));
	expect(pageNavigation.parent).toBe(floating);
	expect(controls.hidden && controls.inert).toBe(true);
	sidebarOpen = false;
	click(pageToggle, 0);
	document.dispatchEvent(Object.assign(new Event('keydown'), { key: 'Escape' }));
	expect(pageNavigation.hidden).toBe(true);
	expect(controls.inert).toBe(false);
	expect(measurements).toBeGreaterThan(3);
	click(pageToggle);
	page.abort();
	expect(pageNavigation.parent).toBe(desktopShell);
	expect(floating.attributes.has('data-outline-open')).toBe(false);
	expect(controls.hidden || controls.inert).toBe(false);
	click(pageToggle);
	expect(floating.attributes.has('data-outline-open')).toBe(false);
});
