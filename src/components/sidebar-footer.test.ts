import { expect, test } from 'bun:test';

test('sidebar footer delegates theme behavior to Starlight and keeps the configured GitHub link accessible', async () => {
	const source = await Bun.file(new URL('./sidebar-footer.astro', import.meta.url)).text();
	expect(source).toContain("import ThemeSelect from '@astrojs/starlight/components/ThemeSelect.astro'");
	expect(source).toContain('<ThemeSelect />');
	expect(source).toContain("config.social?.find(({ icon }) => icon === 'github')");
	expect(source).toContain('href={github.href}');
	expect(source).toContain('rel="me"');
	expect(source).toContain('aria-label={github.label}');
	expect(source).toContain('<ThemeTabs client:load />');
});

test('theme tabs wait for the native picker, delegate changes, and restore the fallback on cleanup', async () => {
	const source = await Bun.file(new URL('./theme-tabs.tsx', import.meta.url)).text();
	const script = new Bun.Transpiler({ loader: 'tsx', tsconfig: { compilerOptions: { jsx: 'react' } } })
		.transformSync(source).replace(/^import .*;$/gm, '').replace('export function', 'function');
	const select = Object.assign(new EventTarget(), { value: 'dark' });
	class Picker {
		hidden = false;
		querySelector() { return select; }
	}
	const picker = new Picker();
	let define!: () => void;
	const defined = new Promise<void>((resolve) => { define = resolve; });
	let cleanup!: () => void;
	let refIndex = 0;
	const state: unknown[] = [];
	const tree = new Function('useEffect', 'useRef', 'useState', 'customElements', 'HTMLElement', 'React', 'Tabs', 'IconSun', 'IconMoon', 'IconDeviceDesktop', `${script}; return ThemeTabs();`)(
		(effect: () => () => void) => { cleanup = effect(); },
		(value: unknown) => ({ current: refIndex++ === 0 ? { closest: () => ({ querySelector: () => picker }) } : value }),
		(value: unknown) => {
			const index = state.push(value) - 1;
			return [value, (next: unknown) => { state[index] = next; }];
		},
		{ whenDefined: () => defined }, Picker,
		{ createElement: (type: unknown, props: unknown, ...children: unknown[]) => ({ type, props, children }) },
		'Tabs', 'Sun', 'Moon', 'Desktop'
	);
	expect(tree.props.hidden).toBe(true);
	expect(picker.hidden).toBe(false);
	define();
	await defined;
	expect(state).toEqual(['dark', true]);
	expect(picker.hidden).toBe(true);
	let nativeChanges = 0;
	select.addEventListener('change', () => { nativeChanges++; });
	tree.children[0].props.onChange('auto');
	expect(select.value).toBe('auto');
	expect(nativeChanges).toBe(1);
	expect(state[0]).toBe('auto');
	cleanup();
	expect(picker.hidden).toBe(false);
	select.value = 'light';
	select.dispatchEvent(new Event('change'));
	expect(state[0]).toBe('auto');
});
