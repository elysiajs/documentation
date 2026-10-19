import { expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import { RouteRunner } from './route-runner';
import { Select } from '../ui/select';
import { SelectMenu } from '../ui/select-menu';

test('route runner renders its initial plain response before hydration', () => {
	const html = renderToString(<RouteRunner routes={[{ method: 'GET', displayPath: '/hello', response: '<saved>\nPlain text' }, { method: 'POST', displayPath: '/', response: 'Next response' }]} />);
	expect(html).toContain('&lt;saved&gt;\nPlain text</pre>');
	expect(html).not.toContain('Next response');
	expect(html).toContain('GET /hello');
	expect(html).toContain('aria-label="Route"');
	expect(html).toContain('role="combobox"');
	expect(html).toContain('bg-transparent');
});

test('both select controls support ghost styling without passing variant into the DOM', () => {
	for (const Component of [Select, SelectMenu]) {
		const html = renderToString(<Component variant="ghost" label="Route" name="route" defaultValue="two" options={['one', 'two']} />);
		expect(html).toContain('border-transparent');
		expect(html).toContain('bg-transparent');
		expect(html).toContain('name="route"');
		expect(html).not.toContain('variant=');
	}
});

test('SelectMenu renders controlled and uncontrolled selections with an associated label', () => {
	for (const selection of [{ value: 'two' }, { defaultValue: 'two' }]) {
		const html = renderToString(<SelectMenu {...selection} id="route" label="Route" options={[{ value: 'one', label: 'First route' }, { value: 'two', label: 'Second route' }]} />);
		expect(html).toContain('for="route"');
		expect(html).toContain('id="route"');
		expect(html).toContain('Second route');
		expect(html).not.toContain('First route');
	}
});
