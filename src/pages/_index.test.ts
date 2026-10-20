import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./index.astro', import.meta.url), 'utf8');
const bootstrap = source.match(/<script is:inline>([\s\S]*?)<\/script>/)![1];
const moduleScript = new Bun.Transpiler({ loader: 'ts' }).transformSync(source.match(/<script>([\s\S]*?)<\/script>/)![1]);
const now = 1_800_000_000_000;
const interval = 15 * 60 * 1000;

function load(stored: string | null, options: { reduce?: boolean; search?: string; holdDecode?: boolean; flowers?: boolean; mobile?: boolean } = {}) {
	const root = { dataset: {} as Record<string, string> };
	const reads: string[] = [];
	const writes: [string, string][] = [];
	const animations: unknown[] = [];
	const animationControls: { finish: () => void; cancel: () => void }[] = [];
	const decoding = Promise.withResolvers<void>();
	const frames: ((time: number) => void)[] = [];
	const frameStarts: { removed: boolean; locked: boolean }[] = [];
	const timers: { callback: () => void; delay: number }[] = [];
	const listeners: Record<string, (event: { target: unknown }) => Promise<void>> = {};
	const mobileLayout = { matches: options.mobile ?? false };
	let mousemove: ((event: { clientX: number; clientY: number }) => void) | undefined;
	let decoded = 0;
	let removed = false;
	const classes = new Set<string>();
	const loader = {
		classList: { add: (name: string) => classes.add(name) },
		remove: () => { removed = true; },
		addEventListener: (name: string, callback: (event: { target: unknown }) => Promise<void>) => { listeners[name] = callback; },
	};
	const names = options.flowers ? ['day_cloud_back', 'day_fg', 'flower-left', 'flower-right'] : ['day_cloud_back', 'day_fg'];
	const layers = names.map((name, index) => ({
		className: `greenfield z-${index > 1 ? 12 : index ? 10 : 3}`,
		dataset: { layer: name },
		style: { scale: '', transform: '' },
		animate: (...args: unknown[]) => {
			animations.push(args);
			const completion = Promise.withResolvers<void>();
			const animation = { finished: completion.promise };
			animationControls.push({
				finish: () => completion.resolve(),
				cancel: () => {
					completion.reject(new Error('Animation canceled'));
					animation.finished = new Promise(() => {});
				},
			});
			return animation;
		},
		decode: () => { decoded++; return options.holdDecode ? decoding.promise : Promise.resolve(); },
	}));
	const context = {
		Date: { now: () => now },
		URLSearchParams,
		location: { search: options.search ?? '' },
		localStorage: {
			getItem: (key: string) => {
				reads.push(key);
				return stored;
			},
			setItem: (key: string, value: string) => {
				writes.push([key, value]);
			},
		},
		document: {
			documentElement: root,
			querySelector: () => loader,
			querySelectorAll: () => layers,
			addEventListener: () => {},
		},
		matchMedia: (query: string) => query === '(max-width: 1023px)'
			? mobileLayout
			: { matches: options.reduce ?? false },
		performance: { now: () => 0 },
		requestAnimationFrame: (callback: (time: number) => void) => {
			frameStarts.push({ removed, locked: root.dataset.landingIntroActive === 'true' });
			frames.push(callback);
		},
		setTimeout: (callback: () => void, delay: number) => timers.push({ callback, delay }),
		addEventListener: (name: string, listener: (event: { clientX: number; clientY: number }) => void) => {
			if (name === 'mousemove') mousemove = listener;
		},
		innerWidth: 320,
		innerHeight: 568,
		scrollY: 0,
	};
	runInNewContext(bootstrap, context);
	return {
		root, reads, writes, animations, animationControls, frames, frameStarts, timers, listeners, layers, classes,
		decode: () => decoding.resolve(),
		get removed() { return removed; },
		get decoded() { return decoded; },
		scroll: (y: number) => { context.scrollY = y; },
		setMobile: (mobile: boolean) => { mobileLayout.matches = mobile; },
		movePointer: (x: number, y: number) => mousemove!({ clientX: x, clientY: y }),
		start: () => runInNewContext(`(async () => { ${moduleScript} })()`, context) as Promise<void>,
		finish: (target: unknown = loader) => listeners.animationend?.({ target }),
	};
}

test.each([null, '', 'bad', 'NaN', 'Infinity', '-1', '0', String(now), String(now - 1), String(now - interval + 1), String(now - interval), String(now - interval - 1), String(now + 1)])('every visit plays the full entrance regardless of stored timestamp (%s)', async (stored) => {
	const page = load(stored);
	expect(page.root.dataset.skipLandingIntro).toBeUndefined();
	expect(page.root.dataset.landingIntroActive).toBe('true');
	const started = page.start();
	page.timers[0].callback();
	await started;
	expect(page.classes.has('is-done')).toBe(true);
	expect(page.animations).toHaveLength(1);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	await page.finish({ tagName: 'IMG' });
	expect(page.removed).toBe(false);
	const finished = page.finish();
	expect(page.removed).toBe(true);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	page.animationControls[0].finish();
	await finished;
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
	expect(page.reads).toHaveLength(0);
	expect(page.writes).toHaveLength(0);
});

test('the full entrance waits for decoding after the minimum hold', async () => {
	const page = load(String(now - 1000), { holdDecode: true });
	const started = page.start();
	expect(page.decoded).toBe(2);
	expect(page.timers.map(timer => timer.delay)).toEqual([800]);
	page.timers[0].callback();
	await new Promise(setImmediate);
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.animations).toHaveLength(0);
	expect(page.writes).toHaveLength(0);
	expect(page.classes.has('is-done')).toBe(false);
	expect(page.frames).toHaveLength(0);
	page.decode();
	await started;
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.frameStarts).toEqual([{ removed: false, locked: true }]);
	expect(page.frames).toHaveLength(1);
	expect(page.listeners.animationend).toBeDefined();
	expect(page.animations).toHaveLength(1);
	expect(page.classes.has('is-done')).toBe(true);
	expect(page.writes).toHaveLength(0);
	page.animationControls[0].finish();
	await page.finish();
	expect(page.removed).toBe(true);
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
	page.frames[0](16);
	expect(page.layers[0].style.transform).toContain('translate3d(');
});

test('the full entrance waits for the minimum hold after decoding', async () => {
	const page = load(String(now - 1000));
	const started = page.start();
	expect(page.decoded).toBe(2);
	expect(page.timers.map(timer => timer.delay)).toEqual([800]);
	await new Promise(setImmediate);
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.animations).toHaveLength(0);
	expect(page.writes).toHaveLength(0);
	expect(page.classes.has('is-done')).toBe(false);
	expect(page.frames).toHaveLength(0);
	page.timers[0].callback();
	await started;
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.frameStarts).toEqual([{ removed: false, locked: true }]);
	expect(page.frames).toHaveLength(1);
	expect(page.listeners.animationend).toBeDefined();
	expect(page.animations).toHaveLength(1);
	expect(page.classes.has('is-done')).toBe(true);
	expect(page.writes).toHaveLength(0);
	page.animationControls[0].finish();
	await page.finish();
	expect(page.removed).toBe(true);
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
	page.frames[0](16);
	expect(page.layers[0].style.transform).toContain('translate3d(');
});

test('scrolling keeps the flowers anchored while the background still has parallax', async () => {
	const page = load(String(now - 1000), { flowers: true });
	const started = page.start();
	page.timers[0].callback();
	await started;
	page.frames[0](16);
	const before = page.layers.map(layer => layer.style.transform);
	page.scroll(400);
	page.frames[1](16);
	expect(page.layers[0].style.transform).not.toBe(before[0]);
	expect(page.layers[2].style.transform).toBe(before[2]);
	expect(page.layers[3].style.transform).toBe(before[3]);
});

test('mobile flowers ignore pointer parallax but keep wind and regain pointer motion after a layout change', async () => {
	const baseline = load(String(now - 1000), { flowers: true, mobile: true });
	const moved = load(String(now - 1000), { flowers: true, mobile: true });
	const baselineStarted = baseline.start();
	const movedStarted = moved.start();
	baseline.timers[0].callback();
	moved.timers[0].callback();
	await baselineStarted;
	await movedStarted;
	baseline.frames[0](16);
	moved.frames[0](16);
	moved.movePointer(320, 568);
	baseline.frames[1](32);
	moved.frames[1](32);
	expect(moved.layers[0].style.transform).not.toBe(baseline.layers[0].style.transform);
	expect(moved.layers[2].style.transform).toBe(baseline.layers[2].style.transform);
	expect(moved.layers[3].style.transform).toBe(baseline.layers[3].style.transform);

	const flowers = baseline.layers.slice(2).map(layer => layer.style.transform);
	baseline.frames[2](1600);
	moved.frames[2](1600);
	expect(baseline.layers[2].style.transform).not.toBe(flowers[0]);
	expect(baseline.layers[3].style.transform).not.toBe(flowers[1]);
	expect(moved.layers[2].style.transform).toBe(baseline.layers[2].style.transform);
	expect(moved.layers[3].style.transform).toBe(baseline.layers[3].style.transform);

	baseline.setMobile(false);
	moved.setMobile(false);
	baseline.frames[3](1616);
	moved.frames[3](1616);
	expect(moved.layers[2].style.transform).not.toBe(baseline.layers[2].style.transform);
	expect(moved.layers[3].style.transform).not.toBe(baseline.layers[3].style.transform);
});

test.each(['', '?intro', '?intro=0', '?intro=1', '?preview=true', '?preview=true&intro=1'])('query string %s does not change entrance replay', async (search) => {
	const page = load(String(now - 1000), { search });
	const started = page.start();
	expect(page.decoded).toBe(2);
	expect(page.timers.map(timer => timer.delay)).toEqual([800]);
	page.timers[0].callback();
	await started;
	expect(page.classes.has('is-done')).toBe(true);
	expect(page.animations).toHaveLength(1);
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	page.animationControls[0].finish();
	await page.finish();
	expect(page.removed).toBe(true);
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
	expect(page.reads).toHaveLength(0);
	expect(page.writes).toHaveLength(0);
});

test.each([null, String(now - 1000)])('reduced motion keeps the loader event but avoids scene fly-ins (%s)', async (stored) => {
	const page = load(stored, { reduce: true });
	const started = page.start();
	expect(page.decoded).toBe(2);
	expect(page.timers.map(timer => timer.delay)).toEqual([800]);
	expect(page.classes.has('is-done')).toBe(false);
	page.timers[0].callback();
	await started;
	expect(page.classes.has('is-done')).toBe(true);
	expect(page.animations).toHaveLength(0);
	expect(page.frames).toHaveLength(1);
	expect(page.frameStarts).toEqual([{ removed: false, locked: true }]);
	expect(page.listeners.animationend).toBeDefined();
	expect(page.removed).toBe(false);
	expect(page.root.dataset.landingIntroActive).toBe('true');
	await page.finish();
	expect(page.removed).toBe(true);
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
	expect(page.reads).toHaveLength(0);
	expect(page.writes).toHaveLength(0);
});

test('scrolling stays locked while image decoding outlasts the minimum hold', async () => {
	const page = load(null, { holdDecode: true });
	const started = page.start();
	page.timers[0].callback();
	await Promise.resolve();
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.classes.has('is-done')).toBe(false);
	expect(page.animations).toHaveLength(0);
	page.decode();
	await started;
	expect(page.root.dataset.landingIntroActive).toBe('true');
	page.animationControls[0].finish();
	await page.finish();
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
});

test('finished fly-in animations still wait for the loading sheet before unlocking scrolling', async () => {
	const page = load(null);
	const started = page.start();
	page.timers[0].callback();
	await started;
	page.animationControls[0].finish();
	await page.finish({ tagName: 'IMG' });
	expect(page.root.dataset.landingIntroActive).toBe('true');
	expect(page.removed).toBe(false);
	await page.finish();
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
});

test('canceling a fly-in before the sheet finishes does not leave scrolling locked', async () => {
	const page = load(null);
	const started = page.start();
	page.timers[0].callback();
	await started;
	page.animationControls[0].cancel();
	await Promise.resolve();
	expect(page.root.dataset.landingIntroActive).toBe('true');
	await page.finish();
	expect(page.root.dataset.landingIntroActive).toBeUndefined();
});
