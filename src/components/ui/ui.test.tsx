import { expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import { Button, ButtonLink } from './button';
import { Callout } from './callout';
import { Card, CardTitle } from './card';
import { Checkbox } from './checkbox';
import { Dropdown } from './dropdown';
import { IconButton, IconTooltip } from './icon-button';
import { InputGroup } from './input-group';
import { NumberedCards } from './numbered-cards';
import { Select } from './select';
import { SelectMenu } from './select-menu';
import { Table } from './table';
import { Tabs } from './tabs';
import { Tooltip } from './tooltip';

const count = (html: string, needle: string) => html.split(needle).length - 1;
const hasClass = (html: string, name: string) =>
	new RegExp(`class="(?:[^"]*\\s)?${name}(?:\\s[^"]*)?"`).test(html);

test('Button keeps native semantics and the dashed focus outline', () => {
	const html = renderToString(<Button disabled className="disabled:bg-danger-soft">Save</Button>);
	expect(html).toContain('<button');
	expect(html).toContain('type="button"');
	expect(html).toContain('disabled=""');
	expect(html).toContain('>Save</button>');
	expect(hasClass(html, 'focus-ring')).toBe(true);
	expect(hasClass(html, 'disabled:bg-danger-soft')).toBe(true);
	expect(html).not.toContain('disabled:bg-surface-2');
});

test('ButtonLink keeps native link semantics, focus, and ripple behavior', () => {
	const html = renderToString(<ButtonLink href="/at-glance/">Read the docs</ButtonLink>);
	expect(html).toContain('<a href="/at-glance/"');
	expect(count(html, '<button')).toBe(0);
	expect(hasClass(html, 'focus-ring')).toBe(true);
	expect(count(html, '<spica-ripple aria-hidden="true"><span></span></spica-ripple>')).toBe(1);
	expect(html).toContain('>Read the docs</a>');
});

test('IconButton gives its icon an accessible name and exposes active state', () => {
	expect(renderToString(<IconButton label="Bold">B</IconButton>)).toContain('aria-label="Bold"');
	expect(renderToString(<IconButton label="Bold" active>B</IconButton>)).toContain('aria-pressed="true"');
});

test('Tabs renders one tab per item and selects the first', () => {
	const html = renderToString(<Tabs tabs={['One', { value: 'two', label: 'Two', count: 3 }]} />);
	expect(html).toContain('role="tablist"');
	expect(count(html, 'role="tab"')).toBe(2);
	expect(html).toContain('aria-selected="true"');
	expect(html).toContain('>3<');
});

test('Tabs keeps its default tones and gives ghost tabs the same selection semantics', () => {
	const pink = renderToString(<Tabs tabs={['One', 'Two']} />);
	const white = renderToString(<Tabs tone="white" tabs={['One', 'Two']} />);
	const ghost = renderToString(<Tabs variant="ghost" aria-label="Product" defaultValue="Two" tabs={['One', 'Two']} />);
	expect(hasClass(pink, 'bg-primary')).toBe(true);
	expect(hasClass(white, 'bg-surface-raised')).toBe(true);
	for (const html of [pink, white]) {
		expect(hasClass(html, 'border-border-strong')).toBe(true);
		expect(hasClass(html, 'rounded-full')).toBe(true);
	}
	expect(ghost).toContain('role="tablist"');
	expect(ghost).toContain('aria-label="Product"');
	expect(count(ghost, 'role="tab"')).toBe(2);
	expect(count(ghost, 'aria-selected="true"')).toBe(1);
	expect(ghost).toMatch(/aria-selected="true"[^>]*><span>Two<\/span>/);
	expect(hasClass(ghost, 'rounded-xl')).toBe(true);
	const ghostTrack = ghost.slice(0, ghost.indexOf('>') + 1);
	expect(hasClass(ghostTrack, 'border-0')).toBe(true);
	expect(hasClass(ghostTrack, 'border-border-strong')).toBe(false);
	expect(hasClass(ghost, 'bg-primary')).toBe(false);
	expect(hasClass(ghost, 'bg-surface-2')).toBe(true);
	expect(hasClass(ghost, 'focus-ring')).toBe(true);
});

test('Tooltip preserves its native trigger and the existing IconTooltip export', () => {
	expect(IconTooltip).toBe(Tooltip);
	const trigger = <button type="button" aria-label="Request">Request</button>;
	expect(renderToString(<Tooltip>{trigger}</Tooltip>)).toBe(renderToString(trigger));
	const html = renderToString(<Tooltip label={<span>Send the request.</span>}>{trigger}</Tooltip>);
	expect(count(html, '<button')).toBe(1);
	expect(html).toContain('aria-label="Request"');
	expect(html).toContain('data-base-ui-tooltip-trigger');
});

test('Tooltip preserves existing descriptions and gives each trigger a unique tooltip association', () => {
	const html = renderToString(<>
		<Tooltip label="Send the request."><button aria-describedby="request-help">Request</button></Tooltip>
		<Tooltip label="Run the next hook."><button>Step</button></Tooltip>
	</>);
	const descriptions = Array.from(html.matchAll(/aria-describedby="([^"]+)"/g), match => match[1]);
	expect(descriptions).toHaveLength(2);
	expect(descriptions[0]?.split(' ')).toHaveLength(2);
	expect(descriptions[0]?.split(' ')[0]).toBe('request-help');
	expect(descriptions[0]?.split(' ')[1]).not.toBe(descriptions[1]);
	expect(descriptions[1]).toBeTruthy();
});

test('Tab tooltips do not add buttons or replace tab names and selection semantics', () => {
	const html = renderToString(<Tabs iconOnly tabs={[
		{ value: 'continue', label: 'Continue', icon: '+', tooltip: 'Run the next hook.' },
		{ value: 'error', label: 'Error 418', icon: '!', tooltip: 'Throw an error.' },
	]} />);
	expect(count(html, '<button')).toBe(2);
	expect(count(html, 'role="tab"')).toBe(2);
	expect(count(html, 'data-base-ui-tooltip-trigger')).toBe(2);
	expect(count(html, 'aria-selected="true"')).toBe(1);
	expect(html).toContain('>Continue</span>');
	expect(html).toContain('>Error 418</span>');
	expect(html).not.toContain('Run the next hook.');
});

test('InputGroup renders its label, affixes and input in one field', () => {
	const html = renderToString(<InputGroup label="Site" prefix="https://" suffix=".com" />);
	expect(html).toContain('<label');
	expect(html).toContain('<input');
	expect(html).toContain('https://');
	expect(html).toContain('.com');
});

test('Select preserves supplied route data and native selection without hydration', () => {
	const html = renderToString(
		<Select aria-label="Route" defaultValue="1" data-playground-route>
			<option value="0" data-method="GET" data-response="Hello">GET /</option>
			<option value="1" data-method="POST" data-response={'<saved>\n'}>POST /</option>
		</Select>
	);
	expect(html).toContain('data-method="POST"');
	expect(html).toContain('data-response="&lt;saved&gt;\n"');
	expect(html).toContain('value="1" data-method="POST" data-response="&lt;saved&gt;\n" selected=""');
	expect(html).toContain('aria-label="Route"');
});

test('Dropdown renders its trigger with menu popup semantics', () => {
	const html = renderToString(
		<Dropdown trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, 'divider', { label: 'Delete', danger: true }]} />
	);
	expect(html).toContain('aria-haspopup="menu"');
	expect(html).toContain('aria-expanded="false"');
	expect(html).toContain('>Open</button>');
	expect(html).not.toContain('role="menuitem"');
});

test('selectors have one decorative primary ripple without duplicating a Button trigger', () => {
	for (const control of [<Button>Save</Button>, <SelectMenu aria-label="Route" options={['GET /']} />, <Dropdown trigger="Open" />, <Dropdown trigger={<Button>Open</Button>} />]) {
		const html = renderToString(control);
		expect(count(html, '<spica-ripple aria-hidden="true"><span></span></spica-ripple>')).toBe(1);
		expect(html).toContain('[--ripple-color:var(--color-primary)]');
	}
});

test('Callout renders a sentence-case default label and its body', () => {
	const html = renderToString(<Callout tone="tip">Use bun.</Callout>);
	expect(html).toContain('>Tip<');
	expect(html).not.toContain('>tip<');
	expect(html).toContain('Use bun.');
});

test('Card href makes the whole card one native link', () => {
	const html = renderToString(
		<Card href="/essential/route" target="_blank" rel="noreferrer" title="Routing" wash>
			<p>Match a request to a handler.</p>
		</Card>
	);
	expect(html).toMatch(/^<a href="\/essential\/route" target="_blank" rel="noreferrer"/);
	expect(count(html, '<a ')).toBe(1);
	expect(hasClass(html, 'focus-ring')).toBe(true);
	expect(html).toContain('var(--surface-wash)');
});

test('CardTitle can wrap a Markdown heading without nesting headings', () => {
	const html = renderToString(
		<Card tone="night"><CardTitle as="div"><h3 id="get"><code>GET</code></h3></CardTitle></Card>
	);
	expect(count(html, '<h3')).toBe(1);
	expect(html).toContain('<h3 id="get"><code>GET</code></h3>');
});

test('NumberedCards keeps one to four steps ordered and its numerals decorative', () => {
	for (let length = 1; length <= 4; length++) {
		const items = Array.from({ length }, (_, i) => ({ title: `Step ${i + 1}`, children: 'Details' }));
		const html = renderToString(<NumberedCards items={items} />);
		expect(html).toContain('<ol role="list">');
		expect(count(html, '<li>')).toBe(length);
		expect(count(html, 'aria-hidden="true" focusable="false"')).toBe(length);
	}
	for (const length of [0, 5]) {
		expect(() => renderToString(<NumberedCards items={Array.from({ length }, () => ({ title: 'Step', children: 'Details' }))} />)).toThrow('between 1 and 4');
	}
});

const people = [
	{ id: 'kate', name: 'Kate Moore', role: 'CEO' },
	{ id: 'john', name: 'John Smith', role: 'CTO' },
	{ id: 'sara', name: 'Sara Johnson', role: 'CMO' },
];
const columns = [
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'role', label: 'Role', muted: true },
];
const rowId = (row: (typeof people)[number]) => row.id;
const surfaceAt = (html: string) => html.indexOf('--surface-wash-cool');
// `<col` also matches `<colgroup`, so discount the two wrappers.
const colCount = (html: string) => count(html, '<col') - count(html, '<colgroup');

test('Checkbox pairs one role=checkbox control with its inline label', () => {
	const html = renderToString(<Checkbox defaultChecked label="Attention light" />);
	expect(html).toStartWith('<label');
	expect(count(html, 'role="checkbox"')).toBe(1);
	expect(html).toContain('aria-checked="true"');
	expect(html).toContain('>Attention light</span>');
	// the tick is the checked state made visible; it must not render on its own
	expect(html).toContain('M20 6 9 17l-5-5');
	expect(renderToString(<Checkbox label="Attention light" />)).not.toContain('M20 6 9 17l-5-5');
});

test('Checkbox indeterminate reports mixed and shows the dash instead of the tick', () => {
	const html = renderToString(<Checkbox indeterminate label="Every row" />);
	expect(html).toContain('aria-checked="mixed"');
	expect(html).toContain('data-indeterminate');
	expect(html).not.toContain('M20 6 9 17l-5-5');
});

test('Checkbox disabled cannot be toggled and reads as unavailable', () => {
	const html = renderToString(<Checkbox disabled label="Locked" />);
	expect(html).toContain('data-disabled');
	expect(html).toContain('disabled=""');
	expect(hasClass(html, 'cursor-not-allowed')).toBe(true);
});

test('Table select-all is mixed while only some visible rows are picked', () => {
	const partial = renderToString(
		<Table columns={columns} rows={people} rowKey={rowId} selectable defaultSelected={['kate']} />
	);
	expect(partial).toContain('aria-label="Select all rows"');
	expect(count(partial, 'aria-label="Select row"')).toBe(3);
	expect(count(partial, 'aria-checked="mixed"')).toBe(1);
	// only the picked row: the header checkbox is mixed, not true
	expect(count(partial, 'aria-checked="true"')).toBe(1);
	expect(count(partial, 'aria-selected="true"')).toBe(1);
	expect(partial).toContain('>1 selected<');

	const all = renderToString(
		<Table columns={columns} rows={people} rowKey={rowId} selectable defaultSelected={['kate', 'john', 'sara']} />
	);
	expect(all).not.toContain('aria-checked="mixed"');
	expect(count(all, 'aria-checked="true"')).toBe(4);
	expect(count(all, 'aria-selected="true"')).toBe(3);
	expect(all).toContain('>3 selected<');
});

test('Table selection column and its footer note appear only when selectable', () => {
	const html = renderToString(<Table columns={columns} rows={people} rowKey={rowId} />);
	expect(html).not.toContain('role="checkbox"');
	expect(html).not.toContain('selected<');
	expect(colCount(html)).toBe(4);
});

test('Table pagination slices the rows and marks the current page', () => {
	const rows = Array.from({ length: 12 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, role: 'Staff' }));
	const html = renderToString(
		<Table columns={columns} rows={rows} rowKey={rowId} pagination pageSize={5} defaultPage={2} />
	);
	expect(html).toContain('>Row 5</td>');
	expect(html).toContain('>Row 9</td>');
	expect(html).not.toContain('>Row 0</td>');
	expect(html).not.toContain('>Row 10</td>');
	expect(html).toContain('6–10 of 12');
	expect(count(html, 'aria-current="page"')).toBe(1);
	expect(html.match(/aria-current="page"[^>]*>(\d+)</)?.[1]).toBe('2');
	// 12 rows at 5 a page is 3 pages, so neither arrow is spent
	expect(count(html, 'disabled=""')).toBe(0);
	expect(renderToString(<Table columns={columns} rows={rows} rowKey={rowId} pagination pageSize={5} />)).toContain(
		'1–5 of 12'
	);
});

test('Table pagination collapses long page runs around the current page', () => {
	const rows = Array.from({ length: 100 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, role: 'Staff' }));
	const html = renderToString(
		<Table columns={columns} rows={rows} rowKey={rowId} pagination pageSize={5} defaultPage={10} />
	);
	// 1 … 9 10 11 … 20 — never twenty buttons
	expect(count(html, '…')).toBe(2);
	expect(html.match(/aria-current="page"[^>]*>(\d+)</)?.[1]).toBe('10');
	const pagesShown = Array.from(html.matchAll(/<button[^>]*type="button"[^>]*>(\d+)<\/button>/g), (m) => m[1]);
	expect(pagesShown).toEqual(['1', '9', '10', '11', '20']);
});

test('Table pagination shows every page when there are seven or fewer', () => {
	const rows = Array.from({ length: 35 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, role: 'Staff' }));
	const html = renderToString(
		<Table columns={columns} rows={rows} rowKey={rowId} pagination pageSize={5} defaultPage={4} />
	);
	const pagesShown = Array.from(html.matchAll(/<button[^>]*type="button"[^>]*>(\d+)<\/button>/g), (m) => m[1]);
	expect(pagesShown).toEqual(['1', '2', '3', '4', '5', '6', '7']);
	expect(html).not.toContain('…');
});

test('Table pagination collapses around page 1 when there are eight pages', () => {
	const rows = Array.from({ length: 40 }, (_, i) => ({ id: `r${i}`, name: `Row ${i}`, role: 'Staff' }));
	const html = renderToString(
		<Table columns={columns} rows={rows} rowKey={rowId} pagination pageSize={5} defaultPage={1} />
	);
	const pagesShown = Array.from(html.matchAll(/<button[^>]*type="button"[^>]*>(\d+)<\/button>/g), (m) => m[1]);
	expect(pagesShown).toEqual(['1', '2', '8']);
	expect(count(html, '…')).toBe(1);
});

test('Table exposes the sort direction on the sorted column, and only sorts by keyboard when onSort is given', () => {
	const html = renderToString(
		<Table columns={columns} rows={people} rowKey={rowId} sortKey="name" sortDir="desc" onSort={() => {}} />
	);
	expect(count(html, 'aria-sort=')).toBe(1);
	expect(html).toContain('aria-sort="descending"');
	// the sortable header is the only control on the table, and it is a real button
	expect(count(html, '<button')).toBe(1);
	expect(html).toContain('type="button"');

	const inert = renderToString(<Table columns={columns} rows={people} rowKey={rowId} sortKey="name" />);
	expect(inert).toContain('aria-sort="ascending"');
	expect(inert).not.toContain('<button');
});

test('Table renders the row actions column only when rowActions is given', () => {
	const html = renderToString(
		<Table
			columns={columns}
			rows={people}
			rowKey={rowId}
			actionsWidth={90}
			rowActions={(row) => <IconButton label={`Edit ${row.name}`} size="sm">e</IconButton>}
		/>
	);
	// one extra <col> per table (header table + body table), sized by actionsWidth
	expect(colCount(html)).toBe(6);
	// actionsWidth reaches both <col>s and the header cell, so the two tables stay in step
	expect(count(html, 'width:90px')).toBe(3);
	expect(count(html, 'aria-label="Edit ')).toBe(3);
	expect(html).toContain('opacity-0');
	expect(html).toContain('group-data-selected:opacity-100');

	const without = renderToString(<Table columns={columns} rows={people} rowKey={rowId} />);
	expect(colCount(without)).toBe(4);
	expect(without).not.toContain('<button');

	const defaultWidth = renderToString(
		<Table
			columns={columns}
			rows={people}
			rowKey={rowId}
			rowActions={(row) => <IconButton label={`Edit ${row.name}`} size="sm">e</IconButton>}
		/>
	);
	expect(count(defaultWidth, 'width:76px')).toBe(3);
});

test('Table empty state replaces the body but keeps the headers', () => {
	const html = renderToString(<Table columns={columns} rows={[]} emptyState="No routes yet." />);
	expect(html).toContain('No routes yet.');
	expect(html).not.toContain('<tbody');
	expect(html).toContain('>Name</th>');
	expect(html).toContain('var(--gradient-magic)');
	expect(renderToString(<Table columns={columns} rows={[]} />)).toContain('Nothing here yet');
});

test('Table shows the empty state when a controlled page runs past the rows', () => {
	const html = renderToString(
		<Table columns={columns} rows={people} rowKey={rowId} pagination pageSize={2} page={9} />
	);
	expect(html).toContain('Nothing here yet');
	expect(html).not.toContain('</td>');
});

test('Table sticky header moves the one header table inside the scrolling surface', () => {
	const plain = renderToString(<Table columns={columns} rows={people} rowKey={rowId} />);
	const sticky = renderToString(
		<Table columns={columns} rows={people} rowKey={rowId} stickyHeader maxHeight={220} />
	);
	expect(count(plain, 'role="presentation"')).toBe(1);
	expect(count(sticky, 'role="presentation"')).toBe(1);
	expect(plain.indexOf('role="presentation"')).toBeLessThan(surfaceAt(plain));
	expect(sticky.indexOf('role="presentation"')).toBeGreaterThan(surfaceAt(sticky));
	expect(plain).not.toContain('max-height:220px');
	expect(sticky).toContain('max-height:220px');
	expect(sticky).toContain('sticky top-0');
	expect(sticky).toContain('overflow-y-auto');
});

test('Table title strip and cell rendering stay under the caller control', () => {
	const html = renderToString(
		<Table
			title="Team"
			meta="12 people"
			columns={[
				{ key: 'name', label: 'Name' },
				{ key: 'p95', label: 'p95', numeric: true, render: (row) => <code>{row.role}</code> },
			]}
			rows={people}
			rowKey={rowId}
			dense
			data-testid="team"
		/>
	);
	expect(html).toContain('data-testid="team"');
	expect(html).toContain('>Team<');
	expect(html).toContain('>12 people<');
	// `render` wins over the row's own field, which does not exist here
	expect(count(html, '<code>')).toBe(3);
	expect(html).not.toContain('undefined');
});

test('NumberedCards keeps gradient references unique across groups', () => {
	const items = [{ title: 'Start', children: 'Details' }, { title: 'Finish', children: 'Done' }];
	const html = renderToString(<><NumberedCards items={items} /><NumberedCards items={items} /></>);
	const ids = Array.from(html.matchAll(/<linearGradient id="([^"]+)"/g), match => match[1]);
	expect(ids.length).toBe(4);
	expect(new Set(ids).size).toBe(4);
	for (const id of ids) expect(html).toContain(`stroke="url(#${id})"`);
});
