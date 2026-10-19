import { expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { FileExplorer } from './file-explorer';

test('explorer exposes empty folders, nested hierarchy and one keyboard entry point', () => {
	const html = renderToString(createElement(FileExplorer, {
		fs: { 'index.ts': '', 'routes/hello.ts': '' }, folders: ['empty'],
		tabs: { files: ['index.ts'], active: 0 }, onFilesChange() {}
	}));
	expect(html).toContain('aria-label="empty"');
	expect(html).toContain('aria-label="hello.ts" aria-level="2"');
	expect(html.indexOf('data-path="empty"')).toBeLessThan(html.indexOf('data-path="index.ts"'));
	expect((html.match(/tabindex="0" data-path/g) ?? []).length).toBe(1);
	expect(html).toContain('aria-label="New folder"');
	expect(html).not.toContain('aria-label="File actions"');
});
