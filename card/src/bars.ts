export function parseValue(value: string) {
	const match = /^([+-]?(?:\d+\.?\d*|\.\d+))(.*)$/.exec(value.replace(/[,_\s]/g, ''));
	const n = Number(match?.[1]);
	return match && Number.isFinite(n) ? { n, unit: match[2] } : null;
}

const bytes = new Map([['b', 1], ['kb', 1e3], ['mb', 1e6], ['gb', 1e9], ['kib', 2 ** 10], ['mib', 2 ** 20], ['gib', 2 ** 30]]);

export function barWidths(rows: { value: string }[]) {
	const parsed = rows.map((row) => {
		const p = parseValue(row.value);
		const scale = p && bytes.get(p.unit.toLowerCase());
		if (!p || !scale) return p;
		return Number.isFinite(p.n * scale) ? { n: p.n * scale, unit: 'b' } : null;
	});
	if (new Set(parsed.flatMap((p) => (p ? [p.unit] : []))).size > 1) return null;

	const max = Math.max(0, ...parsed.map((p) => p?.n ?? 0));
	return parsed.map((p) => (p && p.n > 0 ? (p.n / max) * 100 : 0));
}
