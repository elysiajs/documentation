import { expect, test } from 'bun:test';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'hast-util-to-string';
import { interactiveStepContent } from './interactive-step-content';

test('inserting a step pairs subsequent content by order without authored indices', () => {
	const marker = (body: string) => `<div data-interactive-step-content>${body}</div>`;
	const content = (html: string) => ({ html, className: undefined });
	const original = ['<h2>Start</h2>', '<h3>Finish</h3>'];
	expect(interactiveStepContent(original.map(marker).join('\n'), 2)).toEqual(original.map(content));
	const inserted = [original[0], '<h3>Middle</h3>', original[1]];
	expect(interactiveStepContent(inserted.map(marker).join('\n<!-- comment -->'), 3)).toEqual(inserted.map(content));
	const [entities] = interactiveStepContent(marker('<p>A &amp; B <code>&lt;tag&gt;</code></p>'), 1);
	expect(toString(fromHtml(entities.html, { fragment: true }))).toBe('A & B <tag>');
	// Each document starts fresh, even when rendered after another document.
	expect(interactiveStepContent(original.map(marker).join(''), 2)).toEqual(original.map(content));
	expect(() => interactiveStepContent(original.map(marker).join(''), 3)).toThrow('3 code entries but 2');
	expect(() => interactiveStepContent(`${marker('Start')}<p>Lost content</p>`, 1)).toThrow('direct InteractiveStep');
	expect(() => interactiveStepContent(marker(marker('Nested')), 1)).toThrow('must not be nested');
});

test('authored utility classes stay with their step without changing its content', () => {
	const content = interactiveStepContent(
		'<div data-interactive-step-content class="bg-red-500 [&amp;&gt;p]:mb-0"><p>A &amp; B</p></div>' +
		'<div data-interactive-step-content><h3>Next</h3></div>',
		2,
	);
	expect(content[0].className).toBe('bg-red-500 [&>p]:mb-0');
	expect(toString(fromHtml(content[0].html, { fragment: true }))).toBe('A & B');
	expect(content[1]).toEqual({ html: '<h3>Next</h3>', className: undefined });
});
