export type Row = { id: string; label: string; value: string; sub: string };
export type Lang = 'ts' | 'tsx' | 'js' | 'json' | 'bash';
export type Background = 'wash' | 'rose' | 'cool' | 'iris' | 'dawn';

export type Benchmark = {
	title: string;
	claim: string;
	claimRest: string;
	featured: string[];
	rows: Row[];
	caption: string;
	method: string;
	code: { enabled: boolean; lang: Lang; source: string };
	background: Background;
};

export const maxRows = 6;
export const languages: [Lang, string][] = [['ts', 'TypeScript'], ['tsx', 'TSX'], ['js', 'JavaScript'], ['json', 'JSON'], ['bash', 'Bash']];
export const backgrounds: [Background, string][] = [['wash', 'Default'], ['rose', 'Rose'], ['cool', 'Cool'], ['iris', 'Iris'], ['dawn', 'Dawn']];
export const washVar = (background: Background) => `var(--surface-wash${background === 'wash' ? '' : `-${background}`})`;
const key = 'card:benchmark:v3';
const textFields = ['title', 'claim', 'claimRest', 'caption', 'method'] as const;

export const row = (label: string, value: string, sub: string): Row => ({ id: crypto.randomUUID(), label, value, sub });

export function defaults(): Benchmark {
	const rows = [
		row('Your project', '1.2s', '1.0 GiB'),
		row('Alternative A', '2.4s', '1.6 GiB'),
		row('Alternative B', '3.6s', '2.1 GiB'),
	];
	return {
		title: 'Project name',
		claim: '2x–3x',
		claimRest: 'faster',
		featured: [rows[0].id],
		rows,
		caption: 'What was measured, and one more highlight',
		method: 'Hardware, dataset and number of runs.',
		code: { enabled: false, lang: 'bash', source: 'bun run bench' },
		background: 'wash',
	};
}

const isRow = (value: unknown): value is Row =>
	typeof value === 'object' &&
	value !== null &&
	['id', 'label', 'value', 'sub'].every((field) => typeof (value as Record<string, unknown>)[field] === 'string');

export function load(): Benchmark {
	const card = defaults();
	try {
		const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
		for (const field of textFields) if (typeof saved?.[field] === 'string') card[field] = saved[field];

		const code = saved?.code;
		if (typeof code?.enabled === 'boolean') card.code.enabled = code.enabled;
		if (languages.some(([lang]) => lang === code?.lang)) card.code.lang = code.lang;
		if (typeof code?.source === 'string') card.code.source = code.source;
		if (backgrounds.some(([background]) => background === saved?.background)) card.background = saved.background;

		const rows = saved?.rows;
		const ids = Array.isArray(rows) && rows.every(isRow) ? new Set(rows.map((r) => r.id)) : null;
		if (ids && rows.length >= 1 && rows.length <= maxRows && ids.size === rows.length) card.rows = rows;

		const featured = typeof saved?.featured === 'string' ? [saved.featured] : saved?.featured;
		card.featured =
			Array.isArray(featured) && featured.every((id) => typeof id === 'string')
				? [...new Set<string>(featured)].filter((id) => card.rows.some((r) => r.id === id))
				: [card.rows[0].id];
	} catch {
	}
	return card;
}

export function save(card: Benchmark) {
	try {
		localStorage.setItem(key, JSON.stringify(card));
		return true;
	} catch {
		return false;
	}
}
