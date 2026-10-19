// Success criterion 4 of .claude/tutorial-port-plan.md: every lesson's `answer`
// must satisfy its own `testcases` through the SAME pure checker the browser
// uses (`runTestcases`). The browser `execute` needs a Worker + esm.sh, so this
// file supplies a Bun-side `Execute` that runs the lesson against the installed
// `elysia` package instead. Every answer must pass, and starter code must fail
// at least one assignment to keep the exercises meaningful.
import { describe, expect, test } from 'bun:test';
import * as elysia from 'elysia';
import { Elysia } from 'elysia';
import { transform } from 'sucrase';
import { readFile } from 'node:fs/promises';
import { checkResponse, runTestcases, type Execute, type Testcases, type VirtualFS } from '../../components/tutorial/testcases';

// ---------------------------------------------------------------- Bun execute

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (
	...args: string[]
) => (imp: (module: string) => Promise<unknown>) => Promise<void>;

// Not line-anchored: sucrase prepends helpers such as `_optionalChain` onto the
// same line as the first import, which a `^`-anchored pattern silently skips.
const IMPORT = /(?<![\w$.])import\s+(.+?)\s+from\s*(['"])([^'"]+)\2/g;
const ANY_IMPORT = /(?<![\w$.])import\s*[{*'"\w]/;

/**
 * Turn ES imports into runtime imports so the lesson can run inside an async
 * function. Only the forms the lessons actually use are supported; anything
 * else throws so a new lesson cannot be silently mis-executed.
 */
export function rewriteImports(code: string): string {
	const rewritten = code.replace(IMPORT, (statement, clause: string, _quote, module: string) => {
		const specifier = clause.trim();
		const from = `await __import(${JSON.stringify(module)})`;
		if (specifier.startsWith('{') && specifier.endsWith('}')) {
			const bindings = specifier
				.slice(1, -1)
				.split(',')
				.map((binding) => binding.trim())
				.filter(Boolean)
				.map((binding) => {
					const aliased = binding.match(/^(\w+)\s+as\s+(\w+)$/);
					if (aliased) return `${aliased[1]}: ${aliased[2]}`;
					if (!/^\w+$/.test(binding)) throw new Error(`Unsupported import binding \`${binding}\``);
					return binding;
				});
			return `const { ${bindings.join(', ')} } = ${from}`;
		}
		if (/^\w+$/.test(specifier)) return `const ${specifier} = (${from}).default`;
		throw new Error(`Unsupported import form \`${statement.trim()}\``);
	});
	// Namespace / side-effect / multi-line imports survive the rewrite: fail loud
	// rather than hand the AsyncFunction constructor a SyntaxError.
	const leftover = ANY_IMPORT.exec(rewritten);
	if (leftover) throw new Error(`Unsupported import form near \`${rewritten.slice(leftover.index, leftover.index + 60)}\``);
	return rewritten;
}

const execute: Execute = async (fs, url, init) => {
	const files = Object.keys(fs);
	if (files.length !== 1) throw new Error(`The Bun execute only supports index.ts, got ${files.join(', ')}`);

	const source = transform(fs['index.ts'], { transforms: ['typescript'] }).code;
	const run = new AsyncFunction('__import', rewriteImports(source));

	// `listen` is an own instance field, not a prototype method, so the capture
	// seam is a per-run subclass handed to the lesson through `__import`.
	// Per-run keeps concurrent runTestcases executions independent.
	let app: Pick<Elysia, 'handle' | 'modules'> | undefined;
	class Capturing extends Elysia<string, 'local' | 'plugin' | 'global'> {
		constructor(...options: ConstructorParameters<typeof Elysia>) {
			// The base initialises `listen` as an instance field, so overwrite it
			// after `super()` rather than declaring a conflicting field.
			super(...options);
			(this as unknown as { listen: () => Capturing }).listen = () => {
				app = this;
				return this;
			};
		}
	}

	await run(async (module: string) =>
		module === 'elysia' ? { ...elysia, Elysia: Capturing } : await import(module)
	);
	if (!app) throw new Error('No Elysia instance was captured — index.ts never called `.listen()`');

	// buildRequest smuggles cookies past the browser Worker in `x-browser-cookie`;
	// the worker banner maps it back. Do the same here, before Request locks headers.
	const headers = { ...((init.headers ?? {}) as Record<string, string>) };
	if (headers['x-browser-cookie']) {
		headers.cookie = headers['x-browser-cookie'];
		delete headers['x-browser-cookie'];
	}

	await app.modules;
	const response = await app.handle(new Request(url, { ...init, headers }));
	return [await response.text(), { status: response.status, headers: Object.fromEntries(response.headers) }];
};

// ---------------------------------------------------------------- lesson load

interface Lesson {
	id: string;
	file: string;
	code: string;
	testcases: Testcases;
	answer?: string;
}

const lessons: Lesson[] = [];
for (const relative of [...new Bun.Glob('**/_data.ts').scanSync(import.meta.dir)].sort()) {
	const module = (await import(`${import.meta.dir}/${relative}`)) as Partial<Lesson>;
	lessons.push({
		id: relative.replace(/\/?_data\.ts$/, '') || 'index',
		file: relative,
		code: module.code!,
		testcases: module.testcases!,
		answer: module.answer
	});
}

/**
 * The lesson set is pinned, not discovered: a converter regression that drops a
 * lesson, drops its `answer`, or empties its `testcases` would otherwise make
 * every assertion below pass vacuously.
 */
const ANSWERED: Record<string, number> = {
	index: 1,
	'getting-started/your-first-route': 4,
	'getting-started/handler-and-context': 4,
	'getting-started/status-and-headers': 3,
	'getting-started/validation': 1,
	'getting-started/life-cycle': 2,
	'getting-started/guard': 2,
	'getting-started/plugin': 1,
	'getting-started/encapsulation': 2,
	'patterns/cookie': 2,
	'patterns/extends-context': 2,
	'patterns/macro': 2,
	'patterns/error-handling': 2,
	'patterns/validation-error': 1,
	'patterns/standalone-schema': 1
};

/** Demo-only lessons: no exercise, so no answer and no testcases to satisfy. */
const DEMO_ONLY = [
	'features/end-to-end-type-safety',
	'features/mount',
	'features/openapi',
	'features/unit-test',
	'whats-next'
];

const answered = lessons.filter((lesson) => lesson.answer !== undefined);
const demoOnly = lessons.filter((lesson) => lesson.answer === undefined);

describe('import rewriting', () => {
	// The rewrite is the one place this shim diverges from the browser runner,
	// so an import form it cannot express must be reported, never approximated.
	test('rewrites the forms lessons use', () => {
		expect(rewriteImports(`import { Elysia, t } from 'elysia'`)).toBe(
			'const { Elysia, t } = await __import("elysia")'
		);
		expect(rewriteImports(`import { a as b } from 'm'`)).toBe('const { a: b } = await __import("m")');
		expect(rewriteImports(`import x from 'm'`)).toBe('const x = (await __import("m")).default');
	});

	test('throws on forms it cannot express', () => {
		expect(() => rewriteImports(`import * as m from 'm'`)).toThrow('Unsupported import form');
		expect(() => rewriteImports(`import 'side-effect'`)).toThrow('Unsupported import form');
		expect(() => rewriteImports(`import {\n\tElysia\n} from 'elysia'`)).toThrow('Unsupported import form');
	});

	test('rewrites an import sucrase has moved off the start of its line', () => {
		// sucrase emits `function _optionalChain(...) {...}import { Elysia } ...`
		expect(rewriteImports(`function _helper() {}import { Elysia } from 'elysia'`)).toBe(
			'function _helper() {}const { Elysia } = await __import("elysia")'
		);
	});
});

describe('lesson set', () => {
	test('every lesson with an answer is pinned, with its testcase count', () => {
		expect(Object.fromEntries(answered.map((lesson) => [lesson.id, lesson.testcases.length]))).toEqual(ANSWERED);
	});

	test('every lesson without an answer is a pinned demo with no testcases', () => {
		expect(demoOnly.map((lesson) => lesson.id)).toEqual(DEMO_ONLY);
		for (const lesson of demoOnly) expect(lesson.testcases).toEqual([]);
	});

	test('every lesson exports a runnable index.ts', () => {
		expect(lessons.length).toBe(Object.keys(ANSWERED).length + DEMO_ONLY.length);
		for (const lesson of lessons) {
			expect(typeof lesson.code, lesson.file).toBe('string');
			expect(lesson.code.includes('.listen('), lesson.file).toBe(true);
			if (lesson.answer !== undefined) expect(lesson.answer.includes('.listen('), lesson.file).toBe(true);
		}
	});
});

async function failingTestcases(lesson: Lesson, source: string) {
	const results = await runTestcases(execute, { 'index.ts': source } as VirtualFS, lesson.testcases);
	return lesson.testcases.filter((_, index) => !results[index]).map(({ title }) => title);
}

describe('answers satisfy their own testcases', () => {
	test.each(answered.map((lesson) => [lesson.id, lesson] as const))(
		'%s',
		async (_id, lesson) => {
			expect(await failingTestcases(lesson, lesson.answer!)).toEqual([]);
		},
		30_000
	);
});

describe('starter code does not already pass', () => {
	// A checklist that passes before the learner writes anything is not a
	// checklist — this proves each lesson's testcases discriminate.
	test.each(answered.map((lesson) => [lesson.id, lesson] as const))(
		'%s',
		async (id, lesson) => {
			// Deliberately not tolerant of a throw: starter code must still run,
			// and swallowing the error hides shim bugs behind a "not passing" pass.
			const failing = await failingTestcases(lesson, lesson.code);
			expect(failing.length, `${id}: starter code already passes every testcase`).toBeGreaterThan(0);
		},
		30_000
	);
});

describe('demo lessons transpile', () => {
	test.each(demoOnly.map((lesson) => [lesson.id, lesson] as const))('%s', (_id, lesson) => {
		const output = transform(lesson.code, { transforms: ['typescript'] }).code;
		expect(output.length).toBeGreaterThan(0);
	});
});

test('unit-test lesson runs its demo and displayed introductory example with a synchronous fetch response', async () => {
	const lesson = lessons.find(({ id }) => id === 'features/unit-test')!;
	expect((await execute({ 'index.ts': lesson.code }, 'http://localhost/', {}))[0]).toBe('Hello World');
	const page = await readFile(new URL('./features/unit-test/index.mdx', import.meta.url), 'utf8');
	const example = page.match(/```typescript\n([\s\S]*?)\n```/)![1];
	expect((await execute({ 'index.ts': `${example}\napp.listen(3000)` }, 'http://localhost/', {}))[0]).toBe('Hello World');
});

test('custom-message assignments reject framework defaults and accept the learner\'s own words', async () => {
	const validation = lessons.find(({ id }) => id === 'patterns/validation-error')!;
	const validationTest = validation.testcases[0].test;
	if (Array.isArray(validationTest)) throw new Error('Expected one validation request');
	const { buildRequest } = await import('../../components/tutorial/testcases');
	const request = buildRequest(validationTest.request);
	expect(checkResponse(validationTest.response, await execute({ 'index.ts': validation.code }, request.url, request.init))).toBe(false);
	expect(checkResponse(validationTest.response, ['Please provide a numeric age', { status: 422, headers: {} }])).toBe(true);
	expect(checkResponse(validationTest.response, ['', { status: 422, headers: {} }])).toBe(false);
	expect(checkResponse(validationTest.response, ['Please provide a numeric age', { status: 500, headers: {} }])).toBe(false);
	const notFound = lessons.find(({ id }) => id === 'patterns/error-handling')!.testcases[0].test;
	if (Array.isArray(notFound)) throw new Error('Expected one missing-page request');
	const missing = buildRequest(notFound.request);
	expect(checkResponse(notFound.response, await execute({ 'index.ts': "import { Elysia } from 'elysia'; new Elysia().listen(3000)" }, missing.url, missing.init))).toBe(false);
	expect(checkResponse(notFound.response, ['This page wandered off', { status: 404, headers: {} }])).toBe(true);
	expect(checkResponse(notFound.response, ['', { status: 404, headers: {} }])).toBe(false);
});
