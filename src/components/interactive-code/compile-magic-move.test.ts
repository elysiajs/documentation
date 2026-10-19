import { expect, test } from 'bun:test';
import { compileMagicMove } from './compile-magic-move';
import type { CodeStep } from './compile-magic-move';

test('compiles each step and keeps unchanged tokens stable', async () => {
	const codes = [
		"import { Elysia } from 'elysia'\n\nnew Elysia().get('/', 'Hello')",
		"import { Elysia } from 'elysia'\n\nnew Elysia().get('/', 'Hello').get('/user', 'User')",
	];
	const steps = await compileMagicMove(codes.map((code) => ({ code })));

	expect(steps).toHaveLength(codes.length);
	expect(steps.map(({ code }) => code)).toEqual(codes);
	expect(steps[0].rootStyle).toContain('--shiki-light:');
	expect(steps[0].rootStyle).toContain('--shiki-dark:');
	expect(steps[0].rootStyle).toContain('--shiki-light-bg:#FFFFFF');
	expect(steps[0].rootStyle).toContain('--shiki-dark-bg:#171723');

	const unchanged = steps.map(({ tokens }) => tokens.find(({ content }) => content === 'import'));
	expect(unchanged[0]).toBeDefined();
	expect(unchanged[1]?.key).toBe(unchanged[0]?.key);
});

test('highlights HTML, React, and configuration steps with their own grammars', async () => {
	const plain = { '--shiki-light': '#2A2630', '--shiki-dark': '#EDEAFB' };
	const property = { '--shiki-light': '#904061', '--shiki-dark': '#F6BCD6' };
	const keyword = { '--shiki-light': '#7E5BA8', '--shiki-dark': '#CFB4E8' };
	const samples = [
		{ lang: 'html', code: '<main class="app">Hello</main>', token: '<main class=', style: plain },
		{ lang: 'tsx', code: 'const element = <main>{count}</main>', token: '<main>{count}</main>', style: plain },
		{ lang: 'json', code: '{"jsx": "react-jsx"}', token: '"jsx"', style: property },
		{ lang: 'toml', code: '[serve.static]\nplugins = ["bun-plugin-tailwind"]', token: '[serve.static]', style: plain },
		{ lang: 'css', code: '@import "tailwindcss";\nmain { color: red; }', token: '@import', style: keyword },
	] satisfies (CodeStep & { token: string; style: Record<string, string> })[];
	const steps = await compileMagicMove(samples);

	expect(steps.map(({ lang }) => lang)).toEqual(samples.map(({ lang }) => lang));
	for (const [index, sample] of samples.entries()) {
		expect(steps[index].code).toBe(sample.code);
		expect(steps[index].tokens.map(({ content }) => content).join('')).toBe(`${sample.code}\n`);
		const start = sample.code.indexOf(sample.token);
		const styled = steps[index].tokens.filter(({ offset, content }) => offset < start + sample.token.length && offset + content.length > start);
		expect(styled.length).toBeGreaterThan(0);
		for (const token of styled) expect(token.htmlStyle).toEqual(sample.style);
	}
});

test('retokenizes identical source when its language changes and keeps keys across a React edit', async () => {
	const code = 'const element = <main>{count}</main>';
	const steps = await compileMagicMove([
		{ code },
		{ code, lang: 'tsx' },
		{ code: `${code}\nconst next = <button>Increase</button>`, lang: 'tsx' },
	]);
	const rendering = ({ tokens }: typeof steps[number]) => tokens.map(({ content, htmlStyle }) => ({ content, htmlStyle }));

	expect(steps[0].code).toBe(steps[1].code);
	expect(rendering(steps[0])).not.toEqual(rendering(steps[1]));
	const unchanged = steps.slice(1).map(({ tokens }) => tokens.find(({ content }) => content === '<main>{count}</main>'));
	expect(unchanged[0]).toBeDefined();
	expect(unchanged[1]?.key).toBe(unchanged[0]?.key);
});
