import { expect, test } from 'bun:test';
import { runInNewContext } from 'node:vm';
import { fromHtml } from 'hast-util-from-html';
import { select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { previewDocument } from './preview-document';

const script = previewDocument('').match(/<script>([\s\S]*?)<\/script>/)![1];

test('sandbox storage is available before page scripts without changing the document mode', () => {
	const html = '<!DOCTYPE html><html><HEAD lang="en"><script>Scalar.createApiReference()</script></HEAD><body>API</body></html>';
	const preview = previewDocument(html);
	expect(preview.startsWith('<!DOCTYPE html><html><HEAD lang="en"><script>')).toBe(true);
	expect(preview.indexOf('Object.defineProperty')).toBeLessThan(preview.indexOf('Scalar.createApiReference'));
	expect(preview.endsWith('<script>Scalar.createApiReference()</script></HEAD><body>API</body></html>')).toBe(true);
	expect(previewDocument('<!doctype html><p>Fragment</p>')).toStartWith('<!doctype html><script>');
	expect(previewDocument('<p>Fragment</p>')).toEndWith('<p>Fragment</p>');
});

test('head-like text in scripts and quoted attributes stays intact', () => {
	const code = 'const tag = "<head>"; window.tag = tag;';
	const html = `<!doctype html><html><head data-x=">"><script>${code}</script></head><body>API</body></html>`;
	const preview = previewDocument(html);
	expect(preview.endsWith(`<script>${code}</script></head><body>API</body></html>`)).toBe(true);
	const scripts = selectAll('script', fromHtml(preview));
	expect(scripts).toHaveLength(2);
	expect(toString(scripts[0])).toContain('Object.defineProperty(window, name');
	expect(toString(scripts[1])).toBe(code);
	expect(select('head', fromHtml(preview))!.properties).toEqual(select('head', fromHtml(html))!.properties);
	const fragment = selectAll('script', fromHtml(previewDocument(`<script>${code}</script><p>API</p>`)));
	expect(fragment).toHaveLength(2);
	expect(toString(fragment[1])).toBe(code);
});

test('leading document and head attributes survive initialization', () => {
	const html = `<!doctype html><html lang="en" data-example="<head>"><!-- Settings --><head data-theme="dark" data-x='>'><title>API</title></head><body>API</body></html>`;
	const original = fromHtml(html);
	const preview = fromHtml(previewDocument(html));
	for (const tag of ['html', 'head'])
		expect(select(tag, preview)!.properties).toEqual(select(tag, original)!.properties);
	expect(toString(select('title', preview)!)).toBe('API');
});

test('comments preceding the doctype stay before the bootstrap so the doctype remains effective', () => {
	const leading = ' \n<!-- Preview -->\n<!-- Another comment -->\n<!DOCTYPE html>';
	const preview = previewDocument(`${leading}<html lang="en"><head></head><body>API</body></html>`);
	expect(preview.startsWith(`${leading}<html lang="en"><head><script>`)).toBe(true);
	expect(preview.indexOf('Object.defineProperty')).toBeLessThan(preview.indexOf('<body>API</body>'));
});

test('blocked storage uses separate frame-local string stores with the required Storage methods', () => {
	const window = {} as { localStorage: Storage; sessionStorage: Storage };
	for (const name of ['localStorage', 'sessionStorage'])
		Object.defineProperty(window, name, { configurable: true, get() { throw new DOMException('Opaque origin', 'SecurityError'); } });
	runInNewContext(script, { window });
	const local = window.localStorage;
	const session = window.sessionStorage;
	expect(local.getItem('missing')).toBeNull();
	local.setItem('theme', 'dark');
	local.setItem(42 as unknown as string, false as unknown as string);
	local.setItem('theme', 'light');
	expect(local.length).toBe(2);
	expect(local.getItem('theme')).toBe('light');
	expect(local.getItem('42')).toBe('false');
	expect(local.key(0)).toBe('theme');
	expect(local.key(1)).toBe('42');
	expect(local.key(2)).toBeNull();
	expect(session.getItem('theme')).toBeNull();
	session.setItem('theme', 'session');
	local.removeItem('theme');
	expect(local.length).toBe(1);
	local.clear();
	expect(local.length).toBe(0);
	expect(session.getItem('theme')).toBe('session');
});

test('available storage providers are preserved', () => {
	const window = { localStorage: {}, sessionStorage: {} };
	const original = { ...window };
	runInNewContext(script, { window });
	expect(window.localStorage).toBe(original.localStorage);
	expect(window.sessionStorage).toBe(original.sessionStorage);
});
