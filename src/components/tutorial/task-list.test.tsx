import { expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import TaskList from './task-list';
import { tutorialStore } from './store';

const rows = [
	{ title: 'Return a string', description: 'GET / responds with Hello Elysia.' },
	{ title: 'Add a second route', description: 'GET /hi responds with Hello!.' },
];

const count = (html: string, needle: string) => html.split(needle).length - 1;

// A lesson with no testcases (the openapi-style lessons) must not leave an empty "Assignment"
// heading behind — the checklist is the only thing that section exists for.
test('TaskList renders nothing without testcases', () => {
	expect(renderToString(<TaskList testcases={[]} />)).toBe('');
});

test('TaskList renders one row per testcase with its title and description', () => {
	const html = renderToString(<TaskList testcases={rows} />);
	expect(count(html, '<li')).toBe(rows.length);
	for (const { title, description } of rows) {
		expect(html).toContain(title);
		expect(html).toContain(description);
	}
});

// The island hydrates over server markup: if the server guessed "passed" the learner would see a
// finished checklist for code they have not written yet, and hydration would fight it back.
// A screen-reader user needs an announced count and a status for every assignment.
test('TaskList never renders a passed row on the server', () => {
	tutorialStore.set({ testcasesResult: [true, true] });
	const html = renderToString(<TaskList testcases={rows} />);
	tutorialStore.set({ testcasesResult: [] });
	expect(html).not.toContain('confetti');
	expect(html).toContain('aria-live="polite"');
	expect(html).toContain(`0 of ${rows.length} assignments passed`);
	expect(count(html, 'Not passed yet')).toBe(rows.length);
	expect(html).not.toContain('>Passed<');
});
