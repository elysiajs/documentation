import { createHighlighterCoreSync, type ThemeRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import js from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import ts from 'shiki/langs/typescript.mjs';
import { spicaDark, spicaLight } from '../../src/spica/code-themes.mjs';
import type { Benchmark } from './state';

type Code = Benchmark['code'];

const highlighter = createHighlighterCoreSync({
	themes: [spicaLight as ThemeRegistration, spicaDark as ThemeRegistration],
	langs: [ts, tsx, js, json, bash],
	engine: createJavaScriptRegexEngine(),
});

const layer = 'm-0 p-4 font-mono text-[13.5px] leading-[1.55] tracking-normal whitespace-pre [tab-size:2] [font-variant-ligatures:none]';

export function CodeBlock({ code, onChange }: { code: Code; onChange: (patch: Partial<Code>) => void }) {
	// A pre drops a trailing empty line and collapses when empty; the textarea keeps both.
	const shown = code.source === '' || code.source.endsWith('\n') ? `${code.source} ` : code.source;
	const html = highlighter.codeToHtml(shown, {
		lang: code.lang,
		themes: { light: 'spica-light', dark: 'spica-dark' },
		defaultColor: 'light-dark()',
		transformers: [
			{
				pre(node) {
					delete node.properties.tabindex;
					this.addClassToHast(node, `${layer} pointer-events-none bg-transparent!`);
				},
			},
		],
	});

	return (
		<div className="spica-code-frame flex min-h-0 min-w-0 flex-col">
			<div data-clip="" className="spica-code-surface min-h-0 flex-1 overflow-clip field-ring">
				<div className="relative w-max min-w-full">
					<div dangerouslySetInnerHTML={{ __html: html }} />
					<textarea
						aria-label="Code"
						value={code.source}
						wrap="off"
						spellCheck={false}
						autoCapitalize="off"
						autoComplete="off"
						className={`${layer} absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-ink outline-none selection:bg-primary/25`}
						onChange={(e) => onChange({ source: e.target.value })}
						onScroll={(e) => {
							e.currentTarget.scrollTop = 0;
							e.currentTarget.scrollLeft = 0;
						}}
						onKeyDown={(e) => {
							if (e.key === 'Escape') e.currentTarget.blur();
							if (e.key !== 'Tab' || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
							e.preventDefault();
							// insertText keeps the browser's own undo history
							document.execCommand('insertText', false, '  ');
						}}
					/>
				</div>
			</div>
		</div>
	);
}
