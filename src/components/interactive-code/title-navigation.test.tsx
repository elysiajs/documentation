import { expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import TitleNavigation from './title-navigation';

test('the server-rendered code title exposes the Spica menu trigger for its own example', () => {
	const first = renderToString(<TitleNavigation labels={['First alpha', 'First beta']} />);
	const second = renderToString(<TitleNavigation labels={['Second gamma', 'Second delta']} />);
	for (const html of [first, second]) {
		expect(html).toContain('<button');
		expect(html).toContain('aria-haspopup="menu"');
		expect(html).toContain('In this example: ');
	}
	expect(first).toContain('First alpha');
	expect(first).not.toContain('Second gamma');
	expect(second).toContain('Second gamma');
	expect(second).not.toContain('First alpha');
});
