
function normalize(parts: string[], absolute: boolean): string {
	const out: string[] = [];
	for (const part of parts) {
		if (!part || part === '.') continue;
		if (part === '..') {
			if (out.length && out.at(-1) !== '..') out.pop();
			else if (!absolute) out.push('..');
		} else out.push(part);
	}
	return (absolute ? '/' : '') + out.join('/') || (absolute ? '/' : '.');
}

export function join(...paths: string[]): string {
	const joined = paths.filter(Boolean).join('/');
	return joined ? normalize(joined.split('/'), joined.startsWith('/')) : '.';
}

export function dirname(path: string): string {
	const trimmed = path.replace(/\/+$/, '');
	if (!trimmed) return path.startsWith('/') ? '/' : '.';
	const index = trimmed.lastIndexOf('/');
	if (index === -1) return '.';
	if (index === 0) return '/';
	return trimmed.slice(0, index) || '/';
}

export default { join, dirname };
