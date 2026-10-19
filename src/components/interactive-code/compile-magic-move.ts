import { codeToKeyedTokens, syncTokenKeys } from '@shikijs/magic-move/core';
import type { KeyedTokensInfo } from '@shikijs/magic-move/core';
import { createHighlighter } from 'shiki';
import type { BundledLanguage } from 'shiki';
import { spicaLight, spicaDark } from '../../spica/code-themes.mjs';

export interface CodeStep {
	code: string;
	lang?: BundledLanguage;
}

export async function compileMagicMove(steps: CodeStep[]): Promise<KeyedTokensInfo[]> {
	const highlighter = await createHighlighter({
		langs: [...new Set(steps.map(({ lang = 'typescript' }) => lang))],
		themes: [spicaLight, spicaDark],
	});

	try {
		const compiled: KeyedTokensInfo[] = [];
		for (const { code, lang = 'typescript' } of steps) {
			const tokens = codeToKeyedTokens(highlighter, code, {
				lang,
				themes: { light: 'spica-light', dark: 'spica-dark' },
				defaultColor: false,
			});
			const previous = compiled.at(-1);
			compiled.push(previous ? syncTokenKeys(previous, tokens, { splitTokens: true }).to : tokens);
		}

		return compiled;
	} finally {
		highlighter.dispose();
	}
}
