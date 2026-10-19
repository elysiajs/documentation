import { expect, test } from 'bun:test';
import { docToMarkdown } from '../../scripts/export-docs';
import { assistantPageLink } from './page-actions';

test('copy keeps the title and code while leaving page actions out of the document', () => {
	const page = docToMarkdown(`<div data-interactive-doc-layout><h1>Routing</h1>
		<div data-page-actions>Copy page Open in ChatGPT Open in Claude Page copied.</div>
		<p>Return a greeting.</p><pre><code class="language-ts">app.get('/', () =&gt; 'Hello')</code></pre></div>`)!;
	expect(page.markdown).toContain('# Routing');
	expect(page.markdown).toContain("```ts\napp.get('/', () => 'Hello')\n```");
	expect(page.markdown).toContain('Return a greeting.');
	expect(page.markdown).not.toMatch(/Copy page|Open in|Page copied/);
});

test('assistant links encode the actual page URL without its search or fragment', () => {
	for (const provider of ['ChatGPT', 'Claude'] as const) {
		const link = new URL(assistantPageLink(provider, 'https://elysiajs.com/essential/route/?token=private#params'));
		expect(link.origin).toBe(provider === 'ChatGPT' ? 'https://chatgpt.com' : 'https://claude.ai');
		expect(link.pathname).toBe(provider === 'ChatGPT' ? '/' : '/new');
		expect(link.searchParams.get('q')).toBe('Read https://elysiajs.com/essential/route/ so I can ask questions about this page.');
		expect(link.href).not.toContain('private');
	}
});
