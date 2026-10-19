import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const bootstrap = readFileSync(new URL('./lesson.astro', import.meta.url), 'utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)![1];

function load(getItem: (key: string) => string | null) {
	const properties: Record<string, string> = {};
	const root = { dataset: { theme: '' }, style: { setProperty: (key: string, value: string) => { properties[key] = value; } } };
	runInNewContext(bootstrap, {
		localStorage: { getItem },
		document: { documentElement: root },
		window: { matchMedia: () => ({ matches: true }) },
	});
	return { theme: root.dataset.theme, properties };
}

test('blocked storage preserves system theme and usable default layout', () => {
	expect(load(() => { throw new Error('Storage blocked'); })).toEqual({ theme: 'light', properties: {} });
});

test('only a positive finite stored width overrides the default pane width', () => {
	for (const width of [null, '', 'NaN', 'Infinity', '-100', '0', '320px']) {
		expect(load(key => key === 'starlight-theme' ? 'dark' : width)).toEqual({ theme: 'dark', properties: {} });
	}
	expect(load(key => key === 'starlight-theme' ? 'dark' : '420')).toEqual({ theme: 'dark', properties: { '--aside-w': '420px' } });
});
