import { expect, mock, spyOn, test } from 'bun:test';
import { Combobox } from '@base-ui/react/combobox';
import { renderToString } from 'react-dom/server';
import { fromHtml } from 'hast-util-from-html';
import { select } from 'hast-util-select';
import { toString } from 'hast-util-to-string';
import Result, { requestPaths } from './result';

test('request suggestions match the method and keep distinct registered templates in order', () => {
	expect(requestPaths([
		{ method: 'GET', path: '/api/users/:id' },
		{ method: 'POST', path: '/api/users' },
		{ method: 'GET', path: '/api/users/:id' },
		{ method: 'ALL', path: '/health' },
		{ method: '*', path: '/files/*' },
	], 'GET')).toEqual(['/api/users/:id', '/health', '/files/*']);
	expect(requestPaths([], 'GET')).toEqual([]);
});

test('request path is an editable combobox even when the custom URL has no registered suggestion', () => {
	const html = renderToString(<Result
		input={{ path: '/api/users/42?include=posts', method: 'GET', body: '', headers: [], cookie: [] }}
		routes={[{ method: 'GET', path: '/api/users/:id' }]}
		onInputChange={() => {}}
		response={{ body: null, status: null, headers: {} }}
		result={{ console: [], error: null, isHTML: false }}
		resultTab="preview"
		onResultTabChange={() => {}}
	/>);
	const tree = fromHtml(html);
	const input = select('input[role="combobox"]', tree)!;
	expect(input.properties.ariaLabel).toBe('Request path');
	expect(input.properties.value).toBe('/api/users/42?include=posts');
	expect(input.properties.readOnly).toBeUndefined();
	expect(select('button[aria-label="Show registered routes"]', tree)).not.toBeNull();
});

test('closing route suggestions preserves a custom path while typing and selection update it', () => {
	let change: Combobox.Root.Props<string>['onInputValueChange'];
	const original = Combobox.Root;
	const root = spyOn(Combobox, 'Root').mockImplementation((props) => {
		change = props.onInputValueChange;
		return original(props);
	});
	const onInputChange = mock(() => {});
	try {
		renderToString(<Result
			input={{ path: '/api/users/42?include=posts', method: 'GET', body: '', headers: [], cookie: [] }}
			routes={[{ method: 'GET', path: '/api/users/:id' }]}
			onInputChange={onInputChange}
			response={{ body: null, status: null, headers: {} }}
			result={{ console: [], error: null, isHTML: false }}
			resultTab="preview"
			onResultTabChange={() => {}}
		/>);
	} finally {
		root.mockRestore();
	}
	expect(change).toBeDefined();
	for (const reason of ['input-clear', 'none', 'escape-key', 'focus-out', 'input-change', 'item-press'] as const) {
		const cancel = mock(() => {});
		const details = { reason, event: new Event('change'), cancel, allowPropagation() {}, isCanceled: false, isPropagationAllowed: false, trigger: undefined } as Combobox.Root.ChangeEventDetails;
		change!('/hello', details);
		if (reason === 'input-change' || reason === 'item-press') {
			expect(onInputChange).toHaveBeenLastCalledWith({ path: '/hello' });
			expect(cancel).not.toHaveBeenCalled();
		} else {
			expect(onInputChange).not.toHaveBeenCalled();
			expect(cancel).toHaveBeenCalledTimes(1);
		}
	}
});

test('HTML preview keeps its sandbox while the response pane shows the unmodified server document', () => {
	const body = '<!doctype html><html><head><script>Scalar.createApiReference()</script></head><body>API</body></html>';
	const props = {
		input: { path: '/openapi', method: 'GET', body: '', headers: [], cookie: [] },
		routes: [],
		onInputChange() {},
		response: { body, status: 200, headers: {} },
		result: { console: [], error: null, isHTML: true },
		onResultTabChange() {},
	};
	const preview = fromHtml(renderToString(<Result {...props} resultTab="preview" />));
	const frame = select('iframe', preview)!;
	expect(frame.properties.sandbox).toEqual(['allow-scripts']);
	expect(String(frame.properties.srcDoc)).toContain('Object.defineProperty(window, name');
	expect(String(frame.properties.srcDoc)).toContain('<script>Scalar.createApiReference()</script>');
	const response = fromHtml(renderToString(<Result {...props} resultTab="response" />));
	expect(toString(select('pre', response)!)).toContain(body);
	expect(toString(select('pre', response)!)).not.toContain('Object.defineProperty');
});
