// Sandboxed previews have an opaque origin; libraries that read browser storage need a frame-local fallback.
const storagePrelude = `<script>
for (const name of ['localStorage', 'sessionStorage']) {
	try {
		window[name];
	} catch {
		const entries = new Map();
		Object.defineProperty(window, name, { value: {
			get length() { return entries.size; },
			key(index) { return [...entries.keys()][index >>> 0] ?? null; },
			getItem(key) { return entries.get(String(key)) ?? null; },
			setItem(key, value) { entries.set(String(key), String(value)); },
			removeItem(key) { entries.delete(String(key)); },
			clear() { entries.clear(); }
		} });
	}
}
</script>`;

export function previewDocument(html: string): string {
	const gaps = String.raw`(?:\s|<!--[\s\S]*?-->)*`;
	const attributes = `(?:[^>"']|"[^"]*"|'[^']*')*`;
	const head = html.match(new RegExp(`^${gaps}(?:<!doctype${attributes}>${gaps})?(?:<html(?=\\s|>)${attributes}>${gaps})?<head(?=\\s|>)${attributes}>`, 'i'))?.[0];
	const prefix = head ?? html.match(new RegExp(`^${gaps}<!doctype${attributes}>`, 'i'))?.[0] ?? '';
	return prefix + storagePrelude + html.slice(prefix.length);
}
