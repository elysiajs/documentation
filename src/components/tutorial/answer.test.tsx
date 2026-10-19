import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { fromHtml } from 'hast-util-from-html';
import { select } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import Answer from './answer';

test('answer stays in server HTML while the accessible disclosure starts closed', () => {
	const content = '<div class="expressive-code"><style>.answer-code{color:pink}</style><pre class="answer-code">return "Elysia"</pre><script type="module">window.answerCode = true</script></div>';
	const html = renderToStaticMarkup(<Answer html={content} />);
	const tree = fromHtml(html);
	const trigger = select('button', tree)!;
	const panel = select('.tutorial-answer-panel', tree)!;
	expect(trigger.properties.ariaExpanded).toBe('false');
	expect(toString(trigger)).toBe('Show answer');
	expect(panel.properties.hidden).toBe(true);
	expect(html).toContain(content);
});
