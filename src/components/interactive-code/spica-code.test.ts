import { expect, test } from 'bun:test';
import { ExpressiveCode, ExpressiveCodeTheme } from 'expressive-code';
import { toHtml } from 'hast-util-to-html';
import { selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import { spicaLight, spicaDark } from '../../spica/code-themes.mjs';
import { docToMarkdown } from '../../../scripts/export-docs';
import { pluginErrorPreview } from '../../lib/expressive-code-error.mjs';
import { highlightRanges } from './highlight-ranges';

test('adjacent highlights share one rounded block while gaps and single lines stay separate', () => {
	expect(highlightRanges([9, 3, 2, 8, 3, 4, 6])).toEqual([
		{ start: 2, length: 3 },
		{ start: 6, length: 1 },
		{ start: 8, length: 2 },
	]);
	expect(highlightRanges([])).toEqual([]);
});

const luminance = (hex: string) => {
	const rgb = hex.slice(1).match(/../g)!.map((channel) => {
		const value = parseInt(channel, 16) / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};

test('small Spica code text stays legible over the iris wash, including uncorrected Magic Move tokens', () => {
	for (const [theme, background] of [[spicaLight, '#F4EEFA'], [spicaDark, '#252D3B']] as const) {
		for (const color of [theme.colors['editor.foreground'], ...theme.tokenColors.map(({ settings }) => settings.foreground)]) {
			const [dark, light] = [luminance(color), luminance(background)].sort((a, b) => a - b);
			expect((light + 0.05) / (dark + 0.05)).toBeGreaterThanOrEqual(4.5);
		}
	}
});

test('Spica highlighting keeps marked source lines, copy controls, and Markdown export intact', async () => {
	const engine = new ExpressiveCode({ themes: [spicaDark, spicaLight].map((theme) => new ExpressiveCodeTheme(theme)), minSyntaxHighlightingColorContrast: 4.5 });
	const code = "import { Elysia } from 'elysia'\n\nnew Elysia().get('/', 'Hello')";
	const { renderedGroupAst } = await engine.render({ code, language: 'ts', meta: 'mark={3}' });
	expect(selectAll('.ec-line.mark > .code', renderedGroupAst)).toHaveLength(1);
	expect(selectAll('.copy button', renderedGroupAst)).toHaveLength(1);
	const page = docToMarkdown(`<main class="sl-markdown-content"><h1>Routing</h1>${toHtml(renderedGroupAst)}</main>`);
	expect(page?.markdown).toContain('```ts\n' + code + '\n```');
	expect(page?.markdown).not.toContain('Copy to clipboard');
});

test('error previews are opt-in, hide display markers, and preserve valid copied code', async () => {
	const engine = new ExpressiveCode({ plugins: [pluginErrorPreview()] });
	const code = "~~consore~~.log('Hello')  //! Cannot find name 'consore'";
	const plain = await engine.render({ code, language: 'ts', meta: 'error-preview=false' });
	const preview = await engine.render({ code, language: 'ts', meta: 'error-preview' });
	const plainHtml = toHtml(plain.renderedGroupAst);
	const previewHtml = toHtml(preview.renderedGroupAst);
	const marker = selectAll('.error-message-marker', preview.renderedGroupAst);
	const message = selectAll('.error-message', preview.renderedGroupAst);
	const copy = selectAll('.copy button', preview.renderedGroupAst);

	expect(selectAll('.error-squiggles, .error-message', plain.renderedGroupAst)).toHaveLength(0);
	expect(plainHtml).toContain('~~consore~~');
	expect(selectAll('.error-squiggles', preview.renderedGroupAst)).toHaveLength(1);
	expect(marker).toHaveLength(1);
	expect(toString(marker[0])).toBe('//! ');
	expect(message).toHaveLength(1);
	expect(toString(message[0])).toBe("Cannot find name 'consore'");
	expect(await engine.getBaseStyles()).toMatch(/\.error-message-marker\s*\{\s*display:\s*none/);
	expect(await engine.getBaseStyles()).toMatch(/\.ec-line \.error-message > span\s*\{[^}]*color:\s*inherit !important/s);
	expect(copy).toHaveLength(1);
	expect(copy[0].properties.dataCode).toBe("consore.log('Hello')  //! Cannot find name 'consore'");
	expect(previewHtml).not.toContain('~~');
});

test('Expressive Code emits mark, insert, and delete line classes', async () => {
	const engine = new ExpressiveCode();
	const { renderedGroupAst } = await engine.render({
		code: 'marked\ninserted\ndeleted',
		language: 'txt',
		meta: 'mark={1} ins={2} del={3}',
	});

	expect(selectAll('.ec-line.mark', renderedGroupAst)).toHaveLength(1);
	expect(selectAll('.ec-line.ins', renderedGroupAst)).toHaveLength(1);
	expect(selectAll('.ec-line.del', renderedGroupAst)).toHaveLength(1);
});
